/**
 * test.js
 * Comprehensive unit and regression checks.
 */

const fs = require('fs');

let registeredClass = null;

global.HTMLElement = class {
    constructor() {
        this.shadowRoot = {
            getElementById: () => null
        };
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
    console.error(error);
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

// Test Group 3: HTML
console.log("\n🔹 Testing HTML Highlight Logic...");
const htmlInput = `&lt;div class="box"&gt;`;
const resHtml = componentInstance.highlight(htmlInput, 'html');
assert("Highlight HTML tags", resHtml.includes('<span class="tag">div</span>'), true);
assert("Highlight HTML attributes", resHtml.includes('<span class="attr">class</span>'), true);

// Test Group 4: CSS
console.log("\n🔹 Testing CSS Highlight Logic...");
const cssInput = `--color: #fff;\nmargin: 10px;`;
const resCss = componentInstance.highlight(cssInput, 'css');
assert("Highlight CSS variables", resCss.includes('<span class="keyword">--color</span>'), true);
assert("Highlight CSS units", resCss.includes('<span class="number">10px</span>'), true);

// Test Group 5: JSON
console.log("\n🔹 Testing JSON Highlight Logic...");
const jsonInput = `"status": true`;
const resJson = componentInstance.highlight(jsonInput, 'json');
assert("Highlight JSON keys", resJson.includes('<span class="attr">"status"</span>'), true);
assert("Highlight JSON booleans", resJson.includes('<span class="keyword">true</span>'), true);

// Test Group 6: Bash
console.log("\n🔹 Testing Bash Highlight Logic...");
const bashInput = `echo $USER`;
const resBash = componentInstance.highlight(bashInput, 'bash');
assert("Highlight Bash keywords", resBash.includes('<span class="keyword">echo</span>'), true);
assert("Highlight Bash variables", resBash.includes('<span class="number">$USER</span>'), true);

// Test Group 7: Component DOM Rendering (Integration)
console.log("\n🔹 Testing Component DOM Rendering & Double Escaping...");
const renderElement = (code, lang) => {
    const el = new registeredClass();
    el.setAttribute('lang', lang);
    el.textContent = code;
    el.connectedCallback(); // Trigger render pipeline
    return el.shadowRoot.innerHTML;
};

// JS Arrow Function Check
const jsRendered = renderElement("const f = (x) => x;", "js");
assert("JS arrow function output has correct =&gt;", jsRendered.includes('=&gt;'), true);
assert("JS arrow function output is not double-escaped", jsRendered.includes('=&amp;gt;'), false);

// HTML Tag Double Escaping Check
const htmlRendered = renderElement('<div class="box"></div>', "html");
assert("HTML output highlights tag names", htmlRendered.includes('<span class="tag">div</span>'), true);
assert("HTML output is not double-escaped", htmlRendered.includes('&amp;lt;'), false);

// Python String Swallowing & Sentinel Leak Check
const pyStringInput = `if '=' in line:\n    key = 'val' # comment`;
const pyRendered = renderElement(pyStringInput, "python");
assert("Python string quotes do not leak sentinels (no «T or T»)", /«T|T»|\\x00/g.test(pyRendered), false);
assert("Python string code on same line is not swallowed", pyRendered.includes('line'), true);
assert("Python comments still highlight after string matching", pyRendered.includes('<span class="comment"># comment</span>'), true);

console.log(`\n📊 Run Details: ${testCount} tests, ${failureCount} failures.`);

if (failureCount > 0) {
    console.error("❌ Regression tests failed.");
    process.exit(1);
} else {
    console.log("🎉 Quality gates cleared!");
    process.exit(0);
}
