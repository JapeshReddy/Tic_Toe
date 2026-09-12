import Box from '@mui/material/Box'
import { motion } from 'motion/react'
import { MARK_VARIANTS, SNAP } from '../utils/motion'

const MotionBox = motion.create(Box)

// Renders a player's symbol as pure geometry rather than a text glyph: X is a
// crossed pair of bars, O is a true ring. X always reads red (primary), O
// always reads blue (secondary). `size` sets the font-size the em-based
// dimensions scale from, so one component serves the board, status bar and
// wordmark. Decorative only — callers provide the accessible label.
//
// `animate` opts into the stamp-in motion. Only the board passes it: the status
// bar and wordmark re-render on every turn, where a replayed animation reads as
// flicker rather than feedback.
export default function Mark({ symbol, size = '1em', sx, animate = false }) {
  const motionProps = animate
    ? {
        variants: MARK_VARIANTS,
        initial: 'hidden',
        animate: 'visible',
        transition: SNAP,
      }
    : {}

  if (symbol === 'X') {
    return (
      <MotionBox
        aria-hidden
        {...motionProps}
        sx={{
          position: 'relative',
          fontSize: size,
          width: '0.86em',
          height: '0.86em',
          color: 'primary.main',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            height: '0.19em',
            backgroundColor: 'currentColor',
            transformOrigin: 'center',
          },
          '&::before': { transform: 'translateY(-50%) rotate(45deg)' },
          '&::after': { transform: 'translateY(-50%) rotate(-45deg)' },
          ...sx,
        }}
      />
    )
  }

  if (symbol === 'O') {
    return (
      <MotionBox
        aria-hidden
        {...motionProps}
        sx={{
          fontSize: size,
          width: '0.82em',
          height: '0.82em',
          borderRadius: '50%',
          border: '0.17em solid',
          borderColor: 'secondary.main',
          boxSizing: 'border-box',
          ...sx,
        }}
      />
    )
  }

  return null
}
