import { createTheme } from '@mui/material/styles'

// Typeface roles. Jost (geometric, Futura-lineage) carries the Bauhaus display
// voice; Archivo handles UI text; Space Mono marks anything data-like (section
// labels, move numbers).
const DISPLAY_FONT = '"Jost", "Century Gothic", sans-serif'
const BODY_FONT = '"Archivo", "Helvetica Neue", Arial, sans-serif'
const MONO_FONT = '"Space Mono", "SFMono-Regular", Consolas, monospace'

// De Stijl primaries. X always reads red, O always reads blue, everywhere; the
// grid rules are the "line" colour (hard black in light, paper-white in dark);
// yellow is the single reserved accent (focus, draw state).
const PALETTES = {
  light: {
    mode: 'light',
    primary: { main: '#E1341E', contrastText: '#FBF9F4' },
    secondary: { main: '#1E4FA3', contrastText: '#FBF9F4' },
    warning: { main: '#F2C20D', contrastText: '#141414' },
    background: { default: '#F2EFE9', paper: '#FBF9F4' },
    text: { primary: '#141414', secondary: '#5A554C' },
    divider: '#141414',
  },
  dark: {
    mode: 'dark',
    primary: { main: '#FF5A3C', contrastText: '#141414' },
    secondary: { main: '#5B8DE0', contrastText: '#141414' },
    warning: { main: '#F4C63A', contrastText: '#141414' },
    background: { default: '#141414', paper: '#1E1E1C' },
    text: { primary: '#F2EFE9', secondary: '#A8A297' },
    divider: '#F2EFE9',
  },
}

// The signature focus ring: a hard yellow "plane" offset from the control, so
// keyboard focus is unmistakable and on-brand.
const focusRing = {
  outline: '3px solid',
  outlineColor: '#F2C20D',
  outlineOffset: '2px',
}

// Builds the MUI theme for the given palette mode ('light' | 'dark').
export function buildTheme(mode) {
  const palette = PALETTES[mode] ?? PALETTES.light
  const displayHeading = {
    fontFamily: DISPLAY_FONT,
    fontWeight: 800,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  }

  return createTheme({
    palette,
    shape: {
      // Bauhaus is hard-edged: no rounded corners anywhere.
      borderRadius: 0,
    },
    typography: {
      fontFamily: BODY_FONT,
      h4: { ...displayHeading, fontWeight: 900 },
      h5: { ...displayHeading, fontWeight: 900, letterSpacing: '0.06em' },
      h6: displayHeading,
      button: {
        fontFamily: BODY_FONT,
        fontWeight: 700,
        letterSpacing: '0.06em',
      },
      overline: {
        fontFamily: MONO_FONT,
        fontWeight: 700,
        letterSpacing: '0.14em',
        fontSize: '0.7rem',
      },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { '&.Mui-focusVisible': focusRing },
          contained: { border: '2px solid transparent' },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            fontFamily: BODY_FONT,
            fontWeight: 700,
            letterSpacing: '0.04em',
            borderWidth: 2,
            '&.Mui-focusVisible': focusRing,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: { root: { '&.Mui-focusVisible': focusRing } },
      },
    },
  })
}
