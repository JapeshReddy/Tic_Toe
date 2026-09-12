// Shared motion tokens. The Bauhaus identity is hard-edged and deliberate, so
// everything here is a fast, decisive ease — no springy overshoot, no bounce.
// Durations are in seconds (Motion's unit), kept short enough that play never
// waits on an animation.

// The house easing curve, matched across marks, the win bar and status changes.
export const SNAP_EASE = [0.2, 0.8, 0.2, 1]

export const DURATIONS = {
  mark: 0.22,
  winBar: 0.32,
  status: 0.18,
  historyItem: 0.16,
  // The Van's roll in from off the Road: long enough to read as a vehicle
  // arriving under its own power, short enough that nobody waits on it.
  vanRoll: 0.6,
  // The Loading stage. Slower than everything above on purpose: someone
  // watching has to be able to follow which Dot is moving and where it lands,
  // and Loading is the whole point of the Delivery rather than a wait for it.
  dotFlight: 0.36,
  parcelAppear: 0.2,
  parcelCarry: 0.6,
  cargoDoors: 0.45,
  fieldDim: 0.3,
  loadingPause: 0.35,
  // How long a Delivery runs before a way out of it exists. Late enough that a
  // first-time visitor has the Van to watch before an exit appears beside it,
  // early enough that nobody is held by the rest of the choreography.
  skipControl: 2,
}

export const SNAP = { duration: DURATIONS.mark, ease: SNAP_EASE }
export const WIN_BAR = { duration: DURATIONS.winBar, ease: SNAP_EASE }
export const STATUS = { duration: DURATIONS.status, ease: SNAP_EASE }
export const HISTORY_ITEM = { duration: DURATIONS.historyItem, ease: SNAP_EASE }
export const VAN_ROLL = { duration: DURATIONS.vanRoll, ease: SNAP_EASE }
export const PARCEL_APPEAR = { duration: DURATIONS.parcelAppear, ease: SNAP_EASE }
export const PARCEL_CARRY = { duration: DURATIONS.parcelCarry, ease: SNAP_EASE }
export const CARGO_DOORS = { duration: DURATIONS.cargoDoors, ease: SNAP_EASE }
export const FIELD_DIM = { duration: DURATIONS.fieldDim, ease: SNAP_EASE }
// A Dot's arc rises and falls, so it needs an ease that moves at both ends
// rather than the house snap, which would slam it into the Parcel.
export const DOT_FLIGHT = { duration: DURATIONS.dotFlight, ease: 'easeInOut' }

// A mark is stamped onto the board: it arrives rotated and undersized, then
// snaps square. X and O share the motion so the board reads consistently.
export const MARK_VARIANTS = {
  hidden: { opacity: 0, scale: 0.45, rotate: -25 },
  visible: { opacity: 1, scale: 1, rotate: 0 },
}
