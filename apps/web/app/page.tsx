"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Progress } from "@workspace/ui/components/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Navigation } from "@/components/navigation"
import { Authentication } from "@/components/Authentication"
import { ChatInterface } from "@/components/ChatInterface"
import { NoSSR } from "@/components/NoSSR"
import { authService } from "@/utils/supabaseClient"
import {
  Terminal,
  Cpu,
  Zap,
  Shield,
  Database,
  Globe,
  Code,
  Brain,
  Rocket,
  Settings,
  Activity,
  Server,
  MessageSquare,
  User,
  ChevronRight,
  Sparkles,
  Network,
  Lock,
  TrendingUp,
  Timer,
  Layers
} from "lucide-react"

export default function HomePage() {
  const [progress, setProgress] = useState(0)
  const [isOnline, setIsOnline] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    // Simulate loading progress
    const timer = setTimeout(() => setProgress(100), 1000)
    const onlineTimer = setTimeout(() => setIsOnline(true), 1500)

    // Check authentication status
    checkAuthStatus()

    return () => {
      clearTimeout(timer)
      clearTimeout(onlineTimer)
    }
  }, [])

  const checkAuthStatus = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)

      // Listen for auth changes
      authService.onAuthStateChange((event, session) => {
        setUser(session?.user || null)
        setIsLoading(false)
      })
    } catch (error) {
      console.error('Auth check failed:', error)
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
      setShowChat(false)
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  const handleChatClick = () => {
    if (user) {
      setShowChat(true)
    }
  }

  // Show loading spinner with enhanced futuristic animation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background circuit-bg flex items-center justify-center relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-neon-green rounded-full opacity-30 particle-${i + 1} ${i % 4 === 0 ? 'particle-float' :
                i % 4 === 1 ? 'particle-float-delay-1' :
                  i % 4 === 2 ? 'particle-float-delay-2' : 'particle-float-delay-3'
                }`}
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
    return <Authentication onAuthSuccess={handleAuthSuccess} />
  }

  // Show chat interface if requested
  if (showChat) {
    return <ChatInterface onSignOut={handleSignOut} />
  }

  const services = [
    {
      name: "DeepSeek R1",
      status: "online",
      icon: Brain,
      description: "Advanced reasoning model",
      metrics: { accuracy: 95, speed: 89, load: 67 },
      version: "v1.7.0",
      uptime: "99.9%"
    },
    {
      name: "Qwen 3",
      status: "online",
      icon: Zap,
      description: "High-performance LLM",
      metrics: { accuracy: 92, speed: 94, load: 52 },
      version: "v3.2.5",
      uptime: "99.7%"
    },
    {
      name: "FastAPI Backend",
      status: "online",
      icon: Server,
      description: "OpenAI-compatible API",
      metrics: { accuracy: 99, speed: 97, load: 34 },
      version: "v2.1.0",
      uptime: "99.8%"
    },
    {
      name: "Ollama Engine",
      status: "online",
      icon: Cpu,
      description: "Local inference engine",
      metrics: { accuracy: 98, speed: 91, load: 45 },
      version: "v0.4.2",
      uptime: "99.6%"
    }
  ]

  const features = [
    {
      icon: Terminal,
      title: "OpenAI Compatible API",
      description: "Seamless integration with existing tools and workflows. Drop-in replacement for OpenAI's API.",
      color: "text-neon-green"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "All processing happens locally on your infrastructure. Zero data leaves your network.",
      color: "text-electric-blue"
    },
    {
      icon: Database,
      title: "Conversation Memory",
      description: "Persistent chat history with intelligent context management and semantic search.",
      color: "text-cyber-purple"
    },
    {
      icon: Network,
      title: "Real-time Streaming",
      description: "WebSocket-based streaming for instant responses with sub-100ms latency.",
      color: "text-neon-green"
    },
    {
      icon: Code,
      title: "Developer Ready",
      description: "Comprehensive APIs, SDKs, and documentation. Built by developers, for developers.",
      color: "text-electric-blue"
    },
    {
      icon: Activity,
      title: "Performance Monitoring",
      description: "Built-in metrics, logging, and health checks with real-time dashboards.",
      color: "text-cyber-purple"
    }
  ]

  const stats = [
    { label: "Response Time", value: "< 100ms", icon: Timer },
    { label: "Uptime", value: "99.9%", icon: TrendingUp },
    { label: "Models Available", value: "50+", icon: Layers },
    { label: "Security Level", value: "Enterprise", icon: Lock }
  ]

  return (
    <div className="min-h-screen bg-background circuit-bg">
      <Navigation />

      <div className="lg:ml-80">
        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden min-h-screen flex items-center">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-green/5 to-transparent animate-pulse" />
            </div>

            {/* Floating particles */}
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-neon-green/20 rounded-full hero-particle-${i + 1} ${i % 4 === 0 ? 'particle-float' :
                  i % 4 === 1 ? 'particle-float-delay-1' :
                    i % 4 === 2 ? 'particle-float-delay-2' : 'particle-float-delay-3'
                  }`}
              />
            ))}

            {/* Beam effects */}
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-green/30 to-transparent" />
            <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent" />
          </div>

          <div className="container mx-auto px-6 py-24 relative z-10">
            <div className="text-center space-y-12">
              {/* Status Indicator */}
              <NoSSR fallback={
                <div className="flex items-center justify-center space-x-3 mb-8">
                  <div className="w-4 h-4 rounded-full bg-gray-500 animate-pulse" />
                  <span className="text-sm font-mono text-muted-foreground tracking-widest">
                    INITIALIZING QUANTUM CORE...
                  </span>
                </div>
              }>
                <div className="flex items-center justify-center space-x-3 mb-8">
                  <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-neon-green glow-green' : 'bg-gray-500'} animate-pulse`} />
                  <span className="text-sm font-mono text-muted-foreground tracking-widest">
                    {isOnline ? 'QUANTUM CORE ONLINE' : 'INITIALIZING QUANTUM CORE...'}
                  </span>
                  {isOnline && <Badge className="bg-neon-green/20 text-neon-green border-neon-green/50">READY</Badge>}
                </div>
              </NoSSR>

              {/* Main Heading with enhanced effects */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-7xl md:text-9xl font-bold tracking-tight leading-none">
                    <div className="relative inline-block">
                      <span className="holographic">LOCAL AI</span>
                      <div className="absolute -top-2 -right-2">
                        <Sparkles className="w-8 h-8 text-neon-green animate-pulse" />
                      </div>
                    </div>
                    <br />
                    <span className="text-glow-green relative">
                      STACK
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent" />
                    </span>
                  </h1>

                  <div className="flex justify-center items-center space-x-4 text-sm font-mono text-muted-foreground">
                    <span>v2.0.0</span>
                    <span>•</span>
                    <span>Enterprise Grade</span>
                    <span>•</span>
                    <span className="text-neon-green">Quantum Ready</span>
                  </div>
                </div>

                <p className="text-xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  Next-generation AI infrastructure running entirely on your hardware.
                  <br />
                  <span className="text-neon-green">Deploy DeepSeek R1, Qwen 3, and custom models</span> with enterprise-grade APIs.
                </p>
              </div>

              {/* Enhanced stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <Card key={stat.label} className="glass-card hover:glow-green transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                      <stat.icon className="w-8 h-8 text-neon-green mx-auto mb-3 group-hover:scale-110 transition-transform" />
                      <div className="text-2xl font-bold text-glow-green">{stat.value}</div>
                      <div className="text-sm text-muted-foreground font-mono">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Loading Progress */}
              <NoSSR fallback={
                <div className="max-w-md mx-auto space-y-4">
                  <Progress value={0} className="h-3 bg-tech-gray/20" />
                  <p className="text-sm font-mono text-muted-foreground tracking-wider">
                    NEURAL NETWORK INITIALIZATION: 0%
                  </p>
                </div>
              }>
                <div className="max-w-md mx-auto space-y-4">
                  <Progress value={progress} className="h-3 bg-tech-gray/20" />
                  <p className="text-sm font-mono text-muted-foreground tracking-wider">
                    NEURAL NETWORK INITIALIZATION: {progress}%
                  </p>
                </div>
              </NoSSR>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16">
                <Button
                  size="lg"
                  className="neon-border-green glow-green hover:glow-green font-mono text-lg px-8 py-4 group relative overflow-hidden"
                  onClick={handleChatClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-green/0 via-neon-green/20 to-neon-green/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <MessageSquare className="mr-3 h-6 w-6 relative z-10" />
                  <span className="relative z-10">LAUNCH NEURAL INTERFACE</span>
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </Button>

                <Link href="/docs">
                  <Button variant="outline" size="lg" className="glass font-mono text-lg px-8 py-4 border-electric-blue/50 hover:border-electric-blue group">
                    <Terminal className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                    API DOCUMENTATION
                  </Button>
                </Link>

                <Link href="/playground">
                  <Button variant="ghost" size="lg" className="font-mono text-lg px-8 py-4 hover:bg-cyber-purple/10 group">
                    <Rocket className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                    PLAYGROUND
                  </Button>
                </Link>
              </div>

              {/* User Info */}
              <div className="flex items-center justify-center space-x-3 mt-12 p-4 glass rounded-full max-w-md mx-auto">
                <User className="h-5 w-5 text-neon-green" />
                <span className="text-sm text-muted-foreground">
                  Welcome back, <span className="text-neon-green font-mono">{user.email}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-xs text-muted-foreground hover:text-foreground ml-4"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Services Status Grid */}
        <section className="py-32 relative">
          <div className="absolute inset-0 green-gradient opacity-50" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold mb-6 text-glow-blue">Neural Network Status</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Real-time monitoring of all AI services and quantum processing units
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <Card key={service.name} className={`glass-card hover:glow-green transition-all duration-500 group relative overflow-hidden ${index === 1 ? 'animation-delay-200' :
                  index === 2 ? 'animation-delay-400' :
                    index === 3 ? 'animation-delay-600' : ''
                  }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <CardHeader className="pb-4 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-neon-green/10 group-hover:bg-neon-green/20 transition-colors">
                        <service.icon className="h-8 w-8 text-neon-green group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={service.status === 'online' ? 'default' : 'destructive'} className="bg-neon-green/20 text-neon-green border-neon-green/50">
                          {service.status.toUpperCase()}
                        </Badge>
                        <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{service.name}</CardTitle>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                      <span>{service.version}</span>
                      <span>Uptime: {service.uptime}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 relative z-10">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Accuracy</span>
                          <span className="font-mono text-neon-green">{service.metrics.accuracy}%</span>
                        </div>
                        <Progress value={service.metrics.accuracy} className="h-2 bg-tech-gray/20" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Speed</span>
                          <span className="font-mono text-electric-blue">{service.metrics.speed}%</span>
                        </div>
                        <Progress value={service.metrics.speed} className="h-2 bg-tech-gray/20" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Load</span>
                          <span className="font-mono text-cyber-purple">{service.metrics.load}%</span>
                        </div>
                        <Progress value={service.metrics.load} className="h-2 bg-tech-gray/20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-32 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 tech-gradient opacity-30" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-electric-blue/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold mb-6 holographic">Advanced Capabilities</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Built for developers, enterprises, and AI researchers who demand performance and control.
                <br />
                <span className="text-neon-green">Experience the future of AI infrastructure today.</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {features.map((feature, index) => (
                <Card key={feature.title} className={`glass-card hover:neon-border-green transition-all duration-500 float group relative overflow-hidden ${index === 1 ? 'animation-delay-200' :
                  index === 2 ? 'animation-delay-400' :
                    index === 3 ? 'animation-delay-600' :
                      index === 4 ? 'animation-delay-800' :
                        index === 5 ? 'animation-delay-1000' : ''
                  }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-green/0 via-neon-green/5 to-neon-green/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardHeader className="relative z-10">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-4 rounded-2xl bg-neon-green/10 group-hover:bg-neon-green/20 group-hover:scale-110 transition-all-300">
                        <feature.icon className={`h-8 w-8 ${feature.color} group-hover:scale-110 transition-transform`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl group-hover:text-neon-green transition-colors">{feature.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>

                  {/* Scan line effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scan-line" />
                </Card>
              ))}
            </div>

            {/* Call to action */}
            <div className="text-center mt-20">
              <Link href="/docs">
                <Button className="neon-border-green glow-green hover:glow-green font-mono text-lg px-8 py-4 group">
                  <Code className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                  EXPLORE ALL FEATURES
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Enhanced API Examples */}
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-transparent" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold mb-6 text-glow-purple">API Integration Hub</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Ready-to-use examples for instant integration with your existing workflows
              </p>
            </div>

            <Tabs defaultValue="curl" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-4 glass mb-8 h-16">
                <TabsTrigger value="curl" className="text-base py-3 data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green">
                  <Terminal className="mr-2 h-5 w-5" />
                  cURL
                </TabsTrigger>
                <TabsTrigger value="python" className="text-base py-3 data-[state=active]:bg-electric-blue/20 data-[state=active]:text-electric-blue">
                  <Code className="mr-2 h-5 w-5" />
                  Python
                </TabsTrigger>
                <TabsTrigger value="javascript" className="text-base py-3 data-[state=active]:bg-cyber-purple/20 data-[state=active]:text-cyber-purple">
                  <Globe className="mr-2 h-5 w-5" />
                  JavaScript
                </TabsTrigger>
                <TabsTrigger value="openai" className="text-base py-3 data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green">
                  <Brain className="mr-2 h-5 w-5" />
                  OpenAI SDK
                </TabsTrigger>
              </TabsList>

              <TabsContent value="curl" className="mt-8">
                <Card className="glass-card border-neon-green/30 hover:border-neon-green/60 transition-colors">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="font-mono text-xl flex items-center">
                      <Terminal className="mr-3 h-6 w-6 text-neon-green" />
                      Simple Chat Request
                    </CardTitle>
                    <CardDescription>High-performance HTTP endpoint for instant AI responses</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <pre className="text-sm bg-tech-gray/10 p-6 overflow-x-auto font-mono scan-line rounded-none">
                      <code className="text-neon-green">{`curl -X POST http://localhost:8000/simple-chat \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your-api-key" \\
  -d '{
    "message": "Explain quantum computing in simple terms",
    "model": "deepseek-r1:7b",
    "temperature": 0.7,
    "max_tokens": 1000,
    "stream": false
  }'`}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="python" className="mt-8">
                <Card className="glass-card border-electric-blue/30 hover:border-electric-blue/60 transition-colors">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="font-mono text-xl flex items-center">
                      <Code className="mr-3 h-6 w-6 text-electric-blue" />
                      Python SDK Integration
                    </CardTitle>
                    <CardDescription>Pythonic interface for seamless AI model interaction</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <pre className="text-sm bg-tech-gray/10 p-6 overflow-x-auto font-mono">
                      <code className="text-electric-blue">{`import requests
import json

# Configure the API endpoint
API_BASE = "http://localhost:8000"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer your-api-key"
}

# Send chat completion request
response = requests.post(
    f"{API_BASE}/chat/completions",
    headers=headers,
    json={
        "messages": [
            {"role": "system", "content": "You are a helpful AI assistant."},
            {"role": "user", "content": "What's the future of AI?"}
        ],
        "model": "qwen2.5:7b",
        "temperature": 0.8,
        "stream": False
    }
)

# Parse and display response
result = response.json()
print(f"AI Response: {result['choices'][0]['message']['content']}")
print(f"Tokens used: {result['usage']['total_tokens']}")`}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="javascript" className="mt-8">
                <Card className="glass-card border-cyber-purple/30 hover:border-cyber-purple/60 transition-colors">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="font-mono text-xl flex items-center">
                      <Globe className="mr-3 h-6 w-6 text-cyber-purple" />
                      Modern JavaScript/Node.js
                    </CardTitle>
                    <CardDescription>Async/await powered AI interactions for web applications</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <pre className="text-sm bg-tech-gray/10 p-6 overflow-x-auto font-mono">
                      <code className="text-cyber-purple">{`// Modern ES6+ implementation
class LocalAIClient {
    constructor(baseURL = 'http://localhost:8000') {
        this.baseURL = baseURL;
        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-api-key'
        };
    }

    async chat(message, model = 'deepseek-r1:7b') {
        try {
            const response = await fetch(\`\${this.baseURL}/simple-chat\`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    message,
                    model,
                    temperature: 0.7,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(\`HTTP error! status: \${response.status}\`);
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('AI request failed:', error);
            throw error;
        }
    }
}

// Usage example
const ai = new LocalAIClient();
const answer = await ai.chat('Explain machine learning in 100 words');
console.log('AI Response:', answer);`}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="openai" className="mt-8">
                <Card className="glass-card border-neon-green/30 hover:border-neon-green/60 transition-colors">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="font-mono text-xl flex items-center">
                      <Brain className="mr-3 h-6 w-6 text-neon-green" />
                      OpenAI SDK Compatible
                    </CardTitle>
                    <CardDescription>Drop-in replacement for OpenAI's official SDK</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <pre className="text-sm bg-tech-gray/10 p-6 overflow-x-auto font-mono">
                      <code className="text-neon-green">{`from openai import OpenAI
import os

# Initialize client with local endpoint
client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="not-required-for-local"  # Local deployment
)

# Chat completion with streaming
def stream_chat_response(prompt, model="deepseek-r1:7b"):
    stream = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are an expert AI assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=2000,
        stream=True  # Enable real-time streaming
    )
    
    print("AI: ", end="", flush=True)
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end="", flush=True)
    print()  # New line after response

# Example usage
stream_chat_response("What are the latest breakthroughs in AI research?")`}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="py-20 border-t border-border/30 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-neon-green/5 to-transparent" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              {/* Brand */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-neon-green to-electric-blue rounded-xl flex items-center justify-center glow-green">
                    <Cpu className="h-6 w-6 text-background" />
                  </div>
                  <span className="text-2xl font-bold holographic">Local AI Stack</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Next-generation AI infrastructure for developers who demand performance, privacy, and control.
                </p>
                <div className="flex space-x-4">
                  <Badge className="bg-neon-green/20 text-neon-green border-neon-green/50">Open Source</Badge>
                  <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/50">MIT License</Badge>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-glow-green">Quick Start</h3>
                <div className="space-y-2">
                  <Link href="/docs" className="block text-muted-foreground hover:text-neon-green transition-colors">
                    Documentation
                  </Link>
                  <Link href="/playground" className="block text-muted-foreground hover:text-neon-green transition-colors">
                    Playground
                  </Link>
                  <Link href="/models" className="block text-muted-foreground hover:text-neon-green transition-colors">
                    Model Library
                  </Link>
                  <Link href="/monitoring" className="block text-muted-foreground hover:text-neon-green transition-colors">
                    System Health
                  </Link>
                </div>
              </div>

              {/* Tools */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-glow-blue">Developer Tools</h3>
                <div className="space-y-2">
                  <Link href="/settings" className="block text-muted-foreground hover:text-electric-blue transition-colors">
                    Configuration
                  </Link>
                  <Link href="/debug" className="block text-muted-foreground hover:text-electric-blue transition-colors">
                    Debug Console
                  </Link>
                  <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-electric-blue transition-colors">
                    Open Web UI
                  </a>
                  <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-electric-blue transition-colors">
                    API Explorer
                  </a>
                </div>
              </div>

              {/* System Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-glow-purple">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Services</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                      <span className="text-sm text-neon-green">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Models</span>
                    <span className="text-sm font-mono text-electric-blue">4/4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <span className="text-sm font-mono text-cyber-purple">99.9%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/20">
              <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4 md:mb-0">
                <span className="font-mono">v2.0.0</span>
                <span>•</span>
                <span>Built with Next.js 15 & React 19</span>
                <span>•</span>
                <span>Powered by Quantum Neural Networks</span>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-neon-green">
                  <Globe className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-electric-blue">
                  <Terminal className="h-4 w-4 mr-2" />
                  Docs
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
