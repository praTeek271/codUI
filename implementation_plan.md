# Fix Double Escaping Bug (v2.0.9)

We need to follow strict development protocols to fix the double-escaping bug properly, rather than patching the minified release bundle directly.

## User Review Required
> [!IMPORTANT]
> Since my terminal is still experiencing the Windows `NUL` permission issue, I will need you to run the `git` commands (branch creation, checkout, commit, merge) as we progress through the execution phase. 

## Proposed Changes

1. **Revert the Quick Fix**
   - Revert the `codUI.js` file in the `dev` branch back to its exact `v2.0.8` state so we don't leave unauthorized patches in the distribution file.

2. **Document the Issue**
   - Create `docs/issues/001-double-escape.md` documenting the `this.innerHTML` vs `this.textContent` double-escaping bug, the reproduction steps, and the expected vs actual snapshot.

3. **Branching (`main` -> `fix/double-escape-html`)**
   - We will switch back to the `main` branch.
   - You will create and checkout a new branch: `git checkout -b fix/double-escape-html`.

4. **Implement the Fix in Source**
   - We will update the actual source file: `src/codui.core.js`.
   - The extraction logic will be changed to prioritize `this.textContent`.
   
   #### [MODIFY] src/codui.core.js
   Change:
   ```javascript
   var rawCode = this.innerHTML;
   if(!rawCode || !rawCode.trim()) { rawCode = this.textContent || ''; }
   ```
   To:
   ```javascript
   var rawCode = this.textContent || this.innerHTML || '';
   ```

5. **Rebuild and Test**
   - Run `npm run build` to generate the new minified `codUI.js`.
   - Run `npm run test` (which triggers automatically with the build script if hooked).
   - Manually verify the playground page renders `=>` correctly.

6. **Release (v2.0.9)**
   - Commit the fix.
   - Merge `fix/double-escape-html` into `main`.
   - Update `CHANGELOG.md` for `v2.0.9`.
   - Run the release tags and sync back to the `dev` branch for deployment.

## Verification Plan
### Automated Tests
- The build script will automatically bundle the new code without errors.
- Pre-push hooks will gate the code on `npm test`.

### Manual Verification
- We will visually inspect the code block on the root webpage to confirm that `const fetchUserData = async (userId) => {` is rendered correctly with the arrow function `=>` intact, rather than `=&gt;`.
