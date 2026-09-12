import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { AnimatePresence, motion } from 'motion/react'
import Mark from './Mark'
import { STATUS } from '../utils/motion'

const MotionPaper = motion.create(Paper)

// Resolves the accent colour, the mark to show (if any) and the message from
// the current game state. Colour always follows the active symbol (X red,
// O blue); a draw uses the reserved yellow accent.
function getStatus({ winner, isDraw, currentPlayer, isComputerTurn }) {
  if (winner) {
    const color = winner === 'X' ? 'primary.main' : 'secondary.main'
    return { symbol: winner, color, message: `${winner} wins` }
  }
  if (isDraw) return { symbol: null, color: 'warning.main', message: 'Draw game' }

  const color = currentPlayer === 'X' ? 'primary.main' : 'secondary.main'
  const message = isComputerTurn
    ? `Computer thinking (${currentPlayer})`
    : `${currentPlayer} to play`
  return { symbol: isComputerTurn ? null : currentPlayer, color, message }
}

export default function StatusBar(props) {
  const { symbol, color, message } = getStatus(props)

  return (
    <MotionPaper
      variant="outlined"
      role="status"
      aria-live="polite"
      // The accent border is the loudest signal of whose turn it is, so the
      // colour change is animated rather than cutting.
      animate={{ opacity: 1 }}
      transition={STATUS}
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 1.75,
        px: 2.5,
        py: 1.75,
        borderLeft: '10px solid',
        borderLeftColor: color,
        transition: (theme) =>
          theme.transitions.create('border-left-color', { duration: 180 }),
      }}
    >
      {symbol && <Mark symbol={symbol} size="1.9rem" />}
      {/* Keyed on the message so each new state slides in rather than the text
          swapping in place — the movement is what draws the eye. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={message}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={STATUS}
        >
          <Typography variant="h6" component="p">
            {message}
          </Typography>
        </motion.div>
      </AnimatePresence>
    </MotionPaper>
  )
}
