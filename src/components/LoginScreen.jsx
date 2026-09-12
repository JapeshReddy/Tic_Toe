import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

// The login screen at its barest: a heading and the button that signs you in.
// The card's real contents, its form semantics and the Delivery that plays on
// submit arrive in later tickets; this one only establishes the phase gate.
export default function LoginScreen({ onSignIn }) {
  return (
    <Stack spacing={3} alignItems="center" sx={{ width: '100%', py: 6 }}>
      <Typography variant="h5" component="h2">
        Sign in
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={onSignIn}
        sx={{ width: '100%' }}
      >
        Log in
      </Button>
    </Stack>
  )
}
