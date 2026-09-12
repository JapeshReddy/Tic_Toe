# The Road is exempt from theming

The Road — the login button's interior, along which the van drives — is a fixed
`#141414` in both light and dark mode, rather than following a palette token
such as `text.primary` or `divider`. Everything that sits on it (the bone van,
the red and blue Parcels, the red brake light, the percentage) is likewise
fixed, so the Road and its contents are the one part of the UI the theme does
not reach.

## Consequences

A hardcoded colour in an otherwise fully themed app looks like an oversight, and
the obvious "fix" is to swap it for `text.primary`. Doing so breaks the feature
in dark mode: `text.primary` is bone `#F2EFE9` there, which makes a white van on
a white road invisible, and the red brake light nearly so. Keeping the Road dark
in both modes is also simply truer — a road is dark — and it means the van,
Parcels, brake light and percentage need exactly one set of colours rather than
two. The only accommodation required is a `divider`-coloured border on the
button, because in dark mode the Road (`#141414`) is a near-match for the card
(`#1E1E1C`).
