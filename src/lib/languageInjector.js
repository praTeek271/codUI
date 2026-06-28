/**
 * src/lib/languageInjector.js
 * Language registry for CodUI.
 *
 * Provides registerLanguage() and getLanguage() — the bridge
 * between language rule files (src/lang/*.js) and the highlighter engine.
 *
 * Language files call registerLanguage() as soon as they are loaded.
 * The highlighter calls getLanguage() at tokenization time.
 */

var _langRegistry = {};

/**
 * Registers a language definition under its primary ID and all aliases.
 *
 * @param {string} id          - Primary language identifier e.g. 'javascript'
 * @param {object} definition  - Must have { aliases: string[], tokenize: function }
 */
function registerLanguage(id, definition) {
    if (!id || typeof definition.tokenize !== 'function') {
        return;
    }
    _langRegistry[id.toLowerCase()] = definition;
    var aliases = definition.aliases || [];
    for (var i = 0; i < aliases.length; i++) {
        _langRegistry[aliases[i].toLowerCase()] = definition;
    }
}

/**
 * Retrieves a registered language definition by ID or alias.
 * Returns null if no matching language is found.
 *
 * @param {string} id
 * @returns {object|null}
 */
function getLanguage(id) {
    if (!id) return null;
    return _langRegistry[id.toLowerCase()] || null;
}

/**
 * Returns the list of all registered primary language IDs.
 * Useful for debugging and tooling.
 *
 * @returns {string[]}
 */
function getRegisteredLanguages() {
    var keys = [];
    for (var key in _langRegistry) {
        if (_langRegistry.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    return keys;
}
