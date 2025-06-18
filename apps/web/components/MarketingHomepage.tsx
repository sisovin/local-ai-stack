"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Navigation } from "@/components/navigation"
import ThreeBackground from "@/components/ThreeBackground"
import { useT } from "@/lib/i18n"
import {
    Monitor,
    MessageSquare,
    Search,
    Play,
    Brain,
    BarChart3,
    Activity,
    ArrowRight,
    FileText,
    Star,
    ChevronLeft,
    ChevronRight,
    Github,
    Twitter,
    Linkedin,
    Mail,
    BarChart2
} from "lucide-react"

export default function MarketingHomepage() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [currentTestimonial, setCurrentTestimonial] = useState(0)
    const t = useT() // Get translations

    // Hero slides data
    const heroSlides = [
        {
            title: "Next-Gen AI Infrastructure",
            subtitle: "Deploy advanced AI models with quantum-ready architecture",
            background: "mesh-gradient"
        },
        {
            title: "Cyberpunk AI Experience",
            subtitle: "Immerse yourself in the future of artificial intelligence",
            background: "futuristic-bg"
        },
        {
            title: "Quantum Neural Networks",
            subtitle: "Harness the power of quantum computing for AI acceleration",
            background: "tech-gradient"
        }
    ]

    // Stats data
    const stats = [
        { label: "AI Models", value: "50+", suffix: "" },
        { label: "Active Users", value: "10", suffix: "K+" },
        { label: "Uptime", value: "99.9", suffix: "%" },
        { label: "Response Time", value: "<100", suffix: "ms" }
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
            name: "Analytics Views",
            description: "Advanced analytics and data visualization for AI performance insights",
            icon: BarChart2,
            gradient: "from-cyber-purple to-neon-green",
            href: "/views"
        }
    ]

    // Testimonials data
    const testimonials = [
        {
            name: "Alex Chen",
            role: "AI Research Director",
            company: "TechCorp",
            content: "LocalAI Stack revolutionized our AI development workflow. The quantum-ready architecture is phenomenal.",
            avatar: "/avatars/placeholder-64.svg",
            rating: 5
        },
        {
            name: "Sarah Rodriguez",
            role: "CTO",
            company: "InnovateAI",
            content: "The cyberpunk UI isn't just beautiful - it's incredibly functional. Our team's productivity increased by 300%.",
            avatar: "/avatars/placeholder-64-alt1.svg",
            rating: 5
        },
        {
            name: "Marcus Thompson",
            role: "ML Engineer",
            company: "DataCorp",
            content: "Best local AI infrastructure I've ever used. The Three.js integration and real-time monitoring are game-changers.",
            avatar: "/avatars/placeholder-64-alt2.svg",
            rating: 5
        }
    ]

    // Auto-advance slides
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    // Auto-advance testimonials
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <Navigation isAuthenticated={false} />

            {/* Three.js 3D Background */}
            <ThreeBackground particleCount={150} enableInteraction={true} />

            {/* Floating 3D mesh gradient background */}
            <div className="fixed inset-0 opacity-20 pointer-events-none futuristic-bg" />

            {/* Hero Section with Parallax Slider */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated background layers */}
                <div className="absolute inset-0">
                    {heroSlides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-all duration-1000 ${slide.background} ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        />
                    ))}
                </div>

                {/* Parallax particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(100)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse hero-particle-${i % 10}`}
                        />
                    ))}
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center space-y-12">
                        {/* Hero content with slider */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center space-x-2 bg-glass px-6 py-3 rounded-full border border-neon-green/30">
                                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                                <span className="text-sm font-mono text-neon-green">QUANTUM NEURAL NETWORKS ONLINE</span>
                            </div>

                            <div className="space-y-6">
                                <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-neon-green via-electric-blue to-cyber-purple bg-clip-text text-transparent leading-tight font-heading">
                                    {heroSlides[currentSlide]?.title || "Next-Gen AI Infrastructure"}
                                </h1>                                <p className="text-xl md:text-2xl text-medium-contrast max-w-4xl mx-auto leading-relaxed font-body">
                                    {heroSlides[currentSlide]?.subtitle || "Deploy advanced AI models with quantum-ready architecture"}
                                </p>
                            </div>

                            {/* Animated stats counter */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                                {stats.map((stat, index) => (
                                    <Card key={stat.label} className="glass-card hover:glow-green transition-all duration-500 group cursor-pointer">
                                        <CardContent className="p-6 text-center">
                                            <div className="text-3xl md:text-4xl font-bold text-neon-green mb-2 stats-counter font-heading">
                                                {stat.value}{stat.suffix}
                                            </div>                                            <div className="text-sm text-medium-contrast uppercase tracking-widest font-body">
                                                {stat.label}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* CTA with glowing button effect */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16">                                <Link href="/auth/register">
                                <Button
                                    size="lg"
                                    className="btn-hover-glow relative group bg-neon-green hover:bg-neon-green/90 text-black font-bold text-lg px-12 py-6 rounded-full transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <MessageSquare className="mr-3 h-6 w-6 relative z-10" />
                                    <span className="relative z-10">{t.marketing.getStarted}</span>
                                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform relative z-10" />
                                </Button>
                            </Link>

                                <Link href="/docs">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="btn-hover-glow glass font-mono text-lg px-8 py-6 border-electric-blue/50 hover:border-electric-blue hover:bg-electric-blue/10 group rounded-full"
                                    >
                                        <FileText className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                                        {t.nav.docs}
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Slider indicators */}
                        <div className="flex justify-center space-x-3">
                            {heroSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                        ? 'bg-neon-green scale-125'
                                        : 'bg-white/30 hover:bg-white/50'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-32 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">                        <h2 className="text-5xl md:text-6xl font-bold mb-6 text-high-contrast font-heading">
                        Quantum AI Services
                    </h2>
                        <p className="text-xl text-medium-contrast max-w-3xl mx-auto font-body leading-relaxed">
                            Experience the future of artificial intelligence with our cutting-edge quantum-ready infrastructure
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                        {services.map((service, index) => (
                            <Link key={service.name} href={service.href}>
                                <Card className="group cursor-pointer h-64 perspective-1000 card-hover-lift">
                                    <div className="relative w-full h-full preserve-3d transition-transform duration-700 group-hover:rotate-y-180">
                                        {/* Front face */}
                                        <div className="absolute inset-0 w-full h-full backface-hidden glass-card border border-white/10">
                                            <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                                                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform glow-green`}>
                                                    <service.icon className="w-8 h-8 text-white" />
                                                </div>
                                                <h3 className="text-lg font-bold text-high-contrast mb-2 font-heading">{service.name}</h3>
                                                <div className="w-8 h-1 bg-gradient-to-r from-neon-green to-electric-blue rounded-full" />
                                            </CardContent>
                                        </div>

                                        {/* Back face */}
                                        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 glass-card border border-white/10">
                                            <CardContent className="flex flex-col justify-center h-full p-6 text-center">
                                                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-4 mx-auto glow-blue`}>
                                                    <service.icon className="w-6 h-6 text-white" />
                                                </div>                                                <h3 className="text-sm font-bold text-high-contrast mb-3 font-heading">{service.name}</h3>
                                                <p className="text-xs text-medium-contrast leading-relaxed font-body">{service.description}</p>
                                                <div className="mt-4">
                                                    <div className="inline-flex items-center text-xs text-shimmer">
                                                        Learn More <ArrowRight className="w-3 h-3 ml-1" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-32 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">                        <h2 className="text-5xl md:text-6xl font-bold mb-6 text-high-contrast font-heading">
                        What Developers Say
                    </h2>
                        <p className="text-xl text-medium-contrast max-w-3xl mx-auto font-body leading-relaxed">
                            Join thousands of developers who are building the future with LocalAI Stack
                        </p>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        <div className="overflow-hidden">
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className={`transition-all duration-700 ease-in-out ${index === currentTestimonial
                                        ? 'opacity-100 transform translate-x-0'
                                        : 'opacity-0 transform translate-x-full absolute inset-0'
                                        }`}
                                >
                                    <Card className="glass-card max-w-3xl mx-auto">
                                        <CardContent className="p-12 text-center">
                                            <div className="flex justify-center mb-6">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                                                ))}
                                            </div>                                            <blockquote className="text-2xl mb-8 text-high-contrast leading-relaxed font-body">
                                                "{testimonial.content}"
                                            </blockquote>
                                            <div className="flex items-center justify-center space-x-4">
                                                <img
                                                    src={testimonial.avatar}
                                                    alt={testimonial.name}
                                                    className="w-16 h-16 rounded-full border-2 border-neon-green/30"
                                                />
                                                <div className="text-left">
                                                    <div className="font-bold text-lg text-neon-green font-heading">
                                                        {testimonial.name}
                                                    </div>                                                    <div className="text-muted-foreground font-body">
                                                        {testimonial.role} at {testimonial.company}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-center space-x-4 mt-8">
                        <button
                            onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                            className="w-12 h-12 rounded-full bg-glass border border-border hover:border-neon-green hover:bg-neon-green/10 transition-all duration-200 flex items-center justify-center"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                            className="w-12 h-12 rounded-full bg-glass border border-border hover:border-neon-green hover:bg-neon-green/10 transition-all duration-200 flex items-center justify-center"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA Section with Glowing Button */}
            <section className="py-32 relative">
                <div className="container mx-auto px-6">
                    <Card className="glass-card border-neon-green/30 max-w-4xl mx-auto">
                        <CardContent className="p-16 text-center">
                            <div className="space-y-8">
                                <div className="inline-flex items-center space-x-2 bg-neon-green/10 px-4 py-2 rounded-full">
                                    <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                                    <span className="text-sm font-mono text-neon-green">LIMITED EARLY ACCESS</span>
                                </div>

                                <h2 className="text-4xl md:text-5xl font-bold text-gradient-hero font-heading">
                                    Ready to Build the Future?
                                </h2>                                <p className="text-xl text-medium-contrast max-w-2xl mx-auto font-body leading-relaxed">
                                    Join the next generation of AI developers. Get instant access to quantum-ready infrastructure.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link href="/auth/register">
                                        <Button
                                            size="lg"
                                            className="btn-hover-glow bg-neon-green hover:bg-neon-green/90 text-black font-bold text-lg px-8 py-4 rounded-full"
                                        >
                                            <Brain className="mr-2 h-5 w-5" />
                                            Get Started Free
                                        </Button>
                                    </Link>

                                    <Link href="/contact">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="glass border-electric-blue/50 hover:border-electric-blue hover:bg-electric-blue/10 text-lg px-8 py-4 rounded-full"
                                        >
                                            <MessageSquare className="mr-2 h-5 w-5" />
                                            Contact Sales
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 border-t border-border/50 bg-card/50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand */}
                        <div className="col-span-1 md:col-span-2">
                            <Link href="/" className="flex items-center space-x-3 mb-6">
                                <div className="w-8 h-8 bg-neon-green rounded-lg flex items-center justify-center">
                                    <Brain className="h-5 w-5 text-background" />
                                </div>
                                <span className="text-xl font-bold text-neon-green font-heading">
                                    LocalAI Stack
                                </span>
                            </Link>                            <p className="text-medium-contrast mb-6 max-w-md font-body leading-relaxed">
                                The future of AI infrastructure. Quantum-ready, cyberpunk-styled, and developer-first.
                            </p>

                            {/* Newsletter */}
                            <form className="space-y-4">
                                <h4 className="font-bold text-lg font-heading">Stay Updated</h4>
                                <div className="flex space-x-2">
                                    <input
                                        id="newsletter-email"
                                        name="newsletter-email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:border-neon-green focus:outline-none"
                                        aria-label="Email address for newsletter subscription"
                                    />
                                    <Button
                                        type="submit"
                                        className="bg-neon-green hover:bg-neon-green/90 text-black font-semibold"
                                    >
                                        Subscribe
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="font-bold text-lg mb-4 font-heading">Product</h4>
                            <div className="space-y-2">                                <Link href="/features" className="block text-medium-contrast hover:text-neon-green transition-colors">
                                Features
                            </Link>
                                <Link href="/pricing" className="block text-medium-contrast hover:text-neon-green transition-colors">
                                    Pricing
                                </Link>
                                <Link href="/docs" className="block text-medium-contrast hover:text-neon-green transition-colors">
                                    Documentation
                                </Link>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4 font-heading">Company</h4>
                            <div className="space-y-2">                                <Link href="/about" className="block text-medium-contrast hover:text-neon-green transition-colors">
                                About Us
                            </Link>
                                <Link href="/contact" className="block text-medium-contrast hover:text-neon-green transition-colors">
                                    Contact
                                </Link>
                                <Link href="/careers" className="block text-medium-contrast hover:text-neon-green transition-colors">
                                    Careers
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/50 mt-8">                        <div className="text-medium-contrast text-sm mb-4 md:mb-0 font-body">
                        © 2025 LocalAI Stack. All rights reserved.
                    </div>

                        {/* Social */}
                        <div className="flex items-center space-x-4">                            <Button variant="ghost" size="sm" className="text-medium-contrast hover:text-neon-green p-2">
                            <Github className="h-5 w-5" />
                        </Button>
                            <Button variant="ghost" size="sm" className="text-medium-contrast hover:text-electric-blue p-2">
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-medium-contrast hover:text-cyber-purple p-2">
                                <Linkedin className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-medium-contrast hover:text-neon-green p-2">
                                <Mail className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
