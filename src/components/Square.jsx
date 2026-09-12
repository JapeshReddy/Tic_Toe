import Button from '@mui/material/Button'
import Mark from './Mark'

// Human-readable position of each cell, used for accessible labels.
const POSITIONS = [
  'top left',
  'top center',
  'top right',
  'middle left',
  'center',
  'middle right',
  'bottom left',
  'bottom center',
  'bottom right',
]

export default function Square({ value, index, onClick, disabled }) {
  const label = value
    ? `${POSITIONS[index]}, ${value}`
    : `${POSITIONS[index]}, empty`

  return (
    <Button
      onClick={() => onClick(index)}
      disabled={disabled}
      aria-label={label}
      sx={{
        width: '100%',
        aspectRatio: '1 / 1',
        minWidth: 0,
        p: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: { xs: '2.6rem', sm: '3.2rem' },
        backgroundColor: 'background.paper',
        boxShadow: 'none',
        '&:hover': { backgroundColor: 'action.hover' },
        // Filled cells are disabled but must stay full-strength planes, not
        // greyed out — the mark carries the colour.
        '&.Mui-disabled': {
          backgroundColor: 'background.paper',
          opacity: 1,
        },
      }}
    >
      <Mark symbol={value} animate />
    </Button>
  )
}
