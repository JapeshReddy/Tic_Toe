# The Delivery uses an imperative useAnimate timeline

The Delivery's six stages are driven by a single awaited `async` function built
on Motion's `useAnimate`, not by a reducer advancing through animation
callbacks. A reducer is still present, but holds only the coarse state the UI
gates on — `idle | delivering | arrived` — while the fine choreography
(percentage, van position, Dot arcs) lives in the timeline and in motion values,
not in React state.

## Considered Options

A `useReducer` with a chain of `setTimeout`s was rejected: it needs six-plus
timers created, tracked and cleared, it leaks on unmount mid-Delivery, and the
Setback's three distinct easings become hand-rolled interpolation. Declarative
variants with `onAnimationComplete` were rejected because a six-stage sequence
containing a reversal becomes a variant graph whose ordering is implicit in
callbacks rather than readable top to bottom.

## Consequences

The timeline source reads as a transcription of `login.md`'s numbered stages,
which is the main reason for the choice, and cancellation for the Skip affordance
is a single `stop()` call. The cost is that the timeline cannot be meaningfully
unit-tested — asserting "stage 4 followed stage 3" would test the animation
library, not our code — so the choreography is verified by watching it.

Coverage is therefore split across two seams, neither of which touches the
animation:

- **Pure logic**, at the existing utils seam: Parcel ordering, character-to-Dot
  conversion, capping at `MAX_DOTS_PER_PARCEL`, and empty fields.
- **The accessibility and form contract**, at a jsdom + Testing Library seam
  around the login screen: the button's accessible name and busy state, fields
  becoming read-only rather than disabled, focus moving on Arrival, Enter
  submitting, and the button staying inert once a Delivery is under way.

The second seam exists because those behaviours are the ones most likely to
regress silently and were the most deliberated, but it asserts only static
attributes and focus — never stage order, position, percentage or duration.
Tests that drive the timeline under fake timers are explicitly out of bounds:
they would be testing Motion, and under jsdom (no layout, no real `rAF`) they
would be flaky.
