# Priorities

A small web app for putting a list in order by comparing two items at a time. Write
your tasks, restaurants, ideas — anything — answer a series of "which has higher
priority?" questions, and get a full ranking with a strength score for each item.
No build step, no server, and nothing leaves your browser.

**Live:** [https://davidbaines.github.io/versus/](https://davidbaines.github.io/versus/)
*(the app is called Priorities; the repository keeps its original name, versus)*

## Install it as an app

Priorities is a PWA — from the live site you can install it like a native app, and it
keeps working offline after the first visit:

- **Android (Chrome):** open the site → menu (⋮) → **Add to Home screen** → Install.
- **iPhone/iPad (Safari):** open the site → Share → **Add to Home Screen**.
- **Desktop (Chrome/Edge):** click the install icon that appears in the address bar.

## Why pairwise?

People are unreliable at ranking a long list directly, but very good at judging two
things side by side. Priorities turns the hard task (rank 20 things) into a sequence
of easy ones (which of these two?).

Three sorting methods, chosen on the first screen (live comparison counts shown for
your actual list):

| Method | How it works | Comparisons for n items |
|---|---|---|
| **Quickest** | Binary insertion — each new item halves its way into place | ≈ n·log₂n (about 90 for 25 items) |
| **Insertion** | Each new item walks down the ranking from the top | ≈ n²/4 (about 170 for 25 items) |
| **Compare all** | Every pair once, with the same item staying on one side | exactly n(n−1)/2 (300 for 25 items) |

In Compare all there is no "equal" option; ranking is by wins, with ties between
items broken by their head-to-head result.

## Features

- Paste a list, or upload a text file (one item per line); duplicates are removed.
- The question is the heading — click it to change it; it's asked of every pair.
- Keyboard on the compare screen: `←`/`→` select a side, `Enter` or `Space` accepts,
  `↓` for equal priority, `⌫` to undo. Clicking or tapping accepts directly.
- **My Lists** — save any number of named lists, each with its question and (once
  ranked) its results and done-ticks. A loaded list stays synced: ticking items done
  or re-ranking writes back automatically. Lists export/import as `.json` files.
- Results are a ledger: stamped rank numerals, a Bradley–Terry strength score, and a
  done-box per item. Finished items stay visible (struck through) so ranks never skip.
- Export the ranking as CSV.
- **Settings (⚙)** — switch language (English, Français, العربية — right-to-left
  languages mirror the whole layout), pick or edit a style (every colour, font, and
  text size, with live preview), rewrite any text in the app, and share styles or
  languages as small `.json` files.
- **Download the whole site** — as a single self-contained `.html` file (all languages
  and styles baked in, works anywhere, can even re-export itself) or as a `.zip`
  mirroring this repository's layout.

## How the site is put together

`index.html` is a pure engine: it contains no English text and no theme values.
Languages live in `locales/`, looks live in `styles/`, and the page loads whatever the
two `manifest.js` files list:

```
index.html            the engine (markup skeleton + logic, no content)
manifest.webmanifest  PWA manifest        sw.js   offline service worker
icons/                app icons (and the HTML source that renders them)
locales/
  manifest.js         lists locale files + default/fallback language
  en.js  fr.js  ar.js one file per language
styles/
  manifest.js         lists style files + default/fallback style
  ledger.js           the default "Priorities" look (SIL Gentium, ink & vermilion)
  classic.js  midnight.js
examples/             sample .json share files
mockups/              the design exploration that produced the current look
```

**Add a language:** copy `locales/en.js`, translate (missing keys fall back), set
`dir: "rtl"` if appropriate, add the code to `locales/manifest.js`. **Add a style:**
same idea in `styles/` — a style may set any subset of tokens. See
[CONTRIBUTING.md](CONTRIBUTING.md).

## How the ranking works

**Order** comes straight from your answers. The two insertion methods slot each new
item into the ranking built so far, so the order always agrees with every answer.
Compare all is a round robin: one point per win, point-ties broken by the results
among the tied items, and a perfectly circular tie keeps your original list order.

**Score** is a maximum-a-posteriori Bradley–Terry fit over the same comparisons — the
model behind Elo, fit in batch with light regularization, then smoothed (weighted
isotonic regression) so the numbers never contradict the order you chose, and shifted
so the lowest reads at least 1. Read gaps as rough confidence, not exact distance.

## Privacy

Everything runs in your browser. There's no backend and no analytics — your lists and
choices are stored only in your browser's localStorage. The service worker caches the
app's own files for offline use; the only external request is to Google Fonts, with a
system-font fallback if it's blocked or you're offline.

## Run it locally

Open `index.html` in any modern browser — keep it together with its `locales/` and
`styles/` folders (no install, no build, no server). Offline/install features need
http(s), so they're active on the live site (or `python -m http.server` locally).
For a truly single file, use **Settings → Share & Export → Download Site**.

## License

MIT. Do what you like with it.
