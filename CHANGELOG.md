# Change Log

## [v0.0.1]

- Initial release

## [v0.0.13] 

- FIX commands 


## [v0.0.14] 

- FIX creation of mailgun config 
- Add get config path

## [v0.0.142] 

- FIX added template name for upload mailgun template

## [v0.0.145]

- Migrate Marketplace publisher `Allan-Nava` → `allannava95` (GitHub org unchanged)
- FIX upload command: add missing `return` guards (no more crash on cancelled dialog, missing config, or empty file)
- FIX upload no longer shows "select a valid file" error when a valid file is selected
- FIX config file parsing: wrap `JSON.parse` in try/catch with a clear error message
- FIX cross-platform template name resolution via `path.basename` (was broken on Windows)
- Refactor `createConfigMailgun` / `createDirectory` to async/await (remove `new Promise(async …)` anti-pattern and synchronous throw)
- Security: stop logging the Mailgun API key and password to the console
- Fix `test` npm script to run `out/test/runTest.js` (`vscode-test` runner)
- Remove dead code: unused module-level editor listener and unused imports
- Add `CLAUDE.md` and `AGENTS.md`
- CI: add `.github/workflows/release.yml` — push a `v*` tag to build, create a GitHub Release and publish to the Marketplace (requires `VSCE_PAT` secret)
