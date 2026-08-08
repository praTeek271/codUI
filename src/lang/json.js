/**
 * src/lang/json.js
 * Syntax rules for JSON (RFC 8259).
 *
 * Token processing order (important — each step protects its output):
 *   1. Keys    "key":  (JSON_KEY pattern — must run BEFORE JSON_STRING)
 *   2. Strings "value" (JSON_STRING pattern — NOT followed by colon)
 *   3. Keywords  true / false / null
 *   4. Numbers   42, -1, 3.14, 1e-10
 *
 * Note: Keys and values use different patterns to avoid cross-matching.
 *
 * Aliases: none
 * Depends on: PATTERNS, makeKeywordRegex (regex.js), registerLanguage (languageInjector.js)
 */

registerLanguage('json', {
    aliases: [],

    tokenize: function (code) {
        var store = [];

        function protect(html) {
            var id = '«T' + store.length + 'T»';
            store.push(html);
            return id;
        }

        // 1. Object keys: "key": — must come before string values
        code = code.replace(PATTERNS.JSON_KEY(), function (_, key) {
            return protect('<span class="attr">"' + key + '"</span>');
        });

        // 2. String values: "value"
        code = code.replace(PATTERNS.JSON_STRING(), function (m) {
            return protect('<span class="string">' + m + '</span>');
        });

        // 3. Keywords: true, false, null
        code = code.replace(makeKeywordRegex(['true', 'false', 'null']), function (m) {
            return protect('<span class="keyword">' + m + '</span>');
        });

        // 4. Numbers
        code = code.replace(PATTERNS.NUMBER_JSON(), function (m) {
            return protect('<span class="number">' + m + '</span>');
        });

        // 5. Restore
        return code.replace(/«T(\d+)T»/g, function (_, i) {
            return store[+i];
        });
    }
});
