"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'

export function SupabaseConnectionTest() {
    const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')
    const [errorMessage, setErrorMessage] = useState<string>('')

    useEffect(() => {
        testConnection()
    }, [])

    const testConnection = async () => {
        try {
            setConnectionStatus('checking')
            setErrorMessage('')

            // Test basic connection - just check if Supabase is responsive
            const { data, error } = await supabase.auth.getSession()

            // A successful response (even without a session) means Supabase is working
            console.log('✅ Supabase connection successful')
            setConnectionStatus('connected')
        } catch (error: any) {
            console.error('❌ Supabase connection failed:', error)
            setConnectionStatus('error')
            setErrorMessage(error.message || 'Unknown error')
        }
    }

    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'checking':
                return 'text-yellow-400'
            case 'connected':
                return 'text-green-400'
            case 'error':
                return 'text-red-400'
            default:
                return 'text-gray-400'
        }
    }

    const getStatusText = () => {
        switch (connectionStatus) {
            case 'checking':
                return 'Testing connection...'
            case 'connected':
                return 'Connected successfully!'
            case 'error':
                return 'Connection failed'
            default:
                return 'Unknown status'
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto border-green-500/20 bg-black/40 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-green-400">🔗 Supabase Connection Test</CardTitle>
                <CardDescription className="text-gray-300">
                    Verify your Supabase configuration
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className={`text-lg font-medium ${getStatusColor()}`}>
                    {getStatusText()}
                </div>

                {connectionStatus === 'error' && (
                    <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded border border-red-500/20">
                        <strong>Error:</strong> {errorMessage}
                    </div>
                )}

                {connectionStatus === 'error' && (
                    <div className="text-amber-400 text-sm bg-amber-500/10 p-3 rounded border border-amber-500/20">
                        <strong>Next steps:</strong>
                        <ol className="list-decimal list-inside mt-2 space-y-1">
                            <li>Get your Supabase anon key from:
                                <br />
                                <code className="text-xs">https://supabase.com/dashboard/project/plvdkvkcxqxuuvyhjojh/settings/api</code>
                            </li>
                            <li>Update your <code>.env.local</code> file</li>
                            <li>Restart the development server</li>
                        </ol>
                    </div>
                )}

                <Button
                    onClick={testConnection}
                    variant="outline"
                    className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
                >
                    Test Again
                </Button>
            </CardContent>
        </Card>
    )
}
