"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "@/lib/theme/theme-context"
import { NoSSR } from "@/components/NoSSR"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"
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
    Search,
    Sun,
    Moon,
    Globe,
    User,
    LogOut,
    ChevronDown,
    Sparkles,
    Monitor,
    Users,
    Bell,
    Cpu,
    MessageSquare,
    BarChart2,
    BookOpen
} from "lucide-react"

const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Chat", href: "/chat", icon: Brain },
    { name: "Search", href: "/search", icon: Search },
    { name: "Playground", href: "/playground", icon: Terminal },
    { name: "Models", href: "/models", icon: Zap },
    { name: "Monitoring", href: "/monitoring", icon: Activity },
    { name: "Debug", href: "/debug", icon: Code },
    { name: "Docs", href: "/docs", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings }
]

// Marketing navigation for non-authenticated users
const marketingNavigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "About Us", href: "/about", icon: User },
    { name: "Our Team", href: "/team", icon: Users },
    { name: "Views", href: "/views", icon: BarChart2 },
    { name: "Pricing", href: "/pricing", icon: Globe },
    { name: "Contact", href: "/contact", icon: MessageSquare }
]

interface NavigationProps {
    isAuthenticated?: boolean
    onSignOut?: () => void
}

export function Navigation({ isAuthenticated = false, onSignOut }: NavigationProps) {
    const { theme, setTheme } = useTheme()
    const [isScrolled, setIsScrolled] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navItems = isAuthenticated ? navigation.slice(0, 6) : marketingNavigation

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg'
            : 'bg-transparent'
            }`}>
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <div className="w-8 h-8 bg-gradient-to-r from-neon-green to-electric-blue rounded-lg flex items-center justify-center glow-green group-hover:scale-110 transition-transform duration-300">
                                <Cpu className="h-5 w-5 text-background" />
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-neon-green to-electric-blue rounded-lg blur opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
                        </div>
                        <div className="font-bold text-xl bg-gradient-to-r from-neon-green to-electric-blue bg-clip-text text-transparent">
                            LocalAI Stack
                        </div>
                    </Link>                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${isActive
                                        ? 'text-neon-green bg-neon-green/10 border border-neon-green/30'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                        }`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                    {isActive && (
                                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-neon-green rounded-full" />
                                    )}
                                    {isAuthenticated && item.name === "Monitoring" && (
                                        <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>                    {/* Right Side Controls */}
                    <div className="flex items-center space-x-3">
                        {isAuthenticated ? (
                            <>
                                {/* Notifications */}
                                <Button variant="ghost" size="sm" className="relative group hover:bg-muted/50">
                                    <Bell className="h-4 w-4" />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-green rounded-full flex items-center justify-center">
                                        <span className="text-xs text-background font-bold">3</span>
                                    </div>
                                </Button>                                {/* Language Switcher */}
                                <LanguageSwitcher />

                                {/* Theme Switcher */}
                                <ThemeSwitcher />                                {/* User Avatar Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="relative p-1 hover:bg-muted/50">
                                            <Avatar className="h-8 w-8 border-2 border-neon-green/30">
                                                <AvatarImage src="/avatars/placeholder-32.svg" alt="User" />
                                                <AvatarFallback className="bg-gradient-to-r from-neon-green to-electric-blue text-background font-bold text-sm">
                                                    JD
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-neon-green rounded-full border-2 border-background" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 glass-card border border-border/50">
                                        <div className="flex items-center space-x-3 p-3 border-b border-border/50">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src="/api/placeholder/40/40" alt="User" />
                                                <AvatarFallback className="bg-gradient-to-r from-neon-green to-electric-blue text-background font-bold">
                                                    JD
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">John Doe</p>
                                                <p className="text-sm text-muted-foreground">john@example.com</p>
                                            </div>
                                        </div>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <User className="h-4 w-4 mr-2" />
                                            Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Settings className="h-4 w-4 mr-2" />
                                            Settings
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Users className="h-4 w-4 mr-2" />
                                            Team
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="cursor-pointer text-destructive"
                                            onClick={onSignOut}
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Sign out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>                                {/* Language Switcher for non-authenticated */}
                                <LanguageSwitcher />

                                {/* Theme Switcher for non-authenticated */}
                                <ThemeSwitcher />                                {/* Login/Register Buttons */}
                                <div className="hidden md:flex items-center space-x-2">
                                    <Link href="/auth/login">
                                        <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/auth/register">
                                        <Button
                                            size="sm"
                                            className="btn-hover-glow bg-gradient-to-r from-neon-green to-electric-blue text-black font-medium"
                                        >
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            </>
                        )}

                        {/* Mobile Menu */}
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                                        <Menu className="h-4 w-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-80 glass-card border-l border-border/50">
                                    <div className="flex items-center space-x-3 mb-8">
                                        <div className="w-8 h-8 bg-gradient-to-r from-neon-green to-electric-blue rounded-lg flex items-center justify-center glow-green">
                                            <Cpu className="h-5 w-5 text-background" />
                                        </div>
                                        <span className="text-xl font-bold bg-gradient-to-r from-neon-green to-electric-blue bg-clip-text text-transparent">
                                            LocalAI Stack
                                        </span>
                                    </div>                                    <div className="space-y-2">
                                        {(isAuthenticated ? navigation : marketingNavigation).map((item) => {
                                            const isActive = pathname === item.href
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                                        ? 'bg-neon-green/10 text-neon-green border border-neon-green/30'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                                        }`}
                                                >
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.name}</span>
                                                    {isAuthenticated && item.name === "Monitoring" && (
                                                        <Badge variant="secondary" className="ml-auto text-xs bg-neon-green/20 text-neon-green">
                                                            Live
                                                        </Badge>
                                                    )}
                                                </Link>
                                            )
                                        })}
                                    </div>

                                    {/* Mobile Status */}
                                    <div className="mt-8 p-4 bg-neon-green/5 rounded-lg border border-neon-green/20">
                                        <div className="flex items-center space-x-2 text-sm">
                                            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                                            <span className="text-neon-green font-medium">All systems operational</span>
                                        </div>
                                        <div className="mt-2 text-xs text-muted-foreground font-mono">
                                            v3.0.0 • Build 2025.1
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
