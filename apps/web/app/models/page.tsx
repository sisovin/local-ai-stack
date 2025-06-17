"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Textarea } from '@workspace/ui/components/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { Badge } from '@workspace/ui/components/badge'
import { Alert, AlertDescription } from '@workspace/ui/components/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { ScrollArea } from '@workspace/ui/components/scroll-area'
import { Navigation } from '@/components/navigation'
import { SupabaseConnectionTest } from '@/components/SupabaseConnectionTest'
import { DatabaseSetupHelper } from '@/components/DatabaseSetupHelper'
import { ServiceSetupGuide } from '@/components/ServiceSetupGuide'
import { openWebUIService } from '@/utils/supabaseClient'
import {
    Play,
    Settings,
    Database,
    MessageSquare,
    Code,
    TestTube,
    Zap,
    Brain,
    Activity,
    RefreshCw,
    CheckCircle,
    AlertTriangle,
    Loader2,
    Server,
    Cpu
} from 'lucide-react'

export default function ModelsPage() {
    const [models, setModels] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown')

    // Helper functions
    const formatSizeString = (size: string | undefined): string => {
        if (!size) return 'Unknown'
        return size
    }

    const extractParameterSize = (modelName: string): string => {
        const match = modelName.match(/(\d+[bB])/i)
        return match?.[1]?.toUpperCase() || 'Unknown'
    }

    const extractQuantization = (modelName: string): string => {
        if (modelName.includes('q4')) return 'Q4_0'
        if (modelName.includes('q8')) return 'Q8_0'
        if (modelName.includes('f16')) return 'F16'
        return 'Q4_0' // Default assumption
    }

    useEffect(() => {
        loadModels()
    }, [])

    const loadModels = async () => {
        setIsLoading(true)
        setError(null)

        try {
            // Use our health API to get models
            const response = await fetch('/api/health?service=models')

            if (response.ok) {
                const healthData = await response.json()
                const modelCheck = healthData.checks.find((check: any) => check.service === 'models')

                if (modelCheck && modelCheck.status === 'healthy' && modelCheck.data) {
                    const modelList = modelCheck.data.models || []
                    setModels(modelList.map((model: any) => ({
                        id: model.name,
                        name: model.name,
                        size: model.size || 'Unknown',
                        modified: model.modified,
                        details: {
                            format: 'gguf',
                            family: model.name.split(':')[0] || 'unknown',
                            parameter_size: extractParameterSize(model.name),
                            quantization_level: extractQuantization(model.name)
                        }
                    })))
                    setConnectionStatus('connected')
                } else {
                    throw new Error(modelCheck?.message || 'No models found')
                }
            } else {
                throw new Error(`Health API returned ${response.status}`)
            }
        } catch (err: any) {
            console.error('Failed to load models via health API:', err)
            setError(`Failed to load models: ${err.message}`)
            setConnectionStatus('error')

            // Set some default models for demo purposes
            setModels([
                {
                    id: 'deepseek-r1:7b',
                    name: 'DeepSeek R1 7B',
                    size: '4.1GB',
                    details: {
                        format: 'gguf',
                        family: 'deepseek',
                        parameter_size: '7B',
                        quantization_level: 'Q4_0'
                    }
                },
                {
                    id: 'qwen2.5:7b',
                    name: 'Qwen 2.5 7B',
                    size: '4.4GB',
                    details: {
                        format: 'gguf',
                        family: 'qwen',
                        parameter_size: '7B',
                        quantization_level: 'Q4_0'
                    }
                },
                {
                    id: 'llama2:7b',
                    name: 'Llama 2 7B',
                    size: '3.8GB',
                    details: {
                        format: 'gguf',
                        family: 'llama',
                        parameter_size: '7B',
                        quantization_level: 'Q4_0'
                    }
                }
            ])
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusBadge = () => {
        switch (connectionStatus) {
            case 'connected':
                return (
                    <Badge variant="outline" className="text-green-400 border-green-400">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                    </Badge>
                )
            case 'error':
                return (
                    <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Offline
                    </Badge>
                )
            default:
                return (
                    <Badge variant="secondary">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Checking...
                    </Badge>
                )
        }
    }

    const getModelIcon = (family: string | undefined) => {
        switch (family?.toLowerCase()) {
            case 'deepseek':
                return <Brain className="h-5 w-5 text-purple-400" />
            case 'qwen':
                return <Zap className="h-5 w-5 text-blue-400" />
            case 'llama':
                return <Activity className="h-5 w-5 text-orange-400" />
            default:
                return <Cpu className="h-5 w-5 text-gray-400" />
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <div className="lg:ml-80">
                <div className="container mx-auto px-6 py-8">
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="text-center space-y-4">                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                            � Model Management
                        </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Manage and monitor your local AI models. View details, check status, and configure model settings.
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                {getStatusBadge()}                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={loadModels}
                                    disabled={isLoading}
                                    className="border-purple-500/50"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh Models
                                </Button>
                            </div>
                        </div>                        {/* Error Alert */}
                        {error && (
                            <Alert className="border-red-500/50 bg-red-500/10">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription className="text-red-200">
                                    <strong>Connection Error:</strong> {error}
                                    <br />
                                    <br />
                                    <strong>Make sure:</strong>
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        <li>Ollama is running on your system</li>
                                        <li>At least one model is pulled in Ollama</li>
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        <Tabs defaultValue="overview" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="overview" className="flex items-center gap-2">
                                    <Database className="h-4 w-4" />
                                    Model Overview
                                </TabsTrigger>
                                <TabsTrigger value="details" className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Model Details
                                </TabsTrigger>
                                <TabsTrigger value="system" className="flex items-center gap-2">
                                    <Server className="h-4 w-4" />
                                    System Info
                                </TabsTrigger>
                            </TabsList>

                            {/* Model Overview Tab */}
                            <TabsContent value="overview" className="space-y-6">
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                                        <span className="ml-2 text-lg">Loading models...</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {models.map((model: any) => (
                                            <Card key={model.id} className="border-purple-500/20 bg-black/40 backdrop-blur-sm hover:border-purple-500/40 transition-colors">
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            {getModelIcon(model.details?.family)}
                                                            <CardTitle className="text-lg">{model.name}</CardTitle>
                                                        </div>
                                                        <Badge variant="outline" className="text-xs">
                                                            {model.details?.parameter_size || 'Unknown'}
                                                        </Badge>
                                                    </div>
                                                    <CardDescription className="text-xs font-mono">
                                                        {model.id}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">Size:</span>
                                                        <span className="font-medium">{formatSizeString(model.size)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">Format:</span>
                                                        <span className="font-medium">{model.details?.format || 'Unknown'}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">Quantization:</span>
                                                        <span className="font-medium">{model.details?.quantization_level || 'Unknown'}</span>
                                                    </div>
                                                    <div className="flex gap-2 pt-2">
                                                        <Button size="sm" variant="outline" className="flex-1">
                                                            <Settings className="h-3 w-3 mr-1" />
                                                            Configure
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}

                                        {models.length === 0 && !isLoading && (
                                            <div className="col-span-full text-center py-12">
                                                <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                                    No models found
                                                </h3>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    Make sure Ollama is running and you have models installed
                                                </p>
                                                <Button variant="outline" onClick={loadModels}>
                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                    Try Again
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </TabsContent>                            {/* Model Details Tab */}
                            <TabsContent value="details" className="space-y-6">
                                <Card className="border-blue-500/20 bg-black/40 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-blue-400">Model Details</CardTitle>
                                        <CardDescription>
                                            Detailed information about your available models
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="h-96">
                                            <div className="space-y-4">
                                                {models.map((model: any) => (
                                                    <div key={model.id} className="border border-blue-500/20 rounded-lg p-4">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            {getModelIcon(model.details?.family)}
                                                            <h4 className="font-medium">{model.name}</h4>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <span className="text-muted-foreground">ID:</span>
                                                                <p className="font-mono">{model.id}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Size:</span>
                                                                <p>{formatSizeString(model.size)}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Family:</span>
                                                                <p>{model.details?.family || 'Unknown'}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Format:</span>
                                                                <p>{model.details?.format || 'Unknown'}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Parameters:</span>
                                                                <p>{model.details?.parameter_size || 'Unknown'}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Quantization:</span>
                                                                <p>{model.details?.quantization_level || 'Unknown'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* System Info Tab */}
                            <TabsContent value="system" className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-green-400">Connection Status</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span>Ollama Service</span>
                                                {connectionStatus === 'connected' ? (
                                                    <Badge variant="outline" className="text-green-400 border-green-400">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Running
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive">
                                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                                        Offline
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>Models Available</span>
                                                <Badge variant="outline">
                                                    {models.length}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-orange-500/20 bg-black/40 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-orange-400">Configuration</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <span className="text-sm font-medium">Ollama URL</span>
                                                <p className="text-xs font-mono bg-black/20 p-2 rounded border">
                                                    {process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434'}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}
