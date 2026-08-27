# CodUI — Development & Playground Workspace (`dev` branch)

Welcome to the **`dev`** branch of **CodUI**. This branch hosts the interactive playground, visual showcase, documentation site, and deployment environment for testing and previewing CodUI Web Component releases.

[![CodUI Version](https://img.shields.io/badge/bundle-v2.1.0-blue)](https://github.com/praTeek271/codUI/releases)
[![Branch](https://img.shields.io/badge/branch-dev-purple)](https://github.com/praTeek271/codUI/tree/dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🎯 Purpose of the `dev` Branch

| Branch | Primary Purpose | Contents |
| :--- | :--- | :--- |
| **`main`** | **Core Source & Releases** | Modular source code (`src/`), build scripts (`scripts/`), CI/CD automation, regression test runner, npm package configuration. |
| **`dev`** | **Showcase, Docs & Playground** | Live landing page ([`index.html`](https://prateek271.github.io/codUI/index.html)), interactive **CodUI Studio Playground** ([`playground/`](https://prateek271.github.io/codUI/playground/index.html)), full **Documentation Portal** ([`docs/`](https://prateek271.github.io/codUI/docs/index.html)), and pre-built distribution testing (`codUI.js`). |

---

## 🌐 Apps & Deployments in this Branch

### 1. 🚀 Visual Showcase & Landing Page ([`index.html`](https://prateek271.github.io/codUI/index.html))
The official marketing and interactive demonstration page featuring:
- Live hero animations and interactive canvas background.
- Dynamic feature cards showcasing Shadow DOM isolation, zero dependencies, and instant copy buttons.
- Direct navigation to the Playground Studio and Documentation site.

### 2. ⚡ CodUI Studio Playground ([`playground/index.html`](https://prateek271.github.io/codUI/playground/index.html))
A real-time interactive code editor and generator:
- Live dual-pane layout: Type code on the left, see instant syntax-highlighted render on the right.
- Real-time toolbar controls for language (`js`, `ts`, `python`, `html`, `css`, `json`, `bash`), theme (`dark`, `dracula`, `glass`, `light`), line-number gutter, width, and max-height.
- One-click HTML snippet exporter for easy embedding into projects.

### 3. 📖 Documentation Portal ([`docs/index.html`](https://prateek271.github.io/codUI/docs/index.html))
Comprehensive developer documentation covering:
- **Quickstart & CDN installation** (via jsDelivr).
- **Component Attributes Reference** (`lang`, `theme`, `line-numbers`, `width`, `height`).
- **Theme System Gallery** with live preview cards.
- **Language Support Guide** for all 6 tokenization engines and aliases.
- **Displaying HTML Guide** (Script template wrapper, escaped entities, and programmatic DOM API).
- **JavaScript API Reference** for `CodUI.highlight()` and dynamic DOM manipulation.

---

## 💻 Running the Playground & Docs Locally

No build tools or bundlers are required to run this branch. Simply serve the workspace with any static web server:

### Option A: VS Code / IDE Live Server
Right-click `index.html`, `playground/index.html`, or `docs/index.html` and select **"Open with Live Server"**.

### Option B: Node.js `npx serve`
```bash
npx serve .
```

### Option C: Python HTTP Server
```bash
# Python 3
python -m http.server 8000
```

Then visit:
- **Landing Page:** `http://localhost:8000/index.html`
- **Playground Studio:** `http://localhost:8000/playground/index.html`
- **Documentation:** `http://localhost:8000/docs/index.html`

---

## 🔄 Syncing `codUI.js` from `main`

When core updates or bug fixes are merged into `main`, the compiled `codUI.js` can be pulled directly into `dev` using:

```bash
# Fetch and checkout the latest built bundle from main
git checkout main -- codUI.js

# Verify and commit the updated bundle on dev
git add codUI.js
git commit -m "chore(sync): update codUI.js from main"
git push origin dev
```

---

## 🧪 Testing

You can run the terminal regression test suite on the bundled `codUI.js` at any time:

```bash
node test.js
```

---

## 📄 License

MIT © [praTeek271](https://github.com/praTeek271)