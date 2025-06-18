"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabaseClient"

export default function AuthCallback() {
    const router = useRouter()

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                const { data, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('Auth callback error:', error)
                    router.push('/auth/login?error=callback_failed')
                    return
                }

                if (data.session) {
                    // Success! Redirect to home page
                    router.push('/')
                } else {
                    // No session, redirect to login
                    router.push('/auth/login')
                }
            } catch (error) {
                console.error('Auth callback error:', error)
                router.push('/auth/login?error=callback_failed')
            }
        }

        handleAuthCallback()
    }, [router])

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-neon-green/30 border-t-neon-green rounded-full animate-spin mx-auto" />
                <p className="text-medium-contrast">Completing authentication...</p>
            </div>
        </div>
    )
}
