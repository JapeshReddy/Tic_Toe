import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid2'
import { AnimatePresence, motion } from 'motion/react'
import Square from './Square'
import { WIN_BAR } from '../utils/motion'

const MotionBox = motion.create(Box)

// Cell-centre positions (%) across a 3-column grid, used to place the win bar.
const CENTERS = ['16.67%', '50%', '83.33%']
const BAR_THICKNESS = 'clamp(10px, 3.6vw, 15px)'

// Describes the winning line's orientation from its three cell indices.
function getWinBar(line) {
  if (!line) return null
  const [a, , c] = line
  if (Math.floor(a / 3) === Math.floor(c / 3)) {
    return { kind: 'h', pos: CENTERS[Math.floor(a / 3)] }
  }
  if (a % 3 === c % 3) return { kind: 'v', pos: CENTERS[a % 3] }
  return { kind: a === 0 ? 'd1' : 'd2' }
}

// Per-orientation placement plus the axis the bar grows along. The bar is
// drawn from its own origin outward, so it reads as being struck through the
// winning cells. Motion handles the reduced-motion case via MotionConfig.
function getBarMotion(bar, color) {
  const sx = {
    position: 'absolute',
    backgroundColor: color,
    pointerEvents: 'none',
    zIndex: 2,
  }

  if (bar.kind === 'h') {
    return {
      sx: {
        ...sx,
        top: bar.pos,
        left: '4%',
        right: '4%',
        height: BAR_THICKNESS,
        transformOrigin: 'left center',
      },
      style: { y: '-50%' },
      initial: { scaleX: 0, opacity: 0 },
      animate: { scaleX: 1, opacity: 1 },
      exit: { scaleX: 0, opacity: 0 },
    }
  }

  if (bar.kind === 'v') {
    return {
      sx: {
        ...sx,
        left: bar.pos,
        top: '4%',
        bottom: '4%',
        width: BAR_THICKNESS,
        transformOrigin: 'center top',
      },
      style: { x: '-50%' },
      initial: { scaleY: 0, opacity: 0 },
      animate: { scaleY: 1, opacity: 1 },
      exit: { scaleY: 0, opacity: 0 },
    }
  }

  return {
    sx: {
      ...sx,
      top: '50%',
      left: '50%',
      width: '128%',
      height: BAR_THICKNESS,
      transformOrigin: 'center',
    },
    style: { x: '-50%', y: '-50%', rotate: bar.kind === 'd1' ? 45 : -45 },
    initial: { scaleX: 0, opacity: 0 },
    animate: { scaleX: 1, opacity: 1 },
    exit: { scaleX: 0, opacity: 0 },
  }
}

export default function Board({
  board,
  winningLine,
  onSquareClick,
  disabled,
  isComputerTurn,
}) {
  const bar = getWinBar(winningLine)
  const winnerSymbol = winningLine ? board[winningLine[0]] : null
  const barColor = winnerSymbol === 'X' ? 'primary.main' : 'secondary.main'

  return (
    <Box sx={{ width: 'min(90vw, 400px)' }}>
      {/* The slab is the grid's "lines": cell gaps and padding show it through. */}
      <Box sx={{ position: 'relative', p: '6px', backgroundColor: 'divider' }}>
        <Grid container spacing="6px">
          {board.map((value, index) => (
            <Grid size={4} key={index}>
              <Square
                value={value}
                index={index}
                onClick={onSquareClick}
                disabled={disabled || value !== null || isComputerTurn}
              />
            </Grid>
          ))}
        </Grid>
        {/* Keyed by orientation so a new win animates from scratch, and
            retracts on reset rather than vanishing. */}
        <AnimatePresence>
          {bar && (
            <MotionBox
              key={bar.kind + (bar.pos ?? '')}
              transition={WIN_BAR}
              {...getBarMotion(bar, barColor)}
            />
          )}
        </AnimatePresence>
      </Box>
    </Box>
  )
}
