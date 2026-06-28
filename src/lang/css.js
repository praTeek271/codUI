/**
 * src/lang/css.js
 * Syntax rules for CSS, SCSS, and Less.
 *
 * Aliases: scss, less
 * Depends on: PATTERNS, makeKeywordRegex (regex.js), registerLanguage (languageInjector.js)
 */

registerLanguage('css', {
    aliases: ['scss', 'less'],

    tokenize: function (code) {
        var store = [];

        function protect(html) {
            var id = '\x00' + store.length + '\x00';
            store.push(html);
            return id;
        }

        // 1. Block comments
        code = code.replace(PATTERNS.COMMENT_BLOCK, function (m) {
            return protect('<span class="comment">' + m + '</span>');
        });

        // 2. String values
        code = code.replace(PATTERNS.STRING_DOUBLE, function (m) {
            return protect('<span class="string">' + m + '</span>');
        });
        code = code.replace(PATTERNS.STRING_SINGLE, function (m) {
            return protect('<span class="string">' + m + '</span>');
        });

        // 3. CSS custom properties / variables: --primary-color
        code = code.replace(PATTERNS.CSS_VAR, function (m) {
            return '<span class="keyword">' + m + '</span>';
        });

        // 4. Numbers with optional units: 12px, 1.5rem, 100%, 0s
        code = code.replace(PATTERNS.NUMBER_CSS, function (m) {
            return '<span class="number">' + m + '</span>';
        });

        // 5. Property names: word before colon (e.g. color, margin-top)
        code = code.replace(PATTERNS.CSS_PROP, function (m) {
            return '<span class="attr">' + m + '</span>';
        });

        // 6. At-rules: @media, @keyframes, @import, @mixin, etc.
        code = code.replace(/@[\w-]+/g, function (m) {
            return '<span class="control">' + m + '</span>';
        });

        // 7. Restore
        return code.replace(/\x00(\d+)\x00/g, function (_, i) {
            return store[+i];
        });
    }
});
