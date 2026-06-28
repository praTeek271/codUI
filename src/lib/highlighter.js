/**
 * src/lib/highlighter.js
 * Core syntax highlighting engine for CodUI.
 *
 * Delegates all language-specific tokenizing to registered language definitions.
 * Has zero knowledge of any language internals — purely a dispatcher.
 *
 * Depends on: lang-injector.js (getLanguage)
 */

/**
 * Highlights a code string for the given language.
 *
 * Looks up the language in the registry, runs its tokenize() pipeline,
 * and returns an HTML string with <span> tags for each token type.
 *
 * Graceful fallback: if the language is not registered, the raw (escaped)
 * code is returned as-is — no crash, no broken output.
 *
 * @param {string} code - HTML-escaped source code
 * @param {string} lang - Language identifier (e.g. 'js', 'python', 'html')
 * @returns {string}    - HTML string with syntax span tags
 */
function highlight(code, lang) {
    if (!code) return '';

    var definition = getLanguage(lang);

    if (!definition) {
        // Unknown language — return code as plain text (no highlighting)
        return code;
    }

    return definition.tokenize(code);
}
