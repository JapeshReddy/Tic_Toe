import { Fragment } from 'react'
import Box from '@mui/material/Box'
import { DOT_SIZE, PARCEL_SIZE } from '../utils/loading'
import { ROAD_COLORS } from '../utils/road'

// A Parcel: the box a field's characters are carried in. Its colour is the
// symbol that field's player will be — the Username Parcel takes X's, the
// Password Parcel O's — so the Delivery quietly teaches the board's colour code
// before the board appears (ADR-0001).
//
// Anchored at its top-left corner so the Loading timeline can scale it down
// about that corner and land it in the Van's cargo bay exactly.
function Parcel({ kind, color }) {
  return (
    <Box
      data-parcel={kind}
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: PARCEL_SIZE,
        height: PARCEL_SIZE,
        transformOrigin: 'top left',
        opacity: 0,
        backgroundColor: color,
        border: '2px solid',
        borderColor: ROAD_COLORS.surface,
        // One hard rule across the upper third: the lid, so the box reads as a
        // Parcel rather than as a plain swatch of colour.
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          top: '32%',
          height: 2,
          backgroundColor: ROAD_COLORS.surface,
        },
      }}
    />
  )
}

// A Dot: one typed character on its way from its field into its Parcel.
function Dot({ parcel, index, color }) {
  return (
    <Box
      data-dot={`${parcel}-${index}`}
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: '50%',
        opacity: 0,
        backgroundColor: color,
      }}
    />
  )
}

// What the Loading stage draws: the Parcels, and the Dots that fill them. It is
// a layer over the whole login card rather than part of the Road, because a
// Parcel starts beside its field — well outside the button — before it is
// carried down into the Van. Only the Van itself never leaves the Road.
//
// Everything here is parked at opacity 0 and positioned by the timeline, so the
// layer is inert until a Delivery starts. It never takes a click, never enters
// the accessibility tree, and clips its own edges, which is what keeps the
// Loading stage inside the card on a narrow screen.
export default function LoadingLayer({ scope, parcels, colors }) {
  return (
    <Box
      ref={scope}
      aria-hidden="true"
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {parcels.map((parcel) => (
        <Fragment key={parcel.kind}>
          <Parcel kind={parcel.kind} color={colors[parcel.kind]} />
          {Array.from({ length: parcel.dots }, (_, index) => (
            <Dot
              key={index}
              parcel={parcel.kind}
              index={index}
              color={colors[parcel.kind]}
            />
          ))}
        </Fragment>
      ))}
    </Box>
  )
}
