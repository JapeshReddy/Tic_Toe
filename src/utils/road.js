import { PARCEL_KINDS } from './delivery'

// The Road's geometry and its fixed palette. The Road is the login button's
// interior, so these numbers are the button's own dimensions — shared by the
// button that draws the surface and the Van and percentage drawn on it.

// The one surface the theme does not reach (ADR-0003): dark in both modes, so
// the bone Van and the percentage read against it without a second palette,
// and so the brake light has a dark ground to flash on.
export const ROAD_COLORS = {
  surface: '#141414',
  ink: '#F2EFE9',
  // Fixed like the rest of the Road's palette, and the one warm colour on it:
  // the Van is the only thing on the Road that ever signals anything.
  brake: '#E1341E',
}

// Taller than a normal button: the Van's livery has to be legible on it.
export const ROAD_HEIGHT = 72

// Inset of the Road's contents from its own edges, so the Van never sits flush
// against the border it rolls in past.
export const ROAD_PADDING = 12

// The Van is 2:1, matching the viewBox it is drawn in.
export const VAN_WIDTH = 84
export const VAN_HEIGHT = VAN_WIDTH / 2

// The Van's own drawing coordinates. The Road decides how big the Van is, so
// everything below is stated in the viewBox and scales with the Van.
export const VAN_VIEWBOX = { width: 96, height: 48 }

// The cargo opening at the Van's rear: dark while the doors are open for
// loading, and filled by the panel the Loading stage slides down over it.
export const CARGO_OPENING = { x: 3, y: 9, width: 7, height: 32 }

// Where the door panel rides while the Van is being loaded: raised by exactly
// its own height, so it clears the opening rather than hanging into it.
export const CARGO_DOOR_RAISED = -CARGO_OPENING.height

// Where the two Parcels come to rest aboard the Van, side by side under the
// roof and clear of the wordmark along the bottom of the bodywork. Top-left
// corners, in the Van's own coordinates.
export const CARGO_SLOTS = {
  [PARCEL_KINDS.USERNAME]: { x: 13, y: 10 },
  [PARCEL_KINDS.PASSWORD]: { x: 28, y: 10 },
}

// How big a stowed Parcel is, in the Van's own coordinates.
export const PARCEL_STOW_SIZE = 12

// The Van's wheels, in its own coordinates. Each is drawn as its own group so
// the Drive can turn it about its own hub, which is what makes how far the Van
// has travelled visible.
export const WHEELS = [
  { cx: 20, cy: 41 },
  { cx: 78, cy: 41 },
]
export const WHEEL_RADIUS = 6

// The Van's brake light, at the rear over the closed doors and clear of the
// livery along the bottom. Unlit for the whole Delivery except the Setback.
export const BRAKE_LIGHT = { x: 3, y: 32, width: 7, height: 6 }

// The percentage's slot at the far right, held clear of the Van for the whole
// Drive so the number stays readable and the two never overlap.
export const PERCENTAGE_SLOT = 48

// How far off the Road's left edge the Van starts, measured from its parked
// spot: enough that the whole Van is outside the surface before it rolls in.
export const VAN_OFF_ROAD_X = -(VAN_WIDTH + ROAD_PADDING * 2)
