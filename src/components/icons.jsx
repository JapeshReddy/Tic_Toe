import SvgIcon from '@mui/material/SvgIcon'

// Inline line icons, replacing @mui/icons-material. That package shipped
// roughly 2,100 icons across five module formats — 31,858 files, 80% of
// node_modules — so that three of them could be used. Bundle size was never
// the issue (Vite tree-shakes per-path imports); install time is driven by
// file count, and it made a cold npm ci in the agent sandbox unworkable.
//
// Drawn as strokes rather than filled glyphs: 2px, butt caps, mitred joins, to
// sit with the theme's hard edges instead of Material's rounded terminals.
const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'butt',
  strokeLinejoin: 'miter',
}

// Shares the SvgIcon wrapper so each icon is only its own geometry. SvgIcon
// keeps MUI's sizing and colour inheritance, so these drop into IconButton and
// Button startIcon exactly as the previous icons did.
function LineIcon({ children, ...props }) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <g {...STROKE}>{children}</g>
    </SvgIcon>
  )
}

// Shown when the theme is dark, to switch to light.
export function SunIcon(props) {
  return (
    <LineIcon {...props}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </LineIcon>
  )
}

// Shown when the theme is light, to switch to dark.
export function MoonIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </LineIcon>
  )
}

// A counter-clockwise arrow: start the game over.
export function RestartIcon(props) {
  return (
    <LineIcon {...props}>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </LineIcon>
  )
}
