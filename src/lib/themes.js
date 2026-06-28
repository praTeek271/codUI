/**
 * src/lib/themes.js
 * Theme definitions and CSS generation for the CodUI Web Component.
 *
 * Each theme defines:
 *   - UI colors  : bg, header, text, border, lineNum, borderStyle
 *   - Syntax colors: keyword, control, function, string, comment, number, tag, attr
 *
 * Add new themes here — no other files need to change.
 */

var THEMES = {

    dark: {
        bg:          '#1e1e1e',
        header:      '#252526',
        text:        '#d4d4d4',
        border:      '#333333',
        lineNum:     '#666666',
        scrollThumb: '#555555',
        borderStyle: 'border: 1px solid #333333;',
        syntax: {
            keyword:  '#569cd6',
            control:  '#c586c0',
            function: '#dcdcaa',
            string:   '#ce9178',
            comment:  '#6a9955',
            number:   '#b5cea8',
            tag:      '#569cd6',
            attr:     '#9cdcfe',
        }
    },

    light: {
        bg:          '#fafafa',
        header:      '#f0f0f0',
        text:        '#333333',
        border:      '#dddddd',
        lineNum:     '#999999',
        scrollThumb: '#cccccc',
        borderStyle: 'border: 1px solid #e5e5e5; box-shadow: 0 4px 15px rgba(0,0,0,0.06);',
        syntax: {
            keyword:  '#0000ff',
            control:  '#af00db',
            function: '#795e26',
            string:   '#a31515',
            comment:  '#008000',
            number:   '#098658',
            tag:      '#800000',
            attr:     '#ff0000',
        }
    },

    dracula: {
        bg:          '#282a36',
        header:      '#21222c',
        text:        '#f8f8f2',
        border:      '#44475a',
        lineNum:     '#6272a4',
        scrollThumb: '#6272a4',
        borderStyle: 'border: 1px solid #44475a;',
        syntax: {
            keyword:  '#ff79c6',
            control:  '#ff79c6',
            function: '#50fa7b',
            string:   '#f1fa8c',
            comment:  '#6272a4',
            number:   '#bd93f9',
            tag:      '#ff79c6',
            attr:     '#50fa7b',
        }
    },

    glass: {
        bg:          'rgba(20, 20, 30, 0.45)',
        header:      'rgba(255, 255, 255, 0.05)',
        text:        '#e2e8f0',
        border:      'rgba(255,255,255,0.12)',
        lineNum:     '#64748b',
        scrollThumb: '#475569',
        borderStyle: 'border: 1px solid rgba(255,255,255,0.15); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); box-shadow: 0 8px 32px rgba(0,0,0,0.3);',
        syntax: {
            keyword:  '#7dd3fc',
            control:  '#c4b5fd',
            function: '#fde68a',
            string:   '#fca5a5',
            comment:  '#94a3b8',
            number:   '#86efac',
            tag:      '#7dd3fc',
            attr:     '#a5f3fc',
        }
    },

};

/**
 * Returns the theme config object for a given name.
 * Falls back to 'dark' if the name is not found.
 * @param {string} name
 * @returns {object}
 */
function getTheme(name) {
    return THEMES[name] || THEMES.dark;
}

/**
 * Generates the CSS rule block for all syntax token span classes,
 * driven entirely by the theme's syntax color map.
 * @param {string} themeName
 * @returns {string}
 */
function buildSyntaxCSS(themeName) {
    var s = getTheme(themeName).syntax;
    return [
        '.keyword  { color: ' + s.keyword  + '; font-weight: 600; }',
        '.control  { color: ' + s.control  + '; }',
        '.function { color: ' + s.function + '; }',
        '.string   { color: ' + s.string   + '; }',
        '.comment  { color: ' + s.comment  + '; font-style: italic; }',
        '.number   { color: ' + s.number   + '; }',
        '.tag      { color: ' + s.tag      + '; }',
        '.attr     { color: ' + s.attr     + '; }',
    ].join('\n');
}
