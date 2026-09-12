import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import Road from './Road'
import Van from './Van'
import { VAN_OFF_ROAD_X } from '../utils/road'

// As with the login card, there is no DOM environment on this workspace
// (ADR-0005), so these are static-markup assertions about the state the Road is
// in — parked or under way — and never a drive of the roll-in itself.

// Motion writes the Van's position as an inline transform at render time, which
// is what makes "parked off the Road" and "parked on it" readable from markup.
const OFF_ROAD = new RegExp(`translateX\\(${VAN_OFF_ROAD_X}px\\)`)

describe('the Van', () => {
  const html = renderToString(<Van />)

  it('carries the Kartel livery', () => {
    expect(html).toContain('Kartel')
  })

  it('is decoration, so assistive technology is not told about it', () => {
    expect(html).toContain('aria-hidden="true"')
  })
})

describe('the Road before a Delivery', () => {
  const html = renderToString(<Road isDelivering={false} />)

  it('holds the Van clear of its own edge, so it has somewhere to roll from', () => {
    expect(html).toMatch(OFF_ROAD)
  })

  it('keeps the percentage out of sight', () => {
    expect(html).toContain('opacity:0')
  })
})

describe('the Road during a Delivery', () => {
  const html = renderToString(<Road isDelivering />)

  it('parks the Van at the start of the Road', () => {
    expect(html).not.toMatch(OFF_ROAD)
  })

  it('shows the percentage at the far right, hidden from assistive technology', () => {
    expect(html).toContain('0%')
    expect(html).toContain('opacity:1')
    expect(html).toContain('aria-hidden="true"')
  })
})
