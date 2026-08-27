# CodUI

A lightweight, zero-dependency Web Component (`<cod-ui>`) for code syntax highlighting. Fully responsive, themeable, with built-in copy actions and line numbers.

[![Version](https://img.shields.io/badge/version-2.1.0-blue)](https://github.com/praTeek271/codUI/releases/tag/v2.1.0)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## ✨ Features

- **Zero Dependencies** — Native Web Component using Shadow DOM. No npm installs needed.
- **7 Languages** — JavaScript/TypeScript, Python, HTML/XML, CSS/SCSS, JSON, Bash/Shell.
- **4 Themes** — `dark`, `light`, `dracula`, and `glass` (glassmorphism).
- **Line Numbers** — Optional toggleable line number column.
- **Copy Button** — One-click copy with visual confirmation feedback.
- **Responsive** — Customizable width and max-height attributes.

## 📦 Installation

### Option 1 — CDN (Recommended, zero setup)

```html
<script src="https://cdn.jsdelivr.net/gh/praTeek271/codUI@v2.1.0/codUI.js"></script>
```

### Option 2 — Download

Download [`codUI.js`](https://github.com/praTeek271/codUI/releases/latest) and include it locally:

```html
<script src="codUI.js"></script>
```

## 🚀 Usage

```html
<cod-ui lang="js" theme="dracula" line-numbers="true">
const greeting = "Hello, world!";
console.log(greeting);
</cod-ui>
```

### 📝 Displaying HTML & Special Code Blocks

Due to how browser HTML parsers work, placing raw HTML tags inside `<cod-ui>` will cause them to be parsed as live elements. You have three options:

#### Option 1: Escaped Entities (Standard)
Escape `<` to `&lt;` and `>` to `&gt;` inside the tag:
```html
<cod-ui lang="html">
&lt;div class="container"&gt;
    &lt;h1&gt;Hello World&lt;/h1&gt;
&lt;/div&gt;
</cod-ui>
```

#### Option 2: Script Wrapper (Unescaped)
Wrap your snippet in a `<script type="text/plain">` tag. The browser won't parse its contents, and `<cod-ui>` will extract and highlight the raw code automatically:
```html
<cod-ui lang="html">
    <script type="text/plain">
<div class="container">
    <h1>Hello World</h1>
</div>
    </script>
</cod-ui>
```

#### Option 3: Programmatic API
Create the element via JavaScript and set `textContent`. Bypasses HTML parsing entirely — no escaping needed:
```javascript
const block = document.createElement('cod-ui');
block.setAttribute('lang', 'html');
block.textContent = '<div class="container"><h1>Hello</h1></div>';
document.body.appendChild(block);
```

### Attributes

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `lang` | string | `'js'` | Language for syntax highlighting. Supported: `js`/`ts`/`jsx`/`tsx`, `python`/`py`, `html`/`xml`, `css`/`scss`/`less`, `json`, `bash`/`sh`/`shell`. |
| `theme` | string | `'dark'` | Color theme: `dark`, `light`, `dracula`, `glass`. |
| `line-numbers` | string | `'false'` | Show line numbers: `'true'` or `'false'`. |
| `width` | string | `'100%'` | Width of the code window. |
| `height` | string | `'auto'` | Max height before the content scrolls. |

## 🆕 What's New in v2.1.0

- **Bug fix — Python:** `'#'` or `"#"` inside a string literal was incorrectly colored as a comment. Now fixed with a combined single-pass alternation regex.
- **Bug fix — Bash:** Strings containing `#` (e.g. `echo "hello # world"`) were partially colored as comments. Same fix applied.
- **Improved test suite** — Dedicated regression tests for the hash-inside-string edge case.

See the full [CHANGELOG](CHANGELOG.md) for all release history.

## 🛠️ Development & Testing

```bash
npm test        # Build from src/ and run all regression tests
npm run build   # Build codUI.js from src/ only
```

> ⚠️ `codUI.js` is auto-generated. **Never edit it directly.** All changes must be made in `src/` and compiled via `npm run build`.

