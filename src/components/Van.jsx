import Box from '@mui/material/Box'
import { motion } from 'motion/react'
import { DISPLAY_FONT } from '../theme'
import {
  BRAKE_LIGHT,
  CARGO_DOOR_RAISED,
  CARGO_OPENING,
  ROAD_COLORS,
  VAN_VIEWBOX,
  WHEELS,
  WHEEL_RADIUS,
} from '../utils/road'

// The Kartel Van, side on and heading right: a bone box with hard black rules,
// the one lively thing on the Road and the only place the Kartel name appears
// (CONTEXT.md — Kartel is the livery, not the product). Its colours are fixed
// like the Road's (ADR-0003), which is why they are not theme tokens: a themed
// van would disappear into the Road the moment the palette flipped.
//
// Geometry only — the Road decides how big the Van is, so the drawing is a
// viewBox and nothing else. The two things the Drive reaches into are handed in
// as motion values: the angle its wheels have turned through, and whether the
// brake light is lit.
export default function Van({ doorRef, wheelAngle, braking }) {
  return (
    <Box
      component="svg"
      viewBox={`0 0 ${VAN_VIEWBOX.width} ${VAN_VIEWBOX.height}`}
      // Purely decorative: the Delivery carries no information, and the Van's
      // name is not something a screen reader should read out mid-sign-in.
      aria-hidden="true"
      focusable="false"
      sx={{ display: 'block', width: '100%', height: '100%' }}
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

      {/* The cargo bay's rear opening, dark like the windshield, and the door
          panel that closes it. The panel rides above the opening until the
          Delivery's timeline slides it down — clipped to the opening's own
          rectangle, so a raised panel is simply not there rather than sitting
          on the Van's roof. */}
      <defs>
        <clipPath id="cargo-door-clip">
          <rect
            x={CARGO_OPENING.x}
            y={CARGO_OPENING.y}
            width={CARGO_OPENING.width}
            height={CARGO_OPENING.height}
          />
        </clipPath>
      </defs>
      <rect
        x={CARGO_OPENING.x}
        y={CARGO_OPENING.y}
        width={CARGO_OPENING.width}
        height={CARGO_OPENING.height}
        fill={ROAD_COLORS.surface}
      />
      <g clipPath="url(#cargo-door-clip)">
        <g
          ref={doorRef}
          style={{ transform: `translateY(${CARGO_DOOR_RAISED}px)` }}
        >
          <rect
            x={CARGO_OPENING.x}
            y={CARGO_OPENING.y}
            width={CARGO_OPENING.width}
            height={CARGO_OPENING.height}
            fill={ROAD_COLORS.ink}
          />
          {/* Two hard rules across the panel: a roller shutter's slats, so a
              closed door is legible as a door rather than as bare bodywork. */}
          <g stroke={ROAD_COLORS.surface} strokeWidth="2">
            <line
              x1={CARGO_OPENING.x}
              y1={CARGO_OPENING.y + 6}
              x2={CARGO_OPENING.x + CARGO_OPENING.width}
              y2={CARGO_OPENING.y + 6}
            />
            <line
              x1={CARGO_OPENING.x}
              y1={CARGO_OPENING.y + CARGO_OPENING.height - 6}
              x2={CARGO_OPENING.x + CARGO_OPENING.width}
              y2={CARGO_OPENING.y + CARGO_OPENING.height - 6}
            />
          </g>
        </g>
      </g>

      {/* The brake light, at the rear over the closed doors. Unlit — which is
          how it is drawn — for the whole Delivery except the Setback, when it
          is the one thing on the Van that says the driver has backed off. */}
      <motion.rect
        x={BRAKE_LIGHT.x}
        y={BRAKE_LIGHT.y}
        width={BRAKE_LIGHT.width}
        height={BRAKE_LIGHT.height}
        fill={ROAD_COLORS.brake}
        style={{ opacity: braking }}
      />

      {/* Tyres outlined in bone: a dark wheel on a dark road would otherwise
          vanish, leaving the Van looking like it is floating. Each wheel is its
          own group so the Drive can turn it — Motion rotates an SVG element
          about its own bounding box, which is the wheel's hub — and carries a
          cross of spokes, without which a turning wheel looks like a still one. */}
      {WHEELS.map(({ cx, cy }) => (
        <motion.g key={cx} style={{ rotate: wheelAngle }}>
          <circle
            cx={cx}
            cy={cy}
            r={WHEEL_RADIUS}
            fill={ROAD_COLORS.surface}
            stroke={ROAD_COLORS.ink}
            strokeWidth="2"
          />
          <g stroke={ROAD_COLORS.ink} strokeWidth="1.5">
            <line
              x1={cx - WHEEL_RADIUS + 2}
              y1={cy}
              x2={cx + WHEEL_RADIUS - 2}
              y2={cy}
            />
            <line
              x1={cx}
              y1={cy - WHEEL_RADIUS + 2}
              x2={cx}
              y2={cy + WHEEL_RADIUS - 2}
            />
          </g>
          <circle cx={cx} cy={cy} r="2" fill={ROAD_COLORS.ink} />
        </motion.g>
      ))}

      {/* Low on the bodywork, clear of the cargo bay above: the Loading stage
          stows the two Parcels under the roof, and a wordmark running through
          them would look like it had been loaded too. */}
      <text
        x="12"
        y="34"
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
