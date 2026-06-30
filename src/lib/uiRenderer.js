/**
 * src/lib/uiRenderer.js
 * UI rendering engine for the CodUI Web Component.
 *
 * Generates the complete shadowRoot innerHTML — all CSS styles and markup —
 * driven entirely by theme data from themes.js. Zero hardcoded colors here.
 *
 * Depends on: themes.js (getTheme, buildSyntaxCSS), utils.js (countLines)
 */

/**
 * Builds the HTML for the line number gutter column.
 *
 * @param {number} lineCount - Number of lines in the code block
 * @returns {string} - HTML string of line number divs
 */
function buildLineNumbers(lineCount) {
    var html = '';
    for (var i = 1; i <= lineCount; i++) {
        html += '<div class="line-number">' + i + '</div>';
    }
    return html;
}

/**
 * Renders the complete Web Component shadow DOM.
 * Returns the full innerHTML string including <style> and markup.
 *
 * @param {object} opts
 * @param {string} opts.lang            - Language identifier (display only)
 * @param {string} opts.theme           - Theme name
 * @param {boolean} opts.showLines      - Whether to show the line number gutter
 * @param {string} opts.width           - CSS width value
 * @param {string} opts.height          - CSS max-height value
 * @param {string} opts.highlightedCode - HTML string with <span> tags
 * @param {string} opts.rawCode         - Plain text code (for copy action)
 * @returns {string}
 */
function renderComponent(opts) {
    var lang            = opts.lang || 'text';
    var theme           = opts.theme || 'dark';
    var showLines       = opts.showLines || false;
    var width           = opts.width || '100%';
    var height          = opts.height || 'auto';
    var highlightedCode = opts.highlightedCode || '';

    var t         = getTheme(theme);
    var syntaxCSS = buildSyntaxCSS(theme);

    // ── Code content HTML ─────────────────────────────────────────────────────
    var codeContentHTML = '';
    if (showLines) {
        var lineCount      = countLines(highlightedCode.replace(/<[^>]+>/g, ''));
        var lineNumbersHTML = buildLineNumbers(lineCount);
        codeContentHTML = [
            '<div class="code-grid">',
            '  <div class="line-numbers-col" aria-hidden="true">' + lineNumbersHTML + '</div>',
            '  <pre class="code-col"><code>' + highlightedCode + '</code></pre>',
            '</div>',
        ].join('\n');
    } else {
        codeContentHTML = '<pre class="pre-container"><code>' + highlightedCode + '</code></pre>';
    }

    // ── Styles ────────────────────────────────────────────────────────────────
    var styles = [
        ':host {',
        '    display: block;',
        '    width: 100%;',
        '    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;',
        '    box-sizing: border-box;',
        '}',
        '*, *:before, *:after { box-sizing: inherit; }',

        '.window {',
        '    width: ' + width + ';',
        '    max-height: ' + height + ';',
        '    background: ' + t.bg + ';',
        '    border-radius: 12px;',
        '    overflow: hidden;',
        '    display: flex;',
        '    flex-direction: column;',
        '    ' + t.borderStyle,
        '    transition: background-color 0.3s ease, border-color 0.3s ease;',
        '}',

        '.header {',
        '    background: ' + t.header + ';',
        '    padding: 10px 16px;',
        '    display: flex;',
        '    justify-content: space-between;',
        '    align-items: center;',
        '    border-bottom: 1px solid ' + t.border + ';',
        '    user-select: none;',
        '}',

        '.controls { display: flex; gap: 8px; }',
        '.dot { width: 12px; height: 12px; border-radius: 50%; }',
        '.dot.red    { background: #ff5f56; }',
        '.dot.yellow { background: #ffbd2e; }',
        '.dot.green  { background: #27c93f; }',

        '.actions { display: flex; gap: 12px; align-items: center; }',
        '.lang-badge {',
        '    color: ' + t.lineNum + ';',
        '    font-size: 11px;',
        '    text-transform: uppercase;',
        '    font-weight: 700;',
        '    letter-spacing: 0.6px;',
        '}',

        '.copy-btn {',
        '    background: transparent;',
        '    border: 1px solid ' + t.border + ';',
        '    color: ' + t.text + ';',
        '    padding: 4px 10px;',
        '    border-radius: 6px;',
        '    font-size: 12px;',
        '    cursor: pointer;',
        '    transition: all 0.2s ease-in-out;',
        '    font-family: inherit;',
        '}',
        '.copy-btn:hover { background: rgba(128,128,128,0.12); }',
        '.copy-btn.copied { background: #27c93f; border-color: #27c93f; color: #000; font-weight: 700; }',

        '.content-wrapper { overflow: auto; flex-grow: 1; }',

        '.pre-container {',
        '    margin: 0;',
        '    padding: 20px;',
        '    color: ' + t.text + ';',
        '    font-size: 14px;',
        '    line-height: 1.65;',
        '    white-space: pre;',
        '}',

        '.code-grid { display: flex; min-width: max-content; }',
        '.line-numbers-col {',
        '    padding: 20px 10px 20px 16px;',
        '    text-align: right;',
        '    color: ' + t.lineNum + ';',
        '    background: rgba(0,0,0,0.10);',
        '    border-right: 1px solid ' + t.border + ';',
        '    user-select: none;',
        '    font-size: 14px;',
        '    line-height: 1.65;',
        '    min-width: 42px;',
        '}',
        '.code-col {',
        '    margin: 0;',
        '    padding: 20px;',
        '    color: ' + t.text + ';',
        '    font-size: 14px;',
        '    line-height: 1.65;',
        '    flex-grow: 1;',
        '    white-space: pre;',
        '}',

        '.content-wrapper::-webkit-scrollbar { width: 8px; height: 8px; }',
        '.content-wrapper::-webkit-scrollbar-track { background: transparent; }',
        '.content-wrapper::-webkit-scrollbar-thumb { background: ' + t.scrollThumb + '; border-radius: 4px; }',
        '.content-wrapper::-webkit-scrollbar-thumb:hover { background: ' + t.scrollThumb + '; opacity: 0.8; }',

        syntaxCSS,
    ].join('\n');

    // ── Markup ────────────────────────────────────────────────────────────────
    return [
        '<style>' + styles + '</style>',
        '<div class="window">',
        '  <div class="header">',
        '    <div class="controls">',
        '      <div class="dot red"></div>',
        '      <div class="dot yellow"></div>',
        '      <div class="dot green"></div>',
        '    </div>',
        '    <div class="actions">',
        '      <span class="lang-badge">' + escapeHTML(lang) + '</span>',
        '      <button class="copy-btn" id="codui-copy-btn">Copy</button>',
        '    </div>',
        '  </div>',
        '  <div class="content-wrapper">',
        '    ' + codeContentHTML,
        '  </div>',
        '</div>',
    ].join('\n');
}
