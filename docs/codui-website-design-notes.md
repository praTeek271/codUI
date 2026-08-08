# CodUI Design System — Working Notes

Personal reference distilled from the base `frontend-design` skill, applied
and refined across the CodUI logo and documentation page build. This is not
the original skill — it's what actually held up in practice for this
specific brand, plus the bugs that got fixed along the way.

---

## 1. Brand identity (locked)

- **Mark**: Geo body fish — rounded-rect torso, forked tail (two diverging
  curves from a single waist point, not a closed shape), single dorsal fin
  arc at the body/head seam, one eye dot. Faces right.
- **Wordmark**: `Cod` in purple, `UI` in primary text color. JetBrains Mono,
  weight 700, tight letter-spacing (-0.3 to -3px depending on size).
- **Palette**: `--purple #7c6bff`, `--purple2 #6c5ce7` (hover/active),
  `--cyan #38bdf8`, `--green #4ade80`, `--pink #f472b6`, `--amber #fbbf24`.
  One dominant accent (purple) carries the brand; the rest are syntax-highlight
  accent colors used sparingly, never competing with purple for attention.
- **Type pairing**: Syne (display, geometric, used for headings) + JetBrains
  Mono (body/code/wordmark). No Inter, no Arial — matches the base skill's
  explicit instruction to avoid generic AI-aesthetic fonts.
- **Rule that mattered**: flat strokes, no gradients on the wordmark or icon
  mark. Gradients break on light backgrounds, embroidery, and favicon scale.
  Glow/gradient treatments are fine for one-off hero art, never for the
  reusable mark.

---

## 2. Loader sequencing — what the spec actually meant

This took several rounds to get right. The lesson generalizes: **a
choreographed animation needs its own state machine with explicit phase
transitions, not a single elapsed-time variable shared across actors.**

Final sequence:
1. `swim-in` — hero fish left → center, eased, ~1s
2. `wait` — hero pauses 1.5s, blinks twice. Swarm fish are *created* near
   the end of this phase but held static at the left edge — spawning early
   and moving early are different things and were conflated in an earlier
   draft, which caused the swarm to appear to originate from center.
3. `exit` — the instant the wait timer ends, the hero starts swimming
   center → right **and** the swarm's own clock starts in the same frame.
   This is the actual "trigger" — not spawn time, departure time.
4. `exit-done` — hero is gone, loop keeps running until swarm front clears
   the right edge.

**Pattern worth reusing**: give independently-timed actors independent
`performance.now()` anchors (`swarmStartTime`, `phaseStart`) rather than
computing their position from a shared phase-elapsed value. Mixing the two
is what caused the original "swarm jumps in front of the hero" bug — the
swarm's position was computed from a clock that wasn't ticking while the
swarm sat motionless, so when it started, the math had a head start baked in.

**Density tuning**: more rows/columns of swarm fish needs proportionally
tighter inter-column delay, or total loader duration balloons. Went from
6→9 columns desktop, had to drop per-column delay 160ms→110ms to keep total
duration roughly constant.

---

## 3. Directional blur wipe

`backdrop-filter: blur()` doesn't crossfade cleanly left-to-right on its own.
Solution: keep the blur element at a constant blur value, and animate
`clip-path: inset(0 0 0 X%)` on it instead, tracking the swarm's front
x-position as a percentage of viewport width. The element doesn't get less
blurry — it gets clipped away, revealing the sharp content underneath.
Cheaper than animating the blur radius itself, and reads as directional
rather than a flat fade.

---

## 4. Hidden-then-revealed content without layout jump

The hero subtitle block needs to stay perfectly centered before the
description/buttons/install-box appear on first scroll. Naive `opacity: 0`
still reserves layout space (margin, height), which threw the visible
content off-center.

Fix: `max-height: 0; overflow: hidden;` on the hidden state, transitioning
to a fixed `max-height` (generous upper bound, e.g. 300px) on reveal,
alongside opacity and transform. True `height: auto` isn't transitionable,
so a sufficiently large max-height stands in for it.

---

## 5. Card ripple-on-scroll

`IntersectionObserver` per card, `threshold: 0.12`, unobserve after first
trigger (one-shot, not re-triggering on scroll-back). Ripple element is
injected at the card's left edge — `left: -ringSize/2`, vertically
centered — so it visually reads as "something swam in and rippled," tying
back to the aquarium motif rather than being a generic fade-in.

---

## 6. Mobile — what actually needed to change vs. what scaled automatically

Scaled fine via `clamp()` and `auto-fit` without intervention: hero
typography, card grid columns, font sizing in body copy.

Needed explicit `@media` overrides: nav links (hidden below 768px, no
hamburger — out of scope for v1), themes-row (4 cols → 2), code block
filename label (dropped, not enough horizontal room), hero fish + swarm
fish *count and size* (reduced ~45% on mobile — this is a JS-side decision,
not CSS, since the swarm is canvas/DOM-generated at runtime based on
`window.innerWidth <= 768`).

---

## 7. Things from the base skill that mattered most in practice

- "One well-orchestrated page load with staggered reveals creates more
  delight than scattered micro-interactions" — the entire loader sequence
  is this principle taken seriously, rather than bolting on a generic
  spinner.
- "Dominant colors with sharp accents outperform timid, evenly-distributed
  palettes" — purple does ~80% of the visual work; cyan/green/pink/amber
  appear only in syntax-highlight contexts (theme swatches, code block
  tokens) where their job is literally to look like a code editor, not to
  share billing with the brand color.
- Explicitly avoided: purple gradient on white (the skill's named cliché),
  Inter/system fonts, predictable centered-hero-with-stock-illustration
  layout — replaced the "stock illustration" with the canvas aquarium,
  which is functional (it's the actual page background) rather than
  decorative.
