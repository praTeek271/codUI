/**
 * src/lib/regex.js
 * Centralized regex pattern library for all language tokenizers.
 * Language files (src/lang/*.js) MUST use these patterns — never define inline regex.
 *
 * All RegExp objects use the global (g) flag by default.
 * Patterns that need to run in sequence are designed to be non-overlapping.
 */

var PATTERNS = {

    // ── Comments ──────────────────────────────────────────────────────────────

    /** Hash-style single line comment: # this is a comment */
    COMMENT_HASH:   /(#[^\n]*)/g,

    /** Double-slash single line comment: // this is a comment */
    COMMENT_SLASH:  /(\/\/[^\n]*)/g,

    /** Block comment: /* ... *\/ */
    COMMENT_BLOCK:  /(\/\*[\s\S]*?\*\/)/g,

    /** HTML/XML comment: <!-- ... --> (operates on HTML-escaped source) */
    COMMENT_HTML:   /(&lt;!--[\s\S]*?--&gt;)/g,

    // ── Strings ───────────────────────────────────────────────────────────────

    /** Double-quoted string (supports escaped quotes inside) */
    STRING_DOUBLE:  /("(?:[^"\\]|\\.)*")/g,

    /** Single-quoted string (supports escaped chars inside) */
    STRING_SINGLE:  /('(?:[^'\\]|\\.)*')/g,

    /** Backtick template literal */
    STRING_BACKTICK: /(`(?:[^`\\]|\\.)*`)/g,

    // ── Numbers ───────────────────────────────────────────────────────────────

    /** Integer, float, scientific notation: 42, 3.14, 1e-10 */
    NUMBER_GENERAL: /\b(\d+(\.\d+)?([eE][+-]?\d+)?)\b/g,

    /** Negative numbers and JSON numbers */
    NUMBER_JSON:    /\b(-?\d+(\.\d+)?([eE][+-]?\d+)?)\b/g,

    /** CSS numbers with optional units: 12px, 1.5rem, 100%, 0.3s */
    NUMBER_CSS:     /\b(\d+(\.\d+)?(px|rem|em|%|vh|vw|vmin|vmax|s|ms|deg|fr)?)\b/g,

    // ── Functions ─────────────────────────────────────────────────────────────

    /** Any identifier immediately followed by an opening parenthesis */
    FUNCTION_CALL:  /\b([a-zA-Z_$][\w$]*)(?=\s*\()/g,

    // ── HTML / XML ────────────────────────────────────────────────────────────

    /** Opening/closing HTML tag name (on escaped source: &lt;div) */
    HTML_TAG:       /(&lt;\/?)([\w\-:]+)/g,

    /** HTML attribute name (word before =) */
    HTML_ATTR:      /\b([\w\-:]+)(?=\s*=)/g,

    // ── CSS ───────────────────────────────────────────────────────────────────

    /** CSS custom property / variable: --primary-color */
    CSS_VAR:        /(--[\w-]+)/g,

    /** CSS property name (word before colon, not inside a value) */
    CSS_PROP:       /([\w-]+)(?=\s*:)/g,

    // ── JSON ──────────────────────────────────────────────────────────────────

    /** JSON object key: "key": (double-quoted string before a colon) */
    JSON_KEY:       /"([^"]+)"(?=\s*:)/g,

    /** JSON string value (double-quoted, NOT followed by colon) */
    JSON_STRING:    /"([^"]+)"(?!\s*:)/g,

    // ── Bash / Shell ──────────────────────────────────────────────────────────

    /** Bash variable expansion: $VAR or ${VAR} */
    BASH_VAR:       /(\$\{?[\w_]+\}?)/g,

};

/**
 * Builds a word-boundary regex from an array of keyword strings.
 * @param {string[]} words
 * @returns {RegExp}
 */
function makeKeywordRegex(words) {
    return new RegExp('\\b(' + words.join('|') + ')\\b', 'g');
}
