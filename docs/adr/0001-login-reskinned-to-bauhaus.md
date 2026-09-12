# Login re-skinned from login.md's palette to Bauhaus

`login.md` specifies the login screen in a completely different visual language
from the app it attaches to: a "Kartel" brand block, a deep green button, warm
cardboard brown parcels, a soft grey-blue page and a "flat, plain and
restrained" mood. The game is De Stijl/Bauhaus — red, blue, a single reserved
yellow, hard black rules and `borderRadius: 0` throughout. We kept the
choreography from `login.md` exactly and re-skinned the palette, typography and
brand to match the game.

## Considered Options

Implementing `login.md` literally was rejected because the login screen would
hard-cut to a game with no colour, type or shape in common — it would read as
two applications stapled together. Keeping "Kartel" as the product name was
rejected for the same reason; the name survives as the van's livery only, which
is both coherent and funnier, since you notice it mid-animation rather than
being introduced to a delivery firm you have no dealings with.

## Consequences

Anyone comparing `login.md` to the implementation will find the colours, brand
and copy all differ. This is deliberate, not drift: the doc is the source of
truth for *what happens*, and the theme is the source of truth for *what it
looks like*. Username Dots and Parcels took the X colour and password ones the
O colour, so the Delivery quietly teaches the board's colour code before the
board appears.
