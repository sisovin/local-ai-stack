"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Moon, Sun, Monitor, Palette } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu"
import { useTheme } from "@/lib/theme/theme-context"

export function ThemeSwitcher() {
    const { theme, resolvedTheme, setTheme, toggleTheme, isTransitioning } = useTheme()
    const [isOpen, setIsOpen] = useState(false)

    const getIcon = () => {
        switch (theme) {
            case 'light':
                return <Sun className="h-4 w-4" />
            case 'dark':
                return <Moon className="h-4 w-4" />
            default:
                return <Monitor className="h-4 w-4" />
        }
    }

    const themes = [
        {
            value: 'light',
            label: 'Light Mode',
            icon: Sun,
            description: 'Clean and bright',
            gradient: 'from-yellow-400 to-orange-500'
        },
        {
            value: 'dark',
            label: 'Dark Mode',
            icon: Moon,
            description: 'Easy on the eyes',
            gradient: 'from-blue-600 to-purple-600'
        },
        {
            value: 'system',
            label: 'System',
            icon: Monitor,
            description: 'Follows device setting',
            gradient: 'from-gray-500 to-gray-700'
        },
    ] as const

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 text-medium-contrast hover:text-neon-green hover:bg-surface-glass border border-border/30 hover:border-neon-green/50 transition-all duration-300 group relative overflow-hidden"
                    disabled={isTransitioning}
                >
                    {/* Animated background */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-neon-green/10 to-electric-blue/10 opacity-0 group-hover:opacity-100"
                        initial={false}
                        animate={{
                            scale: isTransitioning ? [1, 1.2, 1] : 1,
                            rotate: isTransitioning ? [0, 180, 360] : 0
                        }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Icon with rotation animation */}
                    <motion.div
                        className="relative z-10"
                        animate={{
                            rotate: isTransitioning ? 360 : 0,
                            scale: isOpen ? 1.1 : 1
                        }}
                        transition={{
                            duration: isTransitioning ? 0.5 : 0.2,
                            ease: "easeInOut"
                        }}
                    >
                        {getIcon()}
                    </motion.div>

                    {/* Pulse effect on transition */}
                    <AnimatePresence>
                        {isTransitioning && (
                            <motion.div
                                className="absolute inset-0 rounded-md border-2 border-neon-green/50"
                                initial={{ scale: 1, opacity: 1 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            />
                        )}
                    </AnimatePresence>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="glass-card border border-border/30 backdrop-blur-xl bg-background/95 w-64"
                sideOffset={8}
            >
                <div className="p-2">
                    <div className="flex items-center space-x-2 mb-3 px-2">
                        <Palette className="h-4 w-4 text-neon-green" />
                        <span className="text-sm font-medium text-high-contrast">Theme Settings</span>
                    </div>

                    <DropdownMenuSeparator className="bg-border/30" />

                    <div className="space-y-1 mt-3">
                        {themes.map((themeOption) => (
                            <DropdownMenuItem
                                key={themeOption.value}
                                onClick={() => setTheme(themeOption.value)}
                                className="cursor-pointer hover:bg-surface-glass focus:bg-surface-glass transition-all duration-200 rounded-lg p-3 group"
                            >
                                <motion.div
                                    className="flex items-center space-x-3 w-full"
                                    whileHover={{ x: 2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {/* Theme icon with gradient background */}
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${themeOption.gradient} flex items-center justify-center shadow-lg`}>
                                        <themeOption.icon className="h-4 w-4 text-white" />
                                    </div>

                                    {/* Theme info */}
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-high-contrast group-hover:text-neon-green transition-colors">
                                            {themeOption.label}
                                        </div>
                                        <div className="text-xs text-medium-contrast">
                                            {themeOption.description}
                                        </div>
                                    </div>

                                    {/* Active indicator */}
                                    <AnimatePresence>
                                        {theme === themeOption.value && (
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="w-3 h-3 bg-neon-green rounded-full shadow-md shadow-neon-green/50"
                                            />
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </DropdownMenuItem>
                        ))}
                    </div>

                    <DropdownMenuSeparator className="bg-border/30 my-3" />

                    {/* Quick toggle button */}
                    <DropdownMenuItem
                        onClick={toggleTheme}
                        className="cursor-pointer hover:bg-surface-glass focus:bg-surface-glass transition-all duration-200 rounded-lg p-3"
                    >
                        <motion.div
                            className="flex items-center space-x-3 w-full"
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-neon-green to-electric-blue flex items-center justify-center">
                                <motion.div
                                    animate={{ rotate: isTransitioning ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {resolvedTheme === 'dark' ?
                                        <Sun className="h-4 w-4 text-white" /> :
                                        <Moon className="h-4 w-4 text-white" />
                                    }
                                </motion.div>
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-high-contrast">
                                    Quick Toggle
                                </div>
                                <div className="text-xs text-medium-contrast">
                                    Switch to {resolvedTheme === 'dark' ? 'light' : 'dark'} mode
                                </div>
                            </div>
                        </motion.div>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
