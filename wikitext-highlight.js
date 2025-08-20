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

class WikiTextHighlighter {
	constructor(highlightEl, opts) {
		this.highlightEl = highlightEl;
		if (!this.highlightEl) {
			throw new Error("Editor element is null or invalid");
		}
		this.parser = null;
		this.tree = null;
	}

	async highlight() {
		if (!this.query) {
			this.parser = await getWikiTextParser();
			this.query = this.parser.language.query(HIGHLIGHT_QUERY);
		}
		const wikitext = this.highlightEl.innerText;
		this.tree = this.parser.parse(wikitext);
		this.runTreeQuery();
	}

	markRanges(ranges) {
		for (const range of ranges) {
			const r = new Range();
			r.setStart(this.highlightEl.firstChild, range.startIndex);
			r.setEnd(this.highlightEl.firstChild, range.endIndex);
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

export default WikiTextHighlighter;
