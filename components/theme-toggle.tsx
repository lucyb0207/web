'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

/**
 * Theme toggle — flips between light / dark.
 * - First visit: respects `prefers-color-scheme` (applied by the inline script in layout).
 * - After click: persists `localStorage.theme = 'light' | 'dark'`.
 * - Inline script in <head> prevents FOUC on reload.
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      /* ignore — Safari private mode */
    }
  }

  // Placeholder during SSR to avoid layout shift
  if (!mounted) {
    return <div className="h-8 w-8" aria-hidden />
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light' : 'Switch to dark'}
      className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative"
    >
      {/* Sun (shows in dark mode — click to go light) */}
      <Sun
        className={`h-4 w-4 transition-all ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50 absolute inset-0 m-auto'
        }`}
      />
      {/* Moon (shows in light mode — click to go dark) */}
      <Moon
        className={`h-4 w-4 transition-all ${
          isDark ? 'opacity-0 rotate-90 scale-50 absolute inset-0 m-auto' : 'opacity-100 rotate-0 scale-100'
        }`}
      />
    </button>
  )
}
