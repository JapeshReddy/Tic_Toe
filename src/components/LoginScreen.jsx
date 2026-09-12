import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { motion } from 'motion/react'
import { DELIVERY_STATES } from '../utils/constants'
import { useDelivery } from '../hooks/useDelivery'
import { SNAP } from '../utils/motion'

// The login screen as a real card and a real form. Nothing typed is ever
// checked, so submitting always starts a Delivery, empty fields included.
export default function LoginScreen({ delivery, onSignIn, onArrive }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const isDelivering = delivery === DELIVERY_STATES.DELIVERING

  useDelivery(delivery, onArrive)

  const handleSubmit = (event) => {
    // A real form, so Enter from either field submits it just as the button
    // does — and the page never navigates, since there is nowhere to go.
    event.preventDefault()
    onSignIn()
  }

  // Read-only rather than disabled: the fields must stop accepting input but
  // must not be torn out of the tab order, which would drop focus mid-Delivery.
  // aria-disabled is what tells assistive technology they are locked.
  const lock = {
    readOnly: isDelivering,
    'aria-disabled': isDelivering || undefined,
  }

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <Stack
        component="form"
        onSubmit={handleSubmit}
        autoComplete="off"
        noValidate
        spacing={2.5}
        sx={{ p: { xs: 3, sm: 4 } }}
      >
        <Box>
          <Typography variant="overline" component="p" color="text.secondary">
            Delivery
          </Typography>
          <Typography variant="h4" component="h2">
            Sign in
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Nothing is checked. Any username and password will do, including
          neither.
        </Typography>

        <TextField
          label="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="off"
          fullWidth
          slotProps={{ htmlInput: lock }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="off"
          fullWidth
          slotProps={{ htmlInput: lock }}
        />

        {/* Pressing again while a Delivery runs starts nothing, so the button
            stays enabled rather than disabling itself out from under the
            pointer. It stays named and says it is busy. */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          aria-label={isDelivering ? 'Signing in' : undefined}
          aria-busy={isDelivering || undefined}
        >
          {/* The label fades rather than unmounts, so the Road has something to
              clear and the button is never left with no text at all. */}
          <Box
            component={motion.span}
            animate={{ opacity: isDelivering ? 0 : 1 }}
            transition={SNAP}
          >
            Log in
          </Box>
        </Button>

        <Typography variant="body2" color="text.secondary">
          Any details work.
        </Typography>
      </Stack>
    </Card>
  )
}
