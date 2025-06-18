"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/utils/supabaseClient'
import { Database, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'

export function DatabaseSetupHelper() {
    const [isChecking, setIsChecking] = useState(false)
    const [setupStatus, setSetupStatus] = useState<{
        profiles: 'unknown' | 'exists' | 'missing'
        chatMessages: 'unknown' | 'exists' | 'missing'
        conversationSessions: 'unknown' | 'exists' | 'missing'
    }>({
        profiles: 'unknown',
        chatMessages: 'unknown',
        conversationSessions: 'unknown'
    })

    const checkDatabaseTables = async () => {
        setIsChecking(true)
        try {
            // Check if profiles table exists
            try {
                const { error: profilesError } = await supabase
                    .from('profiles')
                    .select('id')
                    .limit(1)

                setSetupStatus(prev => ({
                    ...prev,
                    profiles: profilesError ? 'missing' : 'exists'
                }))
            } catch (error) {
                setSetupStatus(prev => ({ ...prev, profiles: 'missing' }))
            }

            // Check if chat_messages table exists
            try {
                const { error: chatError } = await supabase
                    .from('chat_messages')
                    .select('id')
                    .limit(1)

                setSetupStatus(prev => ({
                    ...prev,
                    chatMessages: chatError ? 'missing' : 'exists'
                }))
            } catch (error) {
                setSetupStatus(prev => ({ ...prev, chatMessages: 'missing' }))
            }

            // Check if conversation_sessions table exists
            try {
                const { error: sessionsError } = await supabase
                    .from('conversation_sessions')
                    .select('id')
                    .limit(1)

                setSetupStatus(prev => ({
                    ...prev,
                    conversationSessions: sessionsError ? 'missing' : 'exists'
                }))
            } catch (error) {
                setSetupStatus(prev => ({ ...prev, conversationSessions: 'missing' }))
            }

        } catch (error) {
            console.error('Database check failed:', error)
        } finally {
            setIsChecking(false)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'exists':
                return <CheckCircle className="h-4 w-4 text-green-400" />
            case 'missing':
                return <AlertTriangle className="h-4 w-4 text-red-400" />
            default:
                return <div className="h-4 w-4 bg-gray-400 rounded-full animate-pulse" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'exists':
                return <Badge variant="outline" className="text-green-400 border-green-400">✓ Ready</Badge>
            case 'missing':
                return <Badge variant="destructive">✗ Missing</Badge>
            default:
                return <Badge variant="secondary">? Unknown</Badge>
        }
    }

    const allTablesExist = Object.values(setupStatus).every(status => status === 'exists')
    const anyTablesMissing = Object.values(setupStatus).some(status => status === 'missing')

    return (
        <Card className="w-full max-w-2xl mx-auto border-blue-500/20 bg-black/40 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Setup Status
                </CardTitle>
                <CardDescription className="text-gray-300">
                    Check if your Supabase database tables are properly configured
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {getStatusIcon(setupStatus.profiles)}
                            <span className="text-sm">Profiles Table</span>
                        </div>
                        {getStatusBadge(setupStatus.profiles)}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {getStatusIcon(setupStatus.chatMessages)}
                            <span className="text-sm">Chat Messages Table</span>
                        </div>
                        {getStatusBadge(setupStatus.chatMessages)}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {getStatusIcon(setupStatus.conversationSessions)}
                            <span className="text-sm">Conversation Sessions Table</span>
                        </div>
                        {getStatusBadge(setupStatus.conversationSessions)}
                    </div>
                </div>

                {anyTablesMissing && (
                    <Alert className="border-amber-500/50 bg-amber-500/10">
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                        <AlertDescription className="text-amber-200">
                            <strong>Database tables are missing!</strong>
                            <br />
                            <br />
                            <strong>To fix this:</strong>
                            <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                                <li>Go to your Supabase project:
                                    <code className="text-xs bg-black/30 px-1 rounded">
                                        https://supabase.com/dashboard/project/plvdkvkcxqxuuvyhjojh
                                    </code>
                                </li>
                                <li>Navigate to <strong>SQL Editor</strong></li>
                                <li>Copy and paste the SQL schema from <code>docs/supabase-schema.sql</code></li>
                                <li>Click <strong>Run</strong> to execute the SQL</li>
                                <li>Come back and test again</li>
                            </ol>
                        </AlertDescription>
                    </Alert>
                )}

                {allTablesExist && (
                    <Alert className="border-green-500/50 bg-green-500/10">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <AlertDescription className="text-green-200">
                            <strong>✅ Database is properly configured!</strong>
                            <br />
                            All required tables exist and the chat functionality should work.
                        </AlertDescription>
                    </Alert>
                )}

                <Button
                    onClick={checkDatabaseTables}
                    disabled={isChecking}
                    variant="outline"
                    className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                >
                    {isChecking ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Checking Database...
                        </>
                    ) : (
                        <>
                            <Database className="h-4 w-4 mr-2" />
                            Check Database Tables
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}
