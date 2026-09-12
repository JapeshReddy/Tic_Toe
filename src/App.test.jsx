import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import App from './App'
import LoginScreen from './components/LoginScreen'
import { DELIVERY_STATES } from './utils/constants'

// A render smoke test, not a UI test: it catches the class of mistake unit
// tests miss and a successful build does not — a bad hook call, a broken
// provider tree, or a misused Motion API that only fails at render time.
describe('App', () => {
  it('renders without throwing, opening on the login screen', () => {
    const html = renderToString(<App />)
    expect(html).toContain('Log in')
    expect(html).not.toContain('to play')
  })
})

// The login card's static contract, read off the server-rendered markup. There
// is no DOM environment on this workspace (ADR-0005), so attributes and copy are
// as far as the suite can reach; what only exists once a Delivery is running —
// the button's name and busy state, the fields going read-only, focus landing on
// the status bar — is verified by hand.
describe('the login card', () => {
  const html = renderToString(<App />)
  const button = html.indexOf('Log in')

  it('says nothing is checked above the button, and repeats it below', () => {
    const above = html.indexOf('Nothing is checked')
    const below = html.indexOf('Any details work')

    expect(above).toBeGreaterThan(-1)
    expect(above).toBeLessThan(button)
    expect(below).toBeGreaterThan(button)
  })

  it('switches autocomplete off on the form and on both fields', () => {
    // Case-insensitive: React serialises the attribute in the casing it was
    // given, and HTML attribute names do not have one.
    expect(html.match(/autocomplete="off"/gi)).toHaveLength(3)
  })

  it('leaves the fields editable at rest, so a Delivery is what locks them', () => {
    expect(html).not.toContain('readonly')
    expect(html).not.toContain('aria-disabled')
  })

  it('names Kartel once, on the Van, and nowhere else on the screen', () => {
    // The brand belongs to the Van's livery alone; the product on screen is
    // Tic·Tac·Toe, and a second mention would mean it had leaked into copy.
    expect(html.match(/Kartel/g)).toHaveLength(1)
  })

  it('offers no way out of a Delivery that is not running', () => {
    expect(html).not.toContain('Skip')
  })
})

// The Loading layer's place in the card. What it holds and in whose colours is
// LoadingLayer.test.jsx's business; what matters here is that the card is where
// it lives, and that it is drawn after the Road it delivers into.
describe('the login card’s Loading layer', () => {
  const html = renderToString(<App />)

  it('waits on the card with both Parcels, Username first', () => {
    const username = html.indexOf('data-parcel="username"')

    expect(username).toBeGreaterThan(-1)
    expect(html.indexOf('data-parcel="password"')).toBeGreaterThan(username)
  })

  it('is drawn over the button, so a Parcel can be carried into the Van', () => {
    expect(html.indexOf('data-parcel="username"')).toBeGreaterThan(
      html.indexOf('Log in'),
    )
  })
})

// The card as it stands mid-Delivery: static markup for a state the reducer
// already models, not a drive of the timeline, which is not a test's business
// (ADR-0004). What it pins is the accessibility contract — the parts of it that
// exist in markup at all.
describe('the login card during a Delivery', () => {
  const html = renderToString(
    <LoginScreen
      delivery={DELIVERY_STATES.DELIVERING}
      onSignIn={() => {}}
      onSkip={() => {}}
      onArrive={() => {}}
    />,
  )

  it('keeps the button named and busy, and never actually disabled', () => {
    expect(html).toContain('aria-label="Signing in"')
    expect(html).toContain('aria-busy="true"')
    expect(html).not.toMatch(/<button[^>]*\sdisabled/)
  })

  it('keeps the faded label in the button, so nothing is left unlabelled', () => {
    expect(html).toContain('Log in')
  })

  it('makes both fields read-only, announced as disabled but still focusable', () => {
    expect(html.match(/readonly=""/g)).toHaveLength(2)
    expect(html.match(/aria-disabled="true"/g)).toHaveLength(2)
    // Read-only, not disabled: a disabled field loses focus, and focus has to
    // survive a Delivery so a keyboard user is not dropped at the document top.
    expect(html).not.toMatch(/<input[^>]*\sdisabled/)
  })

  it('leaves the Skip control out until it has earned its place', () => {
    // It fades in a couple of seconds in, once the Van is the thing being
    // watched; at the moment a Delivery starts there is no exit on the card.
    expect(html).not.toContain('Skip')
  })
})
