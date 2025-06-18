"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { ChatInterface } from "@/components/ChatInterface"
import Sidebar from "@/components/Sidebar"
import MarketingHomepage from "@/components/MarketingHomepage"
import { authService, supabase } from "@/utils/supabaseClient"
import {
    Brain,
    Rocket,
    Settings,
    Users,
    Clock,
    BarChart3,
    Search,
    Play,
    Activity,
    Bug,
    FileText,
    Monitor,
    MessageSquare
} from "lucide-react"

interface User {
    id: string;
    email?: string;
}

export default function HomePage() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showChat, setShowChat] = useState(false)
    const [projectsCompleted, setProjectsCompleted] = useState(0)
    const [activeUsers, setActiveUsers] = useState(0)
    const [modelsDeployed, setModelsDeployed] = useState(0)
    const [uptime, setUptime] = useState(0)
    const parallaxRef = useRef<HTMLDivElement>(null)

    // Hero slider content
    const heroSlides = [
        {
            title: "Next-Gen AI Infrastructure",
            subtitle: "Deploy DeepSeek R1, Qwen 3, and custom models with quantum-ready architecture",
            background: "bg-gradient-to-br from-neon-green/20 via-electric-blue/10 to-cyber-purple/20"
        },
        {
            title: "Enterprise-Grade Security",
            subtitle: "Your data never leaves your infrastructure. Complete privacy and control.",
            background: "bg-gradient-to-br from-electric-blue/20 via-cyber-purple/10 to-neon-green/20"
        },
        {
            title: "OpenAI Compatible API",
            subtitle: "Drop-in replacement with enhanced performance and local processing",
            background: "bg-gradient-to-br from-cyber-purple/20 via-neon-green/10 to-electric-blue/20"
        }
    ]

    // Services data
    const services = [
        {
            name: "Dashboard",
            description: "Real-time monitoring and control center for your AI infrastructure",
            icon: Monitor,
            gradient: "from-neon-green to-electric-blue",
            href: "/dashboard"
        },
        {
            name: "Chat Interface",
            description: "Conversational AI with multiple model support and advanced reasoning",
            icon: MessageSquare,
            gradient: "from-electric-blue to-cyber-purple",
            href: "/chat"
        },
        {
            name: "AI Web Search",
            description: "Intelligent search with AI-powered analysis and summarization",
            icon: Search,
            gradient: "from-cyber-purple to-neon-green",
            href: "/search"
        },
        {
            name: "API Playground",
            description: "Test and experiment with AI models in an interactive environment",
            icon: Play,
            gradient: "from-neon-green to-electric-blue",
            href: "/playground"
        },
        {
            name: "Model Management",
            description: "Deploy, configure, and optimize AI models for peak performance",
            icon: Brain,
            gradient: "from-electric-blue to-cyber-purple",
            href: "/models"
        },
        {
            name: "Monitoring",
            description: "Advanced analytics and performance metrics for all AI services",
            icon: BarChart3,
            gradient: "from-cyber-purple to-neon-green",
            href: "/monitoring"
        },
        {
            name: "Live",
            description: "Real-time AI processing with streaming responses and live updates",
            icon: Activity,
            gradient: "from-neon-green to-electric-blue",
            href: "/live"
        },
        {
            name: "Debug",
            description: "Comprehensive debugging tools for AI model development and testing",
            icon: Bug,
            gradient: "from-electric-blue to-cyber-purple",
            href: "/debug"
        },
        {
            name: "Documentation",
            description: "Complete guides, API references, and integration tutorials",
            icon: FileText,
            gradient: "from-cyber-purple to-neon-green",
            href: "/docs"
        },
        {
            name: "Settings",
            description: "Configure AI models, security settings, and system preferences",
            icon: Settings,
            gradient: "from-neon-green to-electric-blue",
            href: "/settings"
        }
    ]

    // Testimonials
    const testimonials = [
        {
            name: "Dr. Sarah Chen",
            role: "AI Research Director",
            company: "TechCorp Industries",
            content: "This LocalAI Stack has revolutionized our research workflow. The performance is incredible and the privacy guarantees are exactly what we needed.",
            avatar: "/avatars/placeholder-60.svg"
        },
        {
            name: "Marcus Rodriguez",
            role: "CTO",
            company: "DataFlow Solutions",
            content: "Migrating from cloud AI to this local stack saved us 70% in costs while improving response times by 3x. Game changer for our business.",
            avatar: "/avatars/placeholder-60-alt1.svg"
        }, {
            name: "Emily Watson",
            role: "ML Engineer",
            company: "Innovation Labs",
            content: "The API compatibility made switching seamless. We're now running 10+ models locally with better performance than any cloud provider.",
            avatar: "/avatars/placeholder-60-alt2.svg"
        }
    ]

    useEffect(() => {
        // Check authentication
        checkAuthStatus()

        // Animate stats counters
        const interval = setInterval(() => {
            setProjectsCompleted(prev => prev < 500 ? prev + 7 : 500)
            setActiveUsers(prev => prev < 1200 ? prev + 17 : 1200)
            setModelsDeployed(prev => prev < 48 ? prev + 1 : 48)
            setUptime(prev => prev < 99.9 ? Math.min(prev + 0.1, 99.9) : 99.9)
        }, 50)

        // Parallax effect
        const handleScroll = () => {
            if (parallaxRef.current) {
                const scrolled = window.pageYOffset
                const rate = scrolled * 0.5
                parallaxRef.current.style.setProperty('--parallax-y', `${rate}px`)
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            clearInterval(interval)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const checkAuthStatus = async () => {
        try {
            // Use the same robust auth checking as in views page
            const { data: { session }, error: sessionError } = await supabase.auth.getSession()

            if (sessionError) {
                console.warn('Session check failed:', sessionError)
                setUser(null)
                return
            }

            if (session?.user) {
                setUser(session.user)
            } else {
                setUser(null)
            }
        } catch (error) {
            console.warn('Auth check failed, continuing without auth:', error)
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAuthSuccess = () => {
        checkAuthStatus()
    }

    const handleSignOut = async () => {
        try {
            await authService.signOut()
            setUser(null)
        } catch (error) {
            console.error('Sign out failed:', error)
        }
    }

    // Loading screen with enhanced animation
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background circuit-bg flex items-center justify-center relative overflow-hidden">
                {/* Floating 3D mesh gradient background */}
                <div
                    ref={parallaxRef}
                    className="absolute inset-0 opacity-30 mesh-gradient"
                />

                {/* Animated background particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute w-1 h-1 bg-neon-green rounded-full opacity-30 particle-${i + 1} ${i % 4 === 0 ? 'particle-float' :
                                i % 4 === 1 ? 'particle-float-delay-1' :
                                    i % 4 === 2 ? 'particle-float-delay-2' : 'particle-float-delay-3'
                                } particle-position-${i}`}
                        />
                    ))}
                </div>

                <div className="text-center space-y-8 z-10">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-neon-green/30 border-t-neon-green rounded-full animate-spin mx-auto glow-green" />
                        <div className="absolute inset-0 w-24 h-24 border-2 border-electric-blue/20 border-b-electric-blue rounded-full animate-spin-slow mx-auto" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-glow-green">INITIALIZING AI STACK</h2>
                        <p className="text-muted-foreground font-mono">Quantum neural networks coming online...</p>
                        <div className="flex justify-center space-x-1 mt-4">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 bg-neon-green rounded-full animate-pulse ${i === 1 ? 'animation-delay-200' : i === 2 ? 'animation-delay-400' : ''
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Show authentication if not logged in
    if (!user) {
        return <MarketingHomepage />
    }

    // Show chat interface if requested
    if (showChat) {
        return (
            <div className="min-h-screen bg-background">
                <div className="flex">
                    <Sidebar onSignOut={handleSignOut} />
                    <div className="flex-1 ml-72">
                        <ChatInterface onSignOut={handleSignOut} />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="flex">
                <Sidebar onSignOut={handleSignOut} />
                <div className="flex-1 ml-72">
                    <div className="p-8">
                        {/* Authenticated Dashboard Content */}
                        <div className="space-y-8">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-gradient-hero font-heading mb-4">
                                    Welcome to your AI Dashboard
                                </h1>
                                <p className="text-xl text-muted-foreground font-body">
                                    Access all your AI tools and services from one place
                                </p>
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {services.slice(0, 6).map((service, index) => (
                                    <Link key={service.name} href={service.href}>
                                        <Card className="card-hover-lift cursor-pointer h-32">
                                            <CardContent className="flex items-center p-6">
                                                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center mr-4 glow-green`}>
                                                    <service.icon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg font-heading">{service.name}</h3>
                                                    <p className="text-sm text-muted-foreground font-body">{service.description}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
