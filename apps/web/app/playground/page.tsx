"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
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
    Server
} from 'lucide-react'

export default function PlaygroundPage() {
    const [prompt, setPrompt] = useState('Hello! Can you explain quantum computing in simple terms?')
    const [response, setResponse] = useState('')
    const [selectedModel, setSelectedModel] = useState('deepseek-r1:7b')
    const [temperature, setTemperature] = useState(0.7)
    const [maxTokens, setMaxTokens] = useState(1000)
    const [isLoading, setIsLoading] = useState(false)
    const [availableModels, setAvailableModels] = useState<Array<{ id: string, name: string }>>([])
    const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadModels()
    }, [])

    const loadModels = async () => {
        try {
            const models = await openWebUIService.getAvailableModels()
            setAvailableModels(models)
            setConnectionStatus('connected')
        } catch (error) {
            console.error('Failed to load models:', error)
            setConnectionStatus('error')
            setAvailableModels([
                { id: 'deepseek-r1:7b', name: 'DeepSeek R1 7B' },
                { id: 'qwen2.5:7b', name: 'Qwen 2.5 7B' },
                { id: 'llama2:7b', name: 'Llama 2 7B' }
            ])
        }
    }

    const sendMessage = async () => {
        if (!prompt.trim() || isLoading) return

        setIsLoading(true)
        setError(null)
        setResponse('')

        try {
            const result = await openWebUIService.sendChatMessage(prompt, selectedModel, {
                temperature,
                maxTokens,
                stream: false
            })
            setResponse(result)
        } catch (err: any) {
            setError(`Failed to send message: ${err.message}`)
            console.error('Chat error:', err)
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

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <div className="lg:ml-80">
                <div className="container mx-auto px-6 py-8">
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                                🧪 LocalAI Playground
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Test and experiment with your local AI models. Debug connections, try different prompts, and verify your setup.
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                {getStatusBadge()}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={loadModels}
                                    disabled={isLoading}
                                    className="border-blue-500/50"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh
                                </Button>
                            </div>
                        </div>                        <Tabs defaultValue="chat" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="chat" className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    Chat Test
                                </TabsTrigger>
                                <TabsTrigger value="setup" className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Setup Check
                                </TabsTrigger>
                                <TabsTrigger value="services" className="flex items-center gap-2">
                                    <Server className="h-4 w-4" />
                                    Services
                                </TabsTrigger>
                                <TabsTrigger value="debug" className="flex items-center gap-2">
                                    <TestTube className="h-4 w-4" />
                                    Debug Info
                                </TabsTrigger>
                            </TabsList>

                            {/* Chat Test Tab */}
                            <TabsContent value="chat" className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Settings Panel */}
                                    <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-green-400 flex items-center gap-2">
                                                <Settings className="h-5 w-5" />
                                                Settings
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Model</label>
                                                <Select value={selectedModel} onValueChange={setSelectedModel}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableModels.map((model: any) => (
                                                            <SelectItem key={model.id} value={model.id}>
                                                                {model.name || model.id}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Temperature: {temperature}</label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="2"
                                                    step="0.1"
                                                    value={temperature}
                                                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                                    className="w-full"
                                                    aria-label={`Temperature setting: ${temperature}`}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Max Tokens</label>
                                                <Input
                                                    type="number"
                                                    value={maxTokens}
                                                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                                                    min="1"
                                                    max="4000"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Chat Interface */}
                                    <div className="lg:col-span-2 space-y-4">
                                        <Card className="border-blue-500/20 bg-black/40 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle className="text-blue-400 flex items-center gap-2">
                                                    <Brain className="h-5 w-5" />
                                                    Chat Interface
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Your Message</label>
                                                    <Textarea
                                                        placeholder="Enter your message here..."
                                                        value={prompt}
                                                        onChange={(e) => setPrompt(e.target.value)}
                                                        rows={4}
                                                        className="resize-none"
                                                    />
                                                </div>

                                                <Button
                                                    onClick={sendMessage}
                                                    disabled={isLoading || !prompt.trim()}
                                                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                            Generating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Play className="h-4 w-4 mr-2" />
                                                            Send Message
                                                        </>
                                                    )}
                                                </Button>

                                                {error && (
                                                    <Alert className="border-red-500/50 bg-red-500/10">
                                                        <AlertTriangle className="h-4 w-4" />
                                                        <AlertDescription className="text-red-200">
                                                            {error}
                                                        </AlertDescription>
                                                    </Alert>
                                                )}

                                                {response && (
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-green-400">AI Response</label>
                                                        <ScrollArea className="h-64 rounded-md border border-green-500/20 bg-black/20 p-4">
                                                            <pre className="whitespace-pre-wrap text-sm">
                                                                {response}
                                                            </pre>
                                                        </ScrollArea>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>                            {/* Setup Check Tab */}
                            <TabsContent value="setup" className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <SupabaseConnectionTest />
                                    <DatabaseSetupHelper />
                                </div>
                            </TabsContent>

                            {/* Services Tab */}
                            <TabsContent value="services" className="space-y-6">
                                <ServiceSetupGuide />
                            </TabsContent>

                            {/* Debug Info Tab */}
                            <TabsContent value="debug" className="space-y-6">
                                <Card className="border-purple-500/20 bg-black/40 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-purple-400 flex items-center gap-2">
                                            <Code className="h-5 w-5" />
                                            Debug Information
                                        </CardTitle>
                                        <CardDescription>
                                            System information and configuration details
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-medium text-purple-400">Environment</h4>
                                                <div className="text-xs font-mono space-y-1">
                                                    <div>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</div>
                                                    <div>OpenWebUI URL: {process.env.NEXT_PUBLIC_OPENWEBUI_URL}</div>
                                                    <div>AI Search URL: {process.env.NEXT_PUBLIC_AI_SEARCH_URL}</div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-medium text-purple-400">Models Available</h4>
                                                <div className="text-xs font-mono space-y-1">
                                                    {availableModels.map((model: any) => (
                                                        <div key={model.id}>• {model.name || model.id}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}
