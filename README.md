# WikiText Highlighter Web Component

A web component that provides syntax highlighting for WikiText markup using Tree-sitter. This component creates an editable text area with real-time syntax highlighting for MediaWiki-style markup.
See [tree-sitter-wikitext](https://github.com/santhoshtr/tree-sitter-wikitext/) project

## Features

- Real-time syntax highlighting for WikiText markup
- Plain text editing (no rich text formatting)
- Customizable theming with CSS custom properties
- Tree-sitter powered parsing for accurate highlighting
- Web component architecture for easy integration

## Installation

1. Include the required files in your project:

   - `wikitext-highlight.js` - The main web component
   - `theme.css` - Default theme and highlight styles
   - `tree-sitter-wikitext.wasm` - Tree-sitter parser for WikiText

2. Include the web component in your HTML:

```html
<link rel="stylesheet" href="theme.css" />
<script type="module" src="wikitext-highlight.js"></script>
```

## Basic Usage

### HTML

```html
<wikitext-highlighter>
  {{Template}} '''Bold text''' and [[Wiki Link]]
</wikitext-highlighter>
```

### JavaScript

```javascript
import WikitextHighlighter from "./wikitext-highlight.js";

// The component is automatically registered as 'wikitext-highlighter'
const editor = document.querySelector("wikitext-highlighter");

// Get/set content
console.log(editor.value); // Get current text
editor.value = "New '''WikiText''' content"; // Set new text
```

## API Reference

### Properties

#### `value` (String)

Gets or sets the text content of the editor.

```javascript
const editor = document.querySelector("wikitext-highlighter");
editor.value = "{{Infobox}} '''Bold''' [[Link]]";
console.log(editor.value); // Returns the current text content
```

### Attributes

#### `value` (String)

Can be used to set initial content via HTML attribute.

```html
<wikitext-highlighter value="Initial '''content'''"></wikitext-highlighter>
```

### Events

#### `input`

Fired when the content changes (same as standard HTML input event).

```javascript
editor.addEventListener("input", (e) => {
  console.log("Content changed:", e.target.value);
});
```

## Styling

The component uses CSS custom properties for theming. You can override these in your own CSS:

### Theme Variables

```css
:root {
  --text: #cdd6f4; /* Main text color */
  --surface0: #313244; /* Background color */
  --overlay1: #7f849c; /* Border and punctuation */
  --red: #f38ba8; /* Headings and bold text */
  --blue: #89b4fa; /* Links */
  --green: #a6e3a1; /* Strings */
  --yellow: #f9e2af; /* Warnings */
  /* ... and many more */
}
```

### Highlight Classes

The component applies these CSS highlight pseudo-elements:

- `::highlight(markup-heading-1)` through `::highlight(markup-heading-6)` - Headings
- `::highlight(markup-link-url)` - Link URLs
- `::highlight(markup-link-label)` - Link labels
- `::highlight(markup-strong)` - Bold text
- `::highlight(markup-italic)` - Italic text
- `::highlight(punctuation-bracket)` - Brackets like `[[`, `]]`, `{{`, `}}`
- `::highlight(punctuation-delimiter)` - Table delimiters like `|`, `|-`
- `::highlight(comment)` - HTML comments
- `::highlight(module)` - Template names
- `::highlight(attribute)` - HTML attributes
- `::highlight(string)` - String values
- `::highlight(text)` - Regular text content
- `::highlight(text-special)` - Special text (table headers)

### Custom Styling Example

```css
::highlight(markup-heading-1) {
  color: #ff6b6b;
  font-weight: bold;
  font-size: 1.2em;
}

::highlight(markup-link-url) {
  color: #4ecdc4;
  text-decoration: underline;
}

.my-editor {
  background: #2a2a2a;
  border: 2px solid #555;
  border-radius: 8px;
  padding: 16px;
  font-family: "Fira Code", monospace;
}
```

## Configuration

### Custom Parser Path

If your Tree-sitter WASM file is in a different location:

```javascript
// Modify the getWikiTextParser function in wikitext-highlight.js
const Wikitext = await Language.load(
  "./path/to/your/tree-sitter-wikitext.wasm",
);
```

### Disable Formatting Prevention

By default, the component prevents rich text formatting shortcuts (Ctrl+B, Ctrl+I, etc.). To allow them:

```javascript
// Remove or modify the handleKeydown method in the component
handleKeydown(e) {
  // Custom key handling logic
}
```

## Browser Compatibility

- **CSS Highlights API**: Chrome 105+, Firefox 113+, Safari 17.2+
- **Web Components**: All modern browsers
- **Tree-sitter WASM**: All browsers with WebAssembly support

### Fallback for Older Browsers

For browsers without CSS Highlights API support, the component will still work but without syntax highlighting.

## Development

### Building from Source

1. Clone the repository
2. Ensure you have the Tree-sitter WikiText parser compiled to WASM
3. Modify highlight queries in the `HIGHLIGHT_QUERY` constant as needed

### Adding New Highlight Rules

Edit the `HIGHLIGHT_QUERY` string in `wikitext-highlight.js`:

```javascript
const HIGHLIGHT_QUERY = `
  ;; Add your custom highlighting rules here
  (your_syntax_node) @your-highlight-name
`;
```

Then add corresponding CSS:

```css
::highlight(your-highlight-name) {
  color: var(--your-color);
}
```

## Example Projects

### Simple Editor

```html
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="theme.css" />
    <style>
      .editor {
        width: 100%;
        height: 400px;
        font-family: "Monaco", monospace;
      }
    </style>
  </head>
  <body>
    <h1>WikiText Editor</h1>
    <wikitext-highlighter class="editor">
      = Welcome = This is a '''sample''' [[WikiText]] document. {{Info|This is a
      template}}
    </wikitext-highlighter>

    <script type="module" src="wikitext-highlight.js"></script>
  </body>
</html>
```

### With Save/Load Functionality

```javascript
const editor = document.querySelector("wikitext-highlighter");
const saveBtn = document.getElementById("save");
const loadBtn = document.getElementById("load");

saveBtn.addEventListener("click", () => {
  localStorage.setItem("wikitext-content", editor.value);
});

loadBtn.addEventListener("click", () => {
  const saved = localStorage.getItem("wikitext-content");
  if (saved) editor.value = saved;
});
```
