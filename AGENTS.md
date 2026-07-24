# AGENTS.md — Mailgun-Template-Extension-VSCode

Estensione VSCode (repo `github.com/Allan-Nava/Mailgun-Template-Extension-VSCode`, publisher Marketplace `allannava95`, id `allannava95.mailgun-upload-template-vscode`) che carica template HTML su **Mailgun** dall'editor. TypeScript + webpack (target `node`). Command id: `mailgun-upload-template-vscode.{config,get-config,upload}`.

Questo file definisce le regole operative per gli agent AI (Copilot, Claude, altri tool) in questo repository. Per il contesto tecnico completo vedi `CLAUDE.md`.

## Regole di lavoro (SEMPRE)

- **MAI `git push`**: lo fa sempre l'utente. **MAI `Co-Authored-By`** nei commit.
- **Release via tag**: bumpa `version` (`package.json` + `package-lock.json`), annota `CHANGELOG.md`, commit, `git tag -a vX.Y.Z`, push del tag → `.github/workflows/release.yml` builda, crea la GitHub Release e pubblica sul Marketplace (secret `VSCE_PAT`). `vsce` valida il `publisher` contro il PAT → `allannava95`. Publish manuale alternativo: `npx vsce login allannava95` + `npx vsce publish`.
- **`publisher` = `allannava95`; gli URL GitHub restano `Allan-Nava`**: account Marketplace e account GitHub sono distinti. Non uniformarli. Cambiare publisher cambia l'id → nuova entry sul Marketplace, non un update.
- **Un comando nuovo va propagato**: `package.json` (`contributes.commands` + `menus` + `activationEvents`), `src/extension.ts` (`registerCommand` + `context.subscriptions.push`), README/CHANGELOG. Il `command` deve **combaciare esattamente** tra manifest e `registerCommand(...)`.
- **`.vscodeignore` decide il pacchetto**: `src/`, `*.ts`, `*.map`, `out/test/**`, `.vscode/**` esclusi. Verificare con `npx vsce ls` prima di pubblicare.
- **Testare a mano** (F5 → "Run Extension" → *Config* poi *Upload* di un `.html`, verifica su dashboard Mailgun): la suite automatica è un placeholder e non copre l'upload.

## Trappole note / regole tecniche

- **Rami d'errore del comando *upload***: mettere sempre `return` dopo `showErrorMessage`, altrimenti il flusso prosegue e crasha (bug storico, ora fixato).
- **Segreti nei log**: NON loggare API key/password con `console.log` (già ripulito — non reintrodurre).
- **Path cross-platform**: `path.basename`/`path.join` (import `nodePath`), mai `lastIndexOf('/')` (rotto su Windows).
- **Anti-pattern `new Promise(async …)`**: ingoia le eccezioni sincrone → preferire `async/await` diretto.
- **Config file**: `mailgun-config.json` sta nella dir User di VSCode (via `getConfigPath()`), non nel workspace. Chiavi `API_KEY` / `DOMAIN`.
- **Dipendenze**: `lodash`/`mkdirp` importati ma solo come `@types/*` (li bundla webpack); `crypto` in `dependencies` è built-in Node e va rimosso.
- **Toolchain 2020** con vuln (`npm audit`): aggiornare con cautela, un bump di `engines.vscode` alza il minimo richiesto agli utenti.
- **`azure-pipelines.yml` stale** (Node 8, `yarn`, cartella `sample/` inesistente): il CI reale è `.github/workflows/ci.yml`.
- **`npm test`**: esegue `out/test/runTest.js` (runner `vscode-test`); `pretest` fa `compile` + `lint`. Suite placeholder.

## Comandi

```bash
npm run compile   # tsc -p ./
npm run webpack   # bundle dev
npm run lint      # eslint src --ext ts
npx vsce ls       # contenuto del .vsix
npx vsce package  # crea il .vsix
npx vsce publish  # pubblica (publisher allannava95)
```
Debug: F5 → **"Run Extension"** (Extension Development Host).

## Puntatori

- Repo/issue: `github.com/Allan-Nava/Mailgun-Template-Extension-VSCode` · Owner: `@Allan-Nava` (`.github/CODEOWNERS`) · Docs: `docs/` (GitHub Pages)
- CI: `.github/workflows/ci.yml` · Endpoint Mailgun: `/v3/{domain}/templates`
- Contesto tecnico esteso: `CLAUDE.md`
