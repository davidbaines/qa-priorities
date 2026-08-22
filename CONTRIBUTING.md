# Contributing a language or style

Versus loads languages from `locales/` and looks from `styles/`. Contributions
are one small file plus a one-line manifest edit — you never touch `index.html`.
Open a pull request; every submission is reviewed before it ships (locale and
style files are JavaScript that runs in every visitor's browser, so review is
the safety gate).

## Add a language

1. Copy `locales/en.js` to `locales/<code>.js` (e.g. `locales/sw.js`).
   `locales/en.js` is the complete reference key list.
2. Translate the values. You may leave keys out — missing strings fall back to
   the fallback language declared in the manifest.
3. Set the header fields:
   - `name`: the language's own name for itself (endonym), shown in the picker.
   - `dir`: `"ltr"` or `"rtl"` — RTL mirrors the whole layout automatically.
   - `plural`: `"one-other"` (English-like) or `"other-only"` (no singular form,
     e.g. Chinese, Japanese).
4. Keep the `{n}`, `{total}`, `{done}` placeholders in the strings that have them.
   Two strings (`compare.kbdHint`, `results.footnote`) may contain simple HTML.
5. Add the code to the list in `locales/manifest.js`.
6. Test: open `index.html` locally and switch to your language — check all three
   screens and the Customize panel.

An easy way to draft a translation without touching code: open the live site,
use **Edit text** to translate strings in place, then **Export language (.json)**
and include that file in your PR — a maintainer can convert it.

## Add a style

1. Copy `styles/midnight.js` to `styles/<id>.js`.
2. A style may set any subset of `colors`, `fonts`, and `sizes` — whatever it
   doesn't set is inherited from the fallback style (`classic`, which must
   always define every token; don't remove tokens from it).
3. `googleFonts` is optional; every font stack must end in a system fallback.
4. Add the id to `styles/manifest.js`.
5. Test in the browser: switch to your style, run a full ranking, check both
   light-on-dark readability and the compare screen.

The quickest authoring route: use the Customize panel's colour/font/size
controls until it looks right, **Save style**, then **Export style (.json)** and
include the file in your PR.

## Ground rules

- One language or style per PR, one file each (plus the manifest line).
- No extra script, no network calls, no tracking — data files register data and
  nothing else.
- By submitting you agree your contribution is MIT-licensed like the rest.
