# CLAUDE.md — Mailgun-Template-Extension-VSCode

Estensione VSCode (repo `github.com/Allan-Nava/Mailgun-Template-Extension-VSCode`, marketplace publisher `allannava95`, id `allannava95.mailgun-template-uploader`) che carica template HTML su **Mailgun** direttamente dall'editor. Scritta in **TypeScript**, bundlata con **webpack**, target `node`. _Nota migrazione: pubblicata originariamente come `Allan-Nava.mailgun-upload-template-vscode`; migrata a publisher `allannava95` perché l'account vecchio non è più accessibile (l'org GitHub resta `Allan-Nava`). Il vecchio `name` `mailgun-upload-template-vscode` era già occupato sul Marketplace → il campo **`name`** in `package.json` è stato cambiato in `mailgun-template-uploader`. **Attenzione**: i **command id** restano `mailgun-upload-template-vscode.*` (sono indipendenti dal `name` e NON vanno "allineati"). Sul Marketplace è un'estensione nuova, non un update della precedente._

## Layout

- `src/extension.ts` — entrypoint (command/UI layer): `activate()` registra i 3 comandi e delega alla logica. `deactivate()` vuoto.
- `src/common/mailgun-util.ts` — `class MailgunUtil(domain, apiKey)` con `uploadTemplate(content, templateName)` → `POST https://api.mailgun.net/v3/{domain}/templates` (auth basic `api:apiKey`).
- `src/common/api.ts` — wrapper generico ES6 su **axios** (`class Api`), usato da `MailgunUtil`.
- `src/common/constants.ts` — `ExtensionId`, `BaseAPIUrl`, `TemplatesUrl`.
- `src/templates/index.ts` — `getConfigTemplate(apiKey, domain)` ritorna il JSON di config di default (chiavi `API_KEY` / `DOMAIN`).
- `src/test/` — suite Mocha via `vscode-test` (`runTest.ts` + `suite/`), placeholder.
- Build: `out/extension.js` (webpack production in `vscode:prepublish`; `main` del manifest).
- `docs/` — sito GitHub Pages (Jekyll), non codice.

## I 3 comandi (in `package.json` `contributes.commands`)

- `mailgun-upload-template-vscode.config` — chiede API key + dominio, scrive `mailgun-config.json`.
- `mailgun-upload-template-vscode.get-config` — mostra il path del file di config.
- `mailgun-upload-template-vscode.upload` — carica il file (da context menu su file/editor, oppure via dialog) come template Mailgun.

Il config file `mailgun-config.json` **NON** sta nel workspace: `getConfigPath()` lo mette nella dir utente di VSCode (`.../Code/User/` o `Code - Insiders`), risolta per OS via `APPDATA` / `~/Library/Application Support` / `~/.config`.

## Regole di lavoro (SEMPRE)

- **MAI `git push`** — lo fa sempre l'utente. **MAI `Co-Authored-By`** nei commit.
- **Release automatizzata via tag**: al push di un tag `v*`, `.github/workflows/release.yml` fa `npm ci` + lint + compile, impacchetta il `.vsix`, crea la GitHub Release e — se il secret **`VSCE_PAT`** è configurato — pubblica sul Marketplace con `vsce publish --pat`. Flusso: bumpa `version` in `package.json` (+ `package-lock.json`), annota `CHANGELOG.md`, commit, `git tag -a vX.Y.Z`, push del tag. `vsce` valida il campo `publisher` contro il PAT → deve essere `allannava95`. In alternativa publish **manuale**: `npx vsce login allannava95` + `npx vsce publish`.
- **`publisher` = `allannava95`**, ma gli URL GitHub (`repository`, `bugs`, CODEOWNERS, README/docs) restano `Allan-Nava`: sono due account distinti (Marketplace vs GitHub). Non "uniformarli".
- **Ogni modifica va annotata in `CHANGELOG.md`** (oggi in formato `## [vX.Y.Z]`, non Keep-a-Changelog). Bumpare `version` in `package.json` a mano prima del publish.
- **Un comando nuovo tocca più punti** e vanno propagati: `package.json` (`contributes.commands` + `menus` + `activationEvents`), `src/extension.ts` (`registerCommand` + `context.subscriptions.push`), README/CHANGELOG. Il `command` deve **combaciare esattamente** tra `package.json` e `registerCommand(...)`.
- **Il pubblicabile lo decide `.vscodeignore`** — `src/`, `**/*.ts`, `**/*.map`, `out/test/**`, `.vscode/**` sono esclusi dal `.vsix`. Verificare con `npx vsce ls` prima di pubblicare.
- **Testare a mano** (F5 → "Run Extension" → esegui *Config*, poi *Upload* su un `.html`, verifica sul dashboard Mailgun) prima di dichiarare fatto: la suite automatica è un placeholder e non copre l'upload.

## Trappole note / regole tecniche

- **`activationEvents: ["*"]`** — l'estensione si attiva all'avvio di ogni finestra; pesante ma storico. Un domani si può restringere a `onCommand:`.
- **Dipendenze**: `axios`, `@fireflysemantics/join`, `crypto` (deprecato/inutile, è built-in Node), `@types/fs-extra` sono in `dependencies`. `lodash` e `mkdirp` sono importati in `extension.ts` ma dichiarati solo come `@types/*` in `devDependencies` → funzionano perché webpack li bundla da `node_modules` transitivi. Andrebbero messi in `dependencies` espliciti. Il pacchetto `crypto` in `dependencies` va rimosso (built-in).
- **Toolchain 2020** (TS 3.8, `@types/node` 13, eslint 6, webpack 5, engine `vscode ^1.45`) → `npm audit` segnala vuln. Aggiornare con cautela: un bump di `engines.vscode` alza il minimo VSCode richiesto agli utenti.
- **`azure-pipelines.yml` è stale/rotto**: usa Node 8.x, `yarn` e una cartella `sample/` che non esiste. Il CI reale è `.github/workflows/ci.yml` (Node 12, `npm ci` + `tsc -p ./` + Coveralls).
- **`npm test`**: esegue `node ./out/test/runTest.js` (runner `vscode-test` da `src/test/runTest.ts`); `pretest` fa prima `compile` + `lint`. La suite è comunque un placeholder e scarica una build di VSCode al primo run.
- **Segreti nei log**: NON loggare API key / password su `console.log` (già ripulito in `extension.ts` e `mailgun-util.ts` — non reintrodurre).
- **Path cross-platform**: usare `path.basename`/`path.join` (import `nodePath` in `extension.ts`), non `lastIndexOf('/')` — si rompe su Windows.
- **Anti-pattern `new Promise(async …)`**: ingoia le eccezioni sincrone. Preferire `async/await` diretto (già applicato a `createConfigMailgun`/`createDirectory`).
- **Guardare sempre i `return`** nei rami d'errore del comando *upload*: senza `return` dopo `showErrorMessage` il flusso prosegue e va in crash (bug storico, ora fixato).
- **`createDirectory()` è codice non usato** — tenuto per riferimento; se serve creare cartelle usare `await mkdirp(dir)` diretto.

## Comandi utili

```bash
npm ci                 # install pulito (come il CI)
npm run compile        # tsc -p ./  (type-check + emit in out/)
npm run webpack        # bundle dev
npm run lint           # eslint src --ext ts
npx tsc -p ./ --noEmit # solo type-check
npx vsce ls            # cosa finisce nel .vsix
npx vsce package       # crea il .vsix
npx vsce publish       # pubblica sul Marketplace (publisher allannava95)
```
Debug interattivo: F5 in VSCode → config **"Run Extension"** (apre Extension Development Host).

## Puntatori

- Repo/issue: `github.com/Allan-Nava/Mailgun-Template-Extension-VSCode` · Owner: `@Allan-Nava` (`.github/CODEOWNERS`) · Docs: `docs/` (GitHub Pages/Jekyll)
- CI: `.github/workflows/ci.yml` · Release: `.github/workflows/release.yml` (tag `v*`, secret `VSCE_PAT`) · Manifest: `package.json` · Config utente runtime: `mailgun-config.json` nella dir User di VSCode
- API Mailgun template: `https://documentation.mailgun.com/` (endpoint `/v3/{domain}/templates`)
- Regole per agent AI: `AGENTS.md`
