# Project Rules

## Build Artifacts
- **CRITICAL RESTRICTION**: The file `codUI.js` is a strictly read-only build artifact.
- **NEVER** modify, edit, or patch `codUI.js` directly under any circumstances.
- All modifications must be made in the modular source files (`src/`) and compiled back into `codUI.js` exclusively by running the build script (`npm run build`).
