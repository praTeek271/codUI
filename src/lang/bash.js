/**
 * src/lang/bash.js
 * Syntax rules for Bash and POSIX Shell scripts.
 *
 * Token processing order (important — each step protects its output):
 *   1. Comments       # ... (includes shebangs #!/usr/bin/env bash)
 *   2. Strings        "..." / '...'
 *   3. Variables      $VAR / ${VAR}
 *   4. Keywords       echo, export, cd, grep, ...
 *   5. Control flow   if/then/fi, for/do/done, case/esac, ...
 *
 * Aliases: sh, shell
 * Depends on: PATTERNS, makeKeywordRegex (regex.js), registerLanguage (languageInjector.js)
 */

registerLanguage('bash', {
    aliases: ['sh', 'shell'],

    tokenize: function (code) {
        var store = [];

        function protect(html) {
            var id = '\x00T' + store.length + 'T\x00';
            store.push(html);
            return id;
        }

        // 1. Comments
        code = code.replace(PATTERNS.COMMENT_HASH(), function (m) {
            return protect('<span class="comment">' + m + '</span>');
        });

        // 2. Strings
        code = code.replace(PATTERNS.STRING_DOUBLE(), function (m) {
            return protect('<span class="string">' + m + '</span>');
        });
        code = code.replace(PATTERNS.STRING_SINGLE(), function (m) {
            return protect('<span class="string">' + m + '</span>');
        });

        // 3. Variable expansions
        code = code.replace(PATTERNS.BASH_VAR(), function (m) {
            return protect('<span class="number">' + m + '</span>');
        });

        // 4. Keywords
        var keywords = [
            'export', 'local', 'readonly', 'source', 'declare',
            'unset', 'echo', 'printf', 'set', 'alias', 'unalias',
            'cd', 'pwd', 'ls', 'mkdir', 'rm', 'cp', 'mv', 'cat',
            'grep', 'sed', 'awk', 'curl', 'chmod', 'chown',
        ];
        code = code.replace(makeKeywordRegex(keywords), function (m) {
            return protect('<span class="keyword">' + m + '</span>');
        });

        // 5. Control flow
        var control = [
            'if', 'then', 'else', 'elif', 'fi',
            'for', 'while', 'until', 'do', 'done',
            'case', 'esac', 'in', 'function',
            'return', 'exit', 'break', 'continue',
        ];
        code = code.replace(makeKeywordRegex(control), function (m) {
            return protect('<span class="control">' + m + '</span>');
        });

        // 6. Restore
        return code.replace(/\x00T(\d+)T\x00/g, function (_, i) {
            return store[+i];
        });
    }
});
