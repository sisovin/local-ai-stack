"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { useT } from "@/lib/i18n"
import { PageWrapper } from "@/components/PageWrapper"
import {
    Home,
    ArrowLeft,
    Search,
    Bot,
    Zap,
    AlertTriangle,
    RefreshCw,
    ExternalLink,
    ChevronRight
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotFoundPage() {
    const [robotAnimation, setRobotAnimation] = useState(0)
    const [glitchEffect, setGlitchEffect] = useState(false)
    const router = useRouter()
    const t = useT()

    // Simulate robot animation cycles
    useEffect(() => {
        const interval = setInterval(() => {
            setRobotAnimation(prev => (prev + 1) % 4)
        }, 1500)

        const glitchInterval = setInterval(() => {
            setGlitchEffect(true)
            setTimeout(() => setGlitchEffect(false), 200)
        }, 3000)

        return () => {
            clearInterval(interval)
            clearInterval(glitchInterval)
        }
    }, [])

    const handleWarpHome = () => {
        // Add warp effect animation before navigation
        const button = document.querySelector('.warp-button')
        if (button) {
            button.classList.add('warp-active')
            setTimeout(() => {
                router.push('/')
            }, 800)
        }
    }

    const handleGoBack = () => {
        if (window.history.length > 1) {
            router.back()
        } else {
            router.push('/')
        }
    }

    // Robot ASCII art variants for animation
    const robotFrames = [
        `
     ╭─────╮
     │ ◉ ◉ │
     │  ▽  │
     ╰─────╯
        │
    ╭───┴───╮
    │ ERROR │
    │  404  │
    ╰───────╯
        `,
        `
     ╭─────╮
     │ ◎ ◎ │
     │  ◊  │
     ╰─────╯
        │
    ╭───┴───╮
    │ ERROR │
    │  404  │
    ╰───────╯
        `,
        `
     ╭─────╮
     │ ● ● │
     │  △  │
     ╰─────╯
        │
    ╭───┴───╮
    │ ERROR │
    │  404  │
    ╰───────╯
        `,
        `
     ╭─────╮
     │ ○ ○ │
     │  ○  │     ╰─────╯        │
    ╭───┴───╮
    │ ERROR │
    │  404  │
    ╰───────╯
        `
    ]

    return (
        <PageWrapper>
            <div className="min-h-screen bg-background relative overflow-hidden">
                <Navigation isAuthenticated={false} />

                {/* Animated Background Effects */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
                    <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-cyber-purple/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
                </div>

                {/* Glitch overlay */}
                {glitchEffect && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-electric-blue/10 animate-pulse z-10" />
                )}

                <div className="container mx-auto px-6 py-32 relative z-20">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Error Code */}
                        <div className={`mb-8 transition-all duration-300 ${glitchEffect ? 'animate-pulse' : ''}`}>
                            <h1 className={`text-8xl md:text-9xl font-bold bg-gradient-to-r from-red-500 via-electric-blue to-cyber-purple bg-clip-text text-transparent leading-tight font-heading ${glitchEffect ? 'animate-bounce' : ''}`}>
                                404
                            </h1>
                            <div className="text-2xl md:text-3xl text-red-400 font-mono mt-4">
                                ERROR: PAGE NOT FOUND
                            </div>
                        </div>

                        {/* Robot Animation */}
                        <Card className="glass-card max-w-md mx-auto mb-8 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-electric-blue/5 to-cyber-purple/5 animate-pulse" />
                            <CardContent className="p-8 relative z-10">
                                <div className="flex items-center justify-center mb-6">
                                    <Bot className={`w-16 h-16 text-electric-blue transition-transform duration-500 ${robotAnimation % 2 === 0 ? 'rotate-12' : '-rotate-12'}`} />
                                </div>
                                <pre className={`text-xs text-neon-green font-mono leading-tight transition-all duration-300 ${glitchEffect ? 'blur-sm' : ''}`}>
                                    {robotFrames[robotAnimation]}
                                </pre>
                                <div className="mt-4 flex items-center justify-center space-x-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                    <span className="text-sm text-medium-contrast font-mono">
                                        SYSTEM MALFUNCTION
                                    </span>
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping animation-delay-500" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Error Message */}
                        <div className="mb-12 space-y-4">
                            <h2 className="text-3xl md:text-5xl font-bold text-high-contrast font-heading">
                                Oops! You've entered the void
                            </h2>
                            <p className="text-xl text-medium-contrast max-w-2xl mx-auto font-body">
                                The page you're looking for seems to have been digitized into the cyber-space.
                                Don't worry, our quantum navigation system will help you find your way back.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                            {/* Warp Home Button */}
                            <Button
                                onClick={handleWarpHome}
                                size="lg"
                                className="warp-button btn-hover-glow bg-neon-green hover:bg-neon-green/90 text-black font-bold text-lg px-12 py-6 rounded-full relative overflow-hidden group"
                            >
                                <div className="relative z-10 flex items-center">
                                    <Home className="mr-3 h-6 w-6" />
                                    Warp to Home
                                    <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                </div>
                                {/* Warp effect overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            </Button>

                            <Button
                                onClick={handleGoBack}
                                variant="outline"
                                size="lg"
                                className="btn-hover-glow glass font-mono text-lg px-8 py-6 border-electric-blue/50 hover:border-electric-blue hover:bg-electric-blue/10 rounded-full"
                            >
                                <ArrowLeft className="mr-3 h-6 w-6" />
                                Go Back
                            </Button>
                        </div>

                        {/* Helpful Links */}
                        <Card className="glass-card max-w-2xl mx-auto">
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-bold text-high-contrast mb-6 font-heading flex items-center justify-center">
                                    <Search className="w-6 h-6 text-neon-green mr-3" />
                                    Maybe you were looking for...
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { name: "Home", path: "/", icon: Home },
                                        { name: "Chat", path: "/chat", icon: Bot },
                                        { name: "About", path: "/about", icon: AlertTriangle },
                                        { name: "Contact", path: "/contact", icon: ExternalLink },
                                        { name: "Team", path: "/team", icon: Bot },
                                        { name: "Pricing", path: "/pricing", icon: Zap }
                                    ].map((link) => {
                                        const IconComponent = link.icon
                                        return (
                                            <Button
                                                key={link.name}
                                                variant="ghost"
                                                className="justify-start hover:bg-neon-green/10 hover:text-neon-green transition-colors"
                                                onClick={() => router.push(link.path)}
                                            >
                                                <IconComponent className="w-4 h-4 mr-3" />
                                                {link.name}
                                            </Button>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Technical Details */}
                        <div className="mt-12 text-center">
                            <Card className="glass-card max-w-md mx-auto">
                                <CardContent className="p-6">
                                    <div className="text-sm text-medium-contrast font-mono space-y-2">
                                        <div className="flex justify-between">
                                            <span>Status Code:</span>
                                            <span className="text-red-400">404</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Error Type:</span>
                                            <span className="text-electric-blue">Page Not Found</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Timestamp:</span>
                                            <span className="text-cyber-purple">{new Date().toISOString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>User Agent:</span>
                                            <span className="text-neon-green">Quantum Browser</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mt-4 text-xs hover:text-neon-green"
                                        onClick={() => window.location.reload()}
                                    >
                                        <RefreshCw className="w-3 h-3 mr-2" />
                                        Refresh Reality
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* CSS for warp effect */}
                <style jsx>{`
                .warp-button.warp-active {
                    transform: scale(1.1);
                    background: linear-gradient(45deg, #00ff88, #0099ff, #8844ff);
                    animation: warp-effect 0.8s ease-in-out;
                }

                @keyframes warp-effect {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.2) rotate(5deg); }
                    100% { transform: scale(0.8) rotate(-2deg); opacity: 0; }
                }

                .animation-delay-500 {
                    animation-delay: 0.5s;
                }

                .animation-delay-1000 {
                    animation-delay: 1s;
                }                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
            </div>
        </PageWrapper>
    )
}
