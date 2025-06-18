"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Navigation } from "@/components/navigation"
import { supabase } from "@/utils/supabaseClient"
import { useT } from "@/lib/i18n"
import {
    Target,
    Eye,
    Heart,
    Shield,
    Zap,
    Users,
    Code,
    Lightbulb,
    CheckCircle,
    Star,
    ArrowRight,
    Calendar,
    TrendingUp,
    ExternalLink,
    Cpu
} from "lucide-react"

interface User {
    id: string;
    email?: string;
}

export default function AboutPage() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTimelineItem, setActiveTimelineItem] = useState(0)
    const timelineRef = useRef<HTMLDivElement>(null)
    const t = useT()

    // Mock company stats
    const stats = [
        { label: t.about.stats.yearsOfExperience, value: "3+", icon: Calendar },
        { label: t.about.stats.projectsCompleted, value: "50+", icon: CheckCircle },
        { label: t.about.stats.satisfiedClients, value: "100+", icon: Users },
        { label: t.about.stats.linesOfCode, value: "1M+", icon: Code }
    ]

    // Technology stacks
    const technologies = {
        frontend: [
            { name: "React", level: 95 },
            { name: "Next.js", level: 90 },
            { name: "TypeScript", level: 85 },
            { name: "Tailwind CSS", level: 92 },
            { name: "Three.js", level: 78 }
        ],
        backend: [
            { name: "Node.js", level: 88 },
            { name: "Python", level: 85 },
            { name: "FastAPI", level: 82 },
            { name: "GraphQL", level: 75 },
            { name: "REST APIs", level: 90 }
        ],
        database: [
            { name: "PostgreSQL", level: 85 },
            { name: "Supabase", level: 88 },
            { name: "Redis", level: 75 },
            { name: "MongoDB", level: 70 },
            { name: "Vector DBs", level: 80 }
        ],
        ai: [
            { name: "OpenAI GPT", level: 90 },
            { name: "DeepSeek R1", level: 85 },
            { name: "Qwen", level: 83 },
            { name: "LangChain", level: 80 },
            { name: "Ollama", level: 88 }
        ],
        cloud: [
            { name: "AWS", level: 80 },
            { name: "Docker", level: 85 },
            { name: "Kubernetes", level: 75 },
            { name: "Vercel", level: 90 },
            { name: "Terraform", level: 70 }
        ]
    }

    // Timeline events
    const timelineEvents = [
        {
            date: t.about.timeline.events.founded.date,
            title: t.about.timeline.events.founded.title,
            description: t.about.timeline.events.founded.description,
            color: "neon-green",
            icon: Lightbulb
        },
        {
            date: t.about.timeline.events.firstRelease.date,
            title: t.about.timeline.events.firstRelease.title,
            description: t.about.timeline.events.firstRelease.description,
            color: "electric-blue",
            icon: Code
        },
        {
            date: t.about.timeline.events.aiIntegration.date,
            title: t.about.timeline.events.aiIntegration.title,
            description: t.about.timeline.events.aiIntegration.description,
            color: "cyber-purple",
            icon: Cpu
        },
        {
            date: t.about.timeline.events.scalingUp.date,
            title: t.about.timeline.events.scalingUp.title,
            description: t.about.timeline.events.scalingUp.description,
            color: "neon-green",
            icon: TrendingUp
        },
        {
            date: t.about.timeline.events.future.date,
            title: t.about.timeline.events.future.title,
            description: t.about.timeline.events.future.description,
            color: "electric-blue",
            icon: Star
        }
    ]

    // Core values with icons
    const coreValues = [
        {
            title: t.about.values.innovation.title,
            description: t.about.values.innovation.description,
            icon: Lightbulb,
            color: "neon-green"
        },
        {
            title: t.about.values.accessibility.title,
            description: t.about.values.accessibility.description,
            icon: Users,
            color: "electric-blue"
        },
        {
            title: t.about.values.security.title,
            description: t.about.values.security.description,
            icon: Shield,
            color: "cyber-purple"
        },
        {
            title: t.about.values.performance.title,
            description: t.about.values.performance.description,
            icon: Zap,
            color: "neon-green"
        }
    ]

    useEffect(() => {
        // Check auth status
        const checkAuth = async () => {
            try {
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
                setLoading(false)
            }
        }
        checkAuth()        // Scroll-triggered timeline animation
        const handleScroll = () => {
            if (timelineRef.current) {
                const rect = timelineRef.current.getBoundingClientRect()
                const windowHeight = window.innerHeight
                const scrollProgress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)))
                const newActiveItem = Math.floor(scrollProgress * timelineEvents.length)
                setActiveTimelineItem(Math.min(newActiveItem, timelineEvents.length - 1))
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [timelineEvents.length])

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-neon-green/30 border-t-neon-green rounded-full animate-spin mx-auto" />
                    <p className="text-medium-contrast">{t.common.loading}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation isAuthenticated={!!user} />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
                {/* Animated background */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyber-purple/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
                </div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="inline-flex items-center space-x-2 bg-neon-green/10 px-4 py-2 rounded-full mb-6">
                            <Heart className="w-4 h-4 text-neon-green" />
                            <span className="text-sm font-mono text-neon-green">BUILT WITH PASSION</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-neon-green via-electric-blue to-cyber-purple bg-clip-text text-transparent leading-tight font-heading">
                            {t.about.title}
                        </h1>

                        <p className="text-xl md:text-2xl text-medium-contrast max-w-3xl mx-auto leading-relaxed font-body">
                            {t.about.subtitle}
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">                            {stats.map((stat) => {
                            const IconComponent = stat.icon
                            return (
                                <Card key={stat.label} className="glass-card hover:glow-green transition-all duration-500 group cursor-pointer">
                                    <CardContent className="p-6 text-center">
                                        <IconComponent className="w-8 h-8 text-neon-green mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                        <div className="text-3xl md:text-4xl font-bold text-neon-green mb-2 font-heading">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-medium-contrast uppercase tracking-widest font-body">
                                            {stat.label}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Mission */}
                        <Card className="glass-card relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardHeader className="relative z-10">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-neon-green to-electric-blue flex items-center justify-center">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-3xl font-bold text-high-contrast font-heading">
                                        {t.about.mission.title}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <p className="text-lg text-medium-contrast leading-relaxed font-body">
                                    {t.about.mission.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Vision */}
                        <Card className="glass-card relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardHeader className="relative z-10">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-electric-blue to-cyber-purple flex items-center justify-center">
                                        <Eye className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-3xl font-bold text-high-contrast font-heading">
                                        {t.about.vision.title}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <p className="text-lg text-medium-contrast leading-relaxed font-body">
                                    {t.about.vision.description}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-bold text-high-contrast mb-6 font-heading">
                            {t.about.values.title}
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-neon-green to-electric-blue mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">                        {coreValues.map((value) => {
                        const IconComponent = value.icon
                        return (
                            <Card key={value.title} className="glass-card relative overflow-hidden group hover:glow-green transition-all duration-500">
                                <div className={`absolute inset-0 bg-gradient-to-br from-${value.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <CardContent className="p-8 text-center relative z-10">
                                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r from-${value.color} to-electric-blue flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-high-contrast mb-4 font-heading">
                                        {value.title}
                                    </h3>
                                    <p className="text-medium-contrast leading-relaxed font-body">
                                        {value.description}
                                    </p>
                                </CardContent>
                            </Card>
                        )
                    })}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-24 relative" ref={timelineRef}>
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-bold text-high-contrast mb-6 font-heading">
                            {t.about.timeline.title}
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-neon-green to-electric-blue mx-auto" />
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        {/* Timeline line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-neon-green via-electric-blue to-cyber-purple" />

                        {timelineEvents.map((event, index) => {
                            const IconComponent = event.icon
                            const isActive = index <= activeTimelineItem
                            const isLeft = index % 2 === 0

                            return (
                                <div key={index} className={`relative flex items-center mb-16 ${isLeft ? 'justify-start' : 'justify-end'}`}>
                                    {/* Timeline node */}
                                    <div className={`absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-${event.color} to-electric-blue flex items-center justify-center z-10 transition-all duration-500 ${isActive ? 'scale-110 shadow-lg shadow-neon-green/50' : 'scale-100'}`}>
                                        <IconComponent className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Content card */}
                                    <Card className={`glass-card w-80 ${isLeft ? 'mr-auto pr-16' : 'ml-auto pl-16'} transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
                                        <CardContent className="p-6">
                                            <div className={`text-sm font-mono text-${event.color} mb-2`}>
                                                {event.date}
                                            </div>
                                            <h3 className="text-xl font-bold text-high-contrast mb-3 font-heading">
                                                {event.title}
                                            </h3>
                                            <p className="text-medium-contrast font-body">
                                                {event.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Technologies Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-bold text-high-contrast mb-6 font-heading">
                            {t.about.technologies.title}
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-neon-green to-electric-blue mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Object.entries(technologies).map(([category, techs]) => (
                            <Card key={category} className="glass-card">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold text-high-contrast font-heading">
                                        {t.about.technologies[category as keyof typeof t.about.technologies]}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {techs.map((tech) => (
                                        <div key={tech.name} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-medium-contrast">{tech.name}</span>
                                                <span className="text-neon-green">{tech.level}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-neon-green to-electric-blue h-2 rounded-full transition-all duration-1000 ease-out skill-bar"
                                                    style={{ width: `${tech.level}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6 text-center">
                    <Card className="glass-card max-w-4xl mx-auto">
                        <CardContent className="p-12">
                            <h2 className="text-4xl md:text-6xl font-bold text-high-contrast mb-6 font-heading">
                                Ready to Build the Future?
                            </h2>
                            <p className="text-xl text-medium-contrast mb-8 max-w-2xl mx-auto font-body">
                                Join us on our mission to democratize AI technology and create innovative solutions that make a difference.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Button
                                    size="lg"
                                    className="btn-hover-glow bg-neon-green hover:bg-neon-green/90 text-black font-bold text-lg px-12 py-6 rounded-full"
                                >
                                    <Users className="mr-3 h-6 w-6" />
                                    Join Our Team
                                    <ArrowRight className="ml-3 h-6 w-6" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="btn-hover-glow glass font-mono text-lg px-8 py-6 border-electric-blue/50 hover:border-electric-blue hover:bg-electric-blue/10 rounded-full"
                                >
                                    <ExternalLink className="mr-3 h-6 w-6" />
                                    View Projects
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}
