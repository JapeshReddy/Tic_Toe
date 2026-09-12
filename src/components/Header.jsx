import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { SignOutIcon } from './icons'
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

export default function Header({
  mode,
  onToggleTheme,
  showSignOut,
  onSignOut,
}) {
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
        {/* Offered only in the game: on the login screen there is no game to
            leave. The theme toggle stays available on both. */}
        {showSignOut && (
          <Tooltip title="Sign out">
            <IconButton
              onClick={onSignOut}
              color="inherit"
              aria-label="Sign out"
            >
              <SignOutIcon />
            </IconButton>
          </Tooltip>
        )}
        <ThemeToggle mode={mode} onToggle={onToggleTheme} />
      </Toolbar>
    </AppBar>
  )
}
