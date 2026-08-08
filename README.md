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

### 📝 Displaying HTML & Special Code Blocks

Due to how browser HTML parsers work, placing raw HTML tags inside the `<cod-ui>` element will cause the browser to parse them as active elements instead of code text. You have three ways to display HTML code blocks:

#### Option 1: Escaped Entities (Standard)
Escape the brackets (`<` to `&lt;` and `>` to `&gt;`) inside the component tag:
```html
<cod-ui lang="html">
&lt;div class="container"&gt;
    &lt;h1&gt;Hello World&lt;/h1&gt;
&lt;/div&gt;
</cod-ui>
```

#### Option 2: Script Wrapper (Unescaped)
Wrap your code snippet in a `<script type="text/plain">` tag. The browser will ignore parsing the inner HTML, and `<cod-ui>` will automatically extract and highlight the raw code:
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
Create the element dynamically in JavaScript and set `textContent`. This bypasses browser HTML parsing completely and requires no escaping:
```javascript
const codeBlock = document.createElement('cod-ui');
codeBlock.setAttribute('lang', 'html');
codeBlock.textContent = '<div class="container"><h1>Hello World</h1></div>';
document.body.appendChild(codeBlock);
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