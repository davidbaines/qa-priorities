# Versus

A small web app for ranking a list by comparing two items at a time. Put in your
tasks, restaurants, features — anything — answer a series of "this or that"
questions, and get a full ranking with a strength score for each item. No build
step, no server, and nothing leaves your browser.

**Live:** [https://davidbaines.github.io/versus/](https://davidbaines.github.io/versus/)

## Why pairwise?

People are unreliable at ranking a long list directly, but very good at judging
two things side by side. Versus turns the hard task (rank 20 things) into a
sequence of easy ones (which of these two?), and only asks the questions it
needs — it skips comparisons it can infer from earlier answers, so 25 items
takes roughly 85 clicks instead of the 300 an all-pairs comparison would need.

## Features

- Paste a list or load a `.txt` file (one item per line); duplicates are removed.
- Set your own comparison question — e.g. "Which is most important?", "Which do you prefer?"
- Two comparison styles: **Fewest questions** (binary search) or **Top-down** (walk each new item down your current ranking).
- Mark a pair **equal** when you can't separate them; declared ties share a rank and score.
- Results show a rank, a strength score, and a proportional bar for each item.
- Doubles as a to-do list: tick items off, with a show/hide toggle for completed ones.
- Export to CSV (rank, item, score, done — your question is stored in cell E1).
- Keyboard: `←` / `→` to choose (always the card on that side of the screen), `↓` (or `=`) for equal, `⌫` to undo.
- Undo any answer, all the way back to the start.

## Customize (the ⚙ button)

Everything the app shows is data, and all of it can be changed from the
Customize panel — with live preview on the page you're looking at:

- **Language** — switch between shipped languages. Right-to-left languages
  (like Arabic) mirror the whole layout automatically.
- **Edit text** — rewrite any string the app displays. Your edits are a
  personal layer on top of the chosen language and survive reloads.
- **Theme** — pick a style, then change any colour, font, or text size.
- **My styles** — save your current look under a name, reapply or delete it later.
- **Share & export**:
  - *Download site (single .html)* — one self-contained file with every
    language and style (including yours) baked in. Open it anywhere, share it,
    even re-export from it.
  - *Download site (.zip)* — the same site in folder form, mirroring this
    repo's layout, with your custom styles and text edits written out as
    proper data files.
  - *Export / import .json* — share a single style or language as a small data
    file that another Versus user can import with one click.

Preferences, custom styles, and text edits are stored in your browser's
localStorage. Nothing is uploaded.

## How the site is put together

`index.html` is a pure engine: it contains no English text and no colours of
its own. Every language is a file in `locales/`, every look is a file in
`styles/`, and the page loads whatever the two `manifest.js` files list —
English and the "Classic" look are ordinary entries with no special status:

```
index.html            the engine (markup skeleton + logic, no content)
locales/
  manifest.js         lists locale files + default/fallback language
  en.js  fr.js  ar.js one file per language
styles/
  manifest.js         lists style files + default/fallback style
  classic.js  midnight.js
examples/             sample .json share files (used as import fixtures)
```

**Add a language:** copy `locales/en.js` to `locales/<code>.js`, translate the
strings (missing keys fall back to the fallback language), set `dir: "rtl"` if
appropriate, and add the code to `locales/manifest.js`. **Add a style:** same
idea in `styles/` — a style may set any subset of tokens and inherits the rest
from the fallback style. See [CONTRIBUTING.md](CONTRIBUTING.md).

## How the ranking works

Ordering and scoring are kept deliberately separate.

**Order** comes from an insertion sort with a three-way comparator (prefer A /
equal / prefer B). Each new item is slotted into the ranking built so far — by
binary search in the default mode, or by a top-down scan in sequential mode.
Both produce a total order; the only ties are the ones you declare.

**Score** is a maximum-a-posteriori Bradley–Terry fit over the same comparisons —
the model behind Elo, but fit in batch rather than online, with light
regularization (a virtual half-win and half-loss against a phantom opponent) so
ratings stay finite even for an item that won or lost every comparison.

Because the sort collects only about *n·log n* comparisons, the raw Bradley–Terry
estimate is noisy and can disagree with the order you built. So the scores are
projected onto "non-increasing along your ranking" using weighted isotonic
regression (pool-adjacent-violators): where the estimate agrees with your order
it passes through untouched; where it contradicts, those neighbours pool to a
shared value — which honestly reads as "too close to separate." Finally, if the
lowest score would be negative, every score is shifted up by the same amount so
the bottom of the list reads 1.

The result: the ranking is exactly the order you chose, and the numbers beside
it never contradict that order.

## Privacy

Everything runs in your browser. There's no backend and no analytics — your list
and your choices never leave your machine. The only external request is to
Google Fonts (each style declares which fonts it wants), with a system-font
fallback if it's blocked.

## Run it locally

Open `index.html` in any modern browser — keep it together with its `locales/`
and `styles/` folders (no install, no build, no server). If you want a truly
single file, use **Customize → Share & export → Download site (single .html)**
on the live site: that file carries all its data inside itself.

## License

MIT. Do what you like with it.
