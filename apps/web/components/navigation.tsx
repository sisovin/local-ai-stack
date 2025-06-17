"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Sheet, SheetContent, SheetTrigger } from "@workspace/ui/components/sheet"
import {
    Menu,
    Home,
    Terminal,
    Settings,
    Activity,
    Database,
    Code,
    Brain,
    Zap,
    Server,
    FileText,
    Search
} from "lucide-react"

const navigation = [
    {
        name: "Dashboard",
        href: "/",
        icon: Home
    }, {
        name: "Chat Interface",
        href: "/chat",
        icon: Brain
    },
    {
        name: "AI Web Search",
        href: "/search",
        icon: Search
    },
    {
        name: "API Playground",
        href: "/playground",
        icon: Terminal
    },
    {
        name: "Model Management",
        href: "/models",
        icon: Zap
    }, {
        name: "Monitoring",
        href: "/monitoring",
        icon: Activity
    },
    {
        name: "Debug",
        href: "/debug",
        icon: Code
    },
    {
        name: "Documentation",
        href: "/docs",
        icon: FileText
    },
    {
        name: "Settings",
        href: "/settings",
        icon: Settings
    }
]

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const NavItems = () => (
        <>
            {navigation.map((item) => {
                const isActive = pathname === item.href
                return (<Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                        ? 'bg-primary/10 text-neon-green border border-neon-green/30 glow-green'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`Navigate to ${item.name}`}
                >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                    {item.name === "Monitoring" && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                            Live
                        </Badge>
                    )}
                </Link>
                )
            })}
        </>
    )

    return (
        <>            {/* Desktop Navigation */}
            <nav className="hidden lg:flex fixed left-6 top-6 bottom-6 w-64 flex-col glass-card z-50" role="navigation" aria-label="Main navigation">
                <div className="p-6">
                    <div className="flex items-center space-x-2 mb-8">
                        <div className="w-8 h-8 bg-neon-green rounded-lg flex items-center justify-center glow-green">
                            <Server className="h-5 w-5 text-background" />
                        </div>
                        <span className="text-xl font-bold">Local AI</span>
                    </div>

                    <div className="space-y-2">
                        <NavItems />
                    </div>
                </div>

                {/* Status Footer */}
                <div className="mt-auto p-6 border-t border-border/50">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                        <span>All systems operational</span>
                    </div>
                    <div className="mt-2 text-xs font-mono text-muted-foreground">
                        v1.0.0 • Build 2024.1
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <div className="lg:hidden fixed top-6 left-6 z-50">                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="glass" aria-label="Open navigation menu">
                        <Menu className="h-4 w-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 glass-card border-0">
                    <div className="flex items-center space-x-2 mb-8">
                        <div className="w-8 h-8 bg-neon-green rounded-lg flex items-center justify-center glow-green">
                            <Server className="h-5 w-5 text-background" />
                        </div>
                        <span className="text-xl font-bold">Local AI</span>
                    </div>

                    <div className="space-y-2">
                        <NavItems />
                    </div>

                    {/* Mobile Status Footer */}
                    <div className="mt-auto pt-6 border-t border-border/50">
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                            <span>All systems operational</span>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
            </div>
        </>
    )
}
