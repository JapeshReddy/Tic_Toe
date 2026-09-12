import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import ThemeToggle from './ThemeToggle'

// The logotype states the whole idea in two marks: a red square (plane) and a
// blue ring (the O), the game's primitives side by side.
function Logotype() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
      <Box sx={{ width: 16, height: 16, backgroundColor: 'primary.main' }} />
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: '4px solid',
          borderColor: 'secondary.main',
          boxSizing: 'border-box',
        }}
      />
    </Box>
  )
}

export default function Header({ mode, onToggleTheme }) {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: '3px solid',
        borderColor: 'text.primary',
      }}
    >
      <Toolbar sx={{ gap: 1.5 }}>
        <Logotype />
        <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
          Tic&middot;Tac&middot;Toe
        </Typography>
        <ThemeToggle mode={mode} onToggle={onToggleTheme} />
      </Toolbar>
    </AppBar>
  )
}
