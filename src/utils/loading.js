import { CARGO_OPENING, CARGO_SLOTS, PARCEL_STOW_SIZE, VAN_VIEWBOX } from './road'

// The Loading stage's script and its geometry: which Dot moves when, and where
// each Dot and Parcel goes. Pure and DOM-free, so the ordering rules can be
// covered by tests (ADR-0005) — the movement itself is the timeline's business
// and is verified by eye.

export const STEP_KINDS = {
  APPEAR: 'appear',
  DOT: 'dot',
  CARRY: 'carry',
  DOORS: 'doors',
}

// The Parcel as drawn on the card: a small box parked at the trailing end of
// its own field while it is filled, before it is carried aboard.
export const PARCEL_SIZE = 34

// How far the parked Parcel is held off the field's trailing edge.
export const PARCEL_INSET = 8

export const DOT_SIZE = 9

// How far a Dot's arc rises above the straight line from its field to its
// Parcel, so the flight reads as a throw rather than a slide.
export const DOT_LIFT = 44

// How small a Parcel is squashed to as it passes through the cargo opening:
// small enough to look like it is going in through the doors rather than over
// the Van's side.
const CARRY_SCALE = 0.5

// How far a Parcel settles as it appears: a short drop into place, so it lands
// beside its field rather than simply switching on.
const PARCEL_APPEAR_DROP = 10
const PARCEL_APPEAR_SCALE = 0.7

// The Loading stage, step by step, in the order it happens: each Parcel appears
// beside its field, takes its Dots one at a time, and is carried aboard, the
// Username Parcel first; then the cargo doors shut.
//
// The empty case is deliberately not special. A Parcel with no Dots still gets
// its Appear and Carry, because an empty field's Parcel is carried too — that
// is what keeps the sequence reading the same whatever was typed.
export function buildLoadingSteps(parcels) {
  const steps = []
  for (const parcel of parcels) {
    steps.push({ kind: STEP_KINDS.APPEAR, parcel: parcel.kind })
    for (let index = 0; index < parcel.dots; index += 1) {
      steps.push({ kind: STEP_KINDS.DOT, parcel: parcel.kind, index })
    }
    steps.push({ kind: STEP_KINDS.CARRY, parcel: parcel.kind })
  }
  steps.push({ kind: STEP_KINDS.DOORS })
  return steps
}

// Where a field's Dots set off from: spread across the field at its vertical
// centre, so they read as the characters leaving it in the order they were
// typed. Top-left corners, because that is what a Dot's transform positions.
export function dotOrigins(field, count) {
  const step = field.width / (count + 1)
  return Array.from({ length: count }, (_, index) => ({
    x: field.x + step * (index + 1) - DOT_SIZE / 2,
    y: field.y + field.height / 2 - DOT_SIZE / 2,
  }))
}

// Where a Parcel parks while it is filled: at the trailing end of its own
// field, so it sits with the field it is emptying, and inside the field's width
// so it cannot overhang the card on a narrow screen.
export function parcelHome(field) {
  return {
    x: field.x + field.width - PARCEL_SIZE - PARCEL_INSET,
    y: field.y + (field.height - PARCEL_SIZE) / 2,
  }
}

// A Parcel arriving at its field, as Motion keyframes. Every value is a
// keyframe rather than a lone destination on purpose: Motion reads a lone
// destination's starting point off the element, and there is nothing on a
// Parcel that has never been drawn yet to read, so the settling drop is also
// what tells Motion where the Parcel begins.
export function parcelAppear(home) {
  return {
    x: [home.x + PARCEL_APPEAR_DROP, home.x],
    y: [home.y - PARCEL_APPEAR_DROP, home.y],
    opacity: [0, 1],
    scale: [PARCEL_APPEAR_SCALE, 1],
  }
}

// A Dot's flight, as Motion keyframes: x runs straight from the field to the
// Parcel while y rises to an apex and comes back down, so the Dot travels on a
// visible arc rather than straight through whatever lies between the two.
export function dotArc(from, to) {
  return {
    x: [from.x, to.x],
    y: [from.y, Math.min(from.y, to.y) - DOT_LIFT, to.y],
  }
}

// The Van's cargo bay on the page, from the rect the Road's Van lane reports.
// The Van is drawn in its own viewBox, so the bay, the opening a Parcel passes
// through and the size it shrinks to all scale with however wide the Road has
// drawn it.
export function cargoBay(van) {
  const scale = van.width / VAN_VIEWBOX.width
  const at = (point) => ({
    x: van.x + point.x * scale,
    y: van.y + point.y * scale,
  })

  return {
    mouth: at({
      x: CARGO_OPENING.x + CARGO_OPENING.width / 2,
      y: CARGO_OPENING.y + CARGO_OPENING.height / 2,
    }),
    slots: Object.fromEntries(
      Object.entries(CARGO_SLOTS).map(([kind, slot]) => [kind, at(slot)]),
    ),
    stowScale: (PARCEL_STOW_SIZE * scale) / PARCEL_SIZE,
  }
}

// A Parcel's journey into the Van, as Motion keyframes: down to the cargo
// opening, in through it, and up into its own slot — shrinking as it goes, so
// it reads as being carried aboard rather than flown over the Van's side.
export function carryFlight(home, bay, kind) {
  const slot = bay.slots[kind]
  // The Parcel is already squashed to CARRY_SCALE when it reaches the opening,
  // and it scales about its top-left corner, so its centre is half of that
  // smaller size in from where its transform puts it.
  const offset = (PARCEL_SIZE * CARRY_SCALE) / 2
  const mouthX = bay.mouth.x - offset
  const mouthY = bay.mouth.y - offset

  return {
    x: [home.x, mouthX, slot.x],
    y: [home.y, mouthY, slot.y],
    scale: [1, CARRY_SCALE, bay.stowScale],
  }
}
