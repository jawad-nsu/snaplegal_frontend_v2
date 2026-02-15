'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

const STORAGE_KEY = 'snaplegal-admin-theme'

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(STORAGE_KEY) as 'dark' | 'light' | null
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored)
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, next)
    }
  }

  return (
    <div
      className={`min-h-screen bg-background text-foreground ${theme === 'dark' ? 'dark' : ''}`}
    >
      {children}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        className="fixed top-20 right-4 z-40 flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card text-foreground shadow-sm hover:bg-accent transition-colors"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5" aria-hidden />
        ) : (
          <Moon className="w-5 h-5" aria-hidden />
        )}
      </button>
    </div>
  )
}
