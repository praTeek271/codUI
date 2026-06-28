/**
 * src/lang/html.js
 * Syntax rules for HTML and XML.
 *
 * Note: code arrives HTML-escaped — < is &lt;, > is &gt;, & is &amp;
 * All tag/comment patterns must account for this.
 *
 * Aliases: xml
 * Depends on: PATTERNS, makeKeywordRegex (regex.js), registerLanguage (languageInjector.js)
 */

registerLanguage('html', {
    aliases: ['xml'],

    tokenize: function (code) {
        var store = [];

        function protect(html) {
            var id = '\x00T' + store.length + 'T\x00';
            store.push(html);
            return id;
        }

        // 1. HTML comments: &lt;!-- ... --&gt;
        code = code.replace(PATTERNS.COMMENT_HTML(), function (m) {
            return protect('<span class="comment">' + m + '</span>');
        });

        // 2. Attribute string values: "..." and '...'
        code = code.replace(PATTERNS.STRING_DOUBLE(), function (m) {
            return protect('<span class="string">' + m + '</span>');
        });
        code = code.replace(PATTERNS.STRING_SINGLE(), function (m) {
            return protect('<span class="string">' + m + '</span>');
        });

        // 3. Tag names: &lt;div, &lt;/span, etc.
        code = code.replace(PATTERNS.HTML_TAG(), function (_, bracket, tagName) {
            return bracket + protect('<span class="tag">' + tagName + '</span>');
        });

        // 4. Attribute names: word immediately before =
        code = code.replace(PATTERNS.HTML_ATTR(), function (m) {
            return protect('<span class="attr">' + m + '</span>');
        });

        // 5. Restore
        return code.replace(/\x00T(\d+)T\x00/g, function (_, i) {
            return store[+i];
        });
    }
});
