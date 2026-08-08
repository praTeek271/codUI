# Issue #001: Three Critical Tokenizer Bugs in v2.0.8

**Severity:** Critical
**Status:** Open  
**Version:** v2.0.8
**Fix Target:** v2.0.9 (`fix/tokenizer-bugs` branch)
**Component:** `codUI.js` — tokenizer logic and raw code extraction

---

## Summary

Three inter-related bugs were discovered in v2.0.8 that cause incorrect rendering across **Python**, **JavaScript**, and **HTML** language modes. All three ultimately stem from flaws in how the component reads raw code from the DOM and how the token protection system is designed.

---

## Bug #1 — Python: Single-Quoted Strings Break Surrounding Code

### Description
When Python code contains a single-quoted string, everything *after* the closing quote on that line gets swallowed and disappears. The protect token placeholder (`\x00T0T\x00`) leaks visibly into the output.

### Steps to Reproduce
Use `lang="python"` with code containing `'='` or any single-quoted string:
```python
if '=' in line and not line.startswith('#'):
    key, value = line.split('=', 1)
    config[key.strip()] = value.strip()
```

### Expected Output
```
if '=' in line and not line.startswith('#'):
    key, value = line.split('=', 1)
    config[key.strip()] = value.strip()
```

### Actual Output
```
if '=' in line and not line.startswith('T2T
    key, value = line.split('=', 1)
    config[key.strip()] = value.strip()
```

### Root Cause
The Python tokenizer runs `STRING_SINGLE` *after* `COMMENT_HASH`. The single-quote pattern is:
```
/'(?:[^'\\]|\\.)*'/g
```
This greedy regex matches `'='` at the start, wraps it in a protect token, and **replaces the matched text in-place**. But the replace token uses `\x00T0T\x00` which contains a null byte (`\x00`). When the final restore pass runs:
```js
code.replace(/\x00T(\d+)T\x00/g, ...)
```
The null bytes in the string cause the regex to fail to match completely in some browser environments, leaving the raw token placeholder visible in the output (`T2T` is the remnant of `\x00T2T\x00` after null bytes are stripped by the DOM).

The **real fix** needed: The protect key must not use `\x00` — it must use a character sequence guaranteed to be DOM-safe and not interfere with subsequent regex passes. A UUID-style marker like `«T0T»` is the right approach.

---

## Bug #2 — JavaScript: Arrow Functions `=>` Render as `=&gt;`

### Description
Arrow function syntax `=>` is rendered as the literal HTML entity `=&gt;` on screen instead of the correct `=>` symbol.

### Steps to Reproduce
Use `lang="javascript"` with arrow function syntax:
```js
const fetchUserData = async (userId) => {
    try {
```

### Expected Output
```
const fetchUserData = async (userId) => {
    try {
```

### Actual Output
```
const fetchUserData = async (userId) =&gt; {
    try {
```

### Root Cause
**Double-escaping caused by `this.innerHTML`.**

The `render()` method reads the user's raw code using:
```js
var rawCode = this.innerHTML;
```
When a browser serializes `innerHTML`, it automatically HTML-encodes all special characters. So the user's `=>` becomes `=&gt;` at this stage.

Then `escapeHTML(rawCode)` runs on top of that, turning the `&` in `&gt;` into `&amp;`, producing `=&amp;gt;`.

The browser then renders `=&amp;gt;` visually as `=&gt;`.

**The fix:** Use `this.textContent` instead of `this.innerHTML`. `textContent` reads raw characters directly from the DOM tree, bypassing the HTML serializer entirely.

```diff
- var rawCode = this.innerHTML;
- if (!rawCode || !rawCode.trim()) { rawCode = this.textContent || ''; }
+ var rawCode = this.textContent || '';
```

---

## Bug #3 — HTML: Entire Code Block Renders as Escaped Entities

### Description
When using `lang="html"`, the entire displayed code consists of raw HTML entity strings (`&lt;`, `&gt;` etc.) rather than showing the tag characters visually highlighted as `<` and `>`.

### Steps to Reproduce
Use `lang="html"` with standard HTML markup:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>My Page</title>
</head>
<body>
    <h1>Hello, CodUI!</h1>
</body>
</html>
```

### Expected Output
A visually highlighted HTML code block where tags are colored in pink/red, attributes in cyan, values in green, etc.

### Actual Output
```
&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;title&gt;My Page&lt;/title&gt;
&lt;/head&gt;
...
```
The raw entity strings are displayed verbatim — no syntax highlighting, no readable output.

### Root Cause
This is **the same `innerHTML` double-escaping bug from Bug #2, compounded by the HTML tokenizer's design**.

**Step-by-step trace:**
1. User writes `<html>` inside `<cod-ui>`.
2. `this.innerHTML` returns `&lt;html&gt;` (the browser escapes it during serialization).
3. `escapeHTML()` runs on `&lt;html&gt;`, turning it into `&amp;lt;html&amp;gt;`.
4. The HTML tokenizer's `COMMENT_HTML` pattern is:
   ```
   /(&lt;!--[\s\S]*?--&gt;)/g
   ```
   It looks for the *already-escaped* `&lt;` literal in the input (because the tokenizer was designed to operate on pre-escaped text). This is actually correct for HTML comments — but the tag matching pattern `HTML_TAG`:
   ```
   /(&lt;\/?)([\w\-:]+)/g
   ```
   now fails entirely on `&amp;lt;` (which is what the double-escaped input contains), so **no tags are highlighted at all**.
5. The final output renders as raw escaped entity strings with zero syntax highlighting.

**The fix:** Switch to `textContent` for raw code extraction. Then `escapeHTML()` runs exactly once on the real raw characters, producing the `&lt;` tokens that the HTML tokenizer already expects. This restores correct operation.

---

---

## Bug #4 — Programmatic API: `el.textContent = code` Still Breaks

### Description
Even when a developer does everything correctly — creating the element via JS and using `el.textContent = code` — the output is still double-escaped. This affects the playground itself and any user who builds `<cod-ui>` elements dynamically.

### Steps to Reproduce
```js
const el = document.createElement('cod-ui');
el.setAttribute('lang', 'javascript');
el.textContent = 'const greet = (name) => `Hello, ${name}!`;';
document.body.appendChild(el);
```

### Expected Output
Properly highlighted JavaScript with `=>` and backtick template literals rendered correctly.

### Actual Output
`=&gt;` and broken backtick template strings.

### Root Cause
Setting `el.textContent` correctly stores raw characters as a **text node** in the DOM. But when `render()` calls `this.innerHTML`, the browser *serializes* that text node back through its HTML serializer, re-encoding `>` as `&gt;`, `` ` `` as `` ` `` (fine), but `&` as `&amp;` — causing the same double-escape cascade.

The playground (`playground/index.html` line 815) already does the right thing by using `el.textContent = DOM.input.value` — this is the correct approach for setting code. The bug lives entirely inside the component's `render()` which then undoes this correct setup by reading with `this.innerHTML`.

---

## Fix Summary

All four bugs are resolved by a **single one-line change** to the `render()` method in `codUI.js`:

```diff
- var rawCode = this.innerHTML;
- if (!rawCode || !rawCode.trim()) { rawCode = this.textContent || ''; }
+ var rawCode = this.textContent || '';
```

> [!NOTE]
> Bug #1 (the Python `\x00` token placeholder) has a secondary cause independent of the `innerHTML` issue. Even after fixing the extraction method, the null-byte token protection key is fragile. A follow-up issue should be raised to replace `\x00TnT\x00` with a DOM-safe sentinel like `«TnT»`.

---

## Snapshot

> **Drop your screenshot below to document the visual state of the bug:**

![Bug #2 — JS Arrow Function double-escape](double-escape-bug.png)

---

## References
- [codUI.js (v2.0.8)](../../codUI.js) — line 13, `render()` method
- Fix PR: `fix/tokenizer-bugs` → `main`
