import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Mark from './Mark'

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
    <Paper
      variant="outlined"
      role="status"
      aria-live="polite"
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 1.75,
        px: 2.5,
        py: 1.75,
        borderLeft: '10px solid',
        borderLeftColor: color,
      }}
    >
      {symbol && <Mark symbol={symbol} size="1.9rem" />}
      <Typography variant="h6" component="p">
        {message}
      </Typography>
    </Paper>
  )
}
