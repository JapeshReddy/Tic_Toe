# Tic·Tac·Toe

A Tic-Tac-Toe game with a deliberately theatrical sign-in screen. Sign-in
checks nothing — the animation is the feature.

## Language

### Delivery

**Delivery**:
The whole sequence from pressing the login button to the game page appearing.
_Avoid_: journey, job, login sequence, auth flow

**Kartel**:
The delivery firm whose van performs the Delivery. Kartel is the van's livery
only — it is not the product, which is Tic·Tac·Toe.
_Avoid_: the brand, the company

**Van**:
The single Kartel vehicle that carries both Parcels along the Road. There is
never more than one.
_Avoid_: truck, lorry, vehicle

**Parcel**:
A container holding everything typed into one field. There are always exactly
two — a Username Parcel and a Password Parcel — whatever was typed, including
nothing.
_Avoid_: box, dot, package

**Username Parcel**:
The Parcel holding the username. It is filled and carried into the Van before
the Password Parcel appears.
_Avoid_: brown parcel, user box

**Password Parcel**:
The Parcel holding the password. It is filled and carried into the Van only
once the Username Parcel is aboard.
_Avoid_: green parcel, secret box

**Dot**:
The visual representation of a single typed character travelling from its field
into its Parcel. Purely visual — a Dot has no identity beyond "one character
went in", and the number shown is capped independently of what was typed.
_Avoid_: bubble, parcel, character, keystroke

**Road**:
The strip inside the login button along which the Van travels. It is the
button's interior, reinterpreted as a surface. The Van never leaves it.
_Avoid_: track, bar, progress bar, lane

**Loading**:
The stage in which each Parcel appears beside its field, receives its Dots one
at a time, and is then carried into the Van. Runs once per Parcel, username
first.
_Avoid_: filling, packing, uploading

**Drive**:
The stage in which the Van travels the Road and the percentage climbs. Refers
only to the movement, never to the Delivery as a whole.
_Avoid_: trip, run, progress

**Setback**:
The scripted reversal partway along the Drive, where the Van slows, tilts and
rolls backwards before recovering. It is a piece of choreography, not a fault:
nothing has gone wrong and nothing is being reported.
_Avoid_: failure, error, glitch, retry, rejection

**Arrival**:
The final stage, in which the Van passes the end of the Road, fades, and the
game page replaces the login card.
_Avoid_: completion, success, done
