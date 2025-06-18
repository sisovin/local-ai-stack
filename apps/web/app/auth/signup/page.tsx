"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    UserPlus,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    Loader2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function SignupPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
    }, [router])

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        // Validate password strength
        if (password.length < 8) {
            setError("Password must be at least 8 characters long")
            setLoading(false)
            return
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            })

            if (error) {
                setError(error.message)
            } else if (data.user) {
                setSuccess("Account created! Please check your email to verify your account.")
            }
        } catch (err) {
            setError("An unexpected error occurred")
            console.error('Signup error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleOAuthSignup = async (provider: 'github' | 'google') => {
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
            console.error('OAuth signup error:', err)
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
                                            <div className="absolute inset-0 bg-gradient-to-r from-electric-blue to-cyber-purple rounded-full animate-pulse" />
                                            <div className="absolute inset-1 bg-background rounded-full flex items-center justify-center">
                                                <UserPlus className="w-8 h-8 text-electric-blue" />
                                            </div>
                                        </div>

                                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-neon-green via-electric-blue to-cyber-purple bg-clip-text text-transparent font-heading">
                                            {t.auth.signUp}
                                        </CardTitle>
                                        <CardDescription className="text-medium-contrast">
                                            Create your PeanechWeb account
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

                                        {/* Email Signup Form */}
                                        <form onSubmit={handleEmailSignup} className="space-y-4">
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
                                                        placeholder="Create a password"
                                                        required
                                                        disabled={loading}
                                                        minLength={8}
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

                                            <div className="space-y-2">
                                                <label htmlFor="confirmPassword" className="text-sm font-medium text-high-contrast">
                                                    {t.auth.confirmPassword}
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-medium-contrast" />
                                                    <Input
                                                        id="confirmPassword"
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="neon-input pl-10 pr-10"
                                                        placeholder="Confirm your password"
                                                        required
                                                        disabled={loading}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        disabled={loading}
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff className="w-4 h-4 text-medium-contrast" />
                                                        ) : (
                                                            <Eye className="w-4 h-4 text-medium-contrast" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full btn-hover-glow bg-gradient-to-r from-electric-blue to-cyber-purple hover:from-electric-blue/90 hover:to-cyber-purple/90 text-white font-bold"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Creating account...
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus className="mr-2 h-4 w-4" />
                                                        {t.auth.signUp}
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
                                                onClick={() => handleOAuthSignup('github')}
                                                disabled={loading}
                                                className="border-border/30 hover:border-neon-green/50 hover:bg-neon-green/10"
                                            >
                                                <Github className="w-4 h-4 mr-2" />
                                                GitHub
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleOAuthSignup('google')}
                                                disabled={loading}
                                                className="border-border/30 hover:border-electric-blue/50 hover:bg-electric-blue/10"
                                            >
                                                <Chrome className="w-4 h-4 mr-2" />
                                                Google
                                            </Button>
                                        </div>

                                        {/* Links */}
                                        <div className="text-center space-y-2">
                                            <div className="text-sm text-medium-contrast">
                                                Already have an account?{" "}
                                                <Link
                                                    href="/auth/login"
                                                    className="text-neon-green hover:text-neon-green/80 transition-colors font-medium"
                                                >
                                                    {t.auth.signIn}
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
