import { SNAP_EASE } from './motion'
import {
  PERCENTAGE_SLOT,
  ROAD_PADDING,
  VAN_VIEWBOX,
  VAN_WIDTH,
  WHEEL_RADIUS,
} from './road'

// The Drive's script and its geometry: the legs of the Van's journey along the
// Road, what runs on each of them, and where the Van is on the Road at any
// point. Pure and DOM-free, so the parts that can be stated — the order of the
// legs, their speeds, the braking, the Van's clearance from the percentage —
// are covered by tests (ADR-0005); the movement itself is the timeline's
// business and is verified by eye.

export const DRIVE_END = 100

// How far short of the percentage the Van comes to rest at 100%, so the number
// stays readable and the two never overlap.
const PERCENTAGE_CLEARANCE = 12

// The Van's journey, leg by leg, in the order it drives them:
//
// - the run out, which arrives decelerating and confident;
// - the Setback, which gives back thirty points at a noticeably slower rate per
//   point than the run out took them, with the brake light on and the Van tilted
//   back onto its tail;
// - the recovery, standing still at 50 while the brake lets go and the engine
//   catches — which is what stops the wheels and the exhaust with it;
// - the push, which gains speed the whole way to 100.
//
// The Setback is choreography, not a fault: it is never called an error, a
// failure or a glitch, here or in anything that reads this.
//
// The easings are Motion's own names rather than the house snap, because these
// three legs have to feel different from each other rather than consistent.
export const DRIVE_PHASES = [
  {
    key: 'pull-away',
    from: 0,
    to: 80,
    seconds: 2,
    ease: 'easeOut',
    braking: false,
    tilt: 0,
  },
  {
    key: 'setback',
    from: 80,
    to: 50,
    seconds: 1.6,
    ease: 'easeInOut',
    braking: true,
    tilt: -3,
  },
  {
    key: 'recover',
    from: 50,
    to: 50,
    seconds: 0.4,
    ease: 'easeOut',
    braking: false,
    tilt: 0,
  },
  {
    key: 'push',
    from: 50,
    to: 100,
    seconds: 1.7,
    ease: 'easeIn',
    braking: false,
    tilt: 0,
  },
]

// Whether a leg moves the Van at all. Everything that runs with the Van's
// motion — the wheels, the exhaust — runs off this, so none of it runs while the
// Van is standing.
export function isMoving(phase) {
  return phase.to !== phase.from
}

// How long a leg spends per percentage point. A leg with no ground to cover has
// no rate: the Van is standing.
export function secondsPerPoint(phase) {
  const span = Math.abs(phase.to - phase.from)
  return span === 0 ? 0 : phase.seconds / span
}

// The brake light coming on and going out: a snap, not an animation, because it
// is a switch on the Van rather than something the Van does.
export const BRAKE_LIGHT = { duration: 0.12, ease: SNAP_EASE }

// How far the Van travels between 0% and 100%, given the width the Road has
// drawn the login button at. The Van never reaches the percentage: what is left
// over is the slot the number sits in, and a clearance beside it.
export function driveTravel(roadWidth) {
  return Math.max(
    0,
    roadWidth -
      ROAD_PADDING * 2 -
      PERCENTAGE_SLOT -
      VAN_WIDTH -
      PERCENTAGE_CLEARANCE,
  )
}

// Where the Van is, in the Road's own coordinates, at a given percentage.
export function vanTravelAt(percent, travel) {
  return (percent / 100) * travel
}

// A position on the Road read back as a percentage: the Van's position is the
// journey and the number is only its readout. Capped at 100, because the
// departure carries the Van on past the end of the Road with nothing left to
// count.
export function percentageAt(distance, travel) {
  if (travel <= 0) return 0
  return Math.min(DRIVE_END, Math.max(0, (distance / travel) * DRIVE_END))
}

// The readout, as the percentage slot draws it.
export function readoutText(percentage) {
  return `${Math.round(percentage)}%`
}

// One full turn of a wheel, in the Road's pixels. The wheels turn with the
// distance the Van covers rather than with the clock, which is what keeps them
// rolling while it rolls back down the Road and still the moment it stands.
export const WHEEL_ROLL = 2 * Math.PI * WHEEL_RADIUS * (VAN_WIDTH / VAN_VIEWBOX.width)

export function wheelAngleFor(distance) {
  // Parked is parked: a Van that has not moved reads as no rotation at all,
  // rather than as the negative zero the arithmetic would hand back.
  if (distance === 0) return 0
  return -(distance / WHEEL_ROLL) * 360
}

// Arrival: the Van carries on past the end of the Road and fades as it goes.
// Far enough to clear everything the Road draws at that end, so the Van is not
// sitting half on the surface when the game takes over. It leaves still picking
// up speed, which is where the push left it.
export const DEPARTURE_DISTANCE = VAN_WIDTH + PERCENTAGE_SLOT + ROAD_PADDING
export const DEPARTURE_MOTION = { duration: 0.6, ease: 'easeIn' }

// The readout going out as the Van leaves. Quicker than the departure itself,
// so the number has gone before the Van reaches the slot it sits in.
export const READOUT_FADE = { duration: 0.2, ease: SNAP_EASE }

// The exhaust: what the Van leaves behind while it is moving. Three puffs share
// a cycle, each let go in its turn and drifting back until it fades, so the
// trail reads as one puff after another rather than as a cloud.
export const PUFF_COUNT = 3
export const PUFF_SIZE = 9
export const PUFF_CYCLE_SECONDS = 0.9

// The share of the cycle one puff is visible for. Short enough that no two
// puffs are in the air at once.
const PUFF_WINDOW = 0.3

export const PUFF_CYCLE = {
  opacity: [0, 0.45, 0],
  x: [0, -7, -14],
  y: [0, -3, -7],
  scale: [0.5, 1, 1.5],
}

export const PUFF_TIMING = {
  duration: PUFF_CYCLE_SECONDS,
  times: [0, PUFF_WINDOW / 2, PUFF_WINDOW],
  repeat: Infinity,
  ease: 'linear',
}

export const PUFF_STAGGER = PUFF_CYCLE_SECONDS / PUFF_COUNT

// Cutting the engine: a puff stopped mid-flight would be left hanging beside a
// Van that has stopped, so the last of them are let go rather than frozen.
export const PUFF_FADE = { duration: 0.2, ease: 'easeOut' }
