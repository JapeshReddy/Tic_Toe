// The Road's geometry and its fixed palette. The Road is the login button's
// interior, so these numbers are the button's own dimensions — shared by the
// button that draws the surface and the Van and percentage drawn on it.

// The one surface the theme does not reach (ADR-0003): dark in both modes, so
// the bone Van and the percentage read against it without a second palette,
// and so the brake light a later stage adds has a dark ground to flash on.
export const ROAD_COLORS = {
  surface: '#141414',
  ink: '#F2EFE9',
}

// Taller than a normal button: the Van's livery has to be legible on it.
export const ROAD_HEIGHT = 72

// Inset of the Road's contents from its own edges, so the Van never sits flush
// against the border it rolls in past.
export const ROAD_PADDING = 12

// The Van is 2:1, matching the viewBox it is drawn in.
export const VAN_WIDTH = 84
export const VAN_HEIGHT = VAN_WIDTH / 2

// The percentage's slot at the far right, held clear of the Van for the whole
// Drive so the number stays readable and the two never overlap.
export const PERCENTAGE_SLOT = 48

// How far off the Road's left edge the Van starts, measured from its parked
// spot: enough that the whole Van is outside the surface before it rolls in.
export const VAN_OFF_ROAD_X = -(VAN_WIDTH + ROAD_PADDING * 2)
