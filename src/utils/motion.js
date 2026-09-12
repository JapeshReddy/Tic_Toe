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
}

export const SNAP = { duration: DURATIONS.mark, ease: SNAP_EASE }
export const WIN_BAR = { duration: DURATIONS.winBar, ease: SNAP_EASE }
export const STATUS = { duration: DURATIONS.status, ease: SNAP_EASE }
export const HISTORY_ITEM = { duration: DURATIONS.historyItem, ease: SNAP_EASE }

// A mark is stamped onto the board: it arrives rotated and undersized, then
// snaps square. X and O share the motion so the board reads consistently.
export const MARK_VARIANTS = {
  hidden: { opacity: 0, scale: 0.45, rotate: -25 },
  visible: { opacity: 1, scale: 1, rotate: 0 },
}
