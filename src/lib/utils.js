/**
 * src/lib/utils.js
 * Shared utility functions available across the entire bundle.
 * Loaded first in build order — all other modules depend on these.
 */

/**
 * Escapes HTML special characters to their entity equivalents.
 * Used before passing raw user code into the highlighter.
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Trims leading and trailing blank lines from a raw code string.
 * Preserves internal indentation exactly.
 * @param {string} str
 * @returns {string}
 */
function stripNewlines(str) {
    return str.replace(/^\s*[\r\n]/, '').replace(/[\r\n]\s*$/, '');
}

/**
 * Counts the number of lines in a string.
 * @param {string} str
 * @returns {number}
 */
function countLines(str) {
    return (str.match(/\n/g) || []).length + 1;
}
