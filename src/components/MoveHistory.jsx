import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { AnimatePresence, motion } from 'motion/react'
import { HISTORY_ITEM } from '../utils/motion'

const MotionButton = motion.create(Button)

// Time-travel controls: one button per recorded move. Hidden until at least
// one move has been made.
export default function MoveHistory({ history, currentMove, onJumpTo }) {
  if (history.length <= 1) return null

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="overline"
        component="div"
        sx={{ textAlign: 'center' }}
      >
        Move History
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        component={motion.div}
        sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {/* Buttons appear as moves are made and retract when time-travel
            truncates the future, so the list never jumps. */}
        <AnimatePresence initial={false} mode="popLayout">
          {history.map((_, move) => (
            <MotionButton
              key={move}
              layout
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={HISTORY_ITEM}
              size="small"
              variant={move === currentMove ? 'contained' : 'outlined'}
              onClick={() => onJumpTo(move)}
              aria-label={move === 0 ? 'Go to game start' : `Go to move ${move}`}
              sx={{ fontFamily: '"Space Mono", monospace', minWidth: 44 }}
            >
              {move === 0 ? 'Start' : `#${move}`}
            </MotionButton>
          ))}
        </AnimatePresence>
      </Stack>
    </Box>
  )
}
