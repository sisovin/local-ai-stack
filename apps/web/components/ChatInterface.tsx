"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { authService, chatService, openWebUIService, ChatMessage, supabase } from '@/utils/supabaseClient'
import { NoSSR } from '@/components/NoSSR'
import {
    Send,
    User,
    Bot,
    Settings,
    Trash2,
    Download,
    Copy,
    RefreshCw,
    Zap,
    Brain,
    Activity,
    Clock,
    MessageSquare,
    AlertCircle,
    CheckCircle
} from 'lucide-react'
import { format } from 'date-fns'

interface ChatInterfaceProps {
    onSignOut: () => void
}

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    model?: string
    isStreaming?: boolean
}

export function ChatInterface({ onSignOut }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedModel, setSelectedModel] = useState('deepseek-r1:7b')
    const [temperature, setTemperature] = useState([0.7])
    const [maxTokens, setMaxTokens] = useState([2000])
    const [availableModels, setAvailableModels] = useState<any[]>([])
    const [user, setUser] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [sessionStats, setSessionStats] = useState({
        messageCount: 0,
        tokensUsed: 0,
        sessionStart: new Date()
    })

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Initialize component
    useEffect(() => {
        initializeChat()
    }, [])    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const initializeChat = async () => {
        try {
            setError(null)

            // Get current user using robust auth checking
            const { data: { session }, error: sessionError } = await supabase.auth.getSession()

            if (sessionError) {
                console.warn('Session check failed:', sessionError)
                setUser(null)
                return
            }

            let currentUser = null
            if (session?.user) {
                currentUser = session.user
                setUser(currentUser)
            } else {
                setUser(null)
            }

            // Only proceed with chat history if user is authenticated
            if (currentUser) {
                try {
                    // Load chat history
                    const history = await chatService.getChatHistory(currentUser.id)

                    // Create user messages
                    const userMessages: Message[] = history.map(msg => ({
                        id: msg.id,
                        role: 'user' as const,
                        content: msg.message,
                        timestamp: new Date(msg.created_at),
                        model: msg.model
                    }))

                    // Create assistant messages
                    const assistantMessages: Message[] = history.map(msg => ({
                        id: `${msg.id}-response`,
                        role: 'assistant' as const,
                        content: msg.response,
                        timestamp: new Date(msg.created_at),
                        model: msg.model
                    }))

                    // Combine and sort all messages
                    const formattedMessages: Message[] = [...userMessages, ...assistantMessages]
                        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

                    setMessages(formattedMessages)
                    setSessionStats(prev => ({ ...prev, messageCount: formattedMessages.length }))
                } catch (chatError) {
                    console.warn('Failed to load chat history:', chatError)
                    // Continue without chat history
                }
            }

            // Try to load available models (non-blocking)
            try {
                const models = await openWebUIService.getAvailableModels()
                setAvailableModels(models)
                setIsConnected(true)
            } catch (modelError) {
                console.warn('Failed to load models, using defaults:', modelError)
                // Set default models
                setAvailableModels([
                    { id: 'deepseek-r1:7b', name: 'DeepSeek R1 7B' },
                    { id: 'qwen2.5:7b', name: 'Qwen 2.5 7B' },
                    { id: 'llama2:7b', name: 'Llama 2 7B' }
                ])
                setIsConnected(false)
                setError('AI services are not available. Check if Ollama and Open Web UI are running.')
            }

        } catch (err: any) {
            console.error('Failed to initialize chat:', {
                error: err,
                message: err?.message || 'Unknown error',
                stack: err?.stack
            })
            setError(`Failed to initialize chat: ${err?.message || 'Unknown error'}`)
            setIsConnected(false)
        }
    }

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading || !user) return

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: inputMessage.trim(),
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputMessage('')
        setIsLoading(true)
        setError(null)

        try {
            // Create assistant message placeholder
            const assistantMessage: Message = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: '',
                timestamp: new Date(),
                model: selectedModel,
                isStreaming: true
            }

            setMessages(prev => [...prev, assistantMessage])

            // Send to Open Web UI
            const response = await openWebUIService.sendChatMessage(
                userMessage.content,
                selectedModel,
                {
                    temperature: temperature[0],
                    maxTokens: maxTokens[0]
                }
            )

            // Update assistant message
            setMessages(prev => prev.map(msg =>
                msg.id === assistantMessage.id
                    ? { ...msg, content: response, isStreaming: false }
                    : msg
            ))

            // Save to database
            await chatService.saveChatMessage({
                user_id: user.id,
                message: userMessage.content,
                response: response,
                model: selectedModel
            })

            // Update session stats
            setSessionStats(prev => ({
                ...prev,
                messageCount: prev.messageCount + 2,
                tokensUsed: prev.tokensUsed + (userMessage.content.length + response.length) / 4 // Rough token estimation
            }))

        } catch (err: any) {
            console.error('Failed to send message:', err)
            setError(err.message || 'Failed to send message')

            // Remove failed assistant message
            setMessages(prev => prev.filter(msg => msg.id !== `assistant-${Date.now()}`))
        } finally {
            setIsLoading(false)
        }
    }

    const clearChat = async () => {
        if (!user) return

        try {
            await chatService.clearChatHistory(user.id)
            setMessages([])
            setSessionStats(prev => ({ ...prev, messageCount: 0, tokensUsed: 0, sessionStart: new Date() }))
        } catch (err: any) {
            setError('Failed to clear chat history')
        }
    }

    const copyMessage = (content: string) => {
        navigator.clipboard.writeText(content)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border/50 glass-card sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-neon-green to-electric-blue rounded-lg flex items-center justify-center glow-green">
                                    <Brain className="h-4 w-4 text-background" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-glow-green">AI Chat Interface</h1>
                                    <p className="text-xs text-muted-foreground">Connected to local AI stack</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-neon-green glow-green' : 'bg-red-500'} animate-pulse`} />
                                <span className="text-xs font-mono text-muted-foreground">
                                    {isConnected ? 'ONLINE' : 'OFFLINE'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="neon-border-green/50">
                                {user?.email}
                            </Badge>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onSignOut}
                                className="glass hover:neon-border-green"
                            >
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">

                    {/* Chat Area */}
                    <div className="lg:col-span-3 flex flex-col">
                        <Card className="flex-1 glass-card flex flex-col">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center space-x-2">
                                        <MessageSquare className="h-5 w-5 text-neon-green" />
                                        <span>Chat Messages</span>
                                    </CardTitle>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={clearChat}
                                            className="glass hover:neon-border-red"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1 flex flex-col p-0">
                                {/* Error Alert */}
                                {error && (
                                    <div className="mx-6 mb-4">
                                        <Alert className="border-red-500/50 bg-red-500/10">
                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                            <AlertDescription className="text-red-500">
                                                {error}
                                            </AlertDescription>
                                        </Alert>
                                    </div>
                                )}

                                {/* Messages */}
                                <ScrollArea className="flex-1 px-6">
                                    <div className="space-y-4 pb-4">
                                        {messages.length === 0 ? (
                                            <div className="text-center py-12">
                                                <Bot className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                                                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                                    Welcome to Local AI Chat
                                                </h3>
                                                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                                    Start a conversation with your local AI models. Your data stays private and secure on your infrastructure.
                                                </p>
                                            </div>
                                        ) : (
                                            messages.map((message) => (
                                                <div
                                                    key={message.id}
                                                    className={`flex items-start space-x-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                                        }`}
                                                >
                                                    {message.role === 'assistant' && (
                                                        <div className="w-8 h-8 bg-gradient-to-br from-neon-green to-electric-blue rounded-lg flex items-center justify-center glow-green flex-shrink-0">
                                                            <Bot className="h-4 w-4 text-background" />
                                                        </div>
                                                    )}

                                                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                                                        <div
                                                            className={`p-4 rounded-lg ${message.role === 'user'
                                                                ? 'bg-primary text-primary-foreground neon-border-green'
                                                                : 'glass-card neon-border-blue/30'
                                                                }`}
                                                        >
                                                            {message.isStreaming ? (
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                                                                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">                                                                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                                                        <Clock className="h-3 w-3" />
                                                                        <NoSSR fallback={<span>--:--</span>}>
                                                                            <span>{format(message.timestamp, 'HH:mm')}</span>
                                                                        </NoSSR>
                                                                        {message.model && (
                                                                            <>
                                                                                <span>•</span>
                                                                                <span>{message.model}</span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => copyMessage(message.content)}
                                                                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            <Copy className="h-3 w-3" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {message.role === 'user' && (
                                                        <div className="w-8 h-8 bg-tech-gray rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <User className="h-4 w-4 text-foreground" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </ScrollArea>

                                {/* Input Area */}
                                <div className="border-t border-border/50 p-6">
                                    <div className="flex space-x-2">
                                        <Input
                                            ref={inputRef}
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Type your message..."
                                            className="flex-1 glass neon-border-green/30 focus:neon-border-green"
                                            disabled={isLoading || !isConnected}
                                        />
                                        <Button
                                            onClick={sendMessage}
                                            disabled={isLoading || !inputMessage.trim() || !isConnected}
                                            className="neon-border-green glow-green hover:glow-green"
                                        >
                                            {isLoading ? (
                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Send className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Model Settings */}
                        <Card className="glass-card">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center space-x-2 text-sm">
                                    <Settings className="h-4 w-4 text-neon-green" />
                                    <span>Model Settings</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Model</label>
                                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                                        <SelectTrigger className="glass neon-border-green/30">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="glass-card">
                                            {availableModels.map((model) => (
                                                <SelectItem key={model.id} value={model.id}>
                                                    {model.name || model.id}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-medium text-muted-foreground">Temperature</label>
                                        <span className="text-xs text-neon-green">{temperature[0]}</span>
                                    </div>
                                    <Slider
                                        value={temperature}
                                        onValueChange={setTemperature}
                                        max={2}
                                        min={0}
                                        step={0.1}
                                        className="[&_[role=slider]]:neon-border-green"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-medium text-muted-foreground">Max Tokens</label>
                                        <span className="text-xs text-electric-blue">{maxTokens[0]}</span>
                                    </div>
                                    <Slider
                                        value={maxTokens}
                                        onValueChange={setMaxTokens}
                                        max={4000}
                                        min={100}
                                        step={100}
                                        className="[&_[role=slider]]:neon-border-blue"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Session Stats */}
                        <Card className="glass-card">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center space-x-2 text-sm">
                                    <Activity className="h-4 w-4 text-electric-blue" />
                                    <span>Session Stats</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Messages</span>
                                    <span className="text-neon-green font-mono">{sessionStats.messageCount}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Tokens Used</span>
                                    <span className="text-electric-blue font-mono">{sessionStats.tokensUsed}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Session Time</span>
                                    <span className="text-cyber-purple font-mono">
                                        {format(sessionStats.sessionStart, 'HH:mm')}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="glass-card">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center space-x-2 text-sm">
                                    <Zap className="h-4 w-4 text-cyber-purple" />
                                    <span>Quick Actions</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full glass hover:neon-border-green justify-start"
                                    onClick={() => setInputMessage("Explain quantum computing in simple terms")}
                                >
                                    <Brain className="h-4 w-4 mr-2" />
                                    Ask about quantum
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full glass hover:neon-border-blue justify-start"
                                    onClick={() => setInputMessage("Write a Python function for binary search")}
                                >
                                    <Bot className="h-4 w-4 mr-2" />
                                    Code help
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full glass hover:neon-border-purple justify-start"
                                    onClick={() => setInputMessage("What are the latest trends in AI?")}
                                >
                                    <Activity className="h-4 w-4 mr-2" />
                                    AI trends
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
