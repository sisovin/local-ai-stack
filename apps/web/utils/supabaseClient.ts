import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL - Please check your .env.local file')
}

if (!supabaseKey || supabaseKey === 'your-anon-key-here') {
    throw new Error('Missing or invalid env.NEXT_PUBLIC_SUPABASE_ANON_KEY - Please add your actual Supabase anon key to .env.local')
}

console.log('🔧 Supabase Configuration:')
console.log('URL:', supabaseUrl)
console.log('Key (first 20 chars):', supabaseKey.substring(0, 20) + '...')

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

// Database types
export interface ChatMessage {
    id: string
    user_id: string
    message: string
    response: string
    model: string
    created_at: string
    updated_at?: string
}

export interface UserProfile {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
    created_at: string
    updated_at?: string
}

// Database functions
export const chatService = {
    // Get chat history for a user
    async getChatHistory(userId: string) {
        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true })

        if (error) throw error
        return data as ChatMessage[]
    },

    // Save a new chat message
    async saveChatMessage(message: Omit<ChatMessage, 'id' | 'created_at'>) {
        const { data, error } = await supabase
            .from('chat_messages')
            .insert([message])
            .select()
            .single()

        if (error) throw error
        return data as ChatMessage
    },

    // Update a chat message (for streaming responses)
    async updateChatMessage(id: string, updates: Partial<ChatMessage>) {
        const { data, error } = await supabase
            .from('chat_messages')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as ChatMessage
    },

    // Delete a chat message
    async deleteChatMessage(id: string) {
        const { error } = await supabase
            .from('chat_messages')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    // Clear all chat history for a user
    async clearChatHistory(userId: string) {
        const { error } = await supabase
            .from('chat_messages')
            .delete()
            .eq('user_id', userId)

        if (error) throw error
    },

    // Subscribe to real-time chat updates
    subscribeToChats(userId: string, callback: (payload: any) => void) {
        return supabase
            .channel('chat_messages')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'chat_messages',
                    filter: `user_id=eq.${userId}`,
                },
                callback
            )
            .subscribe()
    }
}

// User profile functions
export const userService = {
    // Get user profile
    async getProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

        if (error && error.code !== 'PGRST116') throw error
        return data as UserProfile | null
    },

    // Update user profile
    async updateProfile(userId: string, updates: Partial<UserProfile>) {
        const { data, error } = await supabase
            .from('profiles')
            .upsert({ id: userId, ...updates })
            .select()
            .single()

        if (error) throw error
        return data as UserProfile
    }
}

// Auth helper functions
export const authService = {
    // Sign up with email and password
    async signUp(email: string, password: string, fullName?: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        })

        if (error) throw error
        return data
    },

    // Sign in with email and password
    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error
        return data
    },

    // Sign out
    async signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    },

    // Get current user
    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return user
    },

    // Listen to auth state changes
    onAuthStateChange(callback: (event: string, session: any) => void) {
        return supabase.auth.onAuthStateChange(callback)
    },

    // Resend verification email
    async resendVerification(email: string) {
        const { data, error } = await supabase.auth.resend({
            type: 'signup',
            email: email
        })
        if (error) throw error
        return data
    }
}

// Open Web UI API functions
export const openWebUIService = {
    // Send chat message to Open Web UI
    async sendChatMessage(
        message: string,
        model: string = 'deepseek-r1:7b',
        options: {
            temperature?: number
            maxTokens?: number
            stream?: boolean
            conversationId?: string
        } = {}
    ) {
        const {
            temperature = 0.7,
            maxTokens = 2000,
            stream = false,
            conversationId
        } = options        
        
        const apiKey = process.env.NEXT_PUBLIC_OPENWEBUI_API_KEY
        const baseUrl = process.env.NEXT_PUBLIC_OPENWEBUI_URL || 'http://localhost:3000'

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }

        if (apiKey) {
            headers['Authorization'] = `Bearer ${apiKey}`
        }

        // If baseUrl points to our Next.js app, use Ollama directly
        let chatUrl = `${baseUrl}/api/chat/completions`
        if (baseUrl === 'http://localhost:3000' || baseUrl.includes('192.168.1.23:3000')) {
            const ollamaUrl = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434'
            chatUrl = `${ollamaUrl}/api/generate`

            // Ollama has a different payload format
            const ollamaPayload = {
                model,
                prompt: message,
                stream: false,
                options: {
                    temperature,
                    num_predict: maxTokens
                }
            }

            const response = await fetch(chatUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(ollamaPayload),
            })

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.statusText}`)
            }

            const data = await response.json()
            return data.response || 'No response received'
        }

        // Standard OpenWebUI format
        const payload = {
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ],
            model,
            temperature,
            max_tokens: maxTokens,
            stream,
            ...(conversationId && { conversation_id: conversationId })
        }

        const response = await fetch(chatUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            throw new Error(`Open Web UI API error: ${response.statusText}`)
        }

        if (stream) {
            return response.body
        }

        const data = await response.json()
        return data.choices[0]?.message?.content || 'No response received'
    },    // Get available models from Open Web UI
    async getAvailableModels() {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEBUI_API_KEY
        const baseUrl = process.env.NEXT_PUBLIC_OPENWEBUI_URL || 'http://localhost:8080'
        const ollamaUrl = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434'

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }

        if (apiKey) {
            headers['Authorization'] = `Bearer ${apiKey}`
        }

        try {
            // First try Open Web UI if it's configured to a different port than Ollama
            if (baseUrl !== ollamaUrl && !baseUrl.includes('localhost:3000')) {
                console.log('Trying Open Web UI first:', `${baseUrl}/api/models`)
                try {
                    const response = await fetch(`${baseUrl}/api/models`, {
                        headers,
                        signal: AbortSignal.timeout(3000)
                    })

                    if (response.ok) {
                        const data = await response.json()
                        console.log('Open Web UI response:', data)
                        return data.data || []
                    }
                } catch (openWebUIError) {
                    console.log('Open Web UI failed, trying Ollama:', openWebUIError)
                }
            }

            // Fallback to Ollama directly
            console.log('Trying Ollama directly:', `${ollamaUrl}/api/tags`)
            const response = await fetch(`${ollamaUrl}/api/tags`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: AbortSignal.timeout(3000)
            })

            if (!response.ok) {
                throw new Error(`Failed to fetch models from Ollama: ${response.statusText}`)
            }

            const data = await response.json()
            console.log('Ollama response:', data)

            // Ollama API response format
            return data.models?.map((model: any) => ({
                id: model.name,
                name: model.name,
                size: model.size,
                modified: model.modified_at,
                details: model.details
            })) || []

        } catch (error) {
            console.error('Error fetching models:', error)
            // Return default models if API fails
            return [
                { id: 'deepseek-r1:7b', name: 'DeepSeek R1 7B' },
                { id: 'qwen2.5:7b', name: 'Qwen 2.5 7B' },
                { id: 'llama2:7b', name: 'Llama 2 7B' }
            ]
        }
    }
}

// Health check utilities
export const healthService = {
    // Check if Ollama is running
    async checkOllama() {
        const ollamaUrl = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434'
        try {
            const response = await fetch(`${ollamaUrl}/api/version`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000)
            })
            return { status: response.ok ? 'healthy' : 'error', responseTime: 0 }
        } catch (error) {
            return { status: 'error', responseTime: 0 }
        }
    },

    // Check if AI Search Agent is running
    async checkAISearch() {
        const searchUrl = process.env.NEXT_PUBLIC_AI_SEARCH_URL || 'http://localhost:8001'
        try {
            const start = Date.now()
            const response = await fetch(`${searchUrl}/health`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000)
            })
            const responseTime = Date.now() - start
            return { status: response.ok ? 'healthy' : 'error', responseTime }
        } catch (error) {
            return { status: 'error', responseTime: 0 }
        }
    },

    // Check Supabase connection
    async checkSupabase() {
        try {
            const start = Date.now()
            const { data, error } = await supabase.auth.getSession()
            const responseTime = Date.now() - start
            return { status: error ? 'error' : 'healthy', responseTime }
        } catch (error) {
            return { status: 'error', responseTime: 0 }
        }
    }
}
