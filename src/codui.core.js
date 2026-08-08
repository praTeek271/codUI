/**
 * src/codui.core.js
 * CodUI Web Component entry point.
 *
 * Defines the <cod-ui> custom element and coordinates the full
 * rendering pipeline: attribute parsing → escape → highlight → render.
 *
 * Lifecycle:
 *   connectedCallback()      — fires on DOM insert, triggers initial render
 *   attributeChangedCallback — fires on attr change, re-renders
 *   observedAttributes       — theme, lang, line-numbers, width, height
 *
 * Public API:
 *   instance.highlight(code, lang) — highlight a code string directly
 *   CodUI.highlight(code, lang)    — static version for tooling/testing
 *
 * Depends on:
 *   utils.js       (stripNewlines, escapeHTML)
 *   highlighter.js (highlight)
 *   uiRenderer.js  (renderComponent)
 */

class CodUI extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['theme', 'lang', 'line-numbers', 'width', 'height'];
    }

    attributeChangedCallback() {
        this.render();
    }

    /**
     * Public API: Programmatically highlight code string.
     */
    highlight(code, lang) {
        return highlight(code, lang);
    }

    static highlight(code, lang) {
        return highlight(code, lang);
    }

    render() {
        var width     = this.getAttribute('width') || '100%';
        var height    = this.getAttribute('height') || 'auto';
        var lang      = this.getAttribute('lang') || 'js';
        var theme     = this.getAttribute('theme') || 'dark';
        var showLines = this.getAttribute('line-numbers') === 'true';

        // 1. Get raw content from component body
        var rawCode = this.textContent || '';
        
        // Clean leading/trailing empty lines
        rawCode = stripNewlines(rawCode);

        // 2. Prep code for copy functionality and rendering
        var cleanCodeForCopy = rawCode;
        var escapedCode      = escapeHTML(rawCode);

        // 3. Apply syntax highlighting
        var highlightedCode = highlight(escapedCode, lang);

        // 4. Render HTML/CSS markup into Shadow DOM
        this.shadowRoot.innerHTML = renderComponent({
            lang: lang,
            theme: theme,
            showLines: showLines,
            width: width,
            height: height,
            highlightedCode: highlightedCode,
            rawCode: cleanCodeForCopy
        });

        // 5. Wire up the copy button event listener
        var copyBtn = this.shadowRoot.getElementById('codui-copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function () {
                // Modern Clipboard API with simple textarea fallback
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(cleanCodeForCopy)
                        .then(showCopiedState)
                        .catch(function (err) {
                            console.error("Clipboard API copy failed, using fallback: ", err);
                            fallbackCopy(cleanCodeForCopy);
                        });
                } else {
                    fallbackCopy(cleanCodeForCopy);
                }
            });
        }

        function showCopiedState() {
            if (!copyBtn) return;
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('copied');
            setTimeout(function () {
                copyBtn.textContent = 'Copy';
                copyBtn.classList.remove('copied');
            }, 2000);
        }

        function fallbackCopy(text) {
            var textarea = document.createElement('textarea');
            textarea.value = text;
            // Prevent scrolling on focus
            textarea.style.top = '0';
            textarea.style.left = '0';
            textarea.style.position = 'fixed';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                document.execCommand('copy');
                showCopiedState();
            } catch (err) {
                console.error("Fallback copy failed: ", err);
            }
            document.body.removeChild(textarea);
        }
    }
}

customElements.define('cod-ui', CodUI);
