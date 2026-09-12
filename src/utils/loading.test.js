import { describe, expect, it } from 'vitest'
import { buildParcels, DOT_CAP } from './delivery'
import {
  buildLoadingSteps,
  cargoBay,
  carryFlight,
  DOT_SIZE,
  dotArc,
  dotOrigins,
  PARCEL_SIZE,
  parcelAppear,
  parcelHome,
  STEP_KINDS,
} from './loading'
import { CARGO_OPENING, CARGO_SLOTS, PARCEL_STOW_SIZE, VAN_VIEWBOX } from './road'

// The Loading stage's script, which is the one part of it a test can hold: the
// movement itself is the timeline's business and is verified by eye (ADR-0005).

// A stowed Parcel, as a fraction of the Van it is stowed in.
const STOW_FRACTION = PARCEL_STOW_SIZE / VAN_VIEWBOX.width

const stepsFor = (username, password) =>
  buildLoadingSteps(buildParcels(username, password))

const indexOfFirst = (steps, match) =>
  steps.findIndex((step) => step.kind === match.kind && step.parcel === match.parcel)

describe('the Loading stage script', () => {
  it('appears, fills and carries each Parcel in turn, then shuts the doors', () => {
    const steps = stepsFor('ana', 'pw')
    expect(steps.map((step) => step.kind)).toEqual([
      STEP_KINDS.APPEAR,
      STEP_KINDS.DOT,
      STEP_KINDS.DOT,
      STEP_KINDS.DOT,
      STEP_KINDS.CARRY,
      STEP_KINDS.APPEAR,
      STEP_KINDS.DOT,
      STEP_KINDS.DOT,
      STEP_KINDS.CARRY,
      STEP_KINDS.DOORS,
    ])
  })

  it('takes the Username Parcel aboard before the Password Parcel appears', () => {
    const steps = stepsFor('ana', 'pw12')
    const usernameAboard = indexOfFirst(steps, {
      kind: STEP_KINDS.CARRY,
      parcel: 'username',
    })
    const passwordAppears = indexOfFirst(steps, {
      kind: STEP_KINDS.APPEAR,
      parcel: 'password',
    })

    expect(usernameAboard).toBeGreaterThan(-1)
    expect(passwordAppears).toBeGreaterThan(usernameAboard)
  })

  it('moves the Dots one at a time, in order, and never two together', () => {
    const steps = stepsFor('ana', 'pw12').filter(
      (step) => step.kind === STEP_KINDS.DOT,
    )
    const username = steps.filter((step) => step.parcel === 'username')
    const password = steps.filter((step) => step.parcel === 'password')

    // One Dot step per index, in ascending order, with no repeats: a Dot cannot
    // overtake another, and two can never be in flight at once.
    expect(username.map((step) => step.index)).toEqual([0, 1, 2])
    expect(password.map((step) => step.index)).toEqual([0, 1, 2, 3])
  })

  it('lands every Username Dot before that Parcel is carried aboard', () => {
    const steps = stepsFor('a'.repeat(12), 'b'.repeat(20))
    const carried = indexOfFirst(steps, {
      kind: STEP_KINDS.CARRY,
      parcel: 'username',
    })

    const dotsAfterCarry = steps
      .slice(0, carried)
      .filter((step) => step.kind === STEP_KINDS.DOT)

    expect(dotsAfterCarry).toHaveLength(DOT_CAP)
    expect(
      steps.slice(carried).some(
        (step) => step.kind === STEP_KINDS.DOT && step.parcel === 'username',
      ),
    ).toBe(false)
  })

  it('counts the Dots from the Parcel construction, cap included', () => {
    const steps = stepsFor('a'.repeat(12), 'pw')
    const dots = steps.filter((step) => step.kind === STEP_KINDS.DOT)

    expect(dots.filter((step) => step.parcel === 'username')).toHaveLength(5)
    expect(dots.filter((step) => step.parcel === 'password')).toHaveLength(2)
  })

  it('carries an empty field’s Parcel too, so the sequence still reads', () => {
    const steps = stepsFor('', '')
    expect(steps.filter((step) => step.kind === STEP_KINDS.DOT)).toHaveLength(0)
    expect(steps.filter((step) => step.kind === STEP_KINDS.CARRY)).toHaveLength(2)
  })
})

describe('a Dot’s flight', () => {
  const from = { x: 20, y: 300 }
  const to = { x: 180, y: 300 }
  const arc = dotArc(from, to)

  it('runs straight from the field to the Parcel in x', () => {
    expect(arc.x).toEqual([from.x, to.x])
  })

  it('starts at the field and ends at the Parcel in y', () => {
    expect(arc.y[0]).toBe(from.y)
    expect(arc.y[arc.y.length - 1]).toBe(to.y)
  })

  it('rises above both ends in between, so the Dot travels on an arc', () => {
    const apex = Math.min(...arc.y)
    expect(apex).toBeLessThan(Math.min(from.y, to.y))
  })

  it('arcs even when the Parcel is below the field', () => {
    const falling = dotArc({ x: 0, y: 0 }, { x: 100, y: 260 })
    expect(Math.min(...falling.y)).toBeLessThan(0)
  })
})

describe('where a field’s Dots set off from', () => {
  const field = { x: 40, y: 200, width: 260, height: 56 }
  const origins = dotOrigins(field, 4)

  it('gives one origin per Dot', () => {
    expect(origins).toHaveLength(4)
  })

  it('spreads them left to right across the field', () => {
    const xs = origins.map((origin) => origin.x)
    expect([...xs].sort((a, b) => a - b)).toEqual(xs)
    expect(new Set(xs).size).toBe(xs.length)
  })

  it('keeps every Dot inside the field it leaves', () => {
    for (const origin of origins) {
      expect(origin.x).toBeGreaterThanOrEqual(field.x)
      expect(origin.x + DOT_SIZE).toBeLessThanOrEqual(field.x + field.width)
      expect(origin.y).toBeGreaterThanOrEqual(field.y)
      expect(origin.y + DOT_SIZE).toBeLessThanOrEqual(field.y + field.height)
    }
  })

  it('has nowhere to spread no Dots and invents none', () => {
    expect(dotOrigins(field, 0)).toEqual([])
  })
})

describe('where a Parcel parks while it is filled', () => {
  const field = { x: 40, y: 200, width: 260, height: 56 }
  const home = parcelHome(field)

  it('sits beside its own field rather than floating in the card', () => {
    expect(home.y).toBeGreaterThanOrEqual(field.y)
    expect(home.y + PARCEL_SIZE).toBeLessThanOrEqual(field.y + field.height)
  })

  it('stays inside the field’s own width, so nothing overhangs the card', () => {
    expect(home.x).toBeGreaterThanOrEqual(field.x)
    expect(home.x + PARCEL_SIZE).toBeLessThanOrEqual(field.x + field.width)
  })
})

describe('a Parcel arriving at its field', () => {
  const home = { x: 240, y: 210 }
  const appear = parcelAppear(home)

  it('settles exactly where the Parcel is parked beside its field', () => {
    expect(appear.x.at(-1)).toBe(home.x)
    expect(appear.y.at(-1)).toBe(home.y)
  })

  it('gives every property a starting keyframe, so Motion reads none off the DOM', () => {
    // A lone destination would send Motion looking for a value the Parcel does
    // not have yet, since nothing has drawn it.
    for (const [property, keyframes] of Object.entries(appear)) {
      expect(keyframes, property).toHaveLength(2)
      expect(keyframes[0], property).not.toBe(keyframes[1])
    }
  })

  it('starts out of sight and below full size', () => {
    expect(appear.opacity[0]).toBe(0)
    expect(appear.opacity.at(-1)).toBe(1)
    expect(appear.scale[0]).toBeLessThan(appear.scale.at(-1))
  })
})

describe('the Van’s cargo bay', () => {
  // The Van as the Road draws it: VAN_WIDTH wide, and 2:1 with its viewBox.
  const van = { x: 100, y: 400, width: 84, height: 42 }
  const bay = cargoBay(van)
  const scale = van.width / VAN_VIEWBOX.width

  it('puts each Parcel’s slot where the Van’s own coordinates say', () => {
    expect(bay.slots.username).toEqual({
      x: van.x + CARGO_SLOTS.username.x * scale,
      y: van.y + CARGO_SLOTS.username.y * scale,
    })
    expect(bay.slots.password.x).toBeGreaterThan(bay.slots.username.x)
  })

  it('scales the slots with the Van, since the Road decides how big it is', () => {
    const doubled = cargoBay({ ...van, width: van.width * 2, height: van.height * 2 })

    expect(doubled.slots.username.y - van.y).toBeCloseTo(
      (bay.slots.username.y - van.y) * 2,
    )
    // A stowed Parcel is a fixed fraction of the Van, so however big the Road
    // draws it, the two grow together and the Parcel never outgrows its bay.
    expect(doubled.stowScale * PARCEL_SIZE).toBeCloseTo(van.width * 2 * STOW_FRACTION)
    expect(bay.stowScale * PARCEL_SIZE).toBeCloseTo(van.width * STOW_FRACTION)
  })

  it('lands a stowed Parcel inside the cargo bay, not over the livery', () => {
    expect(bay.stowScale).toBeLessThan(1)
    expect(PARCEL_STOW_SIZE * scale).toBeLessThan(PARCEL_SIZE)
  })

  it('opens at the Van’s rear, so a Parcel is carried in rather than over the side', () => {
    const mouth = bay.mouth
    const rear = van.x + CARGO_OPENING.x * scale
    expect(mouth.x).toBeGreaterThan(rear)
    expect(mouth.x).toBeLessThan(bay.slots.username.x)
  })
})

describe('a Parcel’s journey into the Van', () => {
  const van = { x: 100, y: 400, width: 84, height: 42 }
  const bay = cargoBay(van)
  const home = { x: 240, y: 210 }
  const flight = carryFlight(home, bay, 'username')

  it('starts wherever the Parcel was parked', () => {
    expect(flight.x[0]).toBe(home.x)
    expect(flight.y[0]).toBe(home.y)
  })

  it('ends in the Parcel’s slot inside the Van', () => {
    expect(flight.x.at(-1)).toBe(bay.slots.username.x)
    expect(flight.y.at(-1)).toBe(bay.slots.username.y)
  })

  it('shrinks to the stowed size as it goes', () => {
    expect(flight.scale[0]).toBe(1)
    expect(flight.scale.at(-1)).toBe(bay.stowScale)
    expect(Math.min(...flight.scale.slice(1))).toBeLessThan(1)
  })

  it('passes through the cargo opening on the way', () => {
    expect(flight.x).toHaveLength(3)
    expect(flight.x[1]).toBeLessThan(bay.slots.username.x)
    expect(flight.y[1]).toBeGreaterThan(flight.y.at(-1))
  })

  it('sends the two Parcels to their own slots', () => {
    const password = carryFlight(home, bay, 'password')
    expect(password.x.at(-1)).toBe(bay.slots.password.x)
    expect(password.x.at(-1)).not.toBe(flight.x.at(-1))
  })
})
