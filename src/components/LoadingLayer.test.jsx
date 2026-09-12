import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import LoadingLayer from './LoadingLayer'
import { buildParcels, DOT_CAP } from '../utils/delivery'

// There is no DOM environment on this workspace (ADR-0005), so this is static
// markup for a layer the timeline has not touched yet: what it holds, in what
// order, and in whose colours. Where the Parcels and Dots actually travel to is
// the timeline's business and is verified by eye.

const USERNAME_COLOR = '#E1341E'
const PASSWORD_COLOR = '#1E4FA3'

const COLORS = {
  username: USERNAME_COLOR,
  password: PASSWORD_COLOR,
}

const renderLayer = (username, password) =>
  renderToString(
    <LoadingLayer
      scope={{ current: null }}
      parcels={buildParcels(username, password)}
      colors={COLORS}
    />,
  )

// Emotion writes each element's styles as `.css-hash{...}` in the server-rendered
// stylesheet, so an element's own rule is reachable from its class. That is as
// close to "what colour is this drawn in" as a DOM-less test can get.
const ruleFor = (html, attribute) => {
  const element = html.match(
    new RegExp(`<div class="[^"]*\\b(css-[a-z0-9]+)" ${attribute}>`),
  )
  const rule = html.match(new RegExp(`\\.${element[1]}\\{([^}]*)\\}`))
  return rule[1]
}

const countOf = (html, pattern) => (html.match(pattern) ?? []).length

describe('the Loading layer', () => {
  const html = renderLayer('ana', 'b'.repeat(20))

  it('holds one Dot per Dot the Parcel construction asks for, cap included', () => {
    expect(countOf(html, /data-dot="username-/g)).toBe(3)
    expect(countOf(html, /data-dot="password-/g)).toBe(DOT_CAP)
  })

  it('draws the Username Parcel before the Password Parcel', () => {
    expect(html.indexOf('data-parcel="username"')).toBeLessThan(
      html.indexOf('data-parcel="password"'),
    )
  })

  it('gives each Parcel one player’s colour and the other Parcel the other’s', () => {
    const username = ruleFor(html, 'data-parcel="username"')
    const password = ruleFor(html, 'data-parcel="password"')

    expect(username).toContain(USERNAME_COLOR)
    expect(password).toContain(PASSWORD_COLOR)
    expect(username).not.toContain(PASSWORD_COLOR)
  })

  it('fills each Parcel’s Dots with that same Parcel’s colour', () => {
    for (const kind of ['username', 'password']) {
      const parcel = ruleFor(html, `data-parcel="${kind}"`)
      const dot = ruleFor(html, `data-dot="${kind}-0"`)
      const color = COLORS[kind]

      expect(dot).toContain(color)
      expect(parcel).toContain(color)
      expect(dot).not.toContain(
        color === USERNAME_COLOR ? PASSWORD_COLOR : USERNAME_COLOR,
      )
    }
  })

  it('starts every Parcel and Dot out of sight, for the timeline to place', () => {
    expect(ruleFor(html, 'data-parcel="username"')).toContain('opacity:0')
    expect(ruleFor(html, 'data-dot="username-0"')).toContain('opacity:0')
  })

  it('is decoration: no Dots and no Parcel when neither field was typed in', () => {
    const empty = renderLayer('', '')

    expect(countOf(empty, /data-dot=/g)).toBe(0)
    expect(countOf(empty, /data-parcel="username"/g)).toBe(1)
  })

  it('clips its own edges and never takes a click', () => {
    // This is what keeps the Loading stage inside the card on a narrow screen,
    // and what leaves the Road and the fields it is drawn over working.
    const layer = ruleFor(html, 'aria-hidden="true"')

    expect(layer).toContain('overflow:hidden')
    expect(layer).toContain('pointer-events:none')
  })
})
