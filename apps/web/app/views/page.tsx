"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Progress } from "@workspace/ui/components/progress"
import { Navigation } from "@/components/navigation"
import { authService, supabase } from "@/utils/supabaseClient"
import { useT } from "@/lib/i18n"
import {
    BarChart3,
    TrendingUp,
    Users,
    Brain,
    Activity,
    Server,
    Globe,
    Zap,
    Shield,
    Clock,
    Database,
    MessageSquare,
    Search,
    Play,
    Monitor,
    Eye,
    Cpu,
    Network,
    HardDrive,
    Wifi
} from "lucide-react"

export default function ViewsPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const t = useT() // Get translations

    // Real-time stats simulation
    const [stats, setStats] = useState({
        totalUsers: 12547,
        activeModels: 48,
        requestsToday: 157892,
        uptime: 99.97,
        averageLatency: 89,
        storageUsed: 67.3,
        bandwidth: 1247, errorRate: 0.03
    })    // Performance metrics with color mapping
    const [metrics, setMetrics] = useState([
        { name: t.analytics.metrics.cpuUsage, value: 45, max: 100, colorClass: "circular-progress-neon-green" },
        { name: t.analytics.metrics.memory, value: 72, max: 100, colorClass: "circular-progress-electric-blue" },
        { name: t.analytics.metrics.storage, value: 34, max: 100, colorClass: "circular-progress-cyber-purple" },
        { name: t.analytics.metrics.network, value: 56, max: 100, colorClass: "circular-progress-neon-green" }
    ])

    // Recent activity simulation
    const [activities] = useState([
        { id: 1, type: "model_deploy", message: "DeepSeek R1 model deployed", time: "2 minutes ago", status: "success" },
        { id: 2, type: "user_action", message: "New user registered", time: "5 minutes ago", status: "info" },
        { id: 3, type: "api_call", message: "Chat API request processed", time: "8 minutes ago", status: "success" },
        { id: 4, type: "system", message: "System backup completed", time: "15 minutes ago", status: "success" },
        { id: 5, type: "warning", message: "High memory usage detected", time: "32 minutes ago", status: "warning" }
    ])    // Service status
    const [services] = useState([
        { name: t.services.aiChatService, status: t.services.online, uptime: "99.9%", responseTime: "< 100ms" },
        { name: t.services.modelManagement, status: t.services.online, uptime: "100%", responseTime: "< 50ms" },
        { name: t.services.webSearchApi, status: t.services.online, uptime: "99.7%", responseTime: "< 200ms" },
        { name: t.services.authentication, status: t.services.online, uptime: "100%", responseTime: "< 30ms" },
        { name: t.services.database, status: t.services.online, uptime: "99.9%", responseTime: "< 25ms" }
    ])

    useEffect(() => {
        // Check auth status with proper error handling
        const checkAuth = async () => {
            try {
                // First check if we have a session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()

                if (sessionError) {
                    console.warn('Session check failed:', sessionError)
                    setUser(null)
                    return
                }

                if (session?.user) {
                    setUser(session.user)
                } else {
                    // No active session, but that's okay for this page
                    setUser(null)
                }
            } catch (error) {
                console.warn('Auth check failed, continuing without auth:', error)
                // Set user to null instead of throwing error
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        checkAuth()

        // Simulate real-time updates
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                requestsToday: prev.requestsToday + Math.floor(Math.random() * 5),
                averageLatency: Math.max(50, Math.min(150, prev.averageLatency + (Math.random() - 0.5) * 10)),
                bandwidth: Math.max(800, Math.min(2000, prev.bandwidth + (Math.random() - 0.5) * 100))
            }))

            setMetrics(prev => prev.map(metric => ({
                ...metric,
                value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 5))
            })))
        }, 3000)
        
        return () => clearInterval(interval)
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

            <div className="container mx-auto px-6 py-8 mt-16">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-neon-green to-electric-blue flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>                        <div>                            <h1 className="text-4xl font-bold text-high-contrast font-heading">
                            {t.analytics.title}
                        </h1>
                            <p className="text-medium-contrast font-body leading-relaxed">
                                {t.analytics.subtitle}
                            </p>
                        </div>
                    </div>                    <div className="inline-flex items-center space-x-2 bg-neon-green/10 px-4 py-2 rounded-full">
                        <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                        <span className="text-sm font-mono text-neon-green">{t.analytics.liveData}</span>
                    </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="glass-card border-neon-green/30">
                        <CardContent className="p-6">                            <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-medium-contrast">{t.analytics.metrics.totalUsers}</p>
                                <p className="text-3xl font-bold text-neon-green font-heading">
                                    {stats.totalUsers.toLocaleString()}
                                </p>
                            </div>
                            <Users className="w-8 h-8 text-neon-green opacity-70" />
                        </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-electric-blue/30">
                        <CardContent className="p-6">                            <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-medium-contrast">{t.analytics.metrics.activeModels}</p>
                                <p className="text-3xl font-bold text-electric-blue font-heading">
                                    {stats.activeModels}
                                </p>
                            </div>
                            <Brain className="w-8 h-8 text-electric-blue opacity-70" />
                        </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-cyber-purple/30">
                        <CardContent className="p-6">                            <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-medium-contrast">{t.analytics.metrics.requestsToday}</p>
                                <p className="text-3xl font-bold text-cyber-purple font-heading">
                                    {stats.requestsToday.toLocaleString()}
                                </p>
                            </div>
                            <Activity className="w-8 h-8 text-cyber-purple opacity-70" />
                        </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-neon-green/30">
                        <CardContent className="p-6">                            <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-medium-contrast">{t.analytics.metrics.uptime}</p>
                                <p className="text-3xl font-bold text-neon-green font-heading">
                                    {stats.uptime}%
                                </p>
                            </div>
                            <Shield className="w-8 h-8 text-neon-green opacity-70" />
                        </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 glass">
                        <TabsTrigger value="overview" className="data-[state=active]:neon-border-green">
                            {t.analytics.tabs.overview}
                        </TabsTrigger>
                        <TabsTrigger value="performance" className="data-[state=active]:neon-border-blue">
                            {t.analytics.tabs.performance}
                        </TabsTrigger>
                        <TabsTrigger value="services" className="data-[state=active]:neon-border-purple">
                            {t.analytics.tabs.services}
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="data-[state=active]:neon-border-green">
                            {t.analytics.tabs.activity}
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Performance Metrics */}
                            <Card className="glass-card">                                <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Cpu className="w-5 h-5 text-neon-green" />
                                    <span>{t.analytics.systemPerformance}</span>
                                </CardTitle>
                            </CardHeader>
                                <CardContent className="space-y-4">
                                    {metrics.map((metric, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between text-sm">                                                <span className="text-sm text-medium-contrast">{metric.name}</span>
                                                <span className="text-medium-contrast">{metric.value}%</span>
                                            </div>
                                            <Progress
                                                value={metric.value}
                                                className="h-2"
                                            />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}                            <Card className="glass-card">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <TrendingUp className="w-5 h-5 text-electric-blue" />
                                        <span>{t.analytics.liveMetrics}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 rounded-lg bg-glass">
                                            <Clock className="w-6 h-6 text-neon-green mx-auto mb-2" />
                                            <p className="text-2xl font-bold font-heading">{stats.averageLatency}ms</p>
                                            <p className="text-sm text-medium-contrast">{t.analytics.metrics.avgLatency}</p>
                                        </div>
                                        <div className="text-center p-4 rounded-lg bg-glass">
                                            <Network className="w-6 h-6 text-electric-blue mx-auto mb-2" />
                                            <p className="text-2xl font-bold font-heading">{stats.bandwidth}MB/s</p>
                                            <p className="text-sm text-medium-contrast">{t.analytics.metrics.bandwidth}</p>
                                        </div>
                                        <div className="text-center p-4 rounded-lg bg-glass">
                                            <HardDrive className="w-6 h-6 text-cyber-purple mx-auto mb-2" />
                                            <p className="text-2xl font-bold font-heading">{stats.storageUsed}%</p>
                                            <p className="text-sm text-medium-contrast">{t.analytics.metrics.storage}</p>
                                        </div>
                                        <div className="text-center p-4 rounded-lg bg-glass">
                                            <Shield className="w-6 h-6 text-neon-green mx-auto mb-2" />
                                            <p className="text-2xl font-bold font-heading">{stats.errorRate}%</p>
                                            <p className="text-sm text-medium-contrast">{t.analytics.metrics.errorRate}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Performance Tab */}
                    <TabsContent value="performance" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {metrics.map((metric, index) => (
                                <Card key={index} className="glass-card">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">{metric.name}</CardTitle>
                                    </CardHeader>                                    <CardContent>
                                        <div className="text-center space-y-4">                                            <div className="circular-progress">
                                            <div className="circular-progress-bg" />
                                            <div
                                                className={`circular-progress-fill ${metric.colorClass}`}
                                                data-progress={Math.round(metric.value / 5) * 5}
                                            />
                                            <div className="circular-progress-inner">
                                                <span className="circular-progress-text">{metric.value}%</span>
                                            </div>
                                        </div>                                            <Badge variant="outline" className="border-current">
                                                {metric.value > 80 ? t.performance.high : metric.value > 50 ? t.performance.normal : t.performance.low}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Services Tab */}
                    <TabsContent value="services" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {services.map((service, index) => (
                                <Card key={index} className="glass-card">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold text-lg">{service.name}</h3>                                            <Badge
                                                variant="outline"
                                                className={`border-neon-green text-neon-green ${service.status === t.services.online ? 'bg-neon-green/10' : 'bg-red-500/10 border-red-500 text-red-500'
                                                    }`}
                                            >
                                                {service.status}
                                            </Badge>
                                        </div>                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-medium-contrast">{t.services.uptime}:</span>
                                                <span>{service.uptime}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-medium-contrast">{t.services.responseTime}:</span>
                                                <span>{service.responseTime}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity" className="space-y-6">
                        <Card className="glass-card">                            <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Activity className="w-5 h-5 text-neon-green" />
                                <span>{t.analytics.recentActivity}</span>
                            </CardTitle>
                            <CardDescription>
                                {t.analytics.activityDescription}
                            </CardDescription>
                        </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {activities.map((activity) => (
                                        <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-lg bg-glass">
                                            <div className={`w-3 h-3 rounded-full ${activity.status === 'success' ? 'bg-neon-green' :
                                                activity.status === 'warning' ? 'bg-yellow-500' :
                                                    'bg-electric-blue'
                                                }`} />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{activity.message}</p>
                                                <p className="text-xs text-medium-contrast">{activity.time}</p>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {activity.type.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
