import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import App from './App'

// A render smoke test, not a UI test: it catches the class of mistake unit
// tests miss and a successful build does not — a bad hook call, a broken
// provider tree, or a misused Motion API that only fails at render time.
describe('App', () => {
  it('renders without throwing', () => {
    const html = renderToString(<App />)
    expect(html).toContain('to play')
  })
})
