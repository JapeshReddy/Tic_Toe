# Login page with a delivery van loading animation

## What it is

A login screen where signing in is shown as a small delivery job. The person types a username and a password, presses the login button, and the button itself turns into a road: a delivery van pulls up, the typed details are loaded into it as little parcels, and the van drives across the button while a percentage counts up. When it finishes, the login screen gives way to the next page.

Nothing the person types is ever checked. Any username and password will get them through, including leaving both boxes empty. The animation is the whole point — it is a demo of the idea, not a real sign-in.

## What the screen looks like

A single white card in the middle of a soft grey-blue page. At the top, a small parcel icon next to the brand name, Kartel, with a thin line beneath it. Then a heading, one short line explaining that nothing gets checked, and the two input boxes: Username and Password. Below them sits the login button, full width and deep green. A small note under the button repeats that any details will work.

The look is flat, plain and restrained — quiet greys, white and green, with warm cardboard brown reserved for the parcels. The van is the only lively thing on the screen, and everything else stays out of its way.

## What happens when the button is pressed

**1. The button clears.** The words "Log in" fade away, leaving the button empty. The two input boxes lock so nothing can be changed mid-journey.

**2. The van arrives.** A small white van with "Kartel" written on its side rolls in from the left edge of the button and parks at the start. It stays visible from this moment right through to the end.

**3. The details are loaded.** Every letter of what was typed lifts out of its box as a small dot and arcs over into the back of the van — brown dots for the username, green dots for the password. They go one at a time, in order, username first, and the van gives a little bounce as each one lands. Long passwords are shortened to a handful of dots so the loading doesn't drag on. If both boxes were left empty, a couple of dots are sent anyway so the sequence still reads properly.

**4. The doors shut.** Both input boxes dim now that they are empty, a percentage appears at the right-hand end of the button, and there is a short pause before the van sets off.

**5. The drive.** The van pulls away and travels along the inside of the button, wheels turning, little puffs of exhaust trailing behind it. The percentage climbs as it goes.

At 80% something goes wrong with the delivery. The van slows, its brake light turns red, it tilts back slightly and rolls backwards down to 50% — noticeably slower than the run out, so it reads as a setback rather than a glitch.

Then it recovers. The brake light goes out, the exhaust starts up again, and the van pushes forward from 50% all the way to 100%, picking up speed as it goes.

**6. Arrival.** At 100% the van carries on past the end and fades out. The login card is replaced by the game page.



## Details worth getting right

- The percentage sits still at the right-hand end of the button. The van's journey stops just short of it, so the two never overlap and the number is readable the whole way.
- The van never leaves the button. All the movement, the exhaust, the parcels landing — it all happens within that one strip.
- Pressing the button twice quickly must not start two journeys.
- It should look right on a narrow phone screen as well as on a desktop.
- The drive out, the roll back and the final push should each feel distinct: confident, then reluctant, then determined.

## How to know it's finished

- Pressing login with both boxes empty still runs the whole animation and reaches the next page.
- The dots load one at a time, username before password, never all at once.
- The percentage visibly goes up to 80, back down to 50, then up to 100.
- The van is on screen continuously from the moment it arrives until it fades at the end.