# Versus redesign exploration

Design references produced 2026-08-24 for the redesign of Versus. Kept in the repo as
inspiration for this and other sites. Each direction is a self-contained HTML page with
tabs for the three screens plus a phone-width preview — open them in a browser.

## Audit of the current UI (`audit/`)

Screenshots of the shipped design (desktop, mobile 390px, RTL). Clarity problems found:

1. **Numbering gaps** — hiding "done" items by default leaves visible holes in the rank
   column (1, 3, 4, …) with no explanation. Every direction below fixes this
   differently: keep done rows visible (dimmed), or fold them into a labelled group.
2. **Expensive header** — the stacked brandmark + question costs 120px+ of vertical
   space on every screen; on mobile that is a third of the fold. The question, not the
   brandmark, is the real title of the compare screen.
3. **Four typefaces** (Playfair, Bricolage, Inter, JetBrains) compete; hierarchy comes
   out busy rather than clear. Each direction commits to at most two families.
4. **Floating corner icons** — sidebar toggle and gear hang unanchored; no header bar.
5. **Faint microtext** — progress, kbd hints, and the footnote are set very small and
   very light; the information architecture relies on text nobody can read.
6. **Sidebar buttons wrap** awkwardly at 280px; list rows crowd three actions together.
7. **Mobile compare** — cards stack but stay small; the primary action of the whole app
   doesn't fill the thumb zone; equal/back are small targets.

## Direction 1 — The Scoreboard (`direction-1-scoreboard.html`)

A fixture under floodlights. Petrol-dark field, cream team-sheet cards, one amber
signal colour, condensed display type (Barlow Condensed + Barlow). Signature: the
centre "tale of the tape" divider carrying a live tally (2–1) that ticks as you answer;
progress reads as rounds. Results are a league table — done rows go "full time" but
keep their position. Loudest and most opinionated of the three.

## Direction 2 — The Ledger (`direction-2-ledger.html`)

Ranking as a considered act. Cool ink-wash paper, a single serif family (Newsreader)
doing everything, one vermilion "stamp" reserved for judgements. Signature: you choose
between two pieces of TEXT, not cards — a pen-stroke underline marks the winner; the
mobile split reads "…or…". Results are a true ledger with stamped rank numerals; done
items are struck through but never hidden. Quietest, most literary, most unusual.

## Direction 3 — The Coach (`direction-3-coach.html`)

A pocket decision coach — the phone-first direction and the natural PWA identity.
Warm porcelain ground, deep pine accent, rounded tactile surfaces (Sora + Manrope).
Signature: two big springy choice paddles that fill the bottom of a phone screen;
progress is a friendly ring; results are a podium list with the winner celebrated and
done items folded into a labelled group. Friendliest, most app-like.

## Common to all three

Compact single-line header (brand small, actions anchored); the question promoted to
the compare screen's title; at most two type families; one accent colour; explicit
treatment of done items so rank numbering never has unexplained holes; thumb-first
mobile compare; focus-visible styles and reduced-motion respected.
