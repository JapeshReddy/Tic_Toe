import { useEffect, useRef } from 'react'
import { useAnimate, useMotionValue, useTransform } from 'motion/react'
import { DELIVERY_STATES } from '../utils/constants'
import {
  BRAKE_LIGHT,
  DEPARTURE_DISTANCE,
  DEPARTURE_MOTION,
  DRIVE_PHASES,
  driveTravel,
  isMoving,
  percentageAt,
  PUFF_CYCLE,
  PUFF_FADE,
  PUFF_STAGGER,
  PUFF_TIMING,
  READOUT_FADE,
  readoutText,
  vanTravelAt,
  wheelAngleFor,
} from '../utils/drive'
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
} from '../utils/loading'
import {
  CARGO_DOORS,
  DOT_FLIGHT,
  DURATIONS,
  FIELD_DIM,
  PARCEL_APPEAR,
  PARCEL_CARRY,
} from '../utils/motion'
import { CARGO_DOOR_RAISED, VAN_HEIGHT, VAN_WIDTH } from '../utils/road'

// How far a field's own opacity drops once its Parcel is aboard: the fields are
// empty now, and dimming them says so without pulling them out of the layout.
const FIELD_DIM_OPACITY = 0.45

// The Loading stage opens with the Van's roll in, which the Road animates
// declaratively. Waiting it out is the one thing the timeline cannot express as
// an animation of its own, because the movement belongs to the Van.
const wait = (seconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000)
  })

// A box in the coordinates the Loading layer draws in, from a viewport rect.
const relativeTo = (origin, element) => {
  const box = element.getBoundingClientRect()
  return {
    x: box.left - origin.left,
    y: box.top - origin.top,
    width: box.width,
    height: box.height,
  }
}

// The lane the Van is parked in is never moved, unlike the Van inside it, so
// measuring the lane gives the parked Van's box whatever the roll in is doing.
const vanRect = (lane) => ({
  x: lane.x,
  y: lane.y + (lane.height - VAN_HEIGHT) / 2,
  width: VAN_WIDTH,
  height: VAN_HEIGHT,
})

// The Delivery's timeline, driven as one awaited sequence rather than as
// reducer states or animation callbacks (ADR-0004). What it does — the order of
// the Dots and Parcels, the legs of the Drive — is decided by buildLoadingSteps
// and DRIVE_PHASES; this only carries it out.
//
// The hook owns every element it has to reach, so the login card stays
// presentational and the timeline has one home rather than one per stage. The
// Drive's fine detail — where the Van is on the Road, how far it is tilted, its
// fade, its brake light — is motion values rather than React state, because it
// changes every frame and nothing gates on it.
export function useDelivery({ delivery, parcels, onArrive }) {
  const [scope, animate] = useAnimate()
  const usernameField = useRef(null)
  const passwordField = useRef(null)
  const vanLane = useRef(null)
  const cargoDoor = useRef(null)

  const road = useRef(null)
  const distance = useMotionValue(0)
  const tilt = useMotionValue(0)
  const vanOpacity = useMotionValue(1)
  const braking = useMotionValue(0)
  const readoutOpacity = useMotionValue(1)
  // The Road's drawn width, which only the Drive can say: it is measured when
  // the Van sets off, so a card that has been resized mid-Delivery is still
  // measured as it is now.
  const travel = useRef(0)
  const wheelAngle = useTransform(distance, wheelAngleFor)
  const readout = useTransform(distance, (moved) =>
    readoutText(percentageAt(moved, travel.current)),
  )

  const drive = {
    road,
    distance,
    tilt,
    vanOpacity,
    braking,
    wheelAngle,
    readout,
    readoutOpacity,
  }

  useEffect(() => {
    if (delivery !== DELIVERY_STATES.DELIVERING) return undefined
    const layer = scope.current
    if (!layer) return undefined

    let cancelled = false
    const roadEl = road.current
    const puffs = roadEl ? [...roadEl.querySelectorAll('[data-puff]')] : []
    let engine = null

    // The exhaust runs with the Van's motion, so it stops the moment the Van
    // does. Cutting it lets the last puffs go rather than freezing one in the
    // air beside a Van that has come to a stop.
    const stopEngine = () => {
      engine?.forEach((animation) => animation.stop())
      engine = null
    }
    const setEngine = (running) => {
      if (running === Boolean(engine)) return
      stopEngine()
      if (running) {
        engine = puffs.map((puff, index) =>
          animate(puff, PUFF_CYCLE, {
            ...PUFF_TIMING,
            delay: index * PUFF_STAGGER,
          }),
        )
      } else {
        puffs.forEach((puff) => animate(puff, { opacity: 0 }, PUFF_FADE))
      }
    }

    const run = async () => {
      // Loading starts once the Van is parked: nothing is loaded into a moving
      // Van, and the Van does not move again until the Drive.
      await wait(DURATIONS.vanRoll)
      if (cancelled) return

      const origin = layer.getBoundingClientRect()
      const lane = vanLane.current
      const fields = {
        username: usernameField.current,
        password: passwordField.current,
      }
      // Without the Van there is nowhere to put the Parcels, so the Delivery is
      // cut short rather than left holding the login card hostage.
      if (!lane || !fields.username || !fields.password) {
        onArrive()
        return
      }

      const bay = cargoBay(vanRect(relativeTo(origin, lane)))
      const geometry = new Map(
        parcels.map((parcel) => {
          const field = relativeTo(origin, fields[parcel.kind])
          return [
            parcel.kind,
            { home: parcelHome(field), origins: dotOrigins(field, parcel.dots) },
          ]
        }),
      )

      const find = (selector) => layer.querySelector(selector)

      for (const step of buildLoadingSteps(parcels)) {
        if (cancelled) return
        const { home, origins } = geometry.get(step.parcel) ?? {}

        if (step.kind === STEP_KINDS.APPEAR) {
          const parcel = find(`[data-parcel="${step.parcel}"]`)
          if (!parcel) continue
          await animate(parcel, parcelAppear(home), PARCEL_APPEAR)
        } else if (step.kind === STEP_KINDS.DOT) {
          const dot = find(`[data-dot="${step.parcel}-${step.index}"]`)
          if (!dot) continue
          // Into the middle of the Parcel, where the box's own centre is: a Dot
          // that stopped at its corner would look like a near miss.
          const mouth = {
            x: home.x + PARCEL_SIZE / 2 - DOT_SIZE / 2,
            y: home.y + PARCEL_SIZE / 2 - DOT_SIZE / 2,
          }
          // Awaited one at a time: this is what keeps two Dots from ever being
          // in flight together.
          await animate(
            dot,
            { ...dotArc(origins[step.index], mouth), opacity: [0, 1, 1, 0] },
            DOT_FLIGHT,
          )
        } else if (step.kind === STEP_KINDS.CARRY) {
          const parcel = find(`[data-parcel="${step.parcel}"]`)
          if (!parcel) continue
          await animate(parcel, carryFlight(home, bay, step.parcel), PARCEL_CARRY)
        } else if (step.kind === STEP_KINDS.DOORS && cargoDoor.current) {
          // From the raised position the Van draws it in, spelled out rather
          // than left for Motion to read off an SVG group.
          await animate(
            cargoDoor.current,
            { y: [CARGO_DOOR_RAISED, 0] },
            CARGO_DOORS,
          )
        }
      }

      if (cancelled) return

      // Both fields have been emptied into the Van and the load is closed up:
      // dim them together, then pause before the Van sets off.
      for (const field of Object.values(fields)) {
        animate(field, { opacity: FIELD_DIM_OPACITY }, FIELD_DIM)
      }
      await wait(DURATIONS.loadingPause)
      if (cancelled) return

      // The Drive: the Van crosses the Road leg by leg, and the percentage it
      // reads out is only the position it has reached. The Van's tilt rides the
      // same leg as its position, so it leans back through the Setback and comes
      // upright again as the Van gathers itself at 50.
      if (!roadEl) {
        onArrive()
        return
      }
      travel.current = driveTravel(roadEl.getBoundingClientRect().width)

      for (const phase of DRIVE_PHASES) {
        if (cancelled) return
        const leg = { duration: phase.seconds, ease: phase.ease }
        animate(braking, phase.braking ? 1 : 0, BRAKE_LIGHT)
        setEngine(isMoving(phase))
        await Promise.all([
          animate(distance, vanTravelAt(phase.to, travel.current), leg),
          animate(tilt, phase.tilt, leg),
        ])
      }

      if (cancelled) return

      // Arrival: at 100% the Van carries on past the end of the Road, fading as
      // it goes, and the readout goes out with it. Nothing is left running
      // behind it.
      animate(readoutOpacity, 0, READOUT_FADE)
      await Promise.all([
        animate(distance, travel.current + DEPARTURE_DISTANCE, DEPARTURE_MOTION),
        animate(vanOpacity, 0, DEPARTURE_MOTION),
      ])
      if (cancelled) return
      stopEngine()

      onArrive()
    }

    run()

    return () => {
      cancelled = true
      stopEngine()
    }
  }, [delivery, parcels, onArrive, animate, scope])

  return { scope, usernameField, passwordField, vanLane, cargoDoor, drive }
}
