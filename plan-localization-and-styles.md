# Versus — Customizable Static-Site Framework (Architecture Plan)

## Context

Versus (single-file static app on GitHub Pages, also runs from file://) is being extended
with: (1) localization, (2) per-user text overrides, (3) live theming (fonts, sizes,
per-token colours), (4) named saved "styles", (5) a Download button exporting the site
with all styles + localizations, plus RTL support. The mechanism should generalize into
a reusable framework for future static sites, and community members should be able to
contribute locales/styles easily and safely.

## Decisions made (with David)

- **Storage model:** data-driven — one HTML shell + locale data + style data. Rejected
  "one page per locale×style combination" (N×M duplication, guaranteed drift).
- **No privileged language or style ("pure engine shell"):** index.html contains NO
  human-readable strings and NO theme values — every locale and style is an identical
  external citizen, including English (`locales/en.js`) and the current look
  (`styles/classic.js`). At least one locale and one style must load for the app to
  render. Which locale/style backs up the others is declared as *data* in the manifests
  (`fallbackLocale`, `fallbackStyle`), never hardcoded.
- **RTL:** single page; each locale declares `dir`; CSS converted to logical properties.
  No second base page.
- **Data layout (3b):** `locales/` and `styles/` folders of per-item `.js` files, each
  self-registering, discovered via one-line manifests. Contributors never touch
  index.html.
- **Export:** BOTH a single self-contained HTML file and a ZIP of the site files.
  **No baked/cut-down mode.**
- **Community sharing:** normal public repo + pull requests (review = vandalism gate,
  since locale/style files are executable .js). In-app `.json` import/export of a single
  style or locale for direct user-to-user sharing (pure data, validated, never executed).
- **Accepted cost of the pure shell:** index.html alone is non-functional (needs its
  folders). The "just one file" use case is served by the single-HTML export, which is
  generated with all data bundled — never hand-maintained. README promise becomes
  "open the folder's index.html, or download the single-file version from the live site."

## Target file layout

```
versus/
  index.html            engine only: markup skeleton (empty data-i18n elements),
                        structural CSS, runtime core. No strings, no theme values.
  locales/
    manifest.js         VERSUS.localeList=["en","fr","ar"];
                        VERSUS.defaultLocale="en"; VERSUS.fallbackLocale="en";
    en.js               VERSUS.registerLocale("en", {...})   ← ordinary citizen
    fr.js               VERSUS.registerLocale("fr", {...})
    ar.js               VERSUS.registerLocale("ar", {dir:"rtl", ...})
  styles/
    manifest.js         VERSUS.styleList=["classic","midnight"];
                        VERSUS.defaultStyle="classic"; VERSUS.fallbackStyle="classic";
    classic.js          VERSUS.registerStyle("classic", {...}) ← current look, complete
    midnight.js         VERSUS.registerStyle("midnight", {...})
  examples/
    midnight.versus-style.json    reference import artifact / test fixture
    fr.versus-locale.json         reference import artifact / test fixture
```

## Boot sequence (the part that makes "no default" sound)

1. `<html>` starts hidden (`visibility:hidden` via a class in the shell CSS).
2. index.html defines `window.VERSUS = {locales:{}, styles:{}, registerLocale,
   registerStyle}`, loads the two manifests via `<script src>`, then a loader injects
   one `<script>` per manifest entry, tracking `onload`/`onerror` per file (dynamic
   script injection with relative paths works under file://; fetch does not).
3. When all tracked scripts settle: pick locale = saved pref → `defaultLocale` → first
   registered; same for style. `applyLocale` + `applyStyle`, then unhide. Local script
   loads settle in milliseconds — no visible flash.
4. If ZERO locales or ZERO styles registered (folders missing/renamed, or every file
   errored): show a minimal, language-neutral failure notice (⚠ + the file paths it
   tried). This dev-facing notice is the single unavoidable hardcoded string in the
   shell. Blast radius otherwise: a syntax error in one locale file kills only that
   locale; the picker simply doesn't list it.
5. Exported single-file copies carry `standalone:true` in their data block; the loader
   skips script injection and reads registries from the block instead.

## Data schemas

**Locale** (`locales/fr.js`) — translator-facing, one file per language:
```js
VERSUS.registerLocale("fr", {
  name: "Français", dir: "ltr", plural: "one-other",
  strings: {
    "app.defaultQuestion": "Lequel préférez-vous ?",
    "input.lede": "Mettez ce que vous voulez dans une liste…",
    "input.placeholder": "Corriger le bug…\nRépondre à l'e-mail…",  // real \n, no &#10;
    "input.countItems.one": "{n} élément", "input.countItems.other": "{n} éléments",
    "results.doneStat": "{done} sur {total} terminés",
    // ...missing keys fall back to fallbackLocale (declared in locales/manifest.js)
  }
});
```
- Flat dotted keys, screen-scoped (`app.*`, `input.*`, `compare.*`, `results.*`).
- Resolution: user override → current locale → `fallbackLocale` (data-declared).
  `t(key, params)` does `{placeholder}` substitution; `tn(key, n)` picks `.one/.other`
  via a tiny named plural rule registry (`one-other`, `other-only`; no ICU). Only ~4
  keys are plural.
- The brandmark "Versus" is a logo — not localized (stays in markup as the one visible
  literal, it is an image-like mark, not UI text).

**Style** (`styles/midnight.js` — identical schema for localStorage-saved styles and
`.json` artifacts):
```js
VERSUS.registerStyle("midnight", {
  name: "Midnight",
  colors: { paper:"#101418", ink:"#E7ECF1" /* any subset of the ~15 colour tokens */ },
  fonts:  { sans:'"Inter",system-ui,sans-serif' /* any subset of sans/display/serif/mono */ },
  sizes:  { title:"48px", question:"36px" /* any subset of the --fs-* roles */ },
  googleFonts: ["Atkinson+Hyperlegible:wght@400;700"]   // optional
});
```
Subset styles are legal: `applyStyle` merges them over the `fallbackStyle`'s tokens
(data-declared, normally classic — which is required to be complete; a lint check in
the style import path warns if fallbackStyle has gaps). Styles never contain strings;
locales never contain tokens → any style × any locale by construction.

**Shareable artifacts** (`.json`, imported via `<input type=file>` + FileReader — same
pattern as the existing .txt loader; works on file://):
`{"format":"versus-style","formatVersion":1,"style":{...}}` and
`{"format":"versus-locale","formatVersion":1,"locale":{...}}`. Import validates the
format tag, whitelists keys against the known registries, reports ignored unknowns,
prompts on id collision. Export reuses the existing CSV Blob-download helper.

## Runtime architecture (index.html changes)

1. **Tokenize font sizes** as `--fs-*` vars referenced by the rules:
   `--fs-title, --fs-question, --fs-lede, --fs-label, --fs-input, --fs-btn, --fs-option,
   --fs-item, --fs-results-title, --fs-meta, --fs-fine`. All colour/font/size VALUES
   move out of `:root` into `styles/classic.js`; the shell stylesheet keeps only
   structural rules (grid/flex, spacing, radius, shadows, transitions) plus `var()`
   references. (Radius/shadows can become tokens later if wanted.)
2. **String binding:** markup elements ship EMPTY, carrying `data-i18n="key"` →
   textContent; `data-i18n-placeholder`, `data-i18n-title`, `data-i18n-aria-label` for
   attributes; `data-i18n-html` ONLY for the two markup-bearing strings (footnote,
   kbd-hint). JS strings (default question, mode-help ×2, errors, count/done-stat
   templates, empty state, toggle labels, CSV header, "#" rank badge) routed through
   `t()/tn()`; styled spans injected in JS after escaping.
3. **applyLocale(id):** fills all data-i18n nodes, sets `html.lang`, `html.dir`,
   `document.title` (also a locale key), re-renders dynamic labels.
4. **applyStyle(style):** merge over fallbackStyle, then
   `documentElement.style.setProperty` per token; Reset = re-apply the default style;
   optional Google Font via injected `<link>` (system-font fallback stacks preserved).
   Every editor control writes one token on `input` → instant live preview.
5. **RTL specifics:** convert the 7 physical CSS properties to logical ones
   (`.option .tag/.side` left/right → `inset-inline-start/end`; `.count margin-right:auto`
   → `margin-inline-end`; `.toolbar .spacer` → `margin-inline-start`; `.row .rank/.score
   text-align` → `start/end`; `.row.tie .rank::after margin-left` → `margin-inline-start`).
   Refactor `choose("left"/"right")` to `anchor/ranked` semantics; map physical arrow
   keys by `dir` (`ArrowLeft` selects the physically-left card under RTL too); compute
   tip-tilt classes from physical side.
6. **Customize panel:** slide-over `<aside>` + gear button available on all screens
   (live preview against the real page — a fourth screen can't do that). Sections
   (plain `<details>`): Language picker · Edit text (filterable per-key list, edits
   become overrides, individually revertible) · Theme (colour inputs per token with
   human labels, 4 font selects + Google Font field, size controls) · Styles
   (save-as-name, apply, delete, reset) · Export (HTML / ZIP / style .json / locale .json,
   import file input). Panel labels are themselves locale keys (`panel.*`).
7. **Guard:** compare-screen keydown handler bails when
   `e.target.closest("input,textarea,select,#customize")` — the panel introduces form
   fields onto the compare screen for the first time.

## Persistence (localStorage)

Keys namespaced + versioned: `versus.v1.prefs` `{schema, locale, styleId}`,
`versus.v1.customStyles` `{schema, styles:{id:{...}}}`, `versus.v1.stringOverrides`
`{schema, overrides:{localeId:{key:val}}}`.
- `safeGet(key, fallback)`: try/catch JSON.parse + shape check; corrupt → discard.
- `safeSet(key, obj)`: whole-envelope write; catch QuotaExceeded/SecurityError → run
  from an in-memory mirror + one-time "changes won't persist; use Export" notice.
- Boot-time capability probe (touching localStorage can itself throw when disabled).
- Note: Chrome shares ONE localStorage origin across all file:// pages — the `versus.`
  prefix prevents collisions.

## Export

**Pristine source capture:** first statement of the IIFE:
`const PRISTINE = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;`
— captured before any mutation; one uniform path for https AND file:// (no fetch).
(The pristine shell is content-free by design, which makes this capture even safer —
there is nothing locale- or style-dependent in it to leak into exports.)

**Data block** — the single variable region in the shell, marker-delimited. In the
repo's shell it is nearly empty:
```html
<!--VERSUS:DATA:BEGIN-->
<script type="application/json" id="versus-data">
{"dataVersion":1, "standalone":false}
</script>
<!--VERSUS:DATA:END-->
```
Export = string surgery on PRISTINE replacing the region with the filled block:
`{"dataVersion":1, "standalone":true, "locales":[...all registered...],
"styles":[...], "overrides":{...}, "defaultLocale":"fr", "defaultStyle":"midnight",
"fallbackLocale":"en", "fallbackStyle":"classic"}`. Two mandatory gotchas:
build marker strings by concatenation so they never appear contiguously in code (quine
trap), and `JSON.stringify(...).replace(/</g,"\\u003c")` so `</script>` can't occur.
Self-check before download: markers occur exactly once, JSON round-trips; abort on
failure. Exported file must itself be able to export again (fixed point).

- **Single HTML export:** all registered locales + styles + user's custom styles +
  string overrides in the block, `standalone:true`, current locale/style as defaults.
  One file, opens anywhere — this is the artifact that serves the old "just open one
  file" use case.
- **ZIP export:** hand-written store-only ZIP encoder (~80 lines, CRC32 table, no
  compression, no libraries). Contents mirror the repo layout: pristine index.html
  (empty data block), `locales/*.js` + `styles/*.js` **regenerated from the in-memory
  registries** (user's custom styles/overrides become proper new files), manifests
  regenerated to match.
- **NOT exported by default:** the user's list, comparisons, results, done marks
  (privacy — shared files shouldn't leak someone's task list). Optional later: an
  opt-in "include my current list" seed.

## Implementation milestones (each leaves the app working)

1. **CSS groundwork** — add `--fs-*` tokens (values still in `:root` for now); convert
   the 7 physical properties to logical ones. Pure refactor, zero visual change.
2. **anchor/ranked refactor** + physical keyboard mapping + keydown form-field guard.
3. **The big extraction (atomic by nature):** registries + manifests + loader + boot
   gate; move ALL strings into `locales/en.js` (markup → empty elements + `data-i18n*`,
   JS strings → `t()/tn()`); move ALL token values from `:root` into
   `styles/classic.js`; hidden-until-ready + failure notice. App looks/behaves
   identically after; verify on file:// and http.
4. **More citizens** — `locales/fr.js` + a real RTL locale (Arabic or Hebrew); locale
   picker in a minimal panel shell; lang/dir/title switching; RTL smoke test.
5. **Theme engine** — applyStyle merge-over-fallback, live colour/font/size controls,
   Google Font injection, `styles/midnight.js` as second shipped style.
6. **Persistence + full panel** — safeGet/safeSet schema, text-override editor, named
   style save/load, restore-on-boot.
7. **Artifacts** — `.json` style/locale export + validated import; `examples/` fixtures.
8. **Site export** — PRISTINE capture, data-block markers, single-HTML export
   (standalone boot path); ZIP encoder + ZIP export.
9. **Docs** — README (still "no build"; folder requirement + single-file export story,
   key list, token list); CONTRIBUTING.md (PR a locale/style: one file + one manifest
   line; fallbackStyle must stay complete).

## Verification

- Serve locally (`python -m http.server`) AND double-click index.html (file://) in
  Chrome — full feature pass in both: locale switch, RTL mirror + arrow keys, live
  theming, style save/reload after browser restart, .json round-trip, HTML export
  re-opens (standalone, no folders needed) and re-exports, ZIP export unzips into a
  working site.
- **Pure-shell failure paths:** rename `locales/` → failure notice appears (not a blank
  page); break the syntax of one locale file → only that language disappears from the
  picker; delete a key from fr.js → that string falls back to the fallbackLocale.
- No visible flash of unstyled/empty content on normal boot.
- Keyboard shortcuts still work on the compare screen with the panel closed; typing in
  panel fields must NOT trigger choices/undo.
- Regression: full ranking flow (both modes), ties, undo, CSV download, mobile layout.
- Private-browsing / storage-disabled: app runs, shows the one-time notice.
- Deploy to GitHub Pages and re-test export there (https path).

## Critical files

- `F:\GitHub\davidbaines\versus\index.html` — becomes the pure engine shell (tokens,
  i18n binding, boot gate, panel, persistence, export). Reuse: existing CSV
  Blob-download helper, existing FileReader .txt pattern, existing `:root` token
  architecture.
- New: `locales/manifest.js`, `locales/en.js`, `locales/fr.js`, one RTL locale,
  `styles/manifest.js`, `styles/classic.js`, `styles/midnight.js`, `examples/*.json`,
  `CONTRIBUTING.md`; update `README.md`.
