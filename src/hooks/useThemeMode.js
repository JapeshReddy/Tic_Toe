import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'ttt-theme-mode'

// Reads the persisted preference first, then falls back to the OS setting.
function getInitialMode() {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export function useThemeMode() {
  const [mode, setMode] = useState(getInitialMode)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  return { mode, toggleMode }
}
