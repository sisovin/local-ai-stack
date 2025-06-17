"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Badge } from "@workspace/ui/components/badge"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Separator } from "@workspace/ui/components/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import {
    Search,
    Bot,
    Globe,
    Loader2,
    ExternalLink,
    Copy,
    CheckCircle,
    AlertCircle,
    Clock,
    TrendingUp
} from "lucide-react"

interface SearchResult {
    title: string
    url: string
    content: string
    engine: string
    score?: number
    published_date?: string
}

interface AIAnalysis {
    summary: string
    key_points: string[]
    sources: string[]
    confidence_score: number
    model_used: string
    analysis_time: number
}

interface WebSearchResponse {
    query: string
    search_results: {
        results: SearchResult[]
        total_results: number
        search_time: number
        engines_used: string[]
    }
    ai_analysis?: AIAnalysis
    cached: boolean
    timestamp: string
}

export function WebSearchInterface() {
    const [query, setQuery] = useState("")
    const [context, setContext] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<WebSearchResponse | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleSearch = async () => {
        if (!query.trim()) return

        setIsSearching(true)
        setError(null)

        try {
            const response = await fetch("http://localhost:8001/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: query.trim(),
                    analyze_with_ai: true,
                    ai_context: context.trim() || null,
                    model: "deepseek-r1:7b"
                }),
            })

            if (!response.ok) {
                throw new Error(`Search failed: ${response.status}`)
            }

            const data: WebSearchResponse = await response.json()
            setSearchResults(data)

        } catch (err) {
            setError(err instanceof Error ? err.message : "Search failed")
            console.error("Search error:", err)
        } finally {
            setIsSearching(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    const getConfidenceColor = (score: number) => {
        if (score >= 0.8) return "text-green-400"
        if (score >= 0.6) return "text-yellow-400"
        return "text-red-400"
    }

    const getConfidenceLabel = (score: number) => {
        if (score >= 0.8) return "High"
        if (score >= 0.6) return "Medium"
        return "Low"
    }

    return (
        <div className="space-y-6">
            {/* Search Interface */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Globe className="h-6 w-6 text-neon-green" />
                        <span>AI-Powered Web Search</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Enter your search query..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleSearch}
                            disabled={isSearching || !query.trim()}
                            className="neon-border-green glow-green hover:glow-green"
                        >
                            {isSearching ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Search className="h-4 w-4" />
                            )}
                            {isSearching ? "Searching..." : "Search"}
                        </Button>
                    </div>

                    <Textarea
                        placeholder="Additional context (optional)..."
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        rows={2}
                        className="glass"
                    />
                </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
                <Card className="border-destructive glass-card">
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            <span>{error}</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Search Results */}
            {searchResults && (
                <div className="space-y-6">
                    {/* Search Metadata */}
                    <Card className="glass-card">
                        <CardContent className="pt-6">
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{searchResults.search_results.search_time.toFixed(2)}s</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <TrendingUp className="h-4 w-4" />
                                    <span>{searchResults.search_results.total_results} results</span>
                                </div>
                                <div className="flex space-x-1">
                                    {searchResults.search_results.engines_used.map((engine) => (
                                        <Badge key={engine} variant="outline" className="text-xs">
                                            {engine}
                                        </Badge>
                                    ))}
                                </div>
                                {searchResults.cached && (
                                    <Badge variant="secondary" className="text-xs">
                                        Cached
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Analysis and Results Tabs */}
                    <Tabs defaultValue="analysis" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-2 glass">
                            <TabsTrigger value="analysis" className="flex items-center space-x-2">
                                <Bot className="h-4 w-4" />
                                <span>AI Analysis</span>
                            </TabsTrigger>
                            <TabsTrigger value="results" className="flex items-center space-x-2">
                                <Globe className="h-4 w-4" />
                                <span>Raw Results</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* AI Analysis Tab */}
                        <TabsContent value="analysis">
                            {searchResults.ai_analysis ? (
                                <div className="space-y-4">
                                    {/* Summary Card */}
                                    <Card className="glass-card">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-xl text-glow-blue">Summary</CardTitle>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-muted-foreground">Confidence:</span>
                                                    <Badge
                                                        variant="outline"
                                                        className={getConfidenceColor(searchResults.ai_analysis.confidence_score)}
                                                    >
                                                        {getConfidenceLabel(searchResults.ai_analysis.confidence_score)}
                                                        ({(searchResults.ai_analysis.confidence_score * 100).toFixed(0)}%)
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-foreground leading-relaxed">
                                                {searchResults.ai_analysis.summary}
                                            </p>
                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                                                <span className="text-sm text-muted-foreground">
                                                    Analyzed by {searchResults.ai_analysis.model_used} in {searchResults.ai_analysis.analysis_time.toFixed(2)}s
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(searchResults.ai_analysis!.summary)}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Key Points */}
                                    <Card className="glass-card">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Key Points</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-3">
                                                {searchResults.ai_analysis.key_points.map((point, index) => (
                                                    <li key={index} className="flex items-start space-x-2">
                                                        <CheckCircle className="h-4 w-4 text-neon-green mt-0.5 flex-shrink-0" />
                                                        <span className="text-foreground">{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>

                                    {/* Sources */}
                                    <Card className="glass-card">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Sources</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {searchResults.ai_analysis.sources.map((source, index) => (
                                                    <div key={index} className="flex items-center space-x-2 p-2 rounded-lg bg-tech-gray/20">
                                                        <ExternalLink className="h-4 w-4 text-neon-green flex-shrink-0" />
                                                        <a
                                                            href={source}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-foreground hover:text-neon-green transition-colors truncate"
                                                        >
                                                            {source}
                                                        </a>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => copyToClipboard(source)}
                                                            className="ml-auto flex-shrink-0"
                                                        >
                                                            <Copy className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : (
                                <Card className="glass-card">
                                    <CardContent className="pt-6">
                                        <div className="text-center text-muted-foreground">
                                            <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                            <p>AI analysis not available for this search</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        {/* Raw Results Tab */}
                        <TabsContent value="results">
                            <ScrollArea className="h-[600px]">
                                <div className="space-y-4">
                                    {searchResults.search_results.results.map((result, index) => (
                                        <Card key={index} className="glass-card hover:neon-border-green transition-all duration-300">
                                            <CardContent className="pt-6">
                                                <div className="space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <h3 className="font-semibold text-foreground line-clamp-2">
                                                            {result.title}
                                                        </h3>
                                                        <Badge variant="outline" className="ml-2 flex-shrink-0">
                                                            {result.engine}
                                                        </Badge>
                                                    </div>

                                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                                        {result.content}
                                                    </p>

                                                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                                        <a
                                                            href={result.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-neon-green hover:text-glow-green transition-colors flex items-center space-x-1"
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
                                                            <span className="truncate max-w-[300px]">{result.url}</span>
                                                        </a>

                                                        <div className="flex items-center space-x-2">
                                                            {result.score && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    Score: {result.score.toFixed(2)}
                                                                </span>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => copyToClipboard(result.url)}
                                                            >
                                                                <Copy className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </div>
    )
}
