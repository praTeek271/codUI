/**
 * src/lang/json.js
 * Syntax rules for JSON.
 *
 * Aliases: none
 * Depends on: PATTERNS, makeKeywordRegex (regex.js), registerLanguage (languageInjector.js)
 */

registerLanguage('json', {
    aliases: [],

    tokenize: function (code) {
        var store = [];

        function protect(html) {
            var id = '\x00T' + store.length + 'T\x00';
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
        return code.replace(/\x00T(\d+)T\x00/g, function (_, i) {
            return store[+i];
        });
    }
});
