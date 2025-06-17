"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Alert, AlertDescription } from '@workspace/ui/components/alert'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Copy, ExternalLink, Info, Server, Terminal } from 'lucide-react'

export function ServiceSetupGuide() {
    const services = [
        {
            name: 'Ollama',
            description: 'AI model server',
            defaultPort: '11434',
            url: process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434',
            status: 'Core Service',
            setupCommands: [
                'curl -fsSL https://ollama.ai/install.sh | sh',
                'ollama serve',
                'ollama pull deepseek-r1:7b'
            ]
        },
        {
            name: 'Open Web UI',
            description: 'AI chat interface',
            defaultPort: '8080',
            url: process.env.NEXT_PUBLIC_OPENWEBUI_URL || 'http://localhost:8080',
            status: 'Optional',
            setupCommands: [
                'docker run -d -p 8080:8080 --name open-webui ghcr.io/open-webui/open-webui:main',
                '# OR install with pip:',
                'pip install open-webui',
                'open-webui serve --port 8080'
            ]
        },
        {
            name: 'AI Search Agent',
            description: 'Intelligent search service',
            defaultPort: '8001',
            url: process.env.NEXT_PUBLIC_AI_SEARCH_URL || 'http://localhost:8001',
            status: 'Optional',
            setupCommands: [
                'cd services/ai-search-agent',
                'docker-compose up -d',
                '# OR run locally:',
                'pip install -r requirements.txt',
                'uvicorn main:app --port 8001'
            ]
        },
        {
            name: 'LocalAI Frontend',
            description: 'This Next.js application',
            defaultPort: '3001',
            url: 'http://192.168.1.23:3001',
            status: 'Running',
            setupCommands: [
                'pnpm install',
                'pnpm dev --port 3001'
            ]
        }
    ]

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Core Service':
                return <Badge variant="destructive">Required</Badge>
            case 'Optional':
                return <Badge variant="outline" className="text-blue-400 border-blue-400">Optional</Badge>
            case 'Running':
                return <Badge variant="outline" className="text-green-400 border-green-400">Active</Badge>
            default:
                return <Badge variant="secondary">Unknown</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <Alert className="border-blue-500/50 bg-blue-500/10">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-blue-200">
                    <strong>Service Configuration Guide</strong>
                    <br />
                    Your LocalAI stack consists of multiple services running on different ports.
                    Here's the recommended setup to avoid conflicts.
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {services.map((service) => (
                    <Card key={service.name} className="border-purple-500/20 bg-black/40 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Server className="h-5 w-5 text-purple-400" />
                                    <CardTitle className="text-lg">{service.name}</CardTitle>
                                </div>
                                {getStatusBadge(service.status)}
                            </div>
                            <CardDescription>{service.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Default Port:</span>
                                <span className="font-mono">{service.defaultPort}</span>
                            </div>

                            <div className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Service URL:</span>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 text-xs bg-black/20 p-2 rounded border">
                                        {service.url}
                                    </code>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => copyToClipboard(service.url)}
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => window.open(service.url, '_blank')}
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Setup Commands:</span>
                                <div className="space-y-1">
                                    {service.setupCommands.map((command, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <code className="flex-1 text-xs bg-black/30 p-2 rounded border font-mono">
                                                {command}
                                            </code>
                                            {!command.startsWith('#') && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => copyToClipboard(command)}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Alert className="border-green-500/50 bg-green-500/10">
                <Terminal className="h-4 w-4" />
                <AlertDescription className="text-green-200">
                    <strong>Quick Start Checklist:</strong>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                        <li>Install and start Ollama on port 11434</li>
                        <li>Pull at least one AI model (e.g., deepseek-r1:7b)</li>
                        <li>Optionally start Open Web UI on port 8080</li>
                        <li>Optionally start AI Search Agent on port 8001</li>
                        <li>Restart your LocalAI frontend to apply changes</li>
                    </ol>
                </AlertDescription>
            </Alert>
        </div>
    )
}
