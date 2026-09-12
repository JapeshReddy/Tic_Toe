import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { MoonIcon, SunIcon } from './icons'

export default function ThemeToggle({ mode, onToggle }) {
  const isDark = mode === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <Tooltip title={label}>
      <IconButton onClick={onToggle} color="inherit" aria-label={label}>
        {isDark ? <SunIcon /> : <MoonIcon />}
      </IconButton>
    </Tooltip>
  )
}
