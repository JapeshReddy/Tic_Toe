import Box from '@mui/material/Box'

// Renders a player's symbol as pure geometry rather than a text glyph: X is a
// crossed pair of bars, O is a true ring. X always reads red (primary), O
// always reads blue (secondary). `size` sets the font-size the em-based
// dimensions scale from, so one component serves the board, status bar and
// wordmark. Decorative only — callers provide the accessible label.
export default function Mark({ symbol, size = '1em', sx }) {
  if (symbol === 'X') {
    return (
      <Box
        aria-hidden
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
      <Box
        aria-hidden
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
