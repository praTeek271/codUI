/**
 * src/lang/python.js
 * Syntax rules for Python 3.
 *
 * Token processing order (important — each step protects its output):
 *   1. Triple-quoted strings  """...""" / '''...'''
 *   2. Hash comments          # ...
 *   3. Strings                "..." / '...'
 *   4. Numbers                42, 3.14, 1e-10
 *   5. Keywords               def, class, import, True, None, ...
 *   6. Control flow           if, elif, for, while, try, ...
 *   7. Decorators             @decorator
 *   8. Function calls         identifier(
 *
 * Aliases: py
 * Depends on: PATTERNS, makeKeywordRegex (regex.js), registerLanguage (languageInjector.js)
 */

registerLanguage('python', {
    aliases: ['py'],

    tokenize: function (code) {
        var store = [];

        function protect(html) {
            var id = '«T' + store.length + 'T»';
            store.push(html);
            return id;
        }

        // 1. Triple-quoted strings
        code = code.replace(/"""([\s\S]*?)"""/g, function (m) {
            return protect('<span class="string">' + m + '</span>');
        });
        code = code.replace(/'''([\s\S]*?)'''/g, function (m) {
            return protect('<span class="string">' + m + '</span>');
        });

        // 2+3. Strings AND hash comments — combined single pass.
        // Strings are listed FIRST in the alternation so that '#' inside a
        // string like '=' or "#" is consumed as part of the string token
        // and NEVER treated as a comment start.
        code = code.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|(#[^\n]*)/g, function (m, comment) {
            if (comment !== undefined) return protect('<span class="comment">' + comment + '</span>');
            return protect('<span class="string">' + m + '</span>');
        });

        // 4. Numbers
        code = code.replace(PATTERNS.NUMBER_GENERAL(), function (m) {
            return protect('<span class="number">' + m + '</span>');
        });

        // 5. Keywords
        var keywords = [
            'def', 'class', 'import', 'from', 'as', 'with',
            'lambda', 'yield', 'pass', 'raise', 'global', 'nonlocal',
            'del', 'assert', 'True', 'False', 'None', 'self', 'cls',
        ];
        code = code.replace(makeKeywordRegex(keywords), function (m) {
            return protect('<span class="keyword">' + m + '</span>');
        });

        // 6. Control flow
        var control = [
            'return', 'if', 'elif', 'else', 'for', 'while',
            'try', 'except', 'finally', 'in', 'not', 'and',
            'or', 'is', 'break', 'continue', 'async', 'await',
        ];
        code = code.replace(makeKeywordRegex(control), function (m) {
            return protect('<span class="control">' + m + '</span>');
        });

        // 7. Decorators (@decorator)
        code = code.replace(/@([\w.]+)/g, function (m) {
            return protect('<span class="keyword">' + m + '</span>');
        });

        // 8. Function calls
        code = code.replace(PATTERNS.FUNCTION_CALL(), function (m) {
            return protect('<span class="function">' + m + '</span>');
        });

        // 9. Restore
        return code.replace(/«T(\d+)T»/g, function (_, i) {
            return store[+i];
        });
    }
});
