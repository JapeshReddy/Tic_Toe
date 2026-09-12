import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { motion, useReducedMotion } from 'motion/react'
import { DELIVERY_STATES } from '../utils/constants'
import { buildParcels, PARCEL_KINDS } from '../utils/delivery'
import { useDelivery } from '../hooks/useDelivery'
import { SNAP } from '../utils/motion'
import { ROAD_COLORS, ROAD_HEIGHT } from '../utils/road'
import LoadingLayer from './LoadingLayer'
import Road from './Road'
import SkipControl, { SKIP_CONTROL_HEIGHT } from './SkipControl'

// The login screen as a real card and a real form. Nothing typed is ever
// checked, so submitting always starts a Delivery, empty fields included.
//
// There are three ways off this card and only one of them is the button's: a
// Delivery runs to the game, Escape leaves mid-flight, and someone who has
// asked for reduced motion is given no Delivery at all (issue #9).
export default function LoginScreen({ delivery, onSignIn, onSkip, onArrive }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const theme = useTheme()
  const isDelivering = delivery === DELIVERY_STATES.DELIVERING
  const prefersReducedMotion = useReducedMotion()

  // Built once from what was typed and then left alone: the fields are locked
  // for the Delivery, so the Parcels the timeline is given never change under
  // it. Both fields produce a Parcel whatever was typed, empty included.
  const parcels = useMemo(
    () => buildParcels(username, password),
    [username, password],
  )

  const { scope, usernameField, passwordField, vanLane, cargoDoor, drive } =
    useDelivery({ delivery, parcels, onArrive })

  // X and O's colours, the same the board will use: the Username Parcel carries
  // one and the Password Parcel the other (ADR-0001).
  const colors = {
    [PARCEL_KINDS.USERNAME]: theme.palette.primary.main,
    [PARCEL_KINDS.PASSWORD]: theme.palette.secondary.main,
  }

  // Escape is the other exit from a Delivery, and it leaves the same way the
  // control does: the card gives way to the game rather than hurrying to it.
  useEffect(() => {
    if (!isDelivering) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onSkip()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isDelivering, onSkip])

  const handleSubmit = (event) => {
    // A real form, so Enter from either field submits it just as the button
    // does — and the page never navigates, since there is nowhere to go.
    event.preventDefault()
    // Reduced motion is not a shortened Delivery but no Delivery: it carries no
    // information, so there is nothing to watch and nothing to be spared.
    if (prefersReducedMotion) {
      onSkip()
      return
    }
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
    <Card
      variant="outlined"
      // The Loading layer is drawn over the whole card and measured against it,
      // so the card has to be what the layer is positioned within.
      sx={{ position: 'relative', width: '100%' }}
    >
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
          ref={usernameField}
          label="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="off"
          fullWidth
          slotProps={{ htmlInput: lock }}
        />
        <TextField
          ref={passwordField}
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="off"
          fullWidth
          slotProps={{ htmlInput: lock }}
        />

        {/* The button is the Road: a plain label at rest, and once a Delivery
            starts, a dark strip the Van rolls onto. Pressing it again while a
            Delivery runs starts nothing, so it stays enabled rather than
            disabling itself out from under the pointer. It stays named and
            says it is busy. */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          aria-label={isDelivering ? 'Signing in' : undefined}
          aria-busy={isDelivering || undefined}
          sx={{
            position: 'relative',
            display: 'block',
            overflow: 'hidden',
            p: 0,
            // The Road's own colours, fixed rather than themed, so the Van and
            // the percentage look the same in either mode (ADR-0003). The
            // border is the one themed part: in dark mode the Road and the card
            // it sits on are near neighbours, and the edge is what separates
            // them.
            minHeight: ROAD_HEIGHT,
            backgroundColor: ROAD_COLORS.surface,
            color: ROAD_COLORS.ink,
            border: '2px solid',
            borderColor: 'divider',
            '&:hover': { backgroundColor: ROAD_COLORS.surface },
          }}
        >
          {/* The label fades rather than unmounts, so the Road has something to
              clear and the button is never left with no text at all. */}
          <Box
            component={motion.span}
            animate={{ opacity: isDelivering ? 0 : 1 }}
            transition={SNAP}
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Log in
          </Box>

          <Road
            isDelivering={isDelivering}
            vanLaneRef={vanLane}
            cargoDoorRef={cargoDoor}
            drive={drive}
          />
        </Button>

        {/* The note and the way out share the card's last line, and the row
            holds the Skip control's height from the start, so an exit can
            appear without the card resizing under the Delivery. */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: SKIP_CONTROL_HEIGHT,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Any details work.
          </Typography>
          {isDelivering && <SkipControl onSkip={onSkip} />}
        </Stack>
      </Stack>

      {/* Over the whole card, last, so it draws above the fields it lifts Dots
          out of and above the Road the Parcels are carried into. */}
      <LoadingLayer scope={scope} parcels={parcels} colors={colors} />
    </Card>
  )
}
