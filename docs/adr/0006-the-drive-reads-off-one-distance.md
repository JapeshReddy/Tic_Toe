# The Drive is one distance along the Road, and the rest reads off it

The Drive's single source of truth is how far the Van has come along the Road.
That distance is one Motion value (`drive.js` owns its geometry, the Delivery
timeline animates it leg by leg), and two things are derived from it rather than
animated separately:

- the percentage, which is the distance read back as a fraction of the Van's
  travel, capped at 100;
- the angle of the wheels, one full turn per wheel circumference of travel.

Everything else about the Van is per leg and is stated as such in `DRIVE_PHASES`:
the tilt it leans through, whether the brake light is lit, and whether the Van
is moving at all.

## Considered Options

Animating the percentage as its own Motion value alongside the Van's position
was rejected: it is two values that have to be kept in step by hand, and the
Arrival, which carries the Van on past 100%, would then need the number clamped
by a second mechanism. Spinning the wheels on a timer of their own was rejected
because they would keep turning while the Van was stopped and would turn the
wrong way through the Setback, and both of those are visible.

## Consequences

Deriving the wheels from the distance is what makes them roll backwards down the
Road during the Setback and stand still at 50 without a line of code saying so.
It also means the wheels do not turn during the roll in, which is the Road's
declarative business rather than the Drive's, and which reads correctly: the Van
is arriving and parking, not driving.

The script therefore has a leg that covers no ground — the recovery, with the
Van standing at 50% for 0.4s while the brake lets go and the engine catches.
That leg is what lets "the wheels turn and exhaust trails while the Van is
moving, and stop when it is not" hold literally while the Setback is still the
thing the engine gives up on; without a beat where the Van is still, the exhaust
would either run through the Setback or fall silent while the Van was moving.
It is not an accident and should not be removed as one.
