import { describe, expect, it } from 'vitest'
import {
  BRAKE_LIGHT,
  DEPARTURE_DISTANCE,
  DEPARTURE_MOTION,
  DRIVE_END,
  DRIVE_PHASES,
  driveTravel,
  isMoving,
  percentageAt,
  PUFF_COUNT,
  PUFF_CYCLE,
  PUFF_TIMING,
  READOUT_FADE,
  readoutText,
  secondsPerPoint,
  vanTravelAt,
  wheelAngleFor,
  WHEEL_ROLL,
} from './drive'
import { PERCENTAGE_SLOT, ROAD_PADDING, VAN_WIDTH } from './road'

// The Drive's script, which is the part of it a test can hold: the order of the
// legs, what runs on each, and the geometry of the Road it runs along. The
// movement itself is the timeline's business and is verified by eye (ADR-0005).

const leg = (key) => DRIVE_PHASES.find((phase) => phase.key === key)

describe('the Drive’s script', () => {
  it('runs the Van out to 80, sets it back to 50 and pushes on to 100', () => {
    expect(DRIVE_PHASES.map((phase) => phase.to)).toEqual([80, 50, 50, 100])
  })

  it('joins each leg to the next, so the percentage never jumps', () => {
    expect(DRIVE_PHASES[0].from).toBe(0)
    DRIVE_PHASES.forEach((phase, index) => {
      if (index > 0) expect(phase.from, phase.key).toBe(DRIVE_PHASES[index - 1].to)
    })
    expect(DRIVE_PHASES.at(-1).to).toBe(DRIVE_END)
  })

  it('gives the run out, the Setback and the push each their own feel', () => {
    // The ease is what carries "confident, then reluctant, then determined":
    // the run out arrives decelerating, the push leaves accelerating.
    expect(leg('pull-away').ease).toBe('easeOut')
    expect(leg('push').ease).toBe('easeIn')
    expect(leg('push').ease).not.toBe(leg('pull-away').ease)
  })

  it('spends clearly longer per percentage point on the Setback than on the run out', () => {
    expect(secondsPerPoint(leg('setback'))).toBeGreaterThan(
      secondsPerPoint(leg('pull-away')) * 1.5,
    )
  })

  it('covers the ground it takes back more briskly than it gives it up', () => {
    // The final push is the one leg that speeds up as it goes, so even its
    // average rate is quicker than the roll back it is recovering from.
    expect(secondsPerPoint(leg('push'))).toBeLessThan(secondsPerPoint(leg('setback')))
  })

  it('brings the brake light on for the Setback and for nothing else', () => {
    const braking = DRIVE_PHASES.filter((phase) => phase.braking)

    expect(braking.map((phase) => phase.key)).toEqual(['setback'])
    expect(BRAKE_LIGHT.duration).toBeGreaterThan(0)
  })

  it('lets the Van stand at 50 before the final push, with the brake off', () => {
    const recovery = leg('recover')

    expect(recovery.from).toBe(recovery.to)
    expect(recovery.braking).toBe(false)
    expect(isMoving(recovery)).toBe(false)
    expect(secondsPerPoint(recovery)).toBe(0)
  })

  it('drives the Van whenever it is moving, backwards and forwards alike', () => {
    // Wheels turn and the engine runs with the Van's motion, which is what
    // stops both the moment it is standing: on the setback it is rolling back,
    // on the recovery pause it is not moving at all.
    expect(DRIVE_PHASES.filter(isMoving).map((phase) => phase.key)).toEqual([
      'pull-away',
      'setback',
      'push',
    ])
  })

  it('tilts the Van back over the Setback and settles it for the recovery', () => {
    expect(leg('setback').tilt).toBeLessThan(0)
    expect(leg('recover').tilt).toBe(0)
  })

  it('never names the Setback as anything having gone wrong', () => {
    const named = DRIVE_PHASES.map((phase) => phase.key).join(' ').toLowerCase()

    for (const word of ['error', 'fail', 'glitch', 'problem', 'wrong', 'retry']) {
      expect(named, word).not.toContain(word)
    }
  })
})

describe('the Road the Drive runs along', () => {
  const width = 400

  it('stops the Van short of the percentage, so the number stays readable', () => {
    const travel = driveTravel(width)
    const vanRight = ROAD_PADDING + travel + VAN_WIDTH
    const slotLeft = width - ROAD_PADDING - PERCENTAGE_SLOT

    expect(vanRight).toBeLessThan(slotLeft)
  })

  it('leaves the Van somewhere to stop, however narrow the Road is drawn', () => {
    for (const road of [width, 320, ROAD_PADDING * 2 + PERCENTAGE_SLOT + VAN_WIDTH]) {
      expect(driveTravel(road)).toBeGreaterThanOrEqual(0)
    }
    expect(driveTravel(0)).toBe(0)
  })

  it('gives the Van more Road to cross the wider the Road is drawn', () => {
    expect(driveTravel(600)).toBeGreaterThan(driveTravel(400))
  })

  it('carries the Van past the end of the Road when it departs', () => {
    expect(DEPARTURE_DISTANCE).toBeGreaterThanOrEqual(PERCENTAGE_SLOT + ROAD_PADDING)
    expect(DEPARTURE_MOTION.duration).toBeGreaterThan(0)
  })

  it('gets the number out of the way before the Van crosses the slot it sits in', () => {
    expect(READOUT_FADE.duration).toBeLessThan(DEPARTURE_MOTION.duration)
  })
})

describe('reading a position on the Road as a percentage', () => {
  const travel = driveTravel(400)

  it('puts 0% at the Van’s parked spot and 100% at the far end of its travel', () => {
    expect(vanTravelAt(0, travel)).toBe(0)
    expect(vanTravelAt(DRIVE_END, travel)).toBe(travel)
  })

  it('reads a position back as the percentage that put it there', () => {
    for (const percent of [0, 50, 80, 100]) {
      expect(percentageAt(vanTravelAt(percent, travel), travel)).toBeCloseTo(percent)
    }
  })

  it('holds the readout at 100 while the Van carries on past the Road’s end', () => {
    expect(percentageAt(travel + DEPARTURE_DISTANCE, travel)).toBe(DRIVE_END)
  })

  it('never reads out more or less than the journey’s own ends', () => {
    expect(percentageAt(-40, travel)).toBe(0)
    expect(percentageAt(0, 0)).toBe(0)
  })

  it('reads out whole numbers, with the sign', () => {
    expect(readoutText(0)).toBe('0%')
    expect(readoutText(79.6)).toBe('80%')
    expect(readoutText(DRIVE_END)).toBe('100%')
  })
})

describe('the Van’s wheels', () => {
  it('turn with the Road rather than with the clock', () => {
    expect(wheelAngleFor(0)).toBe(0)
    expect(Math.abs(wheelAngleFor(WHEEL_ROLL))).toBeCloseTo(360)
    expect(Math.abs(wheelAngleFor(WHEEL_ROLL * 2))).toBeCloseTo(720)
  })

  it('roll the other way when the Van rolls back down the Road', () => {
    expect(Math.sign(wheelAngleFor(-40))).toBe(-Math.sign(wheelAngleFor(40)))
  })

  it('are sized by the Van they carry, so a turn is a fraction of its length', () => {
    expect(WHEEL_ROLL).toBeGreaterThan(0)
    expect(WHEEL_ROLL).toBeLessThan(VAN_WIDTH)
  })
})

describe('the Van’s exhaust', () => {
  it('lets each puff go in its turn, rather than all at once', () => {
    const window = PUFF_TIMING.times.at(-1)

    expect(PUFF_TIMING.times[0]).toBe(0)
    expect(window).toBeLessThanOrEqual(1 / PUFF_COUNT)
  })

  it('keeps puffing for as long as the Van is moving', () => {
    expect(PUFF_TIMING.repeat).toBe(Infinity)
  })

  it('lets a puff go rather than switching it off, so nothing is left hanging', () => {
    expect(PUFF_CYCLE.opacity[0]).toBe(0)
    expect(PUFF_CYCLE.opacity.at(-1)).toBe(0)
    expect(PUFF_CYCLE.x.at(-1)).toBeLessThan(PUFF_CYCLE.x[0])
  })
})
