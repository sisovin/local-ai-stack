"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Navigation } from "@/components/navigation"
import { supabase } from "@/utils/supabaseClient"
import { useT } from "@/lib/i18n"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Github,
    Chrome,
    Zap,
    Shield,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    Loader2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [authLoading, setAuthLoading] = useState(true)

    const t = useT()
    const router = useRouter()

    useEffect(() => {
        // Check if user is already logged in
        const checkAuth = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()

                if (sessionError) {
                    console.warn('Session check failed:', sessionError)
                    setUser(null)
                } else if (session?.user) {
                    setUser(session.user)
                    // Redirect to home if already logged in
                    router.push('/')
                    return
                } else {
                    setUser(null)
                }
            } catch (error) {
                console.warn('Auth check failed:', error)
                setUser(null)
            } finally {
                setAuthLoading(false)
            }
        }

        checkAuth()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                setUser(session.user)
                router.push('/')
            }
        })

        return () => subscription.unsubscribe()
    }, [router])

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password
            })

            if (error) {
                setError(error.message)
            } else if (data.user) {
                setSuccess("Login successful! Redirecting...")
                // Navigation will be handled by the auth state listener
            }
        } catch (err) {
            setError("An unexpected error occurred")
            console.error('Login error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleOAuthLogin = async (provider: 'github' | 'google') => {
        setLoading(true)
        setError("")

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            })

            if (error) {
                setError(error.message)
                setLoading(false)
            }
            // Loading state will be cleared when auth state changes
        } catch (err) {
            setError("An unexpected error occurred")
            setLoading(false)
            console.error('OAuth login error:', err)
        }
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-neon-green/30 border-t-neon-green rounded-full animate-spin mx-auto" />
                    <p className="text-medium-contrast">Checking authentication...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation isAuthenticated={!!user} />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
                {/* Animated background */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyber-purple/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-md mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="glass-card overflow-hidden">
                                <div className="relative">
                                    {/* Glowing border effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-neon-green via-electric-blue to-cyber-purple p-[1px] rounded-lg">
                                        <div className="bg-background rounded-lg h-full w-full" />
                                    </div>

                                    <CardHeader className="relative z-10 text-center pb-2">
                                        <div className="w-16 h-16 mx-auto mb-4 relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-neon-green to-electric-blue rounded-full animate-pulse" />
                                            <div className="absolute inset-1 bg-background rounded-full flex items-center justify-center">
                                                <Shield className="w-8 h-8 text-neon-green" />
                                            </div>
                                        </div>

                                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-neon-green via-electric-blue to-cyber-purple bg-clip-text text-transparent font-heading">
                                            {t.auth.signIn}
                                        </CardTitle>
                                        <CardDescription className="text-medium-contrast">
                                            Access your PeanechWeb dashboard
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="relative z-10 space-y-6">
                                        {/* Error/Success Messages */}
                                        <AnimatePresence>
                                            {error && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                                                >
                                                    <AlertCircle className="w-4 h-4 text-red-400" />
                                                    <span className="text-sm text-red-400">{error}</span>
                                                </motion.div>
                                            )}

                                            {success && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="flex items-center space-x-2 bg-neon-green/10 border border-neon-green/20 rounded-lg p-3"
                                                >
                                                    <CheckCircle2 className="w-4 h-4 text-neon-green" />
                                                    <span className="text-sm text-neon-green">{success}</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Email Login Form */}
                                        <form onSubmit={handleEmailLogin} className="space-y-4">
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-medium text-high-contrast">
                                                    {t.auth.email}
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-medium-contrast" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="neon-input pl-10"
                                                        placeholder="Enter your email"
                                                        required
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="password" className="text-sm font-medium text-high-contrast">
                                                    {t.auth.password}
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-medium-contrast" />
                                                    <Input
                                                        id="password"
                                                        type={showPassword ? "text" : "password"}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="neon-input pl-10 pr-10"
                                                        placeholder="Enter your password"
                                                        required
                                                        disabled={loading}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        disabled={loading}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="w-4 h-4 text-medium-contrast" />
                                                        ) : (
                                                            <Eye className="w-4 h-4 text-medium-contrast" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full btn-hover-glow bg-gradient-to-r from-neon-green to-electric-blue hover:from-neon-green/90 hover:to-electric-blue/90 text-black font-bold"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Signing in...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Zap className="mr-2 h-4 w-4" />
                                                        {t.auth.signIn}
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </>
                                                )}
                                            </Button>
                                        </form>

                                        {/* Divider */}
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-border/30" />
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-background px-2 text-medium-contrast">
                                                    Or continue with
                                                </span>
                                            </div>
                                        </div>

                                        {/* OAuth Buttons */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleOAuthLogin('github')}
                                                disabled={loading}
                                                className="border-border/30 hover:border-neon-green/50 hover:bg-neon-green/10"
                                            >
                                                <Github className="w-4 h-4 mr-2" />
                                                GitHub
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleOAuthLogin('google')}
                                                disabled={loading}
                                                className="border-border/30 hover:border-electric-blue/50 hover:bg-electric-blue/10"
                                            >
                                                <Chrome className="w-4 h-4 mr-2" />
                                                Google
                                            </Button>
                                        </div>

                                        {/* Links */}
                                        <div className="text-center space-y-2">
                                            <Link
                                                href="/auth/forgot-password"
                                                className="text-sm text-medium-contrast hover:text-neon-green transition-colors"
                                            >
                                                {t.auth.forgotPassword}
                                            </Link>                                            <div className="text-sm text-medium-contrast">
                                                Don&apos;t have an account?{" "}
                                                <Link
                                                    href="/auth/signup"
                                                    className="text-electric-blue hover:text-electric-blue/80 transition-colors font-medium"
                                                >
                                                    {t.auth.signUp}
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    )
}
