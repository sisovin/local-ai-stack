import { NextRequest, NextResponse } from 'next/server'

interface HealthCheck {
    service: string
    status: 'healthy' | 'warning' | 'error'
    responseTime: number
    message?: string
    data?: any
}

// Helper function to check a service with timeout
async function checkService(
    name: string,
    url: string,
    options: {
        timeout?: number
        headers?: Record<string, string>
    } = {}
): Promise<HealthCheck> {
    const start = Date.now()
    const timeout = options.timeout || 3000 // Reduced from 5000 to 3000

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: options.headers || {},
            signal: AbortSignal.timeout(timeout)
        })

        const responseTime = Date.now() - start

        if (response.ok) {
            let data = null
            try {
                data = await response.json()
            } catch {
                // Response might not be JSON
            }

            return {
                service: name,
                status: 'healthy',
                responseTime,
                data
            }
        } else {
            return {
                service: name,
                status: 'error',
                responseTime,
                message: `HTTP ${response.status}: ${response.statusText}`
            }
        }
    } catch (error) {
        const responseTime = Date.now() - start
        return {
            service: name,
            status: 'error',
            responseTime,
            message: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const service = searchParams.get('service')

    try {
        const results: HealthCheck[] = []

        if (!service || service === 'ollama') {
            const ollamaUrl = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434'
            const ollamaCheck = await checkService('ollama', `${ollamaUrl}/api/version`)
            results.push(ollamaCheck)
        }

        if (!service || service === 'openwebui') {
            const openWebUIUrl = process.env.NEXT_PUBLIC_OPENWEBUI_URL || 'http://localhost:8080'
            const openWebUICheck = await checkService('openwebui', `${openWebUIUrl}/api/health`)
            results.push(openWebUICheck)
        }

        if (!service || service === 'ai-search') {
            const searchUrl = process.env.NEXT_PUBLIC_AI_SEARCH_URL || 'http://localhost:8001'
            const searchCheck = await checkService('ai-search', `${searchUrl}/health`)
            results.push(searchCheck)
        }

        if (!service || service === 'models') {
            // Try to get models from Ollama directly
            const ollamaUrl = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434'
            const modelsCheck = await checkService('models', `${ollamaUrl}/api/tags`)

            if (modelsCheck.status === 'healthy' && modelsCheck.data) {
                // Transform the models data for easier consumption
                modelsCheck.data = {
                    count: modelsCheck.data.models?.length || 0,
                    models: modelsCheck.data.models?.map((model: any) => ({
                        name: model.name,
                        size: model.size,
                        modified: model.modified_at
                    })) || []
                }
            }

            results.push(modelsCheck)
        }

        return NextResponse.json({
            timestamp: new Date().toISOString(),
            checks: results
        })

    } catch (error) {
        return NextResponse.json(
            {
                error: 'Health check failed',
                message: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        )
    }
}
