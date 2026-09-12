import Box from '@mui/material/Box'
import { DISPLAY_FONT } from '../theme'
import { ROAD_COLORS } from '../utils/road'

// The Kartel Van, side on and heading right: a bone box with hard black rules,
// the one lively thing on the Road and the only place the Kartel name appears
// (CONTEXT.md — Kartel is the livery, not the product). Its colours are fixed
// like the Road's (ADR-0003), which is why they are not theme tokens: a themed
// van would disappear into the Road the moment the palette flipped.
//
// Geometry only — the Road decides how big the Van is, so the drawing is a
// viewBox and nothing else.
export default function Van(props) {
  return (
    <Box
      component="svg"
      viewBox="0 0 96 48"
      // Purely decorative: the Delivery carries no information, and the Van's
      // name is not something a screen reader should read out mid-sign-in.
      aria-hidden="true"
      focusable="false"
      sx={{ display: 'block', width: '100%', height: '100%' }}
      {...props}
    >
      <g fill={ROAD_COLORS.ink} stroke={ROAD_COLORS.surface} strokeWidth="2">
        {/* Cargo box and cab as one outline, with the windshield raked back
            from the roof and a short nose ahead of it. */}
        <path d="M2 41 V9 H72 L86 23 H94 V41 Z" />
      </g>

      {/* The windshield, and the line the cab door hangs on. */}
      <g fill={ROAD_COLORS.surface}>
        <polygon points="74,12 84,22 74,22" />
        <rect x="68" y="11" width="2" height="28" />
      </g>

      {/* Tyres outlined in bone: a dark wheel on a dark road would otherwise
          vanish, leaving the Van looking like it is floating. */}
      <g
        fill={ROAD_COLORS.surface}
        stroke={ROAD_COLORS.ink}
        strokeWidth="2"
      >
        <circle cx="20" cy="41" r="6" />
        <circle cx="78" cy="41" r="6" />
      </g>
      <g fill={ROAD_COLORS.ink}>
        <circle cx="20" cy="41" r="2" />
        <circle cx="78" cy="41" r="2" />
      </g>

      <text
        x="12"
        y="31"
        fill={ROAD_COLORS.surface}
        fontFamily={DISPLAY_FONT}
        fontSize="14"
        fontWeight="700"
        letterSpacing="0.5"
      >
        Kartel
      </text>
    </Box>
  )
}
