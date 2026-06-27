/**
 * codUI.js - v1.0.0
 * Lightweight, zero-dependency Web Component for code syntax highlighting.
 * Fully responsive, themeable, with built-in copy actions and line numbers.
 * Usage: <cod-ui lang="js" theme="dracula" line-numbers="true">...</cod-ui>
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

    render() {
        const width = this.getAttribute('width') || '100%';
        const height = this.getAttribute('height') || 'auto';
        const lang = this.getAttribute('lang') || 'js';
        const theme = this.getAttribute('theme') || 'dark';
        const showLines = this.getAttribute('line-numbers') === 'true';

        let rawCode = this.innerHTML.replace(/^\s*[\r\n]/, '').replace(/[\r\n]\s*$/, '');
        if (!rawCode) {
            rawCode = this.textContent.replace(/^\s*[\r\n]/, '').replace(/[\r\n]\s*$/, '');
        }
        
        const cleanCodeForCopy = rawCode;
        let escapedCode = rawCode
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        const highlightedCode = this.highlight(escapedCode, lang);

        const themes = {
            dark: { 
                bg: '#1e1e1e', 
                header: '#252526', 
                text: '#d4d4d4', 
                border: '#333', 
                lineNum: '#666', 
                borderStyle: 'border: 1px solid #333;' 
            },
            light: { 
                bg: '#fafafa', 
                header: '#f0f0f0', 
                text: '#333333', 
                border: '#ddd', 
                lineNum: '#999', 
                borderStyle: 'border: 1px solid #e5e5e5; box-shadow: 0 4px 15px rgba(0,0,0,0.05);' 
            },
            dracula: { 
                bg: '#282a36', 
                header: '#21222c', 
                text: '#f8f8f2', 
                border: '#44475a', 
                lineNum: '#6272a4', 
                borderStyle: 'border: 1px solid #44475a;' 
            },
            glass: { 
                bg: 'rgba(20, 20, 30, 0.45)', 
                header: 'rgba(255, 255, 255, 0.05)', 
                text: '#e2e8f0', 
                border: 'rgba(255,255,255,0.1)', 
                lineNum: '#64748b', 
                borderStyle: 'border: 1px solid rgba(255,255,255,0.15); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); box-shadow: 0 8px 32px rgba(0,0,0,0.3);' 
            }
        };
        const t = themes[theme] || themes.dark;

        let syntaxCSS = `
            .keyword { color: ${theme === 'light' ? '#0000ff' : (theme === 'dracula' ? '#ff79c6' : '#569cd6')}; font-weight: bold; }
            .control { color: ${theme === 'light' ? '#af00db' : (theme === 'dracula' ? '#ff79c6' : '#c586c0')}; }
            .function { color: ${theme === 'light' ? '#795e26' : (theme === 'dracula' ? '#50fa7b' : '#dcdcaa')}; }
            .string { color: ${theme === 'light' ? '#a31515' : (theme === 'dracula' ? '#f1fa8c' : '#ce9178')}; }
            .comment { color: ${theme === 'light' ? '#008000' : (theme === 'dracula' ? '#6272a4' : '#6a9955')}; font-style: italic; }
            .number { color: ${theme === 'light' ? '#098658' : (theme === 'dracula' ? '#bd93f9' : '#b5cea8')}; }
            .tag { color: ${theme === 'light' ? '#800000' : (theme === 'dracula' ? '#ff79c6' : '#569cd6')}; }
            .attr { color: ${theme === 'light' ? '#ff0000' : (theme === 'dracula' ? '#50fa7b' : '#9cdcfe')}; }
        `;

        let codeContentHTML = '';
        if (showLines) {
            const linesCount = escapedCode.split('\n').length;
            const lineNumbersHTML = Array.from({ length: linesCount }, (_, i) => `<div class="line-number">${i + 1}</div>`).join('');
            
            codeContentHTML = `
                <div class="code-grid">
                    <div class="line-numbers-col" aria-hidden="true">${lineNumbersHTML}</div>
                    <pre class="code-col"><code>${highlightedCode}</code></pre>
                </div>
            `;
        } else {
            codeContentHTML = `<pre class="pre-container"><code>${highlightedCode}</code></pre>`;
        }

        this.shadowRoot.innerHTML = `
            <style>
                :host { 
                    display: block; 
                    width: 100%; 
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; 
                    box-sizing: border-box;
                }
                *, *:before, *:after { box-sizing: inherit; }
                
                .window {
                    width: ${width};
                    max-height: ${height};
                    background: ${t.bg};
                    border-radius: 12px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    ${t.borderStyle}
                    transition: background-color 0.3s ease, border-color 0.3s ease;
                }
                .header {
                    background: ${t.header};
                    padding: 10px 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid ${t.border};
                    user-select: none;
                }
                .controls { display: flex; gap: 8px; }
                .dot { width: 12px; height: 12px; border-radius: 50%; }
                .dot.red { background: #ff5f56; }
                .dot.yellow { background: #ffbd2e; }
                .dot.green { background: #27c93f; }
                
                .actions { display: flex; gap: 12px; align-items: center; }
                .lang-badge {
                    color: ${t.lineNum};
                    font-size: 11px;
                    text-transform: uppercase;
                    font-weight: bold;
                    letter-spacing: 0.5px;
                }
                .copy-btn {
                    background: transparent;
                    border: 1px solid ${t.border};
                    color: ${t.text};
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                    font-family: inherit;
                }
                .copy-btn:hover { background: ${theme === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.08)'}; }
                .copy-btn.copied { background: #27c93f; border-color: #27c93f; color: #000; font-weight: bold; }
                
                .content-wrapper {
                    overflow: auto;
                    flex-grow: 1;
                }
                
                .pre-container {
                    margin: 0;
                    padding: 20px;
                    color: ${t.text};
                    font-size: 14px;
                    line-height: 1.6;
                }
                
                .code-grid {
                    display: flex;
                    min-width: max-content;
                }
                .line-numbers-col {
                    padding: 20px 10px 20px 16px;
                    text-align: right;
                    color: ${t.lineNum};
                    background: ${theme === 'light' ? '#f5f5f5' : 'rgba(0,0,0,0.12)'};
                    border-right: 1px solid ${t.border};
                    user-select: none;
                    font-size: 14px;
                    line-height: 1.6;
                }
                .code-col {
                    margin: 0;
                    padding: 20px;
                    color: ${t.text};
                    font-size: 14px;
                    line-height: 1.6;
                    flex-grow: 1;
                }
                
                .content-wrapper::-webkit-scrollbar { width: 10px; height: 10px; }
                .content-wrapper::-webkit-scrollbar-track { background: transparent; }
                .content-wrapper::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 5px; }
                .content-wrapper::-webkit-scrollbar-thumb:hover { background: ${theme === 'light' ? '#ccc' : '#555'}; }
                
                ${syntaxCSS}
            </style>

            <div class="window">
                <div class="header">
                    <div class="controls">
                        <div class="dot red"></div>
                        <div class="dot yellow"></div>
                        <div class="dot green"></div>
                    </div>
                    <div class="actions">
                        <span class="lang-badge">${lang}</span>
                        <button class="copy-btn">Copy</button>
                    </div>
                </div>
                <div class="content-wrapper">
                    ${codeContentHTML}
                </div>
            </div>
        `;

        const copyBtn = this.shadowRoot.querySelector('.copy-btn');
        copyBtn.addEventListener('click', () => {
            const textarea = document.createElement('textarea');
            textarea.value = cleanCodeForCopy;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                copyBtn.textContent = 'Copied!';
                copyBtn.classList.add('copied');
                setTimeout(() => { 
                    copyBtn.textContent = 'Copy'; 
                    copyBtn.classList.remove('copied'); 
                }, 2000);
            } catch (err) {
                console.error("Copy failed: ", err);
            }
            document.body.removeChild(textarea);
        });
    }

    highlight(code, lang) {
        if (!code) return '';
        lang = (lang || 'js').toLowerCase();

        // ── 1. HTML / XML ──
        if (lang === 'html' || lang === 'xml') {
            code = code.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="comment">$1</span>');
            code = code.replace(/(&lt;\/?)([a-zA-Z0-9\-:]+)/g, '$1<span class="tag">$2</span>');
            code = code.replace(/\b([a-zA-Z0-9\-:]+)(?=\s*=)/g, '<span class="attr">$1</span>');
            code = code.replace(/(["'])(.*?)\1/g, (match) => {
                if (match.includes('span') || match === '"tag"' || match === '"attr"' || match === '"comment"' || match === '"string"') return match;
                return `<span class="string">${match}</span>`;
            });
            return code;
        }

        // ── 2. JSON ──
        if (lang === 'json') {
            code = code.replace(/"([^"]+)"(?=\s*:)/g, '<span class="attr">"$1"</span>');
            code = code.replace(/"([^"]+)"(?!\s*:)/g, (match) => {
                if (match.includes('<span')) return match;
                return `<span class="string">${match}</span>`;
            });
            code = code.replace(/\b(true|false|null)\b/g, '<span class="keyword">$1</span>');
            code = code.replace(/\b(-?\d+(\.\d+)?([eE][+-]?\d+)?)\b/g, '<span class="number">$1</span>');
            return code;
        }

        // ── 3. CSS ──
        if (lang === 'css') {
            code = code.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
            code = code.replace(/(["'])(.*?)\1/g, '<span class="string">$1$2$1</span>');
            code = code.replace(/(--[\w-]+)/g, '<span class="keyword">$1</span>');
            code = code.replace(/([\w-]+)(?=\s*:)/g, '<span class="attr">$1</span>');
            code = code.replace(/\b(\d+(\.\d+)?(px|rem|em|%|vh|vw|s|ms)?)\b/g, '<span class="number">$1</span>');
            return code;
        }

        // ── 4. Python, Bash, JS, TS ──
        if (lang === 'python' || lang === 'py' || lang === 'bash' || lang === 'sh' || lang === 'shell') {
            code = code.replace(/(#.*)/g, '<span class="comment">$1</span>');
        } else {
            code = code.replace(/(\/\/.*)/g, '<span class="comment">$1</span>');
            code = code.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
        }

        code = code.replace(/(["'`])(.*?)\1/g, (match) => {
            if (match.includes('<span')) return match;
            return `<span class="string">${match}</span>`;
        });
        code = code.replace(/\b(\d+(\.\d+)?([eE][+-]?\d+)?)\b/g, '<span class="number">$1</span>');

        let keywords = [];
        let controlWords = [];

        if (lang === 'python' || lang === 'py') {
            keywords     = ['def', 'import', 'from', 'self', 'True', 'False', 'None', 'lambda', 'yield', 'pass', 'raise', 'global', 'nonlocal'];
            controlWords = ['return', 'if', 'elif', 'else', 'in', 'not', 'and', 'or', 'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'assert', 'del'];
        } else if (lang === 'bash' || lang === 'sh' || lang === 'shell') {
            keywords     = ['export', 'local', 'readonly', 'source', 'declare', 'unset', 'echo', 'set'];
            controlWords = ['if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac', 'in', 'function', 'return', 'exit'];
            code = code.replace(/(\$\{?[\w_]+\}?)/g, (match) => match.includes('<span') ? match : `<span class="number">${match}</span>`);
        } else {
            keywords     = ['const', 'let', 'var', 'function', 'import', 'export', 'default', 'new', 'this',
                            'async', 'await', 'typeof', 'instanceof',
                            'interface', 'type', 'enum', 'namespace', 'declare', 'abstract',
                            'implements', 'extends', 'readonly', 'keyof', 'infer', 'as'];
            controlWords = ['return', 'if', 'else', 'for', 'while', 'try', 'catch', 'finally',
                            'switch', 'case', 'break', 'continue', 'throw', 'of', 'in'];
        }

        if (keywords.length) {
            const kwRe = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
            code = code.replace(kwRe, (match) => `<span class="keyword">${match}</span>`);
        }
        if (controlWords.length) {
            const ctRe = new RegExp(`\\b(${controlWords.join('|')})\\b`, 'g');
            code = code.replace(ctRe, (match) => `<span class="control">${match}</span>`);
        }

        code = code.replace(/\b([a-zA-Z_]\w*)(?=\s*\()/g, (match) => `<span class="function">${match}</span>`);
        return code;
    }
}

customElements.define('cod-ui', CodUI);
