"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Badge } from "@workspace/ui/components/badge"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Navigation } from "@/components/navigation"
import { NoSSR } from "@/components/NoSSR"
import { PageWrapper } from "@/components/PageWrapper"
import {
    Send,
    Bot,
    User,
    Loader2,
    Settings,
    Copy,
    RotateCcw,
    Zap,
    Brain,
    MessageSquare
} from "lucide-react"

interface Message {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: Date
    model?: string
    tokens?: number
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'system',
            content: 'Welcome to Local AI Stack! I\'m running on your local infrastructure. How can I help you today?',
            timestamp: new Date(),
            model: 'deepseek-r1:7b'
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedModel, setSelectedModel] = useState('deepseek-r1:7b')
    const [temperature, setTemperature] = useState(0.7)
    const [maxTokens, setMaxTokens] = useState(1000)
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    const models = [
        { value: 'deepseek-r1:7b', label: 'DeepSeek R1 7B', icon: Brain },
        { value: 'qwen2.5:7b', label: 'Qwen 2.5 7B', icon: Zap },
        { value: 'deepseek-r1:14b', label: 'DeepSeek R1 14B', icon: Brain }, { value: 'qwen2.5:14b', label: 'Qwen 2.5 14B', icon: Zap }
    ]

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
    }, [messages])

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            // Simulate API call to local backend
            await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    model: selectedModel,
                    temperature,
                    max_tokens: maxTokens
                })
            })

            // For demo purposes, simulate a response
            setTimeout(() => {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: `This is a simulated response from ${selectedModel}. In a real implementation, this would be the actual AI response from your local model. The message you sent was: "${input}"`,
                    timestamp: new Date(),
                    model: selectedModel,
                    tokens: Math.floor(Math.random() * 500) + 100
                }

                setMessages(prev => [...prev, assistantMessage])
                setIsLoading(false)
            }, 1500)
        } catch (error) {
            setIsLoading(false)
            console.error('Error sending message:', error)
        }
    }

    const copyMessage = (content: string) => {
        navigator.clipboard.writeText(content)
    }

    const clearChat = () => {
        setMessages([
            {
                id: '1',
                role: 'system', content: 'Chat cleared. How can I help you?',
                timestamp: new Date(),
                model: selectedModel
            }
        ])
    }

    return (
        <PageWrapper>
            <div className="min-h-screen bg-background">
                <Navigation />

                <div className="lg:ml-80 p-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-3rem)]">
                            {/* Chat Area */}
                            <div className="xl:col-span-3 flex flex-col">
                                <Card className="glass-card flex-1 flex flex-col">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <MessageSquare className="h-6 w-6 text-neon-green" />
                                            <CardTitle>AI Chat Interface</CardTitle>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="outline" className="text-neon-green border-neon-green">
                                                {selectedModel}
                                            </Badge>                                        <Button variant="outline" size="sm" onClick={clearChat} aria-label="Clear chat history">
                                                <RotateCcw className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="flex-1 flex flex-col p-0">
                                        {/* Messages */}
                                        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
                                            <div className="space-y-4">
                                                {messages.map((message) => (
                                                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[80%] ${message.role === 'user'
                                                            ? 'bg-primary/10 border border-primary/20'
                                                            : 'glass border border-border/50'
                                                            } rounded-lg p-4 space-y-2`}>
                                                            {/* Message Header */}
                                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                                <div className="flex items-center space-x-2">
                                                                    {message.role === 'user' ? (
                                                                        <User className="h-3 w-3" />
                                                                    ) : (
                                                                        <Bot className="h-3 w-3 text-neon-green" />
                                                                    )}
                                                                    <span className="capitalize">{message.role}</span>
                                                                    {message.model && (
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            {message.model}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    {message.tokens && (
                                                                        <span>{message.tokens} tokens</span>
                                                                    )}                                                                <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-6 w-6 p-0"
                                                                        onClick={() => copyMessage(message.content)}
                                                                        aria-label={`Copy ${message.role} message`}
                                                                    >
                                                                        <Copy className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            {/* Message Content */}
                                                            <div className="text-sm whitespace-pre-wrap">
                                                                {message.content}
                                                            </div>                                                        {/* Timestamp */}
                                                            <div className="text-xs text-muted-foreground">
                                                                <NoSSR fallback={<span>--:--:--</span>}>
                                                                    {message.timestamp.toLocaleTimeString()}
                                                                </NoSSR>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Loading Message */}
                                                {isLoading && (
                                                    <div className="flex justify-start">
                                                        <div className="glass border border-border/50 rounded-lg p-4">
                                                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                                <span>AI is thinking...</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </ScrollArea>

                                        {/* Input Area */}
                                        <div className="p-6 border-t border-border/50">                                        <div className="flex space-x-2">
                                            <Textarea
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                placeholder="Type your message... (Press Ctrl+Enter to send)"
                                                className="min-h-[60px] resize-none"
                                                aria-label="Chat message input"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                                        e.preventDefault()
                                                        sendMessage()
                                                    }
                                                }}
                                            />
                                            <Button
                                                onClick={sendMessage}
                                                disabled={!input.trim() || isLoading}
                                                className="neon-border-green glow-green"
                                                size="sm"
                                                aria-label="Send message"
                                            >
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Settings Panel */}
                            <div className="space-y-6">
                                {/* Model Selection */}
                                <Card className="glass-card">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center space-x-2">
                                            <Settings className="h-5 w-5" />
                                            <span>Configuration</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">                                    <div>
                                        <label htmlFor="model-select" className="text-sm font-medium">Model</label>
                                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                                            <SelectTrigger id="model-select" className="mt-1" aria-label={`Select AI model, currently: ${selectedModel}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {models.map((model) => (
                                                    <SelectItem key={model.value} value={model.value}>
                                                        <div className="flex items-center space-x-2">
                                                            <model.icon className="h-4 w-4" />
                                                            <span>{model.label}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div><div>
                                            <label htmlFor="temperature-slider" className="text-sm font-medium">Temperature: {temperature}</label>
                                            <input
                                                id="temperature-slider"
                                                type="range"
                                                min="0"
                                                max="2"
                                                step="0.1"
                                                value={temperature}
                                                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                                title="Adjust model temperature (0 = deterministic, 2 = creative)"
                                                aria-label={`Temperature slider, current value: ${temperature}`}
                                                className="w-full mt-1"
                                            />
                                        </div>                                    <div>
                                            <label htmlFor="max-tokens-input" className="text-sm font-medium">Max Tokens</label>
                                            <Input
                                                id="max-tokens-input"
                                                type="number"
                                                value={maxTokens}
                                                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                                                min="1"
                                                max="4000"
                                                aria-label={`Maximum tokens, current value: ${maxTokens}`}
                                                className="mt-1"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Stats */}
                                <Card className="glass-card">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Session Stats</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Messages</span>
                                            <span>{messages.length}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Total Tokens</span>
                                            <span>{messages.reduce((acc, msg) => acc + (msg.tokens || 0), 0)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Model</span>
                                            <span className="text-neon-green">{selectedModel}</span>
                                        </div>
                                    </CardContent>
                                </Card>                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}
