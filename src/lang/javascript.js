/**
 * src/lang/javascript.js
 * Syntax rules for JavaScript and TypeScript.
 *
 * Aliases: js, ts, jsx, tsx, typescript
 * Depends on: PATTERNS, makeKeywordRegex (regex.js), registerLanguage (languageInjector.js)
 */

registerLanguage('javascript', {
    aliases: ['js', 'ts', 'jsx', 'tsx', 'typescript'],

    tokenize: function (code) {
        var store = [];

        function protect(html) {
            var id = '\x00T' + store.length + 'T\x00';
            store.push(html);
            return id;
        }

        // 1. Comments
        code = code.replace(PATTERNS.COMMENT_BLOCK(), function (m) {
            return protect('<span class="comment">' + m + '</span>');
        });
        code = code.replace(PATTERNS.COMMENT_SLASH(), function (m) {
            return protect('<span class="comment">' + m + '</span>');
        });

        // 2. Strings
        code = code.replace(PATTERNS.STRING_BACKTICK(), function (m) {
            return protect('<span class="string">' + m + '</span>');
        });
        code = code.replace(PATTERNS.STRING_DOUBLE(), function (m) {
            return protect('<span class="string">' + m + '</span>');
        });
        code = code.replace(PATTERNS.STRING_SINGLE(), function (m) {
            return protect('<span class="string">' + m + '</span>');
        });

        // 3. Numbers
        code = code.replace(PATTERNS.NUMBER_GENERAL(), function (m) {
            return protect('<span class="number">' + m + '</span>');
        });

        // 4. Keywords
        var keywords = [
            'const', 'let', 'var', 'function', 'class', 'extends', 'super', 'static',
            'new', 'this', 'import', 'export', 'default', 'from', 'as',
            'async', 'await', 'typeof', 'instanceof', 'void', 'delete',
            'interface', 'type', 'enum', 'namespace', 'declare', 'abstract',
            'implements', 'readonly', 'keyof', 'infer', 'in', 'of',
        ];
        code = code.replace(makeKeywordRegex(keywords), function (m) {
            return protect('<span class="keyword">' + m + '</span>');
        });

        // 5. Control flow
        var control = [
            'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case',
            'break', 'continue', 'throw', 'try', 'catch', 'finally', 'yield',
        ];
        code = code.replace(makeKeywordRegex(control), function (m) {
            return protect('<span class="control">' + m + '</span>');
        });

        // 6. Function calls
        code = code.replace(PATTERNS.FUNCTION_CALL(), function (m) {
            return protect('<span class="function">' + m + '</span>');
        });

        // 7. Restore all protected tokens
        return code.replace(/\x00T(\d+)T\x00/g, function (_, i) {
            return store[+i];
        });
    }
});
