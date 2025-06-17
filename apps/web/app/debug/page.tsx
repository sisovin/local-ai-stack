"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { ScrollArea } from '@workspace/ui/components/scroll-area'
import { Navigation } from '@/components/navigation'
import { RefreshCw, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

interface HealthCheck {
    service: string
    status: 'healthy' | 'warning' | 'error'
    responseTime: number
    message?: string
    data?: any
}

interface HealthResponse {
    timestamp: string
    checks: HealthCheck[]
}

export default function DebugPage() {
    const [healthData, setHealthData] = useState<HealthResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const runHealthCheck = async (service?: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const url = service ? `/api/health?service=${service}` : '/api/health'
            console.log('Calling health API:', url)

            const response = await fetch(url)
            console.log('Health API response status:', response.status)

            if (response.ok) {
                const data = await response.json()
                console.log('Health API response data:', data)
                setHealthData(data)
            } else {
                const errorText = await response.text()
                throw new Error(`HTTP ${response.status}: ${errorText}`)
            }
        } catch (err: any) {
            console.error('Health check failed:', err)
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'healthy':
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'warning':
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />
            case 'error':
                return <XCircle className="h-4 w-4 text-red-500" />
            default:
                return <AlertTriangle className="h-4 w-4 text-gray-500" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'healthy':
                return <Badge className="bg-green-500">Healthy</Badge>
            case 'warning':
                return <Badge className="bg-yellow-500">Warning</Badge>
            case 'error':
                return <Badge variant="destructive">Error</Badge>
            default:
                return <Badge variant="secondary">Unknown</Badge>
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Debug - Health API</h1>
                        <p className="text-muted-foreground mt-2">
                            Test the health check API for all services
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {/* Controls */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Health Check Controls</CardTitle>
                                <CardDescription>
                                    Test different health check endpoints
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        onClick={() => runHealthCheck()}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                                        Check All Services
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => runHealthCheck('ollama')}
                                        disabled={isLoading}
                                    >
                                        Check Ollama
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => runHealthCheck('openwebui')}
                                        disabled={isLoading}
                                    >
                                        Check OpenWebUI
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => runHealthCheck('ai-search')}
                                        disabled={isLoading}
                                    >
                                        Check AI Search
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => runHealthCheck('models')}
                                        disabled={isLoading}
                                    >
                                        Check Models
                                    </Button>
                                </div>

                                {error && (
                                    <div className="text-red-500 text-sm">
                                        Error: {error}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Results */}
                        {healthData && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Health Check Results</CardTitle>
                                    <CardDescription>
                                        Last checked: {new Date(healthData.timestamp).toLocaleString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {healthData.checks.map((check, index) => (
                                            <div key={index} className="border rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(check.status)}
                                                        <h3 className="font-semibold capitalize">{check.service}</h3>
                                                    </div>
                                                    {getStatusBadge(check.status)}
                                                </div>

                                                <div className="text-sm text-muted-foreground">
                                                    Response Time: {check.responseTime}ms
                                                </div>

                                                {check.message && (
                                                    <div className="text-sm text-red-500 mt-1">
                                                        {check.message}
                                                    </div>
                                                )}

                                                {check.data && (
                                                    <details className="mt-2">
                                                        <summary className="text-sm font-medium cursor-pointer">
                                                            View Data
                                                        </summary>
                                                        <ScrollArea className="h-32 w-full mt-2">
                                                            <pre className="text-xs bg-muted p-2 rounded">
                                                                {JSON.stringify(check.data, null, 2)}
                                                            </pre>
                                                        </ScrollArea>
                                                    </details>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
