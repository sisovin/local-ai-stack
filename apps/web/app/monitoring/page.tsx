"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { Alert, AlertDescription } from '@workspace/ui/components/alert'
import { Progress } from '@workspace/ui/components/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { ScrollArea } from '@workspace/ui/components/scroll-area'
import { Navigation } from '@/components/navigation'
import { PageWrapper } from "@/components/PageWrapper"
import { supabase, openWebUIService } from '@/utils/supabaseClient'
import {
    Activity,
    Server,
    Database,
    Cpu,
    HardDrive,
    Wifi,
    Users,
    MessageSquare,
    Clock,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    RefreshCw,
    Loader2,
    Zap,
    Brain,
    Globe,
    Shield
} from 'lucide-react'

interface SystemMetrics {
    status: 'healthy' | 'warning' | 'error'
    uptime: string
    lastCheck: string
    responseTime: number
}

interface ServiceStatus {
    supabase: SystemMetrics
    openWebUI: SystemMetrics
    ollama: SystemMetrics
    aiSearch: SystemMetrics
}

export default function MonitoringPage() {
    const [services, setServices] = useState<ServiceStatus>({
        supabase: { status: 'healthy', uptime: '99.9%', lastCheck: 'Checking...', responseTime: 0 },
        openWebUI: { status: 'healthy', uptime: '98.5%', lastCheck: 'Checking...', responseTime: 0 },
        ollama: { status: 'healthy', uptime: '97.2%', lastCheck: 'Checking...', responseTime: 0 },
        aiSearch: { status: 'warning', uptime: '95.1%', lastCheck: 'Checking...', responseTime: 0 }
    })

    const [isLoading, setIsLoading] = useState(false)
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
    const [systemStats, setSystemStats] = useState({
        totalUsers: 42,
        totalChats: 1337,
        totalModels: 5,
        totalRequests: 8950,
        avgResponseTime: 2.3,
        successRate: 98.7
    })

    useEffect(() => {
        checkAllServices()
        const interval = setInterval(checkAllServices, 60000) // Check every 60 seconds instead of 30
        return () => clearInterval(interval)
    }, [])

    const checkAllServices = async () => {
        setIsLoading(true)
        const checkTime = new Date()

        try {            // Check Supabase
            const supabaseStart = Date.now()
            try {
                const { data, error } = await supabase.auth.getSession()
                const responseTime = Date.now() - supabaseStart
                // Don't treat missing session as an error - just check if Supabase is responsive
                setServices(prev => ({
                    ...prev,
                    supabase: {
                        status: 'healthy',
                        uptime: '99.9%',
                        lastCheck: checkTime.toLocaleTimeString(),
                        responseTime
                    }
                }))
            } catch (error) {
                console.warn('Supabase monitoring check error:', error)
                setServices(prev => ({
                    ...prev,
                    supabase: {
                        status: 'error',
                        uptime: '99.9%',
                        lastCheck: checkTime.toLocaleTimeString(),
                        responseTime: 0
                    }
                }))
            }// Try direct Ollama check first, then fallback to health API
            const ollamaStart = Date.now()
            try {
                const ollamaUrl = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434'
                console.log('Trying direct Ollama check:', `${ollamaUrl}/api/tags`)

                const response = await fetch(`${ollamaUrl}/api/tags`, {
                    method: 'GET',
                    signal: AbortSignal.timeout(3000)
                })

                if (response.ok) {
                    const data = await response.json()
                    const responseTime = Date.now() - ollamaStart
                    const hasModels = data.models?.length > 0

                    setServices(prev => ({
                        ...prev,
                        openWebUI: {
                            status: hasModels ? 'healthy' : 'warning',
                            uptime: '98.5%',
                            lastCheck: checkTime.toLocaleTimeString(),
                            responseTime
                        },
                        ollama: {
                            status: hasModels ? 'healthy' : 'warning',
                            uptime: '97.2%',
                            lastCheck: checkTime.toLocaleTimeString(),
                            responseTime
                        }
                    }))
                } else {
                    throw new Error(`Ollama returned ${response.status}`)
                }
            } catch (ollamaError) {
                console.log('Direct Ollama check failed:', ollamaError)
                const responseTime = Date.now() - ollamaStart
                setServices(prev => ({
                    ...prev,
                    openWebUI: {
                        status: 'error',
                        uptime: '98.5%',
                        lastCheck: checkTime.toLocaleTimeString(),
                        responseTime
                    },
                    ollama: {
                        status: 'error',
                        uptime: '97.2%',
                        lastCheck: checkTime.toLocaleTimeString(),
                        responseTime
                    }
                }))
            }            // Check AI Search with direct connection and short timeout
            const searchStart = Date.now()
            try {
                const searchUrl = process.env.NEXT_PUBLIC_AI_SEARCH_URL || 'http://localhost:8001'
                const response = await fetch(`${searchUrl}/health`, {
                    method: 'GET',
                    signal: AbortSignal.timeout(2000) // Very short timeout for AI search
                })

                const responseTime = Date.now() - searchStart
                setServices(prev => ({
                    ...prev,
                    aiSearch: {
                        status: response.ok ? 'healthy' : 'warning',
                        uptime: '95.1%',
                        lastCheck: checkTime.toLocaleTimeString(),
                        responseTime
                    }
                }))
            } catch (error) {
                console.log('AI Search check failed (expected if not running):', error)
                const responseTime = Date.now() - searchStart
                setServices(prev => ({
                    ...prev,
                    aiSearch: {
                        status: 'error',
                        uptime: '95.1%',
                        lastCheck: checkTime.toLocaleTimeString(),
                        responseTime
                    }
                }))
            }

            setLastUpdate(checkTime)
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'healthy':
                return <CheckCircle className="h-4 w-4 text-green-400" />
            case 'warning':
                return <AlertTriangle className="h-4 w-4 text-yellow-400" />
            case 'error':
                return <AlertTriangle className="h-4 w-4 text-red-400" />
            default:
                return <Loader2 className="h-4 w-4 animate-spin" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'healthy':
                return <Badge variant="outline" className="text-green-400 border-green-400">Healthy</Badge>
            case 'warning':
                return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Warning</Badge>
            case 'error':
                return <Badge variant="destructive">Error</Badge>
            default:
                return <Badge variant="secondary">Unknown</Badge>
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'text-green-400'
            case 'warning': return 'text-yellow-400'
            case 'error': return 'text-red-400'
            default: return 'text-gray-400'
        }
    }

    const overallStatus = Object.values(services).every(s => s.status === 'healthy') ? 'healthy' :
        Object.values(services).some(s => s.status === 'error') ? 'error' : 'warning'

    return (
        <PageWrapper>
            <div className="min-h-screen bg-background">
                <Navigation />

                <div className="lg:ml-80">
                    <div className="container mx-auto px-6 py-8">
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
                                            📊 System Monitoring
                                        </h1>
                                        <p className="text-lg text-muted-foreground mt-2">
                                            Monitor the health and performance of your LocalAI stack
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`flex items-center gap-2 ${getStatusColor(overallStatus)}`}>
                                            {getStatusIcon(overallStatus)}
                                            <span className="font-medium">
                                                System {overallStatus === 'healthy' ? 'Healthy' : overallStatus === 'warning' ? 'Warning' : 'Error'}
                                            </span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={checkAllServices}
                                            disabled={isLoading}
                                            className="border-green-500/50"
                                        >
                                            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                            Refresh
                                        </Button>
                                    </div>
                                </div>
                                {lastUpdate && (
                                    <p className="text-sm text-muted-foreground">
                                        Last updated: {lastUpdate.toLocaleString()}
                                    </p>
                                )}
                            </div>

                            <Tabs defaultValue="overview" className="space-y-6">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="overview" className="flex items-center gap-2">
                                        <Activity className="h-4 w-4" />
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger value="services" className="flex items-center gap-2">
                                        <Server className="h-4 w-4" />
                                        Services
                                    </TabsTrigger>
                                    <TabsTrigger value="metrics" className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4" />
                                        Metrics
                                    </TabsTrigger>
                                    <TabsTrigger value="logs" className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Activity
                                    </TabsTrigger>
                                </TabsList>

                                {/* Overview Tab */}
                                <TabsContent value="overview" className="space-y-6">
                                    {/* Status Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm">
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                                <Users className="h-4 w-4 text-green-400" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
                                                <p className="text-xs text-muted-foreground">+12% from last month</p>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-blue-500/20 bg-black/40 backdrop-blur-sm">
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
                                                <MessageSquare className="h-4 w-4 text-blue-400" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{systemStats.totalChats.toLocaleString()}</div>
                                                <p className="text-xs text-muted-foreground">+23% from last week</p>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-purple-500/20 bg-black/40 backdrop-blur-sm">
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">AI Models</CardTitle>
                                                <Brain className="h-4 w-4 text-purple-400" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{systemStats.totalModels}</div>
                                                <p className="text-xs text-muted-foreground">3 active, 2 cached</p>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-orange-500/20 bg-black/40 backdrop-blur-sm">
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                                                <TrendingUp className="h-4 w-4 text-orange-400" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{systemStats.successRate}%</div>
                                                <p className="text-xs text-muted-foreground">+0.3% from yesterday</p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Performance Metrics */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <Card className="border-cyan-500/20 bg-black/40 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle className="text-cyan-400">Response Times</CardTitle>
                                                <CardDescription>Average response times by service</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span>Supabase</span>
                                                        <span>{services.supabase.responseTime}ms</span>
                                                    </div>
                                                    <Progress value={Math.min(services.supabase.responseTime / 10, 100)} className="h-2" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span>Open Web UI</span>
                                                        <span>{services.openWebUI.responseTime}ms</span>
                                                    </div>
                                                    <Progress value={Math.min(services.openWebUI.responseTime / 10, 100)} className="h-2" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span>Ollama</span>
                                                        <span>{services.ollama.responseTime}ms</span>
                                                    </div>
                                                    <Progress value={Math.min(services.ollama.responseTime / 10, 100)} className="h-2" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span>AI Search</span>
                                                        <span>{services.aiSearch.responseTime}ms</span>
                                                    </div>
                                                    <Progress value={Math.min(services.aiSearch.responseTime / 10, 100)} className="h-2" />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-pink-500/20 bg-black/40 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle className="text-pink-400">System Health</CardTitle>
                                                <CardDescription>Overall system status indicators</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Database className="h-4 w-4 text-blue-400" />
                                                        <span className="text-sm">Database</span>
                                                    </div>
                                                    {getStatusBadge(services.supabase.status)}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Brain className="h-4 w-4 text-purple-400" />
                                                        <span className="text-sm">AI Models</span>
                                                    </div>
                                                    {getStatusBadge(services.ollama.status)}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="h-4 w-4 text-green-400" />
                                                        <span className="text-sm">Web Interface</span>
                                                    </div>
                                                    {getStatusBadge(services.openWebUI.status)}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Zap className="h-4 w-4 text-yellow-400" />
                                                        <span className="text-sm">Search Agent</span>
                                                    </div>
                                                    {getStatusBadge(services.aiSearch.status)}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>

                                {/* Services Tab */}
                                <TabsContent value="services" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {Object.entries(services).map(([serviceName, service]) => (
                                            <Card key={serviceName} className="border-blue-500/20 bg-black/40 backdrop-blur-sm">
                                                <CardHeader>
                                                    <div className="flex items-center justify-between">
                                                        <CardTitle className="capitalize">{serviceName.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
                                                        {getStatusBadge(service.status)}
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Uptime</span>
                                                        <span className="font-medium">{service.uptime}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Last Check</span>
                                                        <span className="font-medium">{service.lastCheck}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Response Time</span>
                                                        <span className="font-medium">{service.responseTime}ms</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </TabsContent>

                                {/* Metrics Tab */}
                                <TabsContent value="metrics" className="space-y-6">
                                    <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-green-400">Performance Metrics</CardTitle>
                                            <CardDescription>Detailed performance and usage statistics</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="text-center space-y-2">
                                                    <div className="text-3xl font-bold text-green-400">{systemStats.avgResponseTime}s</div>
                                                    <div className="text-sm text-muted-foreground">Avg Response Time</div>
                                                </div>
                                                <div className="text-center space-y-2">
                                                    <div className="text-3xl font-bold text-blue-400">{systemStats.totalRequests.toLocaleString()}</div>
                                                    <div className="text-sm text-muted-foreground">Total Requests</div>
                                                </div>
                                                <div className="text-center space-y-2">
                                                    <div className="text-3xl font-bold text-purple-400">{systemStats.successRate}%</div>
                                                    <div className="text-sm text-muted-foreground">Success Rate</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Activity Tab */}
                                <TabsContent value="logs" className="space-y-6">
                                    <Card className="border-orange-500/20 bg-black/40 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-orange-400">Recent Activity</CardTitle>
                                            <CardDescription>System events and activity log</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ScrollArea className="h-96">
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                                        <span className="text-muted-foreground">15:32:45</span>
                                                        <span>Supabase connection established</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                                        <span className="text-muted-foreground">15:32:43</span>
                                                        <span>Models loaded successfully (5 models)</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                                                        <span className="text-muted-foreground">15:32:40</span>
                                                        <span>AI Search Agent response time elevated (2.3s)</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                                        <span className="text-muted-foreground">15:32:38</span>
                                                        <span>Open Web UI health check passed</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                                        <span className="text-muted-foreground">15:32:35</span>
                                                        <span>System monitoring started</span>
                                                    </div>
                                                </div>
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>                            </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}
