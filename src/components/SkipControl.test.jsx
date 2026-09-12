import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import SkipControl, { SkipButton } from './SkipControl'

// There is no DOM environment on this workspace (ADR-0005), so this is the
// control's static markup: that it is a real button with a name, that it is not
// a way of submitting the form it sits in, and that it is not there at the
// start of a Delivery. The fade itself, and the wait behind it, is a timer that
// only a browser can run and is verified by hand.

const noop = () => {}

describe('the Skip control', () => {
  it('is a real button, named for what it does', () => {
    const html = renderToString(<SkipButton onSkip={noop} />)

    expect(html).toMatch(/<button[^>]*>Skip<\/button>/)
  })

  it('is never a way of submitting the login form it lives in', () => {
    const html = renderToString(<SkipButton onSkip={noop} />)

    expect(html).toContain('type="button"')
    expect(html).not.toContain('type="submit"')
  })

  it('is not there at the start of the Delivery it would skip', () => {
    expect(renderToString(<SkipControl onSkip={noop} />)).toBe('')
  })
})
