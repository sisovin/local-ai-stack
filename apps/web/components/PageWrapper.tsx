"use client"

import React from "react"
import { ThemeProvider } from "@/lib/theme/theme-context"
import { I18nProvider } from "@/lib/i18n"

interface PageWrapperProps {
    children: React.ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
    return (
        <ThemeProvider defaultTheme="dark" enableTransitions={true}>
            <I18nProvider defaultLanguage="en">
                {children}
            </I18nProvider>
        </ThemeProvider>
    )
}
