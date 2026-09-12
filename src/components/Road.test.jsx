import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { motionValue } from 'motion/react'
import Road from './Road'
import Van from './Van'
import { PUFF_COUNT } from '../utils/drive'
import { ROAD_COLORS, VAN_OFF_ROAD_X } from '../utils/road'

// As with the login card, there is no DOM environment on this workspace
// (ADR-0005), so these are static-markup assertions about the state the Road is
// in — parked, under way, or part way through its Drive — and never a drive of
// the roll-in itself. The Drive's own values are motion values, which is what
// lets a test put the Van anywhere on the Road by rendering it there.

// Motion writes the Van's position as an inline transform at render time, which
// is what makes "parked off the Road" and "parked on it" readable from markup.
const OFF_ROAD = new RegExp(`translateX\\(${VAN_OFF_ROAD_X}px\\)`)

// A Drive as the hook hands it over, with everything the Road draws from it set
// wherever the state under test needs it. The hook derives the wheel angle and
// the readout from the distance; a stub only has to follow it.
const driveAt = ({ distance = 0, tilt = 0, braking = 0 } = {}) => ({
  road: { current: null },
  distance: motionValue(distance),
  tilt: motionValue(tilt),
  vanOpacity: motionValue(1),
  braking: motionValue(braking),
  wheelAngle: motionValue(distance),
  readout: motionValue(`${distance}%`),
  readoutOpacity: motionValue(1),
})

describe('the Van', () => {
  const html = renderToString(<Van />)

  it('carries the Kartel livery', () => {
    expect(html).toContain('Kartel')
  })

  it('is decoration, so assistive technology is not told about it', () => {
    expect(html).toContain('aria-hidden="true"')
  })

  it('draws each wheel as its own group, so the Drive can turn it', () => {
    // Motion turns an SVG group about its own bounding box, which is why each
    // wheel being one is what lets the hubs stay put while the spokes turn.
    expect(html.match(/transform-box:fill-box/g) ?? []).toHaveLength(2)
  })
})

describe('the Road before a Delivery', () => {
  const html = renderToString(<Road isDelivering={false} drive={driveAt()} />)

  it('holds the Van clear of its own edge, so it has somewhere to roll from', () => {
    expect(html).toMatch(OFF_ROAD)
  })

  it('keeps the percentage out of sight', () => {
    expect(html).toContain('opacity:0')
  })

  it('mounts the exhaust, drawn behind the Van it trails from', () => {
    expect(html.match(/data-puff="/g) ?? []).toHaveLength(PUFF_COUNT)
    expect(html.indexOf('data-puff="0"')).toBeLessThan(html.indexOf('Kartel'))
  })
})

describe('the Road during a Delivery', () => {
  const html = renderToString(<Road isDelivering drive={driveAt()} />)

  it('parks the Van at the start of the Road', () => {
    expect(html).not.toMatch(OFF_ROAD)
  })

  it('shows the percentage at the far right, hidden from assistive technology', () => {
    expect(html).toContain('0%')
    expect(html).toContain('opacity:1')
    expect(html).toContain('aria-hidden="true"')
  })
})

describe('the Road part way through a Drive', () => {
  const html = renderToString(
    <Road isDelivering drive={driveAt({ distance: 120, tilt: -3 })} />,
  )

  it('puts the Van where the Drive has driven it, leaning as far as it is tilted', () => {
    expect(html).toContain('translateX(120px) rotate(-3deg)')
  })

  it('turns the wheels by the distance behind it, not by the clock', () => {
    expect(html).toContain('rotate(120deg)')
  })
})

describe('the Road at the Setback', () => {
  const html = renderToString(<Road isDelivering drive={driveAt({ braking: 1 })} />)
  const coasting = renderToString(<Road isDelivering drive={driveAt()} />)

  it('lights the brake light, which is unlit for the rest of the Delivery', () => {
    expect(html).toContain(`fill="${ROAD_COLORS.brake}" style="opacity:1"`)
    expect(coasting).toContain(`fill="${ROAD_COLORS.brake}" style="opacity:0"`)
  })
})
