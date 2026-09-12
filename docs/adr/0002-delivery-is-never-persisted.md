# The Delivery is never persisted, and is skipped entirely under reduced motion

Sign-in validates nothing, so there is no session to remember: we store no
"signed in" or "delivery seen" flag anywhere, and the full Delivery replays from
its initial state on every login, including after signing out and back in. For
users with `prefers-reduced-motion`, the Delivery does not play in a reduced
form — it is skipped outright and the game appears immediately.

## Considered Options

Persisting completion to `localStorage` (as the theme already is) was rejected:
it would make the feature invisible on every visit after the first, and it
invites a future reader to mistake a decorative animation for real session
state. A motion-free variant for reduced-motion users — keeping the percentage
arc while dropping all movement — was rejected because the Delivery carries no
information whatsoever: nothing is validated, the percentage is fiction and the
Setback is a gag. There is nothing to miss, so making those users wait several
seconds would be pure cost.

## Consequences

Every login costs roughly six seconds. This is the feature, not a defect, and
should not be "optimised" by adding persistence. Two escape hatches exist
instead: Escape or the Skip link, which fades in after 2.5 seconds, and
reduced-motion, which is consequently the fastest route into the app.
