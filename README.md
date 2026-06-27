# CodUI

A lightweight, zero-dependency Web Component (`<cod-ui>`) for code syntax highlighting. Fully responsive, themeable, with built-in copy actions and line numbers.

## ✨ Features

- **Zero Dependencies**: Lightweight native Web Component using Shadow DOM.
- **Multi-Theme Support**: Built-in themes including `dark`, `light`, `dracula`, and `glass` (glassmorphism).
- **Line Numbers**: Optional toggleable line number column.
- **Interactive Copy Button**: Copy clean code to clipboard with visual confirmation feedback.
- **Responsive Design**: Customizable width and max-height attributes.

## 🚀 Usage

Include `codUI.js` in your project:

```html
<script src="codUI.js"></script>
```

Use the `<cod-ui>` element in your HTML:

```html
<cod-ui lang="js" theme="dracula" line-numbers="true">
const greeting = "Hello, world!";
console.log(greeting);
</cod-ui>
```

### Attributes

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `lang` | string | `'js'` | Language syntax highlighting (`js`, `python`/`py`, `html`/`xml`). |
| `theme` | string | `'dark'` | Color theme (`dark`, `light`, `dracula`, `glass`). |
| `line-numbers`| string | `'false'`| Whether to show line numbers (`'true'` or `'false'`). |
| `width` | string | `'100%'` | Width of the code window. |
| `height` | string | `'auto'` | Max height of the code window before scrolling. |

## 🛠️ Development & Testing

Run unit regression tests locally:

```bash
npm test
```