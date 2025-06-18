"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { supabase } from "@/utils/supabaseClient"
import { useT } from "@/lib/i18n"
import {
    Check,
    X,
    Zap,
    Rocket,
    Crown,
    Star,
    Sparkles,
    ArrowRight,
    Users,
    Database,
    Shield,
    Cpu,
    Cloud,
    Infinity,
    Globe,
    Lock,
    HeartHandshake,
    BarChart3,
    Headphones
} from "lucide-react"

interface PricingPlan {
    id: string
    name: string
    description: string
    monthlyPrice: number
    yearlyPrice: number
    icon: React.ReactNode
    features: string[]
    limitations: string[]
    popular: boolean
    gradient: string
    glowColor: string
    buttonStyle: string
}

const pricingPlans: PricingPlan[] = [
    {
        id: "starter",
        name: "Starter Plan",
        description: "Perfect for individuals and small projects getting started with AI",
        monthlyPrice: 0,
        yearlyPrice: 0,
        icon: <Zap className="w-8 h-8" />,
        features: [
            "Up to 1,000 AI requests/month",
            "Basic chat interface",
            "2 AI models included",
            "Community support",
            "Basic web search",
            "Local deployment"
        ],
        limitations: [
            "Limited advanced features",
            "No priority support",
            "Basic monitoring"
        ],
        popular: false,
        gradient: "from-neon-green/20 via-electric-blue/10 to-cyber-purple/20",
        glowColor: "neon-green",
        buttonStyle: "bg-neon-green hover:bg-neon-green/90 text-black"
    },
    {
        id: "development",
        name: "Development Plan",
        description: "Ideal for developers and growing teams building AI applications",
        monthlyPrice: 29,
        yearlyPrice: 290,
        icon: <Rocket className="w-8 h-8" />,
        features: [
            "Up to 50,000 AI requests/month",
            "Advanced chat interface",
            "10+ AI models included",
            "Priority support",
            "Advanced web search",
            "Custom model integration",
            "API access",
            "Analytics dashboard",
            "Team collaboration (up to 5 users)",
            "Custom deployment options"
        ],
        limitations: [
            "Limited enterprise features"
        ],
        popular: true,
        gradient: "from-electric-blue/20 via-cyber-purple/10 to-neon-green/20",
        glowColor: "electric-blue",
        buttonStyle: "bg-electric-blue hover:bg-electric-blue/90 text-black"
    },
    {
        id: "enterprise",
        name: "Enterprise Plan",
        description: "For large organizations requiring enterprise-grade AI solutions",
        monthlyPrice: 199,
        yearlyPrice: 1990,
        icon: <Crown className="w-8 h-8" />,
        features: [
            "Unlimited AI requests",
            "All AI models included",
            "24/7 dedicated support",
            "Advanced monitoring & observability",
            "Custom model training",
            "White-label solutions",
            "Advanced security & compliance",
            "Unlimited team members",
            "Multi-region deployment",
            "SLA guarantees",
            "Custom integrations",
            "Dedicated account manager"
        ],
        limitations: [],
        popular: false,
        gradient: "from-cyber-purple/20 via-neon-green/10 to-electric-blue/20",
        glowColor: "cyber-purple",
        buttonStyle: "bg-cyber-purple hover:bg-cyber-purple/90 text-white"
    }
]

export default function PricingPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isYearly, setIsYearly] = useState(false)
    const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)
    const t = useT()

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
    }, [])

    const getPrice = (plan: PricingPlan) => {
        return isYearly ? plan.yearlyPrice : plan.monthlyPrice
    }

    const getSavings = (plan: PricingPlan) => {
        if (plan.monthlyPrice === 0) return 0
        return Math.round(((plan.monthlyPrice * 12 - plan.yearlyPrice) / (plan.monthlyPrice * 12)) * 100)
    }

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
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyber-purple/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 bg-neon-green/10 px-4 py-2 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-neon-green" />
                            <span className="text-sm font-mono text-neon-green">Choose Your AI Power Level</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-neon-green via-electric-blue to-cyber-purple bg-clip-text text-transparent leading-tight font-heading mb-6">
                            Pricing Plans
                        </h1>

                        <p className="text-xl md:text-2xl text-medium-contrast max-w-3xl mx-auto leading-relaxed font-body mb-12">
                            Unlock the future of AI with plans designed to scale with your ambitions. From personal projects to enterprise solutions.
                        </p>

                        {/* Billing Toggle */}
                        <div className="inline-flex items-center bg-tech-gray/50 p-2 rounded-full border border-border/30">
                            <button
                                onClick={() => setIsYearly(false)}
                                className={`px-6 py-2 rounded-full transition-all duration-300 ${!isYearly
                                        ? "bg-neon-green text-black font-semibold"
                                        : "text-medium-contrast hover:text-high-contrast"
                                    }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setIsYearly(true)}
                                className={`px-6 py-2 rounded-full transition-all duration-300 relative ${isYearly
                                        ? "bg-electric-blue text-black font-semibold"
                                        : "text-medium-contrast hover:text-high-contrast"
                                    }`}
                            >
                                Yearly
                                <Badge className="absolute -top-2 -right-2 bg-cyber-purple text-white text-xs px-2 py-1">
                                    Save up to 30%
                                </Badge>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {pricingPlans.map((plan) => {
                            const isHovered = hoveredPlan === plan.id
                            const price = getPrice(plan)
                            const savings = getSavings(plan)

                            return (
                                <Card
                                    key={plan.id}
                                    className={`relative overflow-hidden group cursor-pointer transition-all duration-500 ${plan.popular
                                            ? "ring-2 ring-electric-blue scale-105"
                                            : "hover:scale-105"
                                        }`}
                                    style={{
                                        background: `linear-gradient(135deg, ${plan.gradient.replace(/from-|via-|to-/g, '')})`,
                                        transform: isHovered ? 'scale(1.08)' : plan.popular ? 'scale(1.05)' : 'scale(1)',
                                        transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
                                        boxShadow: isHovered
                                            ? `0 20px 60px rgba(var(--${plan.glowColor}) / 0.3)`
                                            : plan.popular
                                                ? `0 10px 40px rgba(var(--electric-blue) / 0.2)`
                                                : '0 4px 20px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onMouseEnter={() => setHoveredPlan(plan.id)}
                                    onMouseLeave={() => setHoveredPlan(null)}
                                >
                                    {/* Popular Badge */}
                                    {plan.popular && (
                                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            <Badge className="bg-electric-blue text-black px-6 py-2 font-semibold">
                                                <Star className="w-4 h-4 mr-1" />
                                                Most Popular
                                            </Badge>
                                        </div>
                                    )}

                                    {/* Holographic effect */}
                                    <div className={`absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    <CardContent className="p-8 relative z-10">
                                        {/* Plan Header */}
                                        <div className="text-center mb-8">
                                            <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-${plan.glowColor} to-${plan.glowColor}/50 flex items-center justify-center mx-auto mb-4 text-black`}>
                                                {plan.icon}
                                            </div>

                                            <h3 className="text-2xl font-bold text-high-contrast mb-2 font-heading">
                                                {plan.name}
                                            </h3>

                                            <p className="text-medium-contrast text-sm leading-relaxed">
                                                {plan.description}
                                            </p>
                                        </div>

                                        {/* Pricing */}
                                        <div className="text-center mb-8">
                                            <div className="flex items-baseline justify-center mb-2">
                                                <span className="text-5xl font-bold text-high-contrast font-heading">
                                                    ${price}
                                                </span>
                                                <span className="text-medium-contrast ml-2">
                                                    /{isYearly ? "year" : "month"}
                                                </span>
                                            </div>

                                            {isYearly && savings > 0 && (
                                                <div className="text-neon-green text-sm font-semibold">
                                                    Save {savings}% annually
                                                </div>
                                            )}

                                            {price === 0 && (
                                                <div className="text-neon-green text-sm font-semibold">
                                                    Forever Free
                                                </div>
                                            )}
                                        </div>

                                        {/* Features */}
                                        <div className="space-y-4 mb-8">
                                            <h4 className="font-semibold text-high-contrast">What's included:</h4>
                                            <ul className="space-y-3">
                                                {plan.features.map((feature, index) => (
                                                    <li key={index} className="flex items-start space-x-3">
                                                        <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                                                        <span className="text-medium-contrast text-sm">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {plan.limitations.length > 0 && (
                                                <ul className="space-y-2 pt-4 border-t border-border/20">
                                                    {plan.limitations.map((limitation, index) => (
                                                        <li key={index} className="flex items-start space-x-3">
                                                            <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                                            <span className="text-medium-contrast/60 text-sm">{limitation}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        {/* CTA Button */}
                                        <Button
                                            size="lg"
                                            className={`w-full ${plan.buttonStyle} font-bold text-lg py-6 rounded-full transition-all duration-300 group-hover:scale-105`}
                                        >
                                            {price === 0 ? "Get Started Free" : "Start Your Journey"}
                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Features Comparison */}
            <section className="py-24 bg-tech-gray/20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-bold text-high-contrast mb-6 font-heading">
                            Compare Features
                        </h2>
                        <p className="text-xl text-medium-contrast max-w-3xl mx-auto">
                            Choose the plan that matches your needs with our detailed feature comparison.
                        </p>
                    </div>

                    <Card className="glass-card overflow-hidden">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border/20">
                                            <th className="text-left p-6 text-high-contrast font-semibold">Features</th>
                                            {pricingPlans.map((plan) => (
                                                <th key={plan.id} className="text-center p-6">
                                                    <div className="text-high-contrast font-semibold">{plan.name}</div>
                                                    <div className="text-medium-contrast text-sm mt-1">
                                                        ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                                        /{isYearly ? "year" : "month"}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { feature: "AI Requests", values: ["1,000/month", "50,000/month", "Unlimited"] },
                                            { feature: "AI Models", values: ["2 models", "10+ models", "All models"] },
                                            { feature: "Support", values: ["Community", "Priority", "24/7 Dedicated"] },
                                            { feature: "Team Members", values: ["1 user", "5 users", "Unlimited"] },
                                            { feature: "Custom Integration", values: [false, true, true] },
                                            { feature: "Analytics", values: [false, true, true] },
                                            { feature: "API Access", values: [false, true, true] },
                                            { feature: "SLA", values: [false, false, true] }
                                        ].map((row, index) => (
                                            <tr key={index} className="border-b border-border/10 hover:bg-white/5">
                                                <td className="p-6 text-medium-contrast font-medium">{row.feature}</td>
                                                {row.values.map((value, valueIndex) => (
                                                    <td key={valueIndex} className="p-6 text-center">
                                                        {typeof value === "boolean" ? (
                                                            value ? (
                                                                <Check className="w-5 h-5 text-neon-green mx-auto" />
                                                            ) : (
                                                                <X className="w-5 h-5 text-red-400 mx-auto" />
                                                            )
                                                        ) : (
                                                            <span className="text-medium-contrast">{value}</span>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-bold text-high-contrast mb-6 font-heading">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-medium-contrast max-w-3xl mx-auto">
                            Everything you need to know about our AI-powered platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                question: "Can I upgrade or downgrade my plan anytime?",
                                answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
                            },
                            {
                                question: "What happens if I exceed my monthly limits?",
                                answer: "We'll notify you when you're approaching your limits. You can either upgrade your plan or wait for the next billing cycle. We never cut off service unexpectedly."
                            },
                            {
                                question: "Do you offer custom enterprise solutions?",
                                answer: "Absolutely! Our Enterprise plan includes custom solutions, dedicated support, and can be tailored to your specific requirements. Contact us for a personalized quote."
                            },
                            {
                                question: "Is my data secure and private?",
                                answer: "Security is our top priority. All data is encrypted in transit and at rest. We're SOC 2 compliant and follow industry best practices for data protection."
                            },
                            {
                                question: "Can I cancel my subscription anytime?",
                                answer: "Yes, you can cancel your subscription at any time with no cancellation fees. You'll continue to have access until the end of your current billing period."
                            },
                            {
                                question: "Do you offer a free trial for paid plans?",
                                answer: "We offer a generous free tier to get started. For paid plans, we provide a 14-day money-back guarantee so you can try risk-free."
                            }
                        ].map((faq, index) => (
                            <Card key={index} className="glass-card hover:glow-green transition-all duration-300">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-high-contrast mb-3">
                                        {faq.question}
                                    </h3>
                                    <p className="text-medium-contrast leading-relaxed">
                                        {faq.answer}
                                    </p>
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
                                Ready to Get Started?
                            </h2>
                            <p className="text-xl text-medium-contrast mb-8 max-w-2xl mx-auto font-body">
                                Join thousands of developers and organizations already using our AI platform to build the future.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Button
                                    size="lg"
                                    className="btn-hover-glow bg-neon-green hover:bg-neon-green/90 text-black font-bold text-lg px-12 py-6 rounded-full"
                                >
                                    <Rocket className="mr-3 h-6 w-6" />
                                    Start Free Trial
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="btn-hover-glow glass font-mono text-lg px-8 py-6 border-electric-blue/50 hover:border-electric-blue hover:bg-electric-blue/10 rounded-full"
                                >
                                    <Headphones className="mr-3 h-6 w-6" />
                                    Talk to Sales
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}
