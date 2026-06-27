CodUI Local Development Workspace Configuration

This document contains the complete layout, source code, configuration files, and setup instructions to transition the CodUI project to your local machine for active development and automated deployment.

📂 Project Directory Structure

Ensure your local folder matches this exact architecture to guarantee that test suites, Git hooks, and automated GitHub Actions locate files correctly:

codUI/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions CI/CD Pipeline
├── .githooks/
│   ├── pre-commit             # Quality validation hooks
│   └── pre-push               # Regression test validation hooks
├── codUI.js                   # Main Web Component plugin source
├── test.js                    # Regression unit testing engine
├── CHANGELOG.md               # Version-specific release notes
├── README.md                  # Developer & User Documentation
└── package.json               # Node dependencies & script runners


🛠️ Codebase & Configuration Files

You can extract the files below directly to their respective local paths to initialize your development workspace.

1. Project Manifest: package.json

Save to: package.json

{
  "name": "cod-ui",
  "version": "1.0.0",
  "description": "A lightweight, zero-dependency Web Component for code highlighting.",
  "main": "codUI.js",
  "scripts": {
    "test": "node test.js"
  },
  "keywords": [
    "web-component",
    "syntax-highlighting",
    "code-block",
    "lightweight",
    "zero-dependency"
  ],
  "author": "Your Name",
  "license": "MIT"
}


2. Main Plugin Logic: codUI.js

Save to: codUI.js

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
        code = code.replace(/(["'`])(.*?[^\\])\1/g, '<span class="string">$1$2$1</span>');
        code = code.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="number">$1</span>');

        let keywords = [];
        let controlWords = [];
        
        if (lang === 'python' || lang === 'py') {
            keywords = ['def', 'class', 'import', 'from', 'self', 'True', 'False', 'None'];
            controlWords = ['return', 'if', 'elif', 'else', 'in', 'for', 'while', 'try', 'except', 'with', 'as'];
            code = code.replace(/(#.*)/g, '<span class="comment">$1</span>');
        } else if (lang === 'html' || lang === 'xml') {
            code = code.replace(/(&lt;\/?)([a-zA-Z0-9\-:]+)/g, '$1<span class="tag">$2</span>');
            code = code.replace(/(\s)([a-zA-Z0-9\-]+)(=["'])/g, '$1<span class="attr">$2</span>$3');
            code = code.replace(/(&lt;!--.*?--&gt;)/g, '<span class="comment">$1</span>');
        } else {
            keywords = ['const', 'let', 'var', 'function', 'class', 'import', 'export', 'default', 'new', 'this', 'async', 'await'];
            controlWords = ['return', 'if', 'else', 'for', 'while', 'try', 'catch', 'switch', 'case', 'break'];
            code = code.replace(/(\/\/.*)/g, '<span class="comment">$1</span>');
        }

        if (keywords.length) {
            const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
            code = code.replace(kwRegex, '<span class="keyword">$1</span>');
        }
        if (controlWords.length) {
            const ctrlRegex = new RegExp(`\\b(${controlWords.join('|')})\\b`, 'g');
            code = code.replace(ctrlRegex, '<span class="control">$1</span>');
        }
        
        code = code.replace(/\b([a-zA-Z_]\w*)(?=\s*\()/g, '<span class="function">$1</span>');
        
        return code;
    }
}

customElements.define('cod-ui', CodUI);


3. Zero-Dependency Unit Test Suite: test.js

Save to: test.js

/**
 * test.js
 * Comprehensive unit and regression checks.
 */

const fs = require('fs');

let registeredClass = null;

global.HTMLElement = class {
    constructor() {
        this.shadowRoot = {};
    }
    attachShadow() {
        return this.shadowRoot;
    }
    getAttribute(attr) {
        return this[attr] || null;
    }
    setAttribute(attr, value) {
        this[attr] = value;
    }
};

global.customElements = {
    define: (name, constructor) => {
        if (name === 'cod-ui') {
            registeredClass = constructor;
        }
    }
};

try {
    require('./codUI.js');
} catch (error) {
    console.error("❌ System Error: Failed to import codUI.js.");
    process.exit(2); 
}

if (!registeredClass) {
    console.error("❌ Test Failure: Custom Element <cod-ui> did not register.");
    process.exit(1);
}

let testCount = 0;
let failureCount = 0;

function assert(description, actual, expected) {
    testCount++;
    if (actual === expected) {
        console.log(`  ✅ Pass: ${description}`);
    } else {
        failureCount++;
        console.error(`  ❌ FAIL: ${description}`);
        console.error(`     Expected: ${expected}`);
        console.error(`     Actual:   ${actual}`);
    }
}

const componentInstance = new registeredClass();

console.log("🚀 Running Local Regression Verification...\n");

// Test Group 1: JS
console.log("🔹 Testing JavaScript Highlight Logic...");
const jsInput = `const score = 100;`;
const resJS = componentInstance.highlight(jsInput, 'js');
assert("Highlight variable declarations", resJS.includes('<span class="keyword">const</span>'), true);
assert("Highlight score values", resJS.includes('<span class="number">100</span>'), true);

// Test Group 2: Python
console.log("\n🔹 Testing Python Highlight Logic...");
const pyInput = `# Code comment\ndef init():`;
const resPy = componentInstance.highlight(pyInput, 'python');
assert("Highlight python single comments", resPy.includes('<span class="comment"># Code comment</span>'), true);
assert("Highlight functional init calls", resPy.includes('<span class="function">init</span>'), true);

console.log(`\n📊 Run Details: ${testCount} tests, ${failureCount} failures.`);

if (failureCount > 0) {
    console.error("❌ Regression tests failed.");
    process.exit(1);
} else {
    console.log("🎉 Quality gates cleared!");
    process.exit(0);
}


4. CI/CD Workflow: .github/workflows/ci-cd.yml

Save to: .github/workflows/ci-cd.yml

name: CodUI CI-CD Pipeline

on:
  push:
    branches: [ main ]
    tags:
      - 'v*' # Trigger release actions on version tags e.g. v1.0.0
  pull_request:
    branches: [ main ]

jobs:
  # Job 1: Quality Gate & Regression Tests
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Codebase
        uses: actions/checkout@v3

      - name: Setup Node.js Runtime
        uses: actions/setup-node@v3
        with:
          node-with-registry: '18'
          cache: 'npm'

      - name: Install Project Dependencies
        run: |
          if [ -f package.json ]; then
            npm install
          fi

      - name: Run Test Suite (Regression Checks)
        run: npm test

  # Job 2: Automate GitHub Releases
  release:
    needs: test
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/v')
    steps:
      - name: Checkout Codebase
        uses: actions/checkout@v3

      - name: Extract Release Notes from Changelog
        id: extract_changelog
        run: |
          TAG_VERSION="${GITHUB_REF#refs/tags/v}"
          echo "Processing version: $TAG_VERSION"
          # Sed extract block matching latest tag in CHANGELOG.md
          RELEASE_NOTES=$(sed -n "/## \[$TAG_VERSION\]/,/## \[/p" CHANGELOG.md | sed '$d')
          # Safely encode multiline variables in GitHub Actions workflow output
          EOF=$(dd if=/dev/urandom bs=15 count=1 2>/dev/null | base64)
          echo "notes<<$EOF" >> $GITHUB_OUTPUT
          echo "$RELEASE_NOTES" >> $GITHUB_OUTPUT
          echo "$EOF" >> $GITHUB_OUTPUT

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          body: ${{ steps.extract_changelog.outputs.notes }}
          files: |
            codUI.js
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}


5. Deployment Changelog: CHANGELOG.md

Save to: CHANGELOG.md

# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-06-27
### Added
- Created foundational custom elements (`<cod-ui>`).
- Interactive copy-to-clipboard actions inside the header.
- Multi-theme configuration (Dark, Light, Dracula, and Glassmorphic).
- Flexible line number columns toggle engine.


6. Git Pre-Push Shield: .githooks/pre-push

Save to: .githooks/pre-push

#!/bin/sh
echo "🔍 Intercepting push: running automated regression validation..."
npm test
EXIT_STATUS=$?

if [ $EXIT_STATUS -ne 0 ]; then
  echo "❌ Push Rejected: The test suite returned exit code $EXIT_STATUS."
  exit $EXIT_STATUS
fi

echo "✅ All validations cleared. Proceeding to remote repository."
exit 0


🚀 Workspace Setup & Bootstrap Guide

Execute these terminal commands from inside your root project folder to configure permissions, initialize your hooks, and verify code stability.

Step 1: Install Local Environment Dependencies

Initialize your environment variables and install Node.js tooling:

# Initialize local node modules folder
npm install


Step 2: Set Hook Permissions & Activate Git Anchors

Configure Git to use your localized .githooks directory and make sure the pre-push script has operational execution permissions:

# Point Git's hook indexer to our customized folder
git config core.hooksPath .githooks

# Grant terminal execution permissions to the scripts
chmod +x .githooks/pre-push


Step 3: Run Validation Manually

To check for syntax highlighting regressions without pushing, execute:

npm test


Step 4: Tag & Publish Versions

When you want to deploy a new version:

Update CHANGELOG.md with the new version headers.

Update the version field in package.json.

Commit and tag your code:

git add .
git commit -m "Release v1.0.0"
git tag v1.0.0
git push origin main --tags


The tag trigger will automatically prompt GitHub to run unit tests and parse the release notes before distributing the updated JavaScript files.