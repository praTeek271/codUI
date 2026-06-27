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
