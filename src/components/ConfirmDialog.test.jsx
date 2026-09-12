import { describe, expect, it, vi } from 'vitest'
import { renderToString } from 'react-dom/server'
import ConfirmDialog from './ConfirmDialog'

// The real Dialog renders its children through a portal, which has nothing to
// mount into under renderToString. A plain wrapper keeps the copy itself under
// test without pulling a whole DOM environment into the suite.
vi.mock('@mui/material/Dialog', () => ({
  default: ({ open, children }) => (open ? <div>{children}</div> : null),
}))

const noop = () => {}

const PROPS = {
  title: 'Sign out?',
  message: 'You will lose your game.',
  confirmLabel: 'Sign Out',
  onConfirm: noop,
  onCancel: noop,
}

describe('ConfirmDialog', () => {
  it('shows the title, message and confirm label it is given', () => {
    const html = renderToString(<ConfirmDialog open {...PROPS} />)

    expect(html).toContain('Sign out?')
    expect(html).toContain('You will lose your game.')
    expect(html).toContain('Sign Out')
  })

  it('renders nothing while closed', () => {
    const html = renderToString(<ConfirmDialog open={false} {...PROPS} />)

    expect(html).not.toContain('Sign out?')
    expect(html).not.toContain('You will lose your game.')
  })
})
