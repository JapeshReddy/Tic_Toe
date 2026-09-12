# Behaviour is covered at the pure seam, because no DOM environment can run here

ADR-0004 planned a jsdom + Testing Library seam for the login screen's
accessibility contract. It has not been added: neither candidate DOM
environment can be loaded inside a test worker on this workspace.

Measured on the agent sandbox, whose workspace is a 9p mount:

- `node -e "import('jsdom')"` had not returned after six minutes, blocked in
  `p9_client_rpc` and reading the mount at roughly a kilobyte per second.
- `node -e "import('happy-dom')"` returned in 64 seconds cold and 63 seconds
  warm, so it is not a caching artefact.

Vitest's worker start timeout is a hardcoded 60 seconds. A worker that has to
load a DOM environment before it can answer therefore dies before it runs a
single test: a DOM test written against the phase gate failed with `Timeout
waiting for worker to respond` and never reached an assertion.

The same constraint has already shaped a dependency once: `@mui/icons-material`
was replaced with inline icons because its 31,858 files made a cold `npm ci`
unworkable in the sandbox (see `src/components/icons.jsx`).

## Considered Options

Adding jsdom and Testing Library anyway was rejected: the suite is run on every
agent iteration, and a seam that cannot reliably start is worse than no seam —
it turns a green run into a coin flip. Reaching for the DOM only when a test
seems to want one was rejected as the default, because it makes the test's cost
invisible at the point of writing it. Skipping the accessibility contract
entirely was rejected; it is deferred, not dropped.

## Consequences

Behaviour is covered where it can be expressed as a pure function: the game's
transitions live in `src/utils/gameReducer.js` and are tested there without a
DOM, alongside the existing game-logic, AI and Delivery utilities. The phase
gate, the two confirmation flows and the board reset are pinned by that suite.

Behaviour that exists only in a rendered DOM — an accessible name surviving a
label change, a busy state, read-only fields, focus moving at Arrival — has no
automated coverage while this constraint holds, and is verified by hand. That
is a real gap against ADR-0004, and the first thing to close if the workspace
stops being the bottleneck: add the seam, then delete this ADR.

The pattern to reach for meanwhile is unchanged and worth stating: when a
behaviour needs a test and a DOM is out of reach, push the decision into a pure
function with an ordinary signature and test that, rather than rendering it.
