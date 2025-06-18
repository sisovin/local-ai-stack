"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Languages, Check } from "lucide-react"
import { useTranslation, getAvailableLanguages, getLanguageInfo, type SupportedLanguage } from "@/lib/i18n"

export function LanguageSwitcher() {
    const { language, setLanguage } = useTranslation()
    const availableLanguages = getAvailableLanguages()
    const currentLanguageInfo = getLanguageInfo(language)

    const handleLanguageChange = (languageCode: SupportedLanguage) => {
        setLanguage(languageCode)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 px-3 text-medium-contrast hover:text-neon-green hover:bg-surface-glass border border-border/30 hover:border-neon-green/50 transition-all duration-200 focus:ring-2 focus:ring-neon-green focus:ring-offset-2 focus:ring-offset-background"
                    aria-label={`Current language: ${currentLanguageInfo.name}. Click to change language`}
                    aria-haspopup="menu"
                    aria-expanded="false"
                >
                    <span className="text-lg mr-2" role="img" aria-label={`${currentLanguageInfo.name} flag`}>
                        {currentLanguageInfo.flag}
                    </span>
                    <span className="font-mono text-sm hidden sm:inline" aria-hidden="true">
                        {language.toUpperCase()}
                    </span>
                    <Languages className="h-4 w-4 ml-2" aria-hidden="true" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="glass-card border border-border/30 min-w-[200px] backdrop-blur-xl bg-background/95"
                role="menu"
                aria-label="Language selection menu"
            >
                {availableLanguages.map((lang) => {
                    const langInfo = getLanguageInfo(lang)
                    return (
                        <DropdownMenuItem
                            key={lang}
                            onClick={() => handleLanguageChange(lang)}
                            className="cursor-pointer hover:bg-surface-glass focus:bg-surface-glass focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neon-green transition-colors duration-200"
                            role="menuitem"
                            aria-selected={language === lang}
                            tabIndex={0}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-3">
                                    <span
                                        className="text-lg"
                                        role="img"
                                        aria-label={`${langInfo.name} flag`}
                                    >
                                        {langInfo.flag}
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-high-contrast">
                                            {langInfo.nativeName}
                                        </span>
                                        <span className="text-xs text-medium-contrast">
                                            {langInfo.name}
                                        </span>
                                    </div>
                                </div>
                                {language === lang && (
                                    <Check
                                        className="h-4 w-4 text-neon-green"
                                        aria-label="Currently selected language"
                                    />
                                )}
                            </div>
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
