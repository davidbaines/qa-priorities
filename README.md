# Versus

A small web app for ranking a list by comparing two items at a time. Put in your
tasks, restaurants, features — anything — answer a series of "this or that"
questions, and get a full ranking with a strength score for each item. It's a
single HTML file: no build step, no server, and nothing leaves your browser.

**Live:** `https://<your-username>.github.io/versus/`

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
- Keyboard: `←` / `→` to choose, `↓` (or `=`) for equal, `⌫` to undo.
- Undo any answer, all the way back to the start.

## How it works

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
Google Fonts for typography, with a system-font fallback if it's blocked.

## Run it locally

Open `index.html` in any modern browser. No install, no build.

## Hosting (GitHub Pages)

This repo is meant to be served with GitHub Pages: in the repo, go to
**Settings → Pages → Build and deployment**, set the source to **Deploy from a
branch**, choose the `main` branch and the `/ (root)` folder, and save. After a
minute the site is live at `https://<your-username>.github.io/versus/`. Any push
to `main` redeploys automatically.

## License

MIT. Do what you like with it.
