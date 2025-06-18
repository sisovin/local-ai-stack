"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    resolvedTheme: ResolvedTheme
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
    isTransitioning: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
    children: ReactNode
    defaultTheme?: Theme
    enableTransitions?: boolean
}

export function ThemeProvider({
    children,
    defaultTheme = 'dark',
    enableTransitions = true
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme)
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark')
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Initialize theme from localStorage and system preferences
    useEffect(() => {
        setMounted(true)

        const stored = localStorage.getItem('theme') as Theme | null
        const initialTheme = stored || defaultTheme

        setTheme(initialTheme)
        applyTheme(initialTheme)
    }, [defaultTheme])

    // Listen to system theme changes
    useEffect(() => {
        if (!mounted) return

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme('system')
            }
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [theme, mounted])

    const applyTheme = (newTheme: Theme) => {
        const root = document.documentElement
        let effectiveTheme: ResolvedTheme

        if (newTheme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            effectiveTheme = systemPrefersDark ? 'dark' : 'light'
        } else {
            effectiveTheme = newTheme
        }

        // Start transition animation
        if (enableTransitions && mounted) {
            setIsTransitioning(true)

            // Add transition class
            root.style.setProperty('--theme-transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)')
            document.body.style.transition = 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s cubic-bezier(0.4, 0, 0.2, 1)'

            setTimeout(() => {
                setIsTransitioning(false)
                root.style.removeProperty('--theme-transition')
                document.body.style.transition = ''
            }, 300)
        }

        // Apply theme classes
        if (effectiveTheme === 'dark') {
            root.classList.add('dark')
            root.setAttribute('data-theme', 'dark')
        } else {
            root.classList.remove('dark')
            root.setAttribute('data-theme', 'light')
        }

        // Update CSS custom properties for smoother transitions
        updateCSSVariables(effectiveTheme)

        setResolvedTheme(effectiveTheme)
    }

    const updateCSSVariables = (theme: ResolvedTheme) => {
        const root = document.documentElement

        if (theme === 'dark') {
            root.style.setProperty('--background', 'oklch(0.05 0.01 220)')
            root.style.setProperty('--foreground', 'oklch(0.98 0.01 180)')
            root.style.setProperty('--muted', 'oklch(0.12 0.02 220)')
            root.style.setProperty('--border', 'oklch(0.15 0.02 220)')
        } else {
            root.style.setProperty('--background', 'oklch(0.98 0.01 180)')
            root.style.setProperty('--foreground', 'oklch(0.05 0.01 220)')
            root.style.setProperty('--muted', 'oklch(0.95 0.01 180)')
            root.style.setProperty('--border', 'oklch(0.90 0.01 180)')
        }
    }

    const handleSetTheme = (newTheme: Theme) => {
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        applyTheme(newTheme)
    }

    const toggleTheme = () => {
        const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
        handleSetTheme(newTheme)
    }

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="min-h-screen bg-background">
                {children}
            </div>
        )
    }

    const value: ThemeContextType = {
        theme,
        resolvedTheme,
        setTheme: handleSetTheme,
        toggleTheme,
        isTransitioning,
    }

    return (
        <ThemeContext.Provider value={value}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={resolvedTheme}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.3,
                        ease: [0.4, 0, 0.2, 1]
                    }}
                    className="min-h-screen"
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        // Return default values when used outside of ThemeProvider (e.g., during SSR/SSG)
        return {
            theme: 'dark' as Theme,
            setTheme: () => { },
            resolvedTheme: 'dark' as ResolvedTheme,
            toggleTheme: () => { },
            isTransitioning: false
        }
    }
    return context
}

// Theme transition component for smooth visual effects
export function ThemeTransition() {
    const { isTransitioning, resolvedTheme } = useTheme()

    if (!isTransitioning) return null

    return (
        <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
        >
            <motion.div
                className={`absolute inset-0 ${resolvedTheme === 'dark'
                    ? 'bg-gradient-to-br from-background via-tech-gray to-background'
                    : 'bg-gradient-to-br from-white via-gray-100 to-white'
                    }`}
                initial={{ scale: 0, borderRadius: '50%' }}
                animate={{ scale: 1.5, borderRadius: '0%' }}
                transition={{
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1]
                }}
                style={{
                    transformOrigin: 'center center',
                }}
            />
        </motion.div>
    )
}
