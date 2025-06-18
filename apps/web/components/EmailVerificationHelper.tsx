"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { authService } from '@/utils/supabaseClient'
import { Mail, RefreshCw, AlertCircle, CheckCircle, Settings } from 'lucide-react'

export function EmailVerificationHelper() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')

    const handleResendVerification = async () => {
        if (!email) {
            setMessage('Please enter your email address')
            setMessageType('error')
            return
        }

        setIsLoading(true)
        setMessage(null)

        try {
            await authService.resendVerification(email)
            setMessage('✅ Verification email sent! Check your inbox and spam folder.')
            setMessageType('success')
        } catch (error: any) {
            console.error('Resend verification error:', error)
            setMessage(`❌ Failed to resend: ${error.message}`)
            setMessageType('error')
        } finally {
            setIsLoading(false)
        }
    }

    const troubleshootingSteps = [
        'Check your spam/junk folder',
        'Verify the email address is correct',
        'Wait a few minutes for delivery',
        'Try resending the verification email',
        'Check if your email provider blocks automated emails'
    ]

    return (
        <Card className="w-full max-w-md mx-auto border-amber-500/20 bg-black/40 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-amber-400 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email Verification Help
                </CardTitle>
                <CardDescription className="text-gray-300">
                    Not receiving verification emails? Try these solutions.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Resend Verification */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                        Resend verification email
                    </label>
                    <div className="flex gap-2">
                        <Input
                            type="email"
                            placeholder="your-email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 bg-gray-900/50 border-gray-600"
                        />
                        <Button
                            onClick={handleResendVerification}
                            disabled={isLoading}
                            variant="outline"
                            size="sm"
                            className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                        >
                            {isLoading ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Mail className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Message Display */}
                {message && (
                    <Alert className={`border-${messageType === 'success' ? 'green' : messageType === 'error' ? 'red' : 'blue'}-500/20`}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                            {message}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Troubleshooting Steps */}
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Troubleshooting Steps:
                    </h4>
                    <ul className="text-xs text-gray-400 space-y-1">
                        {troubleshootingSteps.map((step, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-amber-400 mt-0.5">•</span>
                                {step}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Supabase Email Settings Link */}
                <Alert className="border-blue-500/20">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                        <strong>For developers:</strong> Configure email settings in your{' '}
                        <a
                            href="https://supabase.com/dashboard/project/plvdkvkcxqxuuvyhjojh/settings/auth"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                        >
                            Supabase Auth settings
                        </a>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    )
}
