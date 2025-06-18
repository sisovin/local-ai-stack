"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Separator } from "@workspace/ui/components/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
    Home,
    Brain,
    Search,
    Terminal,
    Zap,
    Activity,
    Code,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight,
    User,
    LogOut,
    Bell,
    Cpu,
    MoreHorizontal
} from "lucide-react"

const sidebarNavigation = [
    {
        name: "Dashboard",
        href: "/",
        icon: Home,
        description: "Overview and analytics"
    },
    {
        name: "Chat Interface",
        href: "/chat",
        icon: Brain,
        description: "AI conversation hub"
    },
    {
        name: "AI Web Search",
        href: "/search",
        icon: Search,
        description: "Intelligent search engine"
    },
    {
        name: "API Playground",
        href: "/playground",
        icon: Terminal,
        description: "Test and experiment"
    },
    {
        name: "Model Management",
        href: "/models",
        icon: Zap,
        description: "AI model configuration"
    },
    {
        name: "Monitoring",
        href: "/monitoring",
        icon: Activity,
        description: "System performance",
        badge: "Live"
    },
    {
        name: "Debug",
        href: "/debug",
        icon: Code,
        description: "Development tools"
    },
    {
        name: "Documentation",
        href: "/docs",
        icon: FileText,
        description: "Guides and references"
    },
    {
        name: "Settings",
        href: "/settings",
        icon: Settings,
        description: "Configuration"
    }
]

interface SidebarProps {
    onSignOut?: () => void
}

export function Sidebar({ onSignOut }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()

    return (
        <div className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'
            } glass-card border-r border-border/50`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
                {!collapsed && (
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <div className="w-8 h-8 bg-gradient-to-r from-neon-green to-electric-blue rounded-lg flex items-center justify-center glow-green group-hover:scale-110 transition-transform duration-300">
                                <Cpu className="h-5 w-5 text-background" />
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-neon-green to-electric-blue rounded-lg blur opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
                        </div>
                        <span className="font-bold text-lg bg-gradient-to-r from-neon-green to-electric-blue bg-clip-text text-transparent font-heading">
                            LocalAI Stack
                        </span>
                    </Link>
                )}

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCollapsed(!collapsed)}
                    className="hover:bg-muted/50 p-2"
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* User Profile */}
            {!collapsed && (
                <div className="p-4 border-b border-border/50">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start p-3 h-auto hover:bg-muted/50">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10 border-2 border-neon-green/30">
                                        <AvatarImage src="/avatars/placeholder-40.svg" alt="User" />
                                        <AvatarFallback className="bg-gradient-to-r from-neon-green to-electric-blue text-background font-bold">
                                            JD
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 text-left">
                                        <p className="font-medium">John Doe</p>
                                        <p className="text-sm text-muted-foreground">john@example.com</p>
                                    </div>
                                    <div className="relative">
                                        <Bell className="h-4 w-4 text-muted-foreground" />
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-neon-green rounded-full" />
                                    </div>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56 glass-card border border-border/50">
                            <DropdownMenuItem className="cursor-pointer">
                                <User className="h-4 w-4 mr-2" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Settings className="h-4 w-4 mr-2" />
                                Account Settings
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
                </div>
            )}

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-4">
                <div className="space-y-2">
                    {sidebarNavigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.name} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start transition-all duration-200 group ${collapsed ? 'px-3' : 'px-4'
                                        } ${isActive
                                            ? 'bg-neon-green/10 text-neon-green border border-neon-green/30 hover:bg-neon-green/15'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                        }`}
                                >
                                    <item.icon className={`h-4 w-4 ${collapsed ? '' : 'mr-3'} group-hover:scale-110 transition-transform`} />
                                    {!collapsed && (
                                        <>
                                            <div className="flex-1 text-left">
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-xs text-muted-foreground">{item.description}</div>
                                            </div>
                                            {item.badge && (
                                                <Badge variant="secondary" className="ml-2 text-xs bg-neon-green/20 text-neon-green">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                            {item.name === "Monitoring" && (
                                                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse ml-2" />
                                            )}
                                        </>
                                    )}
                                </Button>
                            </Link>
                        )
                    })}
                </div>
            </ScrollArea>

            {/* System Status */}
            {!collapsed && (
                <div className="p-4 border-t border-border/50">
                    <div className="bg-neon-green/5 rounded-lg p-3 border border-neon-green/20">
                        <div className="flex items-center space-x-2 text-sm">
                            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                            <span className="text-neon-green font-medium">System Online</span>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground font-mono">
                            v3.0.0 • Build 2025.6.18
                        </div>
                    </div>
                </div>
            )}

            {/* Collapsed User Avatar */}
            {collapsed && (
                <div className="p-3 border-t border-border/50">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-full p-2">
                                <Avatar className="h-8 w-8 border-2 border-neon-green/30">
                                    <AvatarImage src="/avatars/placeholder-32.svg" alt="User" />
                                    <AvatarFallback className="bg-gradient-to-r from-neon-green to-electric-blue text-background font-bold text-sm">
                                        JD
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" className="glass-card border border-border/50">
                            <DropdownMenuItem className="cursor-pointer">
                                <User className="h-4 w-4 mr-2" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-destructive"
                                onClick={onSignOut}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    )
}

export default Sidebar
