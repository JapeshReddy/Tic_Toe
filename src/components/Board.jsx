import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid2'
import Square from './Square'

// Cell-centre positions (%) across a 3-column grid, used to place the win bar.
const CENTERS = ['16.67%', '50%', '83.33%']
const BAR_THICKNESS = 'clamp(10px, 3.6vw, 15px)'

// Describes the winning line's orientation from its three cell indices.
function getWinBar(line) {
  if (!line) return null
  const [a, b, c] = line
  if (Math.floor(a / 3) === Math.floor(c / 3)) {
    return { kind: 'h', pos: CENTERS[Math.floor(a / 3)] }
  }
  if (a % 3 === c % 3) return { kind: 'v', pos: CENTERS[a % 3] }
  return { kind: a === 0 ? 'd1' : 'd2' }
}

// Per-orientation placement + a keyframe that grows the bar along its own axis
// (respecting reduced-motion). The bar draws in the winner's colour.
function barSx(bar, color) {
  const base = {
    position: 'absolute',
    backgroundColor: color,
    pointerEvents: 'none',
    zIndex: 2,
    animation: 'winSlam 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
  }

  if (bar.kind === 'h') {
    return {
      ...base,
      top: bar.pos,
      left: '4%',
      right: '4%',
      height: BAR_THICKNESS,
      transformOrigin: 'left center',
      '@keyframes winSlam': {
        from: { opacity: 0, transform: 'translateY(-50%) scaleX(0)' },
        to: { opacity: 1, transform: 'translateY(-50%) scaleX(1)' },
      },
    }
  }
  if (bar.kind === 'v') {
    return {
      ...base,
      left: bar.pos,
      top: '4%',
      bottom: '4%',
      width: BAR_THICKNESS,
      transformOrigin: 'center top',
      '@keyframes winSlam': {
        from: { opacity: 0, transform: 'translateX(-50%) scaleY(0)' },
        to: { opacity: 1, transform: 'translateX(-50%) scaleY(1)' },
      },
    }
  }

  const angle = bar.kind === 'd1' ? '45deg' : '-45deg'
  return {
    ...base,
    top: '50%',
    left: '50%',
    width: '128%',
    height: BAR_THICKNESS,
    transformOrigin: 'center',
    '@keyframes winSlam': {
      from: {
        opacity: 0,
        transform: `translate(-50%, -50%) rotate(${angle}) scaleX(0)`,
      },
      to: {
        opacity: 1,
        transform: `translate(-50%, -50%) rotate(${angle}) scaleX(1)`,
      },
    },
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
        {bar && <Box sx={barSx(bar, barColor)} />}
      </Box>
    </Box>
  )
}
