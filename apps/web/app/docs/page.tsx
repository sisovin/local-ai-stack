"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Navigation } from '@/components/navigation'
import { PageWrapper } from "@/components/PageWrapper"
import {
    BookOpen,
    Code,
    Zap,
    Database,
    Server,
    Globe,
    Settings,
    Terminal,
    FileText,
    Download,
    ExternalLink,
    Brain,
    Search,
    Activity
} from 'lucide-react'

export default function DocsPage() {
    return (
        <PageWrapper>
            <div className="min-h-screen bg-background">
                <Navigation />

                <div className="lg:ml-80">
                    <div className="container mx-auto px-6 py-8">
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                    📚 Documentation
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    Complete guide to setting up and using your LocalAI Stack
                                </p>
                            </div>

                            <Tabs defaultValue="overview" className="space-y-6">
                                <TabsList className="grid w-full grid-cols-5">
                                    <TabsTrigger value="overview" className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" />
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger value="setup" className="flex items-center gap-2">
                                        <Settings className="h-4 w-4" />
                                        Setup
                                    </TabsTrigger>
                                    <TabsTrigger value="services" className="flex items-center gap-2">
                                        <Server className="h-4 w-4" />
                                        Services
                                    </TabsTrigger>
                                    <TabsTrigger value="api" className="flex items-center gap-2">
                                        <Code className="h-4 w-4" />
                                        API
                                    </TabsTrigger>
                                    <TabsTrigger value="troubleshooting" className="flex items-center gap-2">
                                        <Terminal className="h-4 w-4" />
                                        Troubleshooting
                                    </TabsTrigger>
                                </TabsList>

                                {/* Overview Tab */}
                                <TabsContent value="overview" className="space-y-6">
                                    <Card className="border-blue-500/20 bg-black/40 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-blue-400">What is LocalAI Stack?</CardTitle>
                                            <CardDescription>
                                                A complete local AI development environment with chat interfaces, model management, and monitoring
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-sm">
                                                LocalAI Stack is a comprehensive solution for running AI models locally. It includes a Next.js frontend,
                                                Supabase integration for data persistence, Ollama for model hosting, and additional services for
                                                web search and monitoring.
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-center gap-3 p-3 border border-green-500/20 rounded-lg">
                                                    <Brain className="h-5 w-5 text-green-400" />
                                                    <div>
                                                        <h4 className="font-medium">AI Chat Interface</h4>
                                                        <p className="text-xs text-muted-foreground">Interactive chat with local models</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 border border-blue-500/20 rounded-lg">
                                                    <Search className="h-5 w-5 text-blue-400" />
                                                    <div>
                                                        <h4 className="font-medium">Web Search Agent</h4>
                                                        <p className="text-xs text-muted-foreground">AI-powered web search with analysis</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 border border-purple-500/20 rounded-lg">
                                                    <Zap className="h-5 w-5 text-purple-400" />
                                                    <div>
                                                        <h4 className="font-medium">Model Management</h4>
                                                        <p className="text-xs text-muted-foreground">View and manage your AI models</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 border border-orange-500/20 rounded-lg">
                                                    <Activity className="h-5 w-5 text-orange-400" />
                                                    <div>
                                                        <h4 className="font-medium">System Monitoring</h4>
                                                        <p className="text-xs text-muted-foreground">Monitor service health and performance</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle className="text-green-400">Architecture</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="h-4 w-4 text-blue-400" />
                                                    <span className="text-sm">Next.js Frontend (Port 3000)</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Database className="h-4 w-4 text-green-400" />
                                                    <span className="text-sm">Supabase Database</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Brain className="h-4 w-4 text-purple-400" />
                                                    <span className="text-sm">Ollama (Port 11434)</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Server className="h-4 w-4 text-orange-400" />
                                                    <span className="text-sm">Open Web UI (Port 8080)</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Search className="h-4 w-4 text-cyan-400" />
                                                    <span className="text-sm">AI Search Agent (Port 8001)</span>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-purple-500/20 bg-black/40 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle className="text-purple-400">Quick Start</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="text-sm space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-xs">1</Badge>
                                                        <span>Install Ollama and pull a model</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-xs">2</Badge>
                                                        <span>Configure Supabase credentials</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-xs">3</Badge>
                                                        <span>Run the development server</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-xs">4</Badge>
                                                        <span>Access the playground to test</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>

                                {/* Setup Tab */}
                                <TabsContent value="setup" className="space-y-6">
                                    <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-green-400">Prerequisites</CardTitle>
                                            <CardDescription>Required software and accounts</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <h4 className="font-medium">Required Software</h4>
                                                    <ul className="text-sm space-y-1 text-muted-foreground">
                                                        <li>• Node.js 18+ and pnpm</li>
                                                        <li>• Ollama (for AI models)</li>
                                                        <li>• Docker (optional)</li>
                                                        <li>• Git</li>
                                                    </ul>
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="font-medium">Required Accounts</h4>
                                                    <ul className="text-sm space-y-1 text-muted-foreground">
                                                        <li>• Supabase account (free tier)</li>
                                                        <li>• GitHub account (for deployment)</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-blue-500/20 bg-black/40 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-blue-400">Installation Steps</CardTitle>
                                            <CardDescription>Step-by-step setup guide</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-3">
                                                <div className="border border-blue-500/20 rounded-lg p-4">
                                                    <h4 className="font-medium mb-2">1. Install Ollama</h4>
                                                    <div className="bg-black/40 p-3 rounded font-mono text-sm">
                                                        <div># Windows/Mac: Download from https://ollama.ai</div>
                                                        <div># Linux:</div>
                                                        <div>curl -fsSL https://ollama.ai/install.sh | sh</div>
                                                    </div>
                                                </div>

                                                <div className="border border-blue-500/20 rounded-lg p-4">
                                                    <h4 className="font-medium mb-2">2. Pull an AI Model</h4>
                                                    <div className="bg-black/40 p-3 rounded font-mono text-sm">
                                                        <div>ollama pull deepseek-r1:7b</div>
                                                        <div># Or any other model you prefer</div>
                                                    </div>
                                                </div>

                                                <div className="border border-blue-500/20 rounded-lg p-4">
                                                    <h4 className="font-medium mb-2">3. Clone and Install</h4>
                                                    <div className="bg-black/40 p-3 rounded font-mono text-sm">
                                                        <div>git clone &lt;repository&gt;</div>
                                                        <div>cd local-ai-stack</div>
                                                        <div>pnpm install</div>
                                                    </div>
                                                </div>

                                                <div className="border border-blue-500/20 rounded-lg p-4">
                                                    <h4 className="font-medium mb-2">4. Configure Environment</h4>
                                                    <div className="bg-black/40 p-3 rounded font-mono text-sm">
                                                        <div>cp apps/web/.env.example apps/web/.env.local</div>
                                                        <div># Edit .env.local with your Supabase credentials</div>
                                                    </div>
                                                </div>

                                                <div className="border border-blue-500/20 rounded-lg p-4">
                                                    <h4 className="font-medium mb-2">5. Start Development Server</h4>
                                                    <div className="bg-black/40 p-3 rounded font-mono text-sm">
                                                        <div>pnpm dev</div>
                                                        <div># Access at http://localhost:3000</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Services Tab */}
                                <TabsContent value="services" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <Card className="border-purple-500/20 bg-black/40 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle className="text-purple-400">Ollama</CardTitle>
                                                <CardDescription>Local AI model server</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span>Default Port:</span>
                                                    <Badge variant="outline">11434</Badge>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>API Endpoint:</span>
                                                    <code className="text-xs">/api/generate</code>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Serves AI models locally. Install models with <code>ollama pull model-name</code>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle className="text-green-400">Supabase</CardTitle>
                                                <CardDescription>Database and authentication</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span>Service:</span>
                                                    <Badge variant="outline">Cloud</Badge>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Features:</span>
                                                    <span className="text-xs">Auth, DB, Realtime</span>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Handles user authentication, chat history, and real-time updates
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-orange-500/20 bg-black/40 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle className="text-orange-400">Open Web UI</CardTitle>
                                                <CardDescription>Alternative web interface</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span>Default Port:</span>
                                                    <Badge variant="outline">8080</Badge>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Status:</span>
                                                    <Badge variant="outline">Optional</Badge>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Provides an alternative interface for Ollama models
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-cyan-500/20 bg-black/40 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle className="text-cyan-400">AI Search Agent</CardTitle>
                                                <CardDescription>Web search with AI analysis</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span>Default Port:</span>
                                                    <Badge variant="outline">8001</Badge>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Status:</span>
                                                    <Badge variant="outline">Optional</Badge>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Python service that performs web searches and AI analysis
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>

                                {/* API Tab */}
                                <TabsContent value="api" className="space-y-6">
                                    <Card className="border-blue-500/20 bg-black/40 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-blue-400">API Endpoints</CardTitle>
                                            <CardDescription>Available API routes and their usage</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-3">
                                                <div className="border border-blue-500/20 rounded-lg p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="outline" className="text-green-400">GET</Badge>
                                                        <code className="text-sm">/api/health</code>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Check the health status of all services
                                                    </p>
                                                </div>

                                                <div className="border border-blue-500/20 rounded-lg p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="outline" className="text-blue-400">POST</Badge>
                                                        <code className="text-sm">/api/chat</code>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Send messages to AI models via Ollama
                                                    </p>
                                                </div>

                                                <div className="border border-blue-500/20 rounded-lg p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="outline" className="text-green-400">GET</Badge>
                                                        <code className="text-sm">/api/models</code>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        List available AI models from Ollama
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Troubleshooting Tab */}
                                <TabsContent value="troubleshooting" className="space-y-6">
                                    <Card className="border-red-500/20 bg-black/40 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-red-400">Common Issues</CardTitle>
                                            <CardDescription>Solutions to frequently encountered problems</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-4">
                                                <div className="border border-red-500/20 rounded-lg p-4">
                                                    <h4 className="font-medium mb-2 text-red-400">Ollama Connection Failed</h4>
                                                    <div className="text-sm space-y-2">
                                                        <p>• Check if Ollama is running: <code>ollama list</code></p>
                                                        <p>• Verify port 11434 is not blocked</p>
                                                        <p>• Try restarting Ollama service</p>
                                                    </div>
                                                </div>

                                                <div className="border border-yellow-500/20 rounded-lg p-4">
                                                    <h4 className="font-medium mb-2 text-yellow-400">No Models Available</h4>
                                                    <div className="text-sm space-y-2">
                                                        <p>• Pull a model: <code>ollama pull deepseek-r1:7b</code></p>
                                                        <p>• Check available models: <code>ollama list</code></p>
                                                        <p>• Ensure model name matches exactly</p>
                                                    </div>
                                                </div>

                                                <div className="border border-blue-500/20 rounded-lg p-4">
                                                    <h4 className="font-medium mb-2 text-blue-400">Supabase Connection Issues</h4>
                                                    <div className="text-sm space-y-2">
                                                        <p>• Verify credentials in .env.local</p>
                                                        <p>• Check Supabase project is active</p>
                                                        <p>• Run database setup scripts</p>
                                                    </div>
                                                </div>

                                                <div className="border border-purple-500/20 rounded-lg p-4">
                                                    <h4 className="font-medium mb-2 text-purple-400">Port Conflicts</h4>
                                                    <div className="text-sm space-y-2">
                                                        <p>• Next.js: 3000 (configurable)</p>
                                                        <p>• Ollama: 11434 (configurable)</p>
                                                        <p>• Open Web UI: 8080 (configurable)</p>
                                                        <p>• AI Search: 8001 (configurable)</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>                                        </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}
