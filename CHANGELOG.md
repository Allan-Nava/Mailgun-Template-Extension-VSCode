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

## [v0.0.146]

- Docs: fix GitHub Pages build — drop the conflicting `theme:` key, pin `remote_theme: just-the-docs/just-the-docs@v0.3.3`, add the `jekyll-remote-theme` plugin
- Docs: fix `docs/Gemfile` (explicit `source`, use the `github-pages` gem instead of a bare `just-the-docs` dependency)
- CI: fix `ci.yml` — compile via `npm run compile` (local `tsc`, was calling a global `tsc` that crashed on modern Node), modernize actions (checkout@v4, setup-node@v4, Node 20), add lint step, drop the dead Coveralls step

## [v0.0.147]

- SECURITY: stop tracking/packaging the `key` / `key.pub` OpenSSH keypair (untracked from git and added to `.gitignore`; the key must also be rotated — see note)
- Packaging: `.vscodeignore` now excludes `node_modules/**` (the extension is a self-contained webpack bundle) plus repo/CI/docs files — the `.vsix` drops from ~105 files to 12 (~50 KB)
- Marketplace: rename the `name` field to `mailgun-template-uploader` — the old `mailgun-upload-template-vscode` name is still owned by the former `Allan-Nava` publisher, so it can't be republished under `allannava95`. New id: `allannava95.mailgun-template-uploader`. `displayName` and command ids are unchanged.
