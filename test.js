/**
 * test.js
 * Visual terminal test runner & verification suite for CodUI.js
 */

const fs = require('fs');
const { performance } = require('perf_hooks');

// ANSI Color definitions
const c = {
    reset:   '\x1b[0m',
    bold:    '\x1b[1m',
    dim:     '\x1b[2m',
    cyan:    '\x1b[36m',
    green:   '\x1b[32m',
    red:     '\x1b[31m',
    yellow:  '\x1b[33m',
    magenta: '\x1b[35m',
    blue:    '\x1b[34m',
    gray:    '\x1b[90m',
    bgGreen: '\x1b[42m\x1b[30m',
    bgRed:   '\x1b[41m\x1b[37m',
};

console.log(`${c.cyan}${c.bold}`);
console.log(`╔══════════════════════════════════════════════════════════════╗`);
console.log(`║               🚀 CodUI.js Test Suite v1.0.0                  ║`);
console.log(`╚══════════════════════════════════════════════════════════════╝${c.reset}\n`);

// Setup Mock DOM
let registeredClass = null;
global.HTMLElement = class {
    constructor() { this.shadowRoot = {}; }
    attachShadow() { return this.shadowRoot; }
    getAttribute(attr) { return this[attr] || null; }
    setAttribute(attr, val) { this[attr] = val; }
};

global.customElements = {
    define: (name, ctor) => { if (name === 'cod-ui') registeredClass = ctor; }
};

process.stdout.write(`${c.gray}📦 Loading custom element environment...${c.reset} `);
try {
    require('./codUI.js');
    console.log(`${c.green}✔ [OK]${c.reset}`);
} catch (err) {
    console.log(`${c.red}✖ [FAILED]${c.reset}`);
    console.error(`${c.red}Fatal: Failed to import codUI.js${c.reset}`);
    process.exit(2);
}

if (!registeredClass) {
    console.error(`${c.red}✖ Fatal: <cod-ui> failed to register with customElements.${c.reset}`);
    process.exit(1);
}

console.log(`${c.green}✨ Registered <cod-ui> web component successfully.${c.reset}`);
console.log(`${c.gray}────────────────────────────────────────────────────────────────${c.reset}\n`);

let testCount = 0;
let failureCount = 0;
const startTime = performance.now();

function group(title) {
    console.log(`${c.bold}${c.blue}🔹 [${title}]${c.reset}`);
}

function assert(desc, condition) {
    testCount++;
    if (condition) {
        console.log(`   ${c.green}✔${c.reset} ${c.dim}${desc}${c.reset}`);
    } else {
        failureCount++;
        console.log(`   ${c.red}✖${c.reset} ${c.bold}${c.red}${desc}${c.reset}`);
    }
}

const instance = new registeredClass();

// ─── 1. JavaScript ───
group("JS / JavaScript");
const jsOut = instance.highlight("const score = 100;\n// note", "js");
assert("Highlights keyword 'const'", jsOut.includes('<span class="keyword">const</span>'));
assert("Highlights number '100'", jsOut.includes('<span class="number">100</span>'));
assert("Highlights single-line comment", jsOut.includes('<span class="comment">// note</span>'));

// ─── 2. TypeScript ───
console.log("");
group("TS / TypeScript");
const tsOut = instance.highlight("interface User { readonly id: number; }", "ts");
assert("Highlights keyword 'interface'", tsOut.includes('<span class="keyword">interface</span>'));
assert("Highlights modifier 'readonly'", tsOut.includes('<span class="keyword">readonly</span>'));

// ─── 3. Python ───
console.log("");
group("PY / Python");
const pyOut = instance.highlight("# Code comment\ndef init(): return True", "python");
assert("Highlights python comment", pyOut.includes('<span class="comment"># Code comment</span>'));
assert("Highlights function definition 'init'", pyOut.includes('<span class="function">init</span>'));
assert("Highlights keyword 'True'", pyOut.includes('<span class="keyword">True</span>'));

// ─── 4. HTML ───
console.log("");
group("HTML / XML");
const htmlOut = instance.highlight("&lt;div class=\"box\"&gt;&lt;!-- c --&gt;&lt;/div&gt;", "html");
assert("Highlights HTML tags", htmlOut.includes('<span class="tag">div</span>'));
assert("Highlights tag attribute 'class'", htmlOut.includes('<span class="attr">class</span>'));
assert("Highlights HTML comment", htmlOut.includes('<span class="comment">&lt;!-- c --&gt;</span>'));

// ─── 5. CSS ───
console.log("");
group("CSS");
const cssOut = instance.highlight("color: var(--snow); /* theme */", "css");
assert("Highlights CSS custom variable '--snow'", cssOut.includes('<span class="keyword">--snow</span>'));
assert("Highlights property name 'color'", cssOut.includes('<span class="attr">color</span>'));
assert("Highlights block comment", cssOut.includes('<span class="comment">/* theme */</span>'));

// ─── 6. JSON ───
console.log("");
group("JSON");
const jsonOut = instance.highlight("\"name\": true", "json");
assert("Highlights object key", jsonOut.includes('<span class="attr">"name"</span>:'));
assert("Highlights boolean literal 'true'", jsonOut.includes('<span class="keyword">true</span>'));

// ─── 7. Bash ───
console.log("");
group("BASH / Shell");
const bashOut = instance.highlight("# deploy\necho $REPO", "bash");
assert("Highlights variable expansion '$REPO'", bashOut.includes('<span class="number">$REPO</span>'));
assert("Highlights bash comment", bashOut.includes('<span class="comment"># deploy</span>'));

const duration = (performance.now() - startTime).toFixed(2);

console.log(`\n${c.gray}────────────────────────────────────────────────────────────────${c.reset}`);
console.log(`${c.bold}📊 Test Execution Summary:${c.reset}`);
console.log(`   Total Tests:  ${c.bold}${testCount}${c.reset}`);
console.log(`   Passed:       ${c.green}${testCount - failureCount}${c.reset}`);
console.log(`   Failed:       ${failureCount > 0 ? c.red + failureCount : c.gray + '0'}${c.reset}`);
console.log(`   Duration:     ${c.yellow}${duration}ms${c.reset}\n`);

if (failureCount > 0) {
    console.log(`${c.bgRed} FAIL ${c.reset} ${c.red}Regression checks failed. Please fix syntax highlighting rules.${c.reset}\n`);
    process.exit(1);
} else {
    console.log(`${c.bgGreen} PASS ${c.reset} ${c.green}All quality gates cleared! Ready for release.${c.reset}\n`);
    process.exit(0);
}
