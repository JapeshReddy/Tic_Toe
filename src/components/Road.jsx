import Box from '@mui/material/Box'
import { motion } from 'motion/react'
import Van from './Van'
import { MONO_FONT } from '../theme'
import { SNAP, VAN_ROLL } from '../utils/motion'
import {
  PERCENTAGE_SLOT,
  ROAD_COLORS,
  ROAD_PADDING,
  VAN_HEIGHT,
  VAN_OFF_ROAD_X,
  VAN_WIDTH,
} from '../utils/road'

// What is drawn on the Road: the parked Van and the percentage. The Road
// itself — the dark, bordered surface — is the login button, so this is only
// its contents, laid over the button's own box.
//
// The Van sits in a full-height lane at the left, so it parks by moving on one
// axis only, and off-Road it is simply past the edge and clipped. The
// percentage is always mounted but invisible until a Delivery starts: keeping
// its slot occupied from the beginning is what stops the Van's journey ever
// reaching the number, and what the Drive later measures against.
//
// `vanLaneRef` and `cargoDoorRef` are handed up to the Delivery's timeline. The
// lane is what the Loading stage measures, because unlike the Van inside it the
// lane never moves; the door is what it shuts once both Parcels are aboard.
export default function Road({ isDelivering, vanLaneRef, cargoDoorRef }) {
  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Box
        ref={vanLaneRef}
        sx={{
          position: 'absolute',
          left: ROAD_PADDING,
          top: 0,
          bottom: 0,
          width: VAN_WIDTH,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          component={motion.div}
          // initial={false} so the Van's position is whatever this Delivery
          // state says it is, with no roll on mount: off the Road at rest, and
          // already parked if a Delivery was somehow under way already.
          initial={false}
          animate={{ x: isDelivering ? 0 : VAN_OFF_ROAD_X }}
          transition={VAN_ROLL}
          sx={{ width: VAN_WIDTH, height: VAN_HEIGHT }}
        >
          <Van doorRef={cargoDoorRef} />
        </Box>
      </Box>

      <Box
        component={motion.div}
        initial={false}
        animate={{ opacity: isDelivering ? 1 : 0 }}
        transition={SNAP}
        // The number climbs on its own and says nothing the button's own busy
        // state does not, so it is left out of the accessibility tree.
        aria-hidden="true"
        sx={{
          position: 'absolute',
          right: ROAD_PADDING,
          top: 0,
          bottom: 0,
          width: PERCENTAGE_SLOT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          // The percentage is data, so it wears the app's mono voice even
          // though the Road around it is outside the theme.
          fontFamily: MONO_FONT,
          fontSize: '1rem',
          fontWeight: 700,
          color: ROAD_COLORS.ink,
        }}
      >
        0%
      </Box>
    </Box>
  )
}
