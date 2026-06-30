# Changelog

All notable changes to CodUI will be documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.0.8] — 2026-06-30

### Added

- **Modular source architecture** — codebase migrated from a single monolithic file into a structured `src/` directory
- **6 language rule files** (`src/lang/`):
  - `javascript.js` — JS, TS, JSX, TSX (ES2022+)
  - `python.js` — Python 3, triple-quoted strings and decorator support
  - `html.js` — HTML and XML (works on HTML-escaped source)
  - `css.js` — CSS, SCSS, Less with at-rules and CSS variable support
  - `json.js` — JSON with key vs value differentiation
  - `bash.js` — Bash and POSIX shell with `$VAR` / `${VAR}` support
- **Core library modules** (`src/lib/`):
  - `utils.js` — `escapeHTML`, `stripNewlines`, `countLines`
  - `regex.js` — Centralized regex factory registry (prevents `lastIndex` bleed-through)
  - `themes.js` — Decoupled theme engine; add new themes without touching any other file
  - `languageInjector.js` — Language registry (`registerLanguage`, `getLanguage`)
  - `highlighter.js` — Pure dispatcher engine with graceful fallback for unknown languages
  - `uiRenderer.js` — Shadow DOM renderer driven entirely from theme data; zero hardcoded colors
- **`src/codui.core.js`** — Web Component entry point with full lifecycle and public `highlight()` API
- **Automated build pipeline** (`scripts/build.js`) — concatenates `src/` in dependency order, wraps output in IIFE
- **Regression test suite** (`test.js`) — 12 automated assertions across all 6 languages; runs on every `git push`

### Fixed

- **Regex tokenizer collision** — sequential regex passes were re-matching inside previously generated `<span>` tags, producing malformed HTML. Fixed with a protect/restore placeholder system
- **Placeholder digit collision** — bare-digit placeholder IDs (e.g. `\x000\x00`) were being re-matched by the number regex. Fixed with `\x00T0T\x00` format
- **`escapeHTML` double-quote encoding** — `"` was being converted to `&quot;` before highlighting, preventing string patterns from matching
- **Shared `RegExp` `lastIndex` bleed** — shared compiled `RegExp` instances in `PATTERNS` caused stale state across calls. Converted all entries to factory functions

### Changed

- `codUI.js` is now **auto-generated** — edit `src/` files, never `codUI.js` directly
- Language rules are fully **decoupled** — add a new language by creating one file in `src/lang/`
- Theme colors are fully **decoupled** — add a new theme by adding an entry in `src/lib/themes.js`

---

## [1.0.0] — 2026-06-27

### Added

- Created foundational custom elements (`<cod-ui>`).
- Interactive copy-to-clipboard actions inside the header.
- Multi-theme configuration (Dark, Light, Dracula, and Glassmorphic).
- Flexible line number columns toggle engine.
