import {
	Parser,
	Language,
} from " https://tree-sitter.github.io/web-tree-sitter.js";

const HIGHLIGHT_QUERY = `
  ;; Highlighting rules for Wikitext

;; Highlight headings
(heading1
  (heading_marker) @punctuation.special
  (text) @markup.heading.1
  (heading_marker) @punctuation.special
)
(heading2
  (heading_marker) @punctuation.special
  (text) @markup.heading.2
  (heading_marker) @punctuation.special
)
(heading3
  (heading_marker) @punctuation.special
  (text) @markup.heading.3
  (heading_marker) @punctuation.special
)
(heading4
  (heading_marker) @punctuation.special
  (text) @markup.heading.4
  (heading_marker) @punctuation.special
)
(heading5
  (heading_marker) @punctuation.special
  (text) @markup.heading.5
  (heading_marker) @punctuation.special
)

(heading6
  (heading_marker) @punctuation.special
  (text) @markup.heading.6
  (heading_marker) @punctuation.special
)

(wikilink
  (wikilink_page) @markup.link.url
  (page_name_segment)? @markup.link.label
)
(external_link
  (url) @markup.link.url
  (page_name_segment)? @markup.link.label
)
(template
  (template_name)? @module
  (template_argument
  (template_param_name)? @tag.attribute
  (template_param_value)? @string
  )?
)

(comment) @comment

[
  "[["
  "]]"
  "{{"
  "}}"
  "{|"
  "|}"
  "["
  "]"
  "<"
  ">"
  "</"
] @punctuation.bracket

[
  "|"
  "|-"
  "|+"
  "!"
  "!!"
  "||"
] @punctuation.delimiter

(table_cell_block
  (content) @text
)
(table_cell_inline
  (content) @text
)
(table_header_block
  (content) @text.special
)
(table_header_inline
  (content) @text.special
)
(table_cell_inline
  (content) @text
)

(html_attribute
  (html_attribute_name) @attribute
  (html_attribute_value) @string
)

(paragraph
  (italic)? @markup.italic
  (bold)? @markup.strong
)
`;

async function getWikiTextParser() {
	await Parser.init();
	const parser = new Parser();
	const Wikitext = await Language.load("./tree-sitter-wikitext.wasm");
	parser.setLanguage(Wikitext);
	return parser;
}

class WikiTextHighlighter extends HTMLElement {
	constructor() {
		super();
		this.parser = null;
		this.tree = null;
		this.query = null;
	}

	connectedCallback() {
		this.classList.add("wikitext-markup");
		this.updateEditableState();
		this.highlight();
	}

	disconnectedCallback() {
		this.removeEventListener("input", this.handleInput.bind(this));
		this.removeEventListener("keydown", this.handleKeydown.bind(this));
		this.removeEventListener("paste", this.handlePaste.bind(this));
	}

	updateEditableState() {
		const isEditable = this.hasAttribute("editable");

		if (isEditable) {
			this.contentEditable = "plaintext-only";
			this.addEventListener("input", this.handleInput.bind(this));
			this.addEventListener("keydown", this.handleKeydown.bind(this));
			this.addEventListener("paste", this.handlePaste.bind(this));
		} else {
			this.contentEditable = "false";
			this.removeEventListener("input", this.handleInput.bind(this));
			this.removeEventListener("keydown", this.handleKeydown.bind(this));
			this.removeEventListener("paste", this.handlePaste.bind(this));
		}
	}

	handleKeydown(e) {
		// Prevent formatting shortcuts
		if (e.ctrlKey || e.metaKey) {
			const forbiddenKeys = ["b", "i", "u", "k"]; // bold, italic, underline, link
			if (forbiddenKeys.includes(e.key.toLowerCase())) {
				e.preventDefault();
				return false;
			}
		}
	}

	handlePaste(e) {
		e.preventDefault();
		// Get plain text from clipboard
		const text = (e.clipboardData || window.clipboardData).getData(
			"text/plain",
		);
		document.execCommand("insertText", false, text);
	}

	handleInput() {
		this.highlight();
	}

	static get observedAttributes() {
		return ["value", "editable"];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "value" && newValue !== oldValue) {
			this.textContent = newValue;
			this.highlight();
		} else if (name === "editable" && oldValue !== newValue) {
			this.updateEditableState();
		}
	}

	get value() {
		return this.textContent;
	}

	set value(text) {
		this.textContent = text;
		this.highlight();
	}

	get editable() {
		return this.hasAttribute("editable");
	}

	set editable(value) {
		if (value) {
			this.setAttribute("editable", "");
		} else {
			this.removeAttribute("editable");
		}
	}

	async highlight() {
		if (!this.query) {
			this.parser = await getWikiTextParser();
			this.query = this.parser.language.query(HIGHLIGHT_QUERY);
		}

		// Clear existing highlights
		CSS.highlights.clear();

		const wikitext = this.innerText;
		if (!wikitext) return;

		this.tree = this.parser.parse(wikitext);
		this.runTreeQuery();
	}

	markRanges(ranges) {
		for (const range of ranges) {
			const r = new Range();
			r.setStart(this.firstChild, range.startIndex);
			r.setEnd(this.firstChild, range.endIndex);
			const highlightName = range.name.replaceAll(".", "-");
			if (CSS.highlights.get(highlightName)) {
				const highlight = CSS.highlights.get(highlightName);
				highlight.add(r);
				CSS.highlights.set(highlightName, highlight);
			} else {
				const highlight = new Highlight();
				highlight.add(r);
				CSS.highlights.set(highlightName, highlight);
			}
		}
	}

	runTreeQuery() {
		const ranges = [];
		if (this.tree && this.query) {
			const captures = this.query.captures(this.tree.rootNode);
			let lastNodeId;
			for (const { name, node } of captures) {
				if (node.id === lastNodeId) {
					continue;
				}
				lastNodeId = node.id;
				const { startIndex, endIndex } = node;
				ranges.push({ startIndex, endIndex, name });
			}
			this.markRanges(ranges);
		}
	}
}

customElements.define("wikitext-highlighter", WikiTextHighlighter);

export default WikiTextHighlighter;
