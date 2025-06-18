"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Badge } from '@workspace/ui/components/badge'
import { Alert, AlertDescription } from '@workspace/ui/components/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { Switch } from '@workspace/ui/components/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { Textarea } from '@workspace/ui/components/textarea'
import { Separator } from '@workspace/ui/components/separator'
import { ScrollArea } from '@workspace/ui/components/scroll-area'
import { Navigation } from '@/components/navigation'
import { PageWrapper } from "@/components/PageWrapper"
import { openWebUIService } from '@/utils/supabaseClient'
import {
    Settings as SettingsIcon,
    Database,
    Brain,
    Globe,
    Shield,
    Zap,
    Save,
    RefreshCw,
    Eye,
    EyeOff,
    Check,
    X,
    AlertTriangle,
    Info,
    Server,
    Key,
    Monitor,
    Palette,
    Bell,
    Download,
    Upload,
    Trash2
} from 'lucide-react'

interface Settings {
    general: {
        appName: string
        theme: 'light' | 'dark' | 'system'
        language: string
        autoSave: boolean
        notifications: boolean
    }
    database: {
        supabaseUrl: string
        supabaseAnonKey: string
        supabaseServiceKey: string
        connectionTimeout: number
        enableRealtime: boolean
    }
    ai: {
        ollamaUrl: string
        openWebUIUrl: string
        defaultModel: string
        temperature: number
        maxTokens: number
        streamResponse: boolean
        enableMemory: boolean
    }
    search: {
        aiSearchUrl: string
        enableWebSearch: boolean
        searchTimeout: number
        maxResults: number
        defaultEngine: string
    }
    security: {
        enableAuth: boolean
        sessionTimeout: number
        enableApiKeys: boolean
        enableCors: boolean
        allowedOrigins: string
    }
    monitoring: {
        enableMetrics: boolean
        logLevel: 'error' | 'warn' | 'info' | 'debug'
        retentionDays: number
        alertsEnabled: boolean
    }
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>({
        general: {
            appName: 'LocalAI Stack',
            theme: 'dark',
            language: 'en',
            autoSave: true,
            notifications: true
        },
        database: {
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
            supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            supabaseServiceKey: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || '',
            connectionTimeout: 5000,
            enableRealtime: true
        },
        ai: {
            ollamaUrl: process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434',
            openWebUIUrl: process.env.NEXT_PUBLIC_OPENWEBUI_URL || 'http://localhost:8080',
            defaultModel: 'deepseek-r1:7b',
            temperature: 0.7,
            maxTokens: 2000,
            streamResponse: true,
            enableMemory: false
        },
        search: {
            aiSearchUrl: process.env.NEXT_PUBLIC_AI_SEARCH_URL || 'http://localhost:8001',
            enableWebSearch: true,
            searchTimeout: 10000,
            maxResults: 10,
            defaultEngine: 'searxng'
        },
        security: {
            enableAuth: true,
            sessionTimeout: 3600,
            enableApiKeys: false,
            enableCors: true,
            allowedOrigins: 'http://localhost:3000'
        },
        monitoring: {
            enableMetrics: true,
            logLevel: 'info',
            retentionDays: 30,
            alertsEnabled: true
        }
    })

    const [availableModels, setAvailableModels] = useState<Array<{ id: string, name: string }>>([])
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [showSecrets, setShowSecrets] = useState({
        supabaseAnonKey: false,
        supabaseServiceKey: false
    })

    useEffect(() => {
        loadModels()
        loadSettingsFromStorage()
    }, [])

    const loadModels = async () => {
        try {
            // Use our health API to get models instead of direct service call
            const response = await fetch('/api/health?service=models')

            if (response.ok) {
                const healthData = await response.json()
                const modelCheck = healthData.checks.find((check: any) => check.service === 'models')

                if (modelCheck && modelCheck.status === 'healthy' && modelCheck.data) {
                    const modelList = modelCheck.data.models || []
                    setAvailableModels(modelList.map((model: any) => ({
                        id: model.name,
                        name: model.name
                    })))
                } else {
                    throw new Error('No models found via health API')
                }
            } else {
                throw new Error(`Health API returned ${response.status}`)
            }
        } catch (error) {
            console.error('Failed to load models via health API:', error)
            setAvailableModels([
                { id: 'deepseek-r1:7b', name: 'DeepSeek R1 7B' },
                { id: 'qwen2.5:7b', name: 'Qwen 2.5 7B' },
                { id: 'llama2:7b', name: 'Llama 2 7B' }
            ])
        }
    }

    const loadSettingsFromStorage = () => {
        try {
            const saved = localStorage.getItem('localai-settings')
            if (saved) {
                const savedSettings = JSON.parse(saved)
                setSettings(prev => ({ ...prev, ...savedSettings }))
            }
        } catch (error) {
            console.error('Failed to load settings from storage:', error)
        }
    }

    const saveSettings = async () => {
        setIsSaving(true)
        setSaveStatus('idle')

        try {
            // Save to localStorage
            localStorage.setItem('localai-settings', JSON.stringify(settings))

            // TODO: In a real app, you'd also save to a backend API
            await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call

            setSaveStatus('success')
            setTimeout(() => setSaveStatus('idle'), 3000)
        } catch (error) {
            console.error('Failed to save settings:', error)
            setSaveStatus('error')
        } finally {
            setIsSaving(false)
        }
    }

    const resetSettings = () => {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            localStorage.removeItem('localai-settings')
            window.location.reload()
        }
    }

    const exportSettings = () => {
        const dataStr = JSON.stringify(settings, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'localai-settings.json'
        link.click()
        URL.revokeObjectURL(url)
    }

    const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target?.result as string)
                    setSettings(imported)
                    setSaveStatus('success')
                } catch (error) {
                    setSaveStatus('error')
                }
            }
            reader.readAsText(file)
        }
    }

    const testConnection = async (service: 'database' | 'ai' | 'search') => {
        setIsLoading(true)
        try {
            // Test connections based on service type
            if (service === 'ai') {
                const response = await fetch(`${settings.ai.ollamaUrl}/api/version`)
                if (!response.ok) throw new Error('Connection failed')
            }
            // Add other service tests here
            setSaveStatus('success')
        } catch (error) {
            setSaveStatus('error')
        } finally {
            setIsLoading(false)
        }
    }

    const updateSettings = (section: keyof Settings, key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }))
    }

    const toggleSecret = (key: 'supabaseAnonKey' | 'supabaseServiceKey') => {
        setShowSecrets(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

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
                                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                            ⚙️ Settings
                                        </h1>
                                        <p className="text-lg text-muted-foreground mt-2">
                                            Configure your LocalAI Stack environment and preferences
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {saveStatus === 'success' && (
                                            <Badge variant="outline" className="text-green-400 border-green-400">
                                                <Check className="h-3 w-3 mr-1" />
                                                Saved
                                            </Badge>
                                        )}
                                        {saveStatus === 'error' && (
                                            <Badge variant="destructive">
                                                <X className="h-3 w-3 mr-1" />
                                                Error
                                            </Badge>
                                        )}
                                        <Button
                                            onClick={saveSettings}
                                            disabled={isSaving}
                                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                        >
                                            {isSaving ? (
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                                <Save className="h-4 w-4 mr-2" />
                                            )}
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <Tabs defaultValue="general" className="space-y-6">
                                <TabsList className="grid w-full grid-cols-6">
                                    <TabsTrigger value="general" className="flex items-center gap-2">
                                        <SettingsIcon className="h-4 w-4" />
                                        General
                                    </TabsTrigger>
                                    <TabsTrigger value="database" className="flex items-center gap-2">
                                        <Database className="h-4 w-4" />
                                        Database
                                    </TabsTrigger>
                                    <TabsTrigger value="ai" className="flex items-center gap-2">
                                        <Brain className="h-4 w-4" />
                                        AI Models
                                    </TabsTrigger>
                                    <TabsTrigger value="search" className="flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        Search
                                    </TabsTrigger>
                                    <TabsTrigger value="security" className="flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        Security
                                    </TabsTrigger>
                                    <TabsTrigger value="monitoring" className="flex items-center gap-2">
                                        <Monitor className="h-4 w-4" />
                                        Monitoring
                                    </TabsTrigger>
                                </TabsList>

                                {/* General Settings */}
                                <TabsContent value="general" className="space-y-6">
                                    <Card className="border-purple-500/20 bg-black/40 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-purple-400">General Settings</CardTitle>
                                            <CardDescription>
                                                Basic application settings and preferences
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="appName">Application Name</Label>
                                                    <Input
                                                        id="appName"
                                                        value={settings.general.appName}
                                                        onChange={(e) => updateSettings('general', 'appName', e.target.value)}
                                                    />
                                                </div>                                            <div className="space-y-2">
                                                    <Label htmlFor="theme">Theme</Label>
                                                    <Select
                                                        value={settings.general.theme}
                                                        onValueChange={(value) => updateSettings('general', 'theme', value)}
                                                    >
                                                        <SelectTrigger id="theme">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="light">Light</SelectItem>
                                                            <SelectItem value="dark">Dark</SelectItem>
                                                            <SelectItem value="system">System</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="language">Language</Label>
                                                    <Select
                                                        value={settings.general.language}
                                                        onValueChange={(value) => updateSettings('general', 'language', value)}
                                                    >
                                                        <SelectTrigger id="language">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="en">English</SelectItem>
                                                            <SelectItem value="es">Spanish</SelectItem>
                                                            <SelectItem value="fr">French</SelectItem>
                                                            <SelectItem value="de">German</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label>Auto Save</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Automatically save changes as you type
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={settings.general.autoSave}
                                                        onCheckedChange={(checked) => updateSettings('general', 'autoSave', checked)}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label>Notifications</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Enable desktop notifications
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={settings.general.notifications}
                                                        onCheckedChange={(checked) => updateSettings('general', 'notifications', checked)}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Import/Export Settings */}
                                    <Card className="border-blue-500/20 bg-black/40 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-blue-400">Import/Export</CardTitle>
                                            <CardDescription>
                                                Backup and restore your settings
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex gap-4">
                                                <Button
                                                    variant="outline"
                                                    onClick={exportSettings}
                                                    className="flex-1"
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Export Settings
                                                </Button>                                            <div className="flex-1">
                                                    <input
                                                        type="file"
                                                        accept=".json"
                                                        onChange={importSettings}
                                                        className="hidden"
                                                        id="import-settings"
                                                        aria-label="Import settings file"
                                                        title="Select a JSON file to import settings"
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => document.getElementById('import-settings')?.click()}
                                                        className="w-full"
                                                    >
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        Import Settings
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="destructive"
                                                    onClick={resetSettings}
                                                    className="flex-1"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Reset All
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Database Settings */}
                                <TabsContent value="database" className="space-y-6">
                                    <Card className="border-blue-500/20 bg-black/40 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-blue-400">Supabase Configuration</CardTitle>
                                            <CardDescription>
                                                Configure your Supabase database connection
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="supabaseUrl">Supabase URL</Label>
                                                    <Input
                                                        id="supabaseUrl"
                                                        value={settings.database.supabaseUrl}
                                                        onChange={(e) => updateSettings('database', 'supabaseUrl', e.target.value)}
                                                        placeholder="https://your-project.supabase.co"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="supabaseAnonKey">Anonymous Key</Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="supabaseAnonKey"
                                                            type={showSecrets.supabaseAnonKey ? 'text' : 'password'}
                                                            value={settings.database.supabaseAnonKey}
                                                            onChange={(e) => updateSettings('database', 'supabaseAnonKey', e.target.value)}
                                                            placeholder="eyJ..."
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="absolute right-0 top-0 h-full px-3"
                                                            onClick={() => toggleSecret('supabaseAnonKey')}
                                                        >
                                                            {showSecrets.supabaseAnonKey ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="supabaseServiceKey">Service Role Key</Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="supabaseServiceKey"
                                                            type={showSecrets.supabaseServiceKey ? 'text' : 'password'}
                                                            value={settings.database.supabaseServiceKey}
                                                            onChange={(e) => updateSettings('database', 'supabaseServiceKey', e.target.value)}
                                                            placeholder="eyJ..."
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="absolute right-0 top-0 h-full px-3"
                                                            onClick={() => toggleSecret('supabaseServiceKey')}
                                                        >
                                                            {showSecrets.supabaseServiceKey ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="connectionTimeout">Connection Timeout (ms)</Label>
                                                        <Input
                                                            id="connectionTimeout"
                                                            type="number"
                                                            value={settings.database.connectionTimeout}
                                                            onChange={(e) => updateSettings('database', 'connectionTimeout', parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between pt-6">
                                                        <div className="space-y-0.5">
                                                            <Label>Enable Realtime</Label>
                                                            <p className="text-sm text-muted-foreground">
                                                                Real-time database updates
                                                            </p>
                                                        </div>
                                                        <Switch
                                                            checked={settings.database.enableRealtime}
                                                            onCheckedChange={(checked) => updateSettings('database', 'enableRealtime', checked)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => testConnection('database')}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Database className="h-4 w-4 mr-2" />
                                                    )}
                                                    Test Connection
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* AI Settings */}
                                <TabsContent value="ai" className="space-y-6">
                                    <Card className="border-green-500/20 bg-black/40 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-green-400">AI Model Configuration</CardTitle>
                                            <CardDescription>
                                                Configure your AI models and inference settings
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="ollamaUrl">Ollama URL</Label>
                                                    <Input
                                                        id="ollamaUrl"
                                                        value={settings.ai.ollamaUrl}
                                                        onChange={(e) => updateSettings('ai', 'ollamaUrl', e.target.value)}
                                                        placeholder="http://localhost:11434"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="openWebUIUrl">Open Web UI URL</Label>
                                                    <Input
                                                        id="openWebUIUrl"
                                                        value={settings.ai.openWebUIUrl}
                                                        onChange={(e) => updateSettings('ai', 'openWebUIUrl', e.target.value)}
                                                        placeholder="http://localhost:8080"
                                                    />
                                                </div>                                            <div className="space-y-2">
                                                    <Label htmlFor="defaultModel">Default Model</Label>
                                                    <Select
                                                        value={settings.ai.defaultModel}
                                                        onValueChange={(value) => updateSettings('ai', 'defaultModel', value)}
                                                    >
                                                        <SelectTrigger id="defaultModel">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {availableModels.map((model) => (
                                                                <SelectItem key={model.id} value={model.id}>
                                                                    {model.name || model.id}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="maxTokens">Max Tokens</Label>
                                                    <Input
                                                        id="maxTokens"
                                                        type="number"
                                                        value={settings.ai.maxTokens}
                                                        onChange={(e) => updateSettings('ai', 'maxTokens', parseInt(e.target.value))}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">                                            <div className="space-y-2">
                                                <Label htmlFor="temperature">Temperature: {settings.ai.temperature}</Label>
                                                <input
                                                    id="temperature"
                                                    type="range"
                                                    min="0"
                                                    max="2"
                                                    step="0.1"
                                                    value={settings.ai.temperature}
                                                    onChange={(e) => updateSettings('ai', 'temperature', parseFloat(e.target.value))}
                                                    className="w-full"
                                                    aria-label={`Temperature setting: ${settings.ai.temperature}`}
                                                    title={`Temperature: ${settings.ai.temperature}`}
                                                />
                                            </div>
                                            </div>

                                            <Separator />

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label>Stream Response</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Enable real-time streaming responses
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={settings.ai.streamResponse}
                                                        onCheckedChange={(checked) => updateSettings('ai', 'streamResponse', checked)}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label>Enable Memory</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Remember conversation context
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={settings.ai.enableMemory}
                                                        onCheckedChange={(checked) => updateSettings('ai', 'enableMemory', checked)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => testConnection('ai')}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Brain className="h-4 w-4 mr-2" />
                                                    )}
                                                    Test AI Connection
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={loadModels}
                                                    disabled={isLoading}
                                                >
                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                    Refresh Models
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Search Settings */}
                                <TabsContent value="search" className="space-y-6">
                                    <Card className="border-cyan-500/20 bg-black/40 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-cyan-400">Search Configuration</CardTitle>
                                            <CardDescription>
                                                Configure AI search and web search capabilities
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="aiSearchUrl">AI Search URL</Label>
                                                    <Input
                                                        id="aiSearchUrl"
                                                        value={settings.search.aiSearchUrl}
                                                        onChange={(e) => updateSettings('search', 'aiSearchUrl', e.target.value)}
                                                        placeholder="http://localhost:8001"
                                                    />
                                                </div>                                            <div className="space-y-2">
                                                    <Label htmlFor="defaultEngine">Default Search Engine</Label>
                                                    <Select
                                                        value={settings.search.defaultEngine}
                                                        onValueChange={(value) => updateSettings('search', 'defaultEngine', value)}
                                                    >
                                                        <SelectTrigger id="defaultEngine">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="searxng">SearXNG</SelectItem>
                                                            <SelectItem value="brave">Brave Search</SelectItem>
                                                            <SelectItem value="duckduckgo">DuckDuckGo</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="searchTimeout">Search Timeout (ms)</Label>
                                                    <Input
                                                        id="searchTimeout"
                                                        type="number"
                                                        value={settings.search.searchTimeout}
                                                        onChange={(e) => updateSettings('search', 'searchTimeout', parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="maxResults">Max Results</Label>
                                                    <Input
                                                        id="maxResults"
                                                        type="number"
                                                        value={settings.search.maxResults}
                                                        onChange={(e) => updateSettings('search', 'maxResults', parseInt(e.target.value))}
                                                    />
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label>Enable Web Search</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Allow searching the web for information
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={settings.search.enableWebSearch}
                                                        onCheckedChange={(checked) => updateSettings('search', 'enableWebSearch', checked)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => testConnection('search')}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Globe className="h-4 w-4 mr-2" />
                                                    )}
                                                    Test Search Service
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Security Settings */}
                                <TabsContent value="security" className="space-y-6">
                                    <Card className="border-red-500/20 bg-black/40 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-red-400">Security Settings</CardTitle>
                                            <CardDescription>
                                                Configure authentication and security policies
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="sessionTimeout">Session Timeout (seconds)</Label>
                                                    <Input
                                                        id="sessionTimeout"
                                                        type="number"
                                                        value={settings.security.sessionTimeout}
                                                        onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="allowedOrigins">Allowed Origins</Label>
                                                    <Textarea
                                                        id="allowedOrigins"
                                                        value={settings.security.allowedOrigins}
                                                        onChange={(e) => updateSettings('security', 'allowedOrigins', e.target.value)}
                                                        placeholder="http://localhost:3000, https://yourdomain.com"
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label>Enable Authentication</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Require users to authenticate
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={settings.security.enableAuth}
                                                        onCheckedChange={(checked) => updateSettings('security', 'enableAuth', checked)}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label>Enable API Keys</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Allow API key authentication
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={settings.security.enableApiKeys}
                                                        onCheckedChange={(checked) => updateSettings('security', 'enableApiKeys', checked)}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label>Enable CORS</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Allow cross-origin requests
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={settings.security.enableCors}
                                                        onCheckedChange={(checked) => updateSettings('security', 'enableCors', checked)}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Monitoring Settings */}
                                <TabsContent value="monitoring" className="space-y-6">
                                    <Card className="border-yellow-500/20 bg-black/40 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-yellow-400">Monitoring & Logging</CardTitle>
                                            <CardDescription>
                                                Configure system monitoring and logging preferences
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">                                            <div className="space-y-2">
                                                <Label htmlFor="logLevel">Log Level</Label>
                                                <Select
                                                    value={settings.monitoring.logLevel}
                                                    onValueChange={(value) => updateSettings('monitoring', 'logLevel', value)}
                                                >
                                                    <SelectTrigger id="logLevel">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="error">Error</SelectItem>
                                                        <SelectItem value="warn">Warning</SelectItem>
                                                        <SelectItem value="info">Info</SelectItem>
                                                        <SelectItem value="debug">Debug</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="retentionDays">Log Retention (days)</Label>
                                                    <Input
                                                        id="retentionDays"
                                                        type="number"
                                                        value={settings.monitoring.retentionDays}
                                                        onChange={(e) => updateSettings('monitoring', 'retentionDays', parseInt(e.target.value))}
                                                    />
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label>Enable Metrics</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Collect performance metrics
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={settings.monitoring.enableMetrics}
                                                        onCheckedChange={(checked) => updateSettings('monitoring', 'enableMetrics', checked)}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label>Enable Alerts</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Send alerts for system issues
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={settings.monitoring.alertsEnabled}
                                                        onCheckedChange={(checked) => updateSettings('monitoring', 'alertsEnabled', checked)}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>                        </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}
