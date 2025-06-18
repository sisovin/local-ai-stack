"use client"

import { Navigation } from "@/components/navigation"
import { WebSearchInterface } from "@/components/WebSearchInterface"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageWrapper } from "@/components/PageWrapper"
import {
    Search,
    Shield,
    Zap,
    Brain,
    Globe, Lock
} from "lucide-react"

export default function WebSearchPage() {
    const features = [
        {
            icon: Shield,
            title: "Privacy-First",
            description: "Search the web without tracking using SearXNG"
        },
        {
            icon: Brain,
            title: "AI Analysis",
            description: "Get intelligent summaries powered by local LLMs"
        },
        {
            icon: Zap,
            title: "Real-time",
            description: "Fast search with instant AI-powered insights"
        }, {
            icon: Lock,
            title: "Local Processing",
            description: "All AI analysis happens on your hardware"
        }
    ]

    return (
        <PageWrapper>
            <div className="min-h-screen bg-background">
                <Navigation />

                <div className="lg:ml-80">
                    {/* Header Section */}
                    <section className="relative overflow-hidden border-b border-border/50">
                        <div className="container mx-auto px-6 py-16">
                            <div className="text-center space-y-6">
                                <div className="flex items-center justify-center space-x-2 mb-4">
                                    <Search className="h-8 w-8 text-neon-green" />
                                    <h1 className="text-4xl md:text-6xl font-bold">
                                        <span className="holographic">AI Web</span>
                                        <span className="text-glow-green"> Search</span>
                                    </h1>
                                </div>

                                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                    Search the web privately with SearXNG and get intelligent analysis
                                    from your local AI models. No tracking, no data collection.
                                </p>

                                <div className="flex items-center justify-center space-x-4">
                                    <Badge variant="outline" className="flex items-center space-x-1">
                                        <Globe className="h-3 w-3" />
                                        <span>SearXNG Powered</span>
                                    </Badge>
                                    <Badge variant="outline" className="flex items-center space-x-1">
                                        <Brain className="h-3 w-3" />
                                        <span>Local AI Analysis</span>
                                    </Badge>
                                    <Badge variant="outline" className="flex items-center space-x-1">
                                        <Shield className="h-3 w-3" />
                                        <span>Privacy Protected</span>
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-16 green-gradient">
                        <div className="container mx-auto px-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                {features.map((feature, index) => (
                                    <Card key={feature.title} className="glass-card hover:glow-green transition-all duration-300 float" style={{ animationDelay: `${index * 0.1}s` }}>
                                        <CardHeader className="text-center">
                                            <feature.icon className="h-8 w-8 text-neon-green mx-auto mb-2" />
                                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-center text-sm">
                                                {feature.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Search Interface Section */}
                    <section className="py-16">
                        <div className="container mx-auto px-6">
                            <WebSearchInterface />
                        </div>
                    </section>

                    {/* How It Works Section */}
                    <section className="py-16 circuit-bg">
                        <div className="container mx-auto px-6">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold mb-4 text-glow-blue">How It Works</h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Our AI-powered search combines privacy-focused web search with intelligent local analysis
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <Card className="glass-card">
                                    <CardHeader className="text-center">
                                        <div className="w-12 h-12 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl font-bold text-neon-green">1</span>
                                        </div>
                                        <CardTitle>Private Search</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-center">
                                            Your query is sent to SearXNG, which searches multiple engines
                                            without tracking or storing your data.
                                        </CardDescription>
                                    </CardContent>
                                </Card>

                                <Card className="glass-card">
                                    <CardHeader className="text-center">
                                        <div className="w-12 h-12 bg-electric-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl font-bold text-electric-blue">2</span>
                                        </div>
                                        <CardTitle>AI Analysis</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-center">
                                            Search results are processed by your local LLM (DeepSeek R1 or Qwen 3)
                                            to generate intelligent summaries.
                                        </CardDescription>
                                    </CardContent>
                                </Card>

                                <Card className="glass-card">
                                    <CardHeader className="text-center">
                                        <div className="w-12 h-12 bg-cyber-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl font-bold text-cyber-purple">3</span>
                                        </div>
                                        <CardTitle>Smart Results</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-center">
                                            Get comprehensive summaries, key points, confidence scores,
                                            and source links - all processed locally.
                                        </CardDescription>
                                    </CardContent>
                                </Card>                        </div>
                        </div>
                    </section>
                </div>
            </div>
        </PageWrapper>
    )
}
