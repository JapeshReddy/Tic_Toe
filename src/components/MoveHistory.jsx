import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

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
        sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {history.map((_, move) => (
          <Button
            key={move}
            size="small"
            variant={move === currentMove ? 'contained' : 'outlined'}
            onClick={() => onJumpTo(move)}
            aria-label={move === 0 ? 'Go to game start' : `Go to move ${move}`}
            sx={{ fontFamily: '"Space Mono", monospace', minWidth: 44 }}
          >
            {move === 0 ? 'Start' : `#${move}`}
          </Button>
        ))}
      </Stack>
    </Box>
  )
}
