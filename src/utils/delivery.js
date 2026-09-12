// Pure Delivery logic: turning the typed fields into the Parcels the Van
// carries. No UI, no animation — the choreography lives in the Delivery hook.

export const PARCEL_KINDS = {
  USERNAME: 'username',
  PASSWORD: 'password',
}

// The most Dots one Parcel is ever shown carrying. A long value would otherwise
// drag the Loading stage out, so the Dots stop here. The cap is presentational
// only: the typed value is never truncated, here or anywhere else.
export const DOT_CAP = 5

function toParcel(kind, value) {
  return {
    kind,
    value,
    dots: Math.min(value.length, DOT_CAP),
  }
}

// Always exactly two Parcels, Username first, whatever was typed — an empty
// field yields an empty Parcel rather than being skipped or padded out.
export function buildParcels(username, password) {
  return [
    toParcel(PARCEL_KINDS.USERNAME, username),
    toParcel(PARCEL_KINDS.PASSWORD, password),
  ]
}
