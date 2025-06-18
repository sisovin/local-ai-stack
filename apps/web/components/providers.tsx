"use client"

import * as React from "react"
import { I18nProvider } from "@/lib/i18n"
import { ThemeProvider, ThemeTransition } from "@/lib/theme/theme-context"

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" enableTransitions={true}>
      <I18nProvider defaultLanguage="en">
        {mounted ? (
          <>
            <ThemeTransition />
            {children}
          </>
        ) : (
          <div className="invisible">{children}</div>
        )}
      </I18nProvider>
    </ThemeProvider>
  )
}
