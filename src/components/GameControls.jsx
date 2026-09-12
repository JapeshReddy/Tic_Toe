import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { RestartIcon } from './icons'
import { GAME_MODES } from '../utils/constants'
import MoveHistory from './MoveHistory'

export default function GameControls({
  gameMode,
  history,
  currentMove,
  onReset,
  onJumpTo,
}) {
  // Time-travel is a hot-seat-only feature.
  const showHistory = gameMode === GAME_MODES.HOT_SEAT

  return (
    <Stack spacing={2} sx={{ width: '100%' }} alignItems="center">
      <Button
        variant="contained"
        startIcon={<RestartIcon />}
        onClick={onReset}
      >
        New Game
      </Button>
      {showHistory && (
        <MoveHistory
          history={history}
          currentMove={currentMove}
          onJumpTo={onJumpTo}
        />
      )}
    </Stack>
  )
}
