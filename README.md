# WikiText Highlighter Web Component

A web component that provides syntax highlighting for WikiText markup using Tree-sitter. This component creates a text area with real-time syntax highlighting for MediaWiki-style markup, with optional editing capabilities.

## Features

- Real-time syntax highlighting for WikiText markup
- Optional plain text editing (no rich text formatting)
- Read-only display mode by default
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

### Read-only Display (Default)

```html
<wikitext-highlighter>
  {{Template}} '''Bold text''' and [[Wiki Link]]
</wikitext-highlighter>
```

### Editable Mode

```html
<wikitext-highlighter editable>
  {{Template}} '''Bold text''' and [[Wiki Link]]
</wikitext-highlighter>
```

### JavaScript

```javascript
import WikitextHighlighter from "./wikitext-highlight.js";

// The component is automatically registered as 'wikitext-highlighter'
const highlighter = document.querySelector("wikitext-highlighter");

// Get/set content
console.log(highlighter.value); // Get current text
highlighter.value = "New '''WikiText''' content"; // Set new text

// Enable/disable editing
highlighter.editable = true; // Make editable
highlighter.editable = false; // Make read-only
```

## API Reference

### Properties

#### `value` (String)

Gets or sets the text content of the component.

```javascript
const highlighter = document.querySelector("wikitext-highlighter");
highlighter.value = "{{Infobox}} '''Bold''' [[Link]]";
console.log(highlighter.value); // Returns the current text content
```

#### `editable` (Boolean)

Gets or sets whether the component is editable.

```javascript
const highlighter = document.querySelector("wikitext-highlighter");
highlighter.editable = true; // Enable editing
highlighter.editable = false; // Disable editing (read-only)
console.log(highlighter.editable); // Returns true/false
```

### Attributes

#### `value` (String)

Can be used to set initial content via HTML attribute.

```html
<wikitext-highlighter value="Initial '''content'''"></wikitext-highlighter>
```

#### `editable` (Boolean Attribute)

Makes the component editable when present.

```html
<!-- Read-only (default) -->
<wikitext-highlighter>Content here</wikitext-highlighter>

<!-- Editable -->
<wikitext-highlighter editable>Content here</wikitext-highlighter>
```

### Events

#### `input`

Fired when the content changes in editable mode (same as standard HTML input event).

```javascript
highlighter.addEventListener("input", (e) => {
  console.log("Content changed:", e.target.value);
});
```

## Use Cases

### Documentation Display

For displaying WikiText content in a read-only, syntax-highlighted format:

```html
<wikitext-highlighter>
  = Documentation = This is '''important''' information about [[API Usage]].
  {{Warning|This is deprecated}}
</wikitext-highlighter>
```

### Interactive Editor

For creating WikiText editors:

```html
<wikitext-highlighter editable>
  = Edit Mode = You can '''edit''' this [[content]] directly.
</wikitext-highlighter>
```

### Toggle Mode

Switching between read-only and editable modes:

```javascript
const highlighter = document.querySelector("wikitext-highlighter");
const toggleBtn = document.querySelector("#toggle");

toggleBtn.addEventListener("click", () => {
  highlighter.editable = !highlighter.editable;
  toggleBtn.textContent = highlighter.editable ? "View Mode" : "Edit Mode";
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

/* Style editable vs read-only differently */
wikitext-highlighter[editable] {
  border: 2px solid var(--blue);
  cursor: text;
}

wikitext-highlighter:not([editable]) {
  border: 1px solid var(--overlay1);
  cursor: default;
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

By default, the component prevents rich text formatting shortcuts (Ctrl+B, Ctrl+I, etc.) in editable mode. To allow them:

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

### Documentation Viewer

```html
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="theme.css" />
    <style>
      .docs-viewer {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <h1>Documentation</h1>
    <wikitext-highlighter class="docs-viewer">
      = API Reference = The '''main''' function accepts these parameters: *
      [[User|user]] - The current user * {{Config|timeout=30}} - Configuration
      object

      <!-- This is internal documentation -->
    </wikitext-highlighter>

    <script type="module" src="wikitext-highlight.js"></script>
  </body>
</html>
```

### Editable Wiki Editor

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
      .toolbar {
        margin-bottom: 10px;
      }
    </style>
  </head>
  <body>
    <h1>WikiText Editor</h1>
    <div class="toolbar">
      <button id="toggle">Switch to View Mode</button>
      <button id="save">Save</button>
      <button id="load">Load</button>
    </div>
    <wikitext-highlighter class="editor" editable>
      = Welcome = This is a '''sample''' [[WikiText]] document. {{Info|This is a
      template}}
    </wikitext-highlighter>

    <script type="module">
      import WikitextHighlighter from "./wikitext-highlight.js";

      const editor = document.querySelector("wikitext-highlighter");
      const toggleBtn = document.getElementById("toggle");
      const saveBtn = document.getElementById("save");
      const loadBtn = document.getElementById("load");

      toggleBtn.addEventListener("click", () => {
        editor.editable = !editor.editable;
        toggleBtn.textContent = editor.editable
          ? "Switch to View Mode"
          : "Switch to Edit Mode";
      });

      saveBtn.addEventListener("click", () => {
        localStorage.setItem("wikitext-content", editor.value);
      });

      loadBtn.addEventListener("click", () => {
        const saved = localStorage.getItem("wikitext-content");
        if (saved) editor.value = saved;
      });
    </script>
  </body>
</html>
```

### Multi-mode Documentation System

```html
<div class="documentation">
  <!-- Read-only sections -->
  <h2>Overview</h2>
  <wikitext-highlighter>
    This '''API''' provides access to [[User Data]].
  </wikitext-highlighter>

  <!-- Editable sections -->
  <h2>Your Notes</h2>
  <wikitext-highlighter editable>
    Add your '''personal notes''' here...
  </wikitext-highlighter>
</div>
```

## License

This project uses Tree-sitter which is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions:

- Check the browser console for errors
- Ensure all required files are properly loaded
- Verify browser compatibility with CSS Highlights API
- Confirm the `editable` attribute is set when editing functionality is needed
