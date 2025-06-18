"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Navigation } from "@/components/navigation"
import { supabase } from "@/utils/supabaseClient"
import { useT } from "@/lib/i18n"
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    MessageSquare,
    Globe,
    Shield,
    Zap,
    CheckCircle,
    ExternalLink,
    Github,
    Twitter,
    Linkedin,
    Calendar,
    User,
    Building,
    AlertCircle
} from "lucide-react"

export default function ContactPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        urgency: 'medium'
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const mapRef = useRef<HTMLDivElement>(null)
    const t = useT()

    // Contact information
    const contactInfo = [
        {
            icon: MapPin,
            title: "Office Location",
            details: ["123 Tech Street", "San Francisco, CA 94105", "United States"],
            color: "neon-green"
        },
        {
            icon: Phone,
            title: "Phone Numbers",
            details: ["+1 (555) 123-4567", "+1 (555) 987-6543", "24/7 Support Available"],
            color: "electric-blue"
        },
        {
            icon: Mail,
            title: "Email Addresses",
            details: ["hello@peanech.com", "support@peanech.com", "sales@peanech.com"],
            color: "cyber-purple"
        },
        {
            icon: Clock,
            title: "Business Hours",
            details: ["Monday - Friday: 9:00 AM - 6:00 PM PST", "Saturday: 10:00 AM - 4:00 PM PST", "Sunday: Closed"],
            color: "neon-green"
        }
    ]

    // Social links
    const socialLinks = [
        { icon: Github, url: "https://github.com/peanech", label: "GitHub" },
        { icon: Twitter, url: "https://twitter.com/peanech", label: "Twitter" },
        { icon: Linkedin, url: "https://linkedin.com/company/peanech", label: "LinkedIn" },
        { icon: Globe, url: "https://peanech.com", label: "Website" }
    ]

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000))
            setSubmitStatus('success')
            setFormData({
                name: '',
                email: '',
                company: '',
                subject: '',
                message: '',
                urgency: 'medium'
            })
        } catch (error) {
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
            setTimeout(() => setSubmitStatus('idle'), 5000)
        }
    }

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
        checkAuth()

        // Initialize 3D Map (Mapbox GL simulation)
        if (mapRef.current) {
            // Create a simulated 3D map effect
            const mapContainer = mapRef.current
            mapContainer.innerHTML = `
                <div class="relative w-full h-full bg-gradient-to-br from-tech-gray via-surface-glass to-tech-gray rounded-lg overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-r from-neon-green/10 via-electric-blue/10 to-cyber-purple/10 animate-pulse"></div>
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div class="w-4 h-4 bg-neon-green rounded-full animate-ping"></div>
                        <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-neon-green font-mono whitespace-nowrap">
                            PeanechWeb HQ
                        </div>
                    </div>
                    <div class="absolute bottom-4 left-4 text-xs text-medium-contrast font-mono">
                        Interactive 3D Map • Mapbox GL
                    </div>
                    <div class="absolute top-4 right-4 flex space-x-1">
                        <div class="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                        <div class="w-2 h-2 bg-electric-blue rounded-full animate-pulse animation-delay-500"></div>
                        <div class="w-2 h-2 bg-cyber-purple rounded-full animate-pulse animation-delay-1000"></div>
                    </div>
                </div>
            `
        }
    }, [])

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
            <section className="relative pt-32 pb-16 overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 bg-neon-green/10 px-4 py-2 rounded-full mb-6">
                            <MessageSquare className="w-4 h-4 text-neon-green" />
                            <span className="text-sm font-mono text-neon-green">GET IN TOUCH</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-neon-green via-electric-blue to-cyber-purple bg-clip-text text-transparent leading-tight font-heading mb-6">
                            Contact Us
                        </h1>

                        <p className="text-xl md:text-2xl text-medium-contrast max-w-3xl mx-auto leading-relaxed font-body">
                            Ready to transform your ideas into reality? Let's start a conversation about your next project.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Form & Info Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <Card className="glass-card relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 via-electric-blue/5 to-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <CardHeader className="relative z-10">
                                <CardTitle className="text-3xl font-bold text-high-contrast font-heading flex items-center">
                                    <Send className="w-8 h-8 text-neon-green mr-3" />
                                    Send Message
                                </CardTitle>
                                <CardDescription className="text-medium-contrast">
                                    Fill out the form below and we'll get back to you within 24 hours.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="relative z-10">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name & Email Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-high-contrast flex items-center">
                                                <User className="w-4 h-4 mr-2 text-neon-green" />
                                                Full Name *
                                            </label>
                                            <Input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="neon-input"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-high-contrast flex items-center">
                                                <Mail className="w-4 h-4 mr-2 text-electric-blue" />
                                                Email Address *
                                            </label>
                                            <Input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="neon-input"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Company & Subject Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-high-contrast flex items-center">
                                                <Building className="w-4 h-4 mr-2 text-cyber-purple" />
                                                Company
                                            </label>
                                            <Input
                                                name="company"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                className="neon-input"
                                                placeholder="Your company name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-high-contrast flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-2 text-neon-green" />
                                                Urgency
                                            </label>                                            <select
                                                name="urgency"
                                                value={formData.urgency}
                                                onChange={handleInputChange}
                                                className="neon-input w-full"
                                                title="Select urgency level"
                                                aria-label="Select urgency level"
                                            >
                                                <option value="low">Low Priority</option>
                                                <option value="medium">Medium Priority</option>
                                                <option value="high">High Priority</option>
                                                <option value="urgent">Urgent</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-high-contrast flex items-center">
                                            <MessageSquare className="w-4 h-4 mr-2 text-electric-blue" />
                                            Subject *
                                        </label>
                                        <Input
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="neon-input"
                                            placeholder="What's this about?"
                                        />
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-high-contrast">
                                            Message *
                                        </label>
                                        <Textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={6}
                                            className="neon-input resize-none"
                                            placeholder="Tell us about your project, questions, or how we can help..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full btn-hover-glow font-bold text-lg py-6 rounded-lg transition-all duration-300 ${submitStatus === 'success'
                                                ? 'bg-green-500 hover:bg-green-600'
                                                : submitStatus === 'error'
                                                    ? 'bg-red-500 hover:bg-red-600'
                                                    : 'bg-neon-green hover:bg-neon-green/90 text-black'
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center">
                                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-3" />
                                                Sending Message...
                                            </div>
                                        ) : submitStatus === 'success' ? (
                                            <div className="flex items-center">
                                                <CheckCircle className="w-5 h-5 mr-3" />
                                                Message Sent Successfully!
                                            </div>
                                        ) : submitStatus === 'error' ? (
                                            <div className="flex items-center">
                                                <AlertCircle className="w-5 h-5 mr-3" />
                                                Failed to Send. Try Again.
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <Send className="w-5 h-5 mr-3" />
                                                Send Message
                                            </div>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            {/* 3D Map */}
                            <Card className="glass-card">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-high-contrast font-heading flex items-center">
                                        <MapPin className="w-6 h-6 text-neon-green mr-3" />
                                        Our Location
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div ref={mapRef} className="w-full h-64 rounded-lg" />
                                </CardContent>
                            </Card>

                            {/* Contact Info Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {contactInfo.map((info, index) => {
                                    const IconComponent = info.icon
                                    return (
                                        <Card key={info.title} className="glass-card hover:glow-green transition-all duration-500">
                                            <CardContent className="p-6">
                                                <div className="flex items-start space-x-3">
                                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r from-${info.color} to-electric-blue flex items-center justify-center flex-shrink-0`}>
                                                        <IconComponent className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-high-contrast mb-2 font-heading">
                                                            {info.title}
                                                        </h3>
                                                        {info.details.map((detail, idx) => (
                                                            <p key={idx} className="text-sm text-medium-contrast font-body">
                                                                {detail}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>

                            {/* Social Links */}
                            <Card className="glass-card">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold text-high-contrast font-heading">
                                        Follow Us
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex space-x-4">
                                        {socialLinks.map((social) => {
                                            const IconComponent = social.icon
                                            return (
                                                <Button
                                                    key={social.label}
                                                    variant="outline"
                                                    size="sm"
                                                    className="hover:glow-green border-border/30 hover:border-neon-green/50"
                                                    onClick={() => window.open(social.url, '_blank')}
                                                >
                                                    <IconComponent className="w-4 h-4" />
                                                </Button>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 border-t border-border/20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-high-contrast mb-4 font-heading">
                            Frequently Asked Questions
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-neon-green to-electric-blue mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                question: "What is your typical response time?",
                                answer: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, we aim to respond within 2-4 hours."
                            },
                            {
                                question: "Do you offer free consultations?",
                                answer: "Yes! We offer a complimentary 30-minute consultation to discuss your project requirements and how we can help."
                            },
                            {
                                question: "What technologies do you specialize in?",
                                answer: "We specialize in modern web technologies including React, Next.js, Node.js, AI integration, and cloud infrastructure."
                            },
                            {
                                question: "Can you help with existing projects?",
                                answer: "Absolutely! We can help optimize, maintain, or add new features to your existing applications and systems."
                            }
                        ].map((faq, index) => (
                            <Card key={index} className="glass-card">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-high-contrast mb-3 font-heading">
                                        {faq.question}
                                    </h3>
                                    <p className="text-medium-contrast font-body">
                                        {faq.answer}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
