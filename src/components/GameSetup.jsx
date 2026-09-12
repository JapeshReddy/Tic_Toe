import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import { DIFFICULTIES, GAME_MODES, PLAYERS } from '../utils/constants'
import Mark from './Mark'

// A labelled, exclusive toggle group. Ignores null values (emitted when the
// already-selected button is clicked) so a choice is always active.
function OptionGroup({ label, value, options, onChange, ariaLabel }) {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="overline" component="div" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <ToggleButtonGroup
        exclusive
        fullWidth
        size="small"
        color="primary"
        value={value}
        onChange={(_, next) => next && onChange(next)}
        aria-label={ariaLabel}
      >
        {options.map((option) => (
          <ToggleButton
            key={option.value}
            value={option.value}
            aria-label={option.ariaLabel}
          >
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  )
}

const MODE_OPTIONS = [
  { value: GAME_MODES.HOT_SEAT, label: 'Two Players' },
  { value: GAME_MODES.VS_COMPUTER, label: 'Vs Computer' },
]

const SYMBOL_OPTIONS = [
  {
    value: PLAYERS.X,
    ariaLabel: 'X',
    label: <Mark symbol={PLAYERS.X} size="1.2rem" />,
  },
  {
    value: PLAYERS.O,
    ariaLabel: 'O',
    label: <Mark symbol={PLAYERS.O} size="1.2rem" />,
  },
]

const DIFFICULTY_OPTIONS = [
  { value: DIFFICULTIES.EASY, label: 'Easy' },
  { value: DIFFICULTIES.MEDIUM, label: 'Medium' },
  { value: DIFFICULTIES.HARD, label: 'Hard' },
]

export default function GameSetup({
  gameMode,
  humanSymbol,
  difficulty,
  onChange,
}) {
  const isVsComputer = gameMode === GAME_MODES.VS_COMPUTER

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <OptionGroup
        label="Mode"
        ariaLabel="Game mode"
        value={gameMode}
        options={MODE_OPTIONS}
        onChange={(value) => onChange('gameMode', value)}
      />

      {isVsComputer && (
        <OptionGroup
          label="Your Symbol"
          ariaLabel="Your symbol"
          value={humanSymbol}
          options={SYMBOL_OPTIONS}
          onChange={(value) => onChange('humanSymbol', value)}
        />
      )}

      {isVsComputer && (
        <OptionGroup
          label="Difficulty"
          ariaLabel="Difficulty"
          value={difficulty}
          options={DIFFICULTY_OPTIONS}
          onChange={(value) => onChange('difficulty', value)}
        />
      )}
    </Stack>
  )
}
