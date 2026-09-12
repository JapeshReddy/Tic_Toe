import Box from '@mui/material/Box'
import { motion } from 'motion/react'
import Van from './Van'
import { MONO_FONT } from '../theme'
import { PUFF_COUNT, PUFF_SIZE } from '../utils/drive'
import { SNAP, VAN_ROLL } from '../utils/motion'
import {
  PERCENTAGE_SLOT,
  ROAD_COLORS,
  ROAD_PADDING,
  VAN_HEIGHT,
  VAN_OFF_ROAD_X,
  VAN_WIDTH,
} from '../utils/road'

// The Van's exhaust: the puffs it lets go while it is moving, one after another
// from its tail, drifting back until they fade. Purely decorative, and drawn
// behind the Van. All of it sits at opacity 0 until the Drive's timeline starts
// the engine, so a parked Van leaves nothing smoking.
function Exhaust() {
  return (
    <Box
      aria-hidden="true"
      sx={{ position: 'absolute', left: 0, bottom: 3, width: 0, height: 0 }}
    >
      {Array.from({ length: PUFF_COUNT }, (_, index) => (
        <Box
          key={index}
          data-puff={index}
          sx={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: PUFF_SIZE,
            height: PUFF_SIZE,
            borderRadius: '50%',
            backgroundColor: ROAD_COLORS.ink,
            opacity: 0,
          }}
        />
      ))}
    </Box>
  )
}

// What is drawn on the Road: the Van and the percentage. The Road itself — the
// dark, bordered surface — is the login button, so this is only its contents,
// laid over the button's own box.
//
// The Van sits in a full-height lane at the left, so it parks by moving on one
// axis only, and off-Road it is simply past the edge and clipped. The
// percentage is always mounted but invisible until a Delivery starts: keeping
// its slot occupied from the beginning is what stops the Van's journey ever
// reaching the number.
//
// The lane carries the roll in, which the Road itself animates; the journey
// past it, the Drive, is the Delivery timeline's (#8) and arrives here as motion
// values — how far the Van has come, how far it is tilted back, its fade at the
// end, whether the brake light is lit, and where its wheels have turned to.
//
// `vanLaneRef` and `cargoDoorRef` are handed up to the Delivery's timeline. The
// lane is what the Loading stage measures, because unlike the Van inside it the
// lane never moves; the door is what it shuts once both Parcels are aboard. The
// Road's own box is handed up as `drive.road`, because the Drive has to measure
// how much room it has before it can set off.
export default function Road({ isDelivering, vanLaneRef, cargoDoorRef, drive }) {
  return (
    <Box
      ref={drive.road}
      sx={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
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
          {/* The Van under its own power, one level in: the roll in above parks
              it, and everything from there — the journey, the tilt back, the
              exhaust, the exit — is the Drive's. */}
          <Box
            component={motion.div}
            style={{
              x: drive.distance,
              rotate: drive.tilt,
              opacity: drive.vanOpacity,
            }}
            sx={{ position: 'relative', width: VAN_WIDTH, height: VAN_HEIGHT }}
          >
            <Exhaust />
            <Van
              doorRef={cargoDoorRef}
              wheelAngle={drive.wheelAngle}
              braking={drive.braking}
            />
          </Box>
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
        {/* The readout fades with the Van it has been reading out: at Arrival
            the number goes out as the Van leaves, so the Van never crosses a
            number that is still worth reading. */}
        <Box component={motion.div} style={{ opacity: drive.readoutOpacity }}>
          {drive.readout}
        </Box>
      </Box>
    </Box>
  )
}
