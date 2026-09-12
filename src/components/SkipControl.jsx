import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import { motion } from 'motion/react'
import { DURATIONS, SNAP } from '../utils/motion'

// The room the control is given on the card: a little more than the small text
// button it becomes. Reserving it from the start is what lets the control fade
// in without the card resizing under the Delivery.
export const SKIP_CONTROL_HEIGHT = 32

// The way out of a Delivery for anyone who does not want to watch it. A real
// button rather than a decoration, so it is reachable by keyboard and announced
// by name; quiet, because it is an exit rather than the thing to do.
//
// It never submits the form it sits in — the login button is not a skip, and a
// skip is not a login.
export function SkipButton({ onSkip }) {
  return (
    <Button
      component={motion.button}
      type="button"
      size="small"
      color="inherit"
      onClick={onSkip}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={SNAP}
      sx={{ minWidth: 0, px: 1, color: 'text.secondary', fontWeight: 400 }}
    >
      Skip
    </Button>
  )
}

// The control as the Delivery meets it: not there at the start, fading in once
// the Van has had the screen to itself. What it does is the card's business —
// skipping is the card leaving, not an animation being hurried along.
//
// Mounted only while a Delivery is under way, so the wait starts with the
// Delivery and is cancelled with it.
export default function SkipControl({ onSkip }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(
      () => setVisible(true),
      DURATIONS.skipControl * 1000,
    )
    return () => clearTimeout(timer)
  }, [])

  return visible ? <SkipButton onSkip={onSkip} /> : null
}
