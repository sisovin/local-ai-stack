"use client"

import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { Alert, AlertDescription } from '@workspace/ui/components/alert'
import { authService } from '@/utils/supabaseClient'
import { Eye, EyeOff, Mail, Lock, User, Zap, Shield, CheckCircle, AlertCircle } from 'lucide-react'

interface AuthenticationProps {
    onAuthSuccess: () => void
}

export function Authentication({ onAuthSuccess }: AuthenticationProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Form states
    const [signInForm, setSignInForm] = useState({
        email: '',
        password: ''
    })

    const [signUpForm, setSignUpForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    })

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            await authService.signIn(signInForm.email, signInForm.password)
            setSuccess('Successfully signed in!')
            setTimeout(onAuthSuccess, 1000)
        } catch (err: any) {
            setError(err.message || 'Failed to sign in')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(null)

        if (signUpForm.password !== signUpForm.confirmPassword) {
            setError('Passwords do not match')
            setIsLoading(false)
            return
        }

        if (signUpForm.password.length < 6) {
            setError('Password must be at least 6 characters long')
            setIsLoading(false)
            return
        }

        try {
            const response = await authService.signUp(signUpForm.email, signUpForm.password, signUpForm.fullName)

            console.log('Signup response:', response)

            if (response.user && !response.user.email_confirmed_at) {
                setSuccess(`✅ Account created! Please check your email (${signUpForm.email}) for a verification link. Don't forget to check your spam folder!`)
            } else if (response.user && response.user.email_confirmed_at) {
                setSuccess('✅ Account created and verified! You can now sign in.')
            } else {
                setSuccess('✅ Please check your email for verification instructions.')
            }
        } catch (err: any) {
            console.error('Signup error:', err)

            // Handle specific Supabase errors
            if (err.message?.includes('email_address_invalid')) {
                setError('Please enter a valid email address')
            } else if (err.message?.includes('signup_disabled')) {
                setError('Account creation is currently disabled. Please contact support.')
            } else if (err.message?.includes('email_address_already_in_use')) {
                setError('An account with this email already exists. Try signing in instead.')
            } else {
                setError(err.message || 'Failed to create account. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background p-4">
            {/* Animated background elements */}
            <div className="fixed inset-0 circuit-bg opacity-10 pointer-events-none" />
            <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/5 rounded-full blur-3xl pointer-events-none animate-pulse [animation-delay:2s]" />

            <Card className="w-full max-w-md glass-card glow-green relative z-10">
                <CardHeader className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-neon-green to-electric-blue rounded-lg flex items-center justify-center glow-green">
                            <Zap className="h-6 w-6 text-background" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold holographic">
                        Local AI Stack
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Secure access to your AI infrastructure
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Tabs defaultValue="signin" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2 glass">
                            <TabsTrigger value="signin" className="data-[state=active]:neon-border-green">
                                Sign In
                            </TabsTrigger>
                            <TabsTrigger value="signup" className="data-[state=active]:neon-border-green">
                                Sign Up
                            </TabsTrigger>
                        </TabsList>

                        {/* Error/Success Messages */}
                        {error && (
                            <Alert className="border-red-500/50 bg-red-500/10">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <AlertDescription className="text-red-500">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert className="border-neon-green/50 bg-neon-green/10">
                                <CheckCircle className="h-4 w-4 text-neon-green" />
                                <AlertDescription className="text-neon-green">
                                    {success}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Sign In Tab */}
                        <TabsContent value="signin" className="space-y-4">
                            <form onSubmit={handleSignIn} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signin-email" className="text-sm font-medium">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="signin-email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={signInForm.email}
                                            onChange={(e) => setSignInForm(prev => ({ ...prev, email: e.target.value }))}
                                            className="pl-10 glass neon-border-green/30 focus:neon-border-green"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signin-password" className="text-sm font-medium">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="signin-password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            value={signInForm.password}
                                            onChange={(e) => setSignInForm(prev => ({ ...prev, password: e.target.value }))}
                                            className="pl-10 pr-10 glass neon-border-green/30 focus:neon-border-green"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full neon-border-green glow-green hover:glow-green disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                            <span>Authenticating...</span>
                                        </div>
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>
                            </form>
                        </TabsContent>

                        {/* Sign Up Tab */}
                        <TabsContent value="signup" className="space-y-4">
                            <form onSubmit={handleSignUp} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-name" className="text-sm font-medium">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="signup-name"
                                            type="text"
                                            placeholder="Your full name"
                                            value={signUpForm.fullName}
                                            onChange={(e) => setSignUpForm(prev => ({ ...prev, fullName: e.target.value }))}
                                            className="pl-10 glass neon-border-green/30 focus:neon-border-green"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signup-email" className="text-sm font-medium">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={signUpForm.email}
                                            onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                                            className="pl-10 glass neon-border-green/30 focus:neon-border-green"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signup-password" className="text-sm font-medium">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="signup-password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Create a password"
                                            value={signUpForm.password}
                                            onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                                            className="pl-10 pr-10 glass neon-border-green/30 focus:neon-border-green"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signup-confirm-password" className="text-sm font-medium">
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="signup-confirm-password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Confirm your password"
                                            value={signUpForm.confirmPassword}
                                            onChange={(e) => setSignUpForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            className="pl-10 glass neon-border-green/30 focus:neon-border-green"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full neon-border-green glow-green hover:glow-green disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                            <span>Creating Account...</span>
                                        </div>
                                    ) : (
                                        'Create Account'
                                    )}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>

                    {/* Security Features */}
                    <div className="mt-6 pt-6 border-t border-border/50">
                        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-2">
                                <Shield className="h-3 w-3 text-neon-green" />
                                <span>End-to-end encryption</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Lock className="h-3 w-3 text-electric-blue" />
                                <span>Local data storage</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
