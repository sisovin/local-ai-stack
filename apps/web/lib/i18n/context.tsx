"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Translation, translations, SupportedLanguage } from './translations'

interface I18nContextType {
    language: SupportedLanguage
    setLanguage: (lang: SupportedLanguage) => void
    t: Translation
    isRTL: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
    children: React.ReactNode
    defaultLanguage?: SupportedLanguage
}

export function I18nProvider({ children, defaultLanguage = 'km' }: I18nProviderProps) {
    const [language, setLanguageState] = useState<SupportedLanguage>(defaultLanguage)

    // Load saved language from localStorage on mount
    useEffect(() => {
        const savedLanguage = localStorage.getItem('preferredLanguage') as SupportedLanguage
        if (savedLanguage && savedLanguage in translations) {
            setLanguageState(savedLanguage)
        }
    }, [])

    // Save language to localStorage when it changes
    const setLanguage = (lang: SupportedLanguage) => {
        setLanguageState(lang)
        localStorage.setItem('preferredLanguage', lang)

        // Update document language and direction
        document.documentElement.lang = lang
        document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr'
    }

    // Check if language is right-to-left
    const isRTL = (lang: SupportedLanguage): boolean => {
        // Add RTL languages here if needed (Arabic, Hebrew, etc.)
        return false
    }

    const value: I18nContextType = {
        language,
        setLanguage,
        t: translations[language],
        isRTL: isRTL(language)
    }

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    )
}

export function useTranslation(): I18nContextType {
    const context = useContext(I18nContext)
    if (context === undefined) {
        throw new Error('useTranslation must be used within an I18nProvider')
    }
    return context
}

// Utility hook for shorter syntax
export function useT() {
    const { t } = useTranslation()
    return t
}

// Helper function to get available languages
export function getAvailableLanguages() {
    return Object.keys(translations) as SupportedLanguage[]
}

// Helper function to get language display information
export function getLanguageInfo(lang: SupportedLanguage) {
    const languageInfo = {
        'km': { name: 'Khmer', nativeName: 'ខ្មែរ', flag: '🇰🇭' },
        'zh-cn': { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
        'en': { name: 'English', nativeName: 'English', flag: '🇺🇸' }
    }

    return languageInfo[lang] || languageInfo.en
}
