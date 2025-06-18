"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { supabase } from "@/utils/supabaseClient"
import { useT } from "@/lib/i18n"
import {
    Users,
    MapPin,
    Calendar,
    Mail,
    Github,
    Twitter,
    Linkedin,
    ExternalLink,
    Star,
    Award,
    Code,
    Palette,
    BarChart3,
    Settings,
    Shield,
    Zap,
    Heart,
    Coffee,
    MessageSquare,
    Phone,
    Video,
    Clock,
    CheckCircle,
    Circle,
    Minus
} from "lucide-react"

// Mock team data with real-time status
const teamMembers = [
    {
        id: 1,
        name: "Alex Chen",
        role: "founder",
        department: "engineering",
        avatar: "/avatars/alex-chen.svg",
        status: "online",
        email: "alex@peanechlab.com",
        joinedDate: "2024-01-15",
        location: "San Francisco, CA",
        timezone: "PST",
        skills: ["React", "TypeScript", "AI/ML", "Leadership"],
        projects: 47,
        bio: "Passionate about building the future of AI-powered applications. 10+ years in tech leadership.",
        github: "alexchen",
        twitter: "alexchen_dev",
        linkedin: "alexchen-ai",
        lastActive: "2 minutes ago",
        workingHours: "9:00 AM - 6:00 PM PST"
    },
    {
        id: 2,
        name: "Sarah Kim",
        role: "cto",
        department: "engineering",
        avatar: "/avatars/sarah-kim.svg",
        status: "online",
        email: "sarah@peanechlab.com",
        joinedDate: "2024-02-01",
        location: "Seattle, WA",
        timezone: "PST",
        skills: ["Node.js", "Python", "DevOps", "Architecture"],
        projects: 52,
        bio: "Technology leader with expertise in scalable systems and AI infrastructure.",
        github: "sarahkim",
        twitter: "sarahkim_tech",
        linkedin: "sarahkim-cto",
        lastActive: "5 minutes ago",
        workingHours: "8:00 AM - 5:00 PM PST"
    },
    {
        id: 3,
        name: "Marcus Johnson",
        role: "lead",
        department: "engineering",
        avatar: "/avatars/marcus-johnson.svg",
        status: "busy",
        email: "marcus@peanechlab.com",
        joinedDate: "2024-03-15",
        location: "Austin, TX",
        timezone: "CST",
        skills: ["React", "Next.js", "GraphQL", "Mentoring"],
        projects: 38,
        bio: "Full-stack developer passionate about creating exceptional user experiences.",
        github: "marcusj",
        twitter: "marcus_codes",
        linkedin: "marcusjohnson-dev",
        lastActive: "15 minutes ago",
        workingHours: "9:00 AM - 6:00 PM CST"
    },
    {
        id: 4,
        name: "Elena Rodriguez",
        role: "designer",
        department: "design",
        avatar: "/avatars/elena-rodriguez.svg",
        status: "online",
        email: "elena@peanechlab.com",
        joinedDate: "2024-04-01",
        location: "Barcelona, Spain",
        timezone: "CET",
        skills: ["UI/UX Design", "Figma", "Design Systems", "3D Design"],
        projects: 29,
        bio: "Creative designer focused on intuitive interfaces and delightful user experiences.",
        github: "elenadesign",
        twitter: "elena_designs",
        linkedin: "elenarodriguez-ux",
        lastActive: "1 hour ago",
        workingHours: "9:00 AM - 6:00 PM CET"
    },
    {
        id: 5,
        name: "David Park",
        role: "senior",
        department: "engineering",
        avatar: "/avatars/david-park.svg",
        status: "away",
        email: "david@peanechlab.com",
        joinedDate: "2024-05-20",
        location: "Toronto, Canada",
        timezone: "EST",
        skills: ["Python", "FastAPI", "AI Models", "Data Science"],
        projects: 23,
        bio: "AI specialist working on cutting-edge machine learning implementations.",
        github: "davidpark",
        twitter: "davidpark_ai",
        linkedin: "davidpark-ml",
        lastActive: "3 hours ago",
        workingHours: "10:00 AM - 7:00 PM EST"
    },
    {
        id: 6,
        name: "Lisa Wang",
        role: "analyst",
        department: "product",
        avatar: "/avatars/lisa-wang.svg",
        status: "online",
        email: "lisa@peanechlab.com",
        joinedDate: "2024-06-10",
        location: "Singapore",
        timezone: "SGT",
        skills: ["Data Analysis", "SQL", "Python", "Business Intelligence"],
        projects: 15,
        bio: "Data analyst transforming complex data into actionable business insights.",
        github: "lisawang",
        twitter: "lisa_data",
        linkedin: "lisawang-analyst",
        lastActive: "30 minutes ago",
        workingHours: "9:00 AM - 6:00 PM SGT"
    }
]

const departments = ["all", "engineering", "design", "product", "marketing", "operations"]
const statusFilters = ["all", "online", "away", "busy", "offline"]

export default function TeamPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selectedDepartment, setSelectedDepartment] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [hoveredMember, setHoveredMember] = useState<number | null>(null)
    const t = useT()

    // Filter team members
    const filteredMembers = teamMembers.filter(member => {
        const departmentMatch = selectedDepartment === "all" || member.department === selectedDepartment
        const statusMatch = selectedStatus === "all" || member.status === selectedStatus
        return departmentMatch && statusMatch
    })

    // Real-time stats
    const stats = {
        totalMembers: teamMembers.length,
        onlineMembers: teamMembers.filter(m => m.status === "online").length,
        departments: [...new Set(teamMembers.map(m => m.department))].length,
        averageProjects: Math.round(teamMembers.reduce((acc, m) => acc + m.projects, 0) / teamMembers.length)
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "online":
                return <CheckCircle className="w-4 h-4 text-neon-green" />
            case "away":
                return <Clock className="w-4 h-4 text-yellow-500" />
            case "busy":
                return <Minus className="w-4 h-4 text-red-500" />
            case "offline":
                return <Circle className="w-4 h-4 text-gray-500" />
            default:
                return <Circle className="w-4 h-4 text-gray-500" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "online":
                return "bg-neon-green"
            case "away":
                return "bg-yellow-500"
            case "busy":
                return "bg-red-500"
            case "offline":
                return "bg-gray-500"
            default:
                return "bg-gray-500"
        }
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "founder":
            case "cto":
                return <Star className="w-5 h-5" />
            case "lead":
                return <Award className="w-5 h-5" />
            case "senior":
            case "developer":
                return <Code className="w-5 h-5" />
            case "designer":
                return <Palette className="w-5 h-5" />
            case "analyst":
                return <BarChart3 className="w-5 h-5" />
            case "manager":
                return <Settings className="w-5 h-5" />
            default:
                return <Users className="w-5 h-5" />
        }
    }

    useEffect(() => {
        // Check auth status
        const checkAuth = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()

                if (sessionError) {
                    console.warn('Session check failed:', sessionError)
                    setUser(null)
                    return
                }

                if (session?.user) {
                    setUser(session.user)
                } else {
                    setUser(null)
                }
            } catch (error) {
                console.warn('Auth check failed, continuing without auth:', error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        checkAuth()

        // Simulate real-time status updates
        const interval = setInterval(() => {
            // Randomly update a team member's status
            const randomIndex = Math.floor(Math.random() * teamMembers.length)
            const statuses = ["online", "away", "busy", "offline"]
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
            // In a real app, this would update the backend and sync across clients
        }, 30000) // Update every 30 seconds

        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-neon-green/30 border-t-neon-green rounded-full animate-spin mx-auto" />
                    <p className="text-medium-contrast">{t.common.loading}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation isAuthenticated={!!user} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 bg-neon-green/10 px-4 py-2 rounded-full mb-6">
                            <Heart className="w-4 h-4 text-neon-green" />
                            <span className="text-sm font-mono text-neon-green">{stats.onlineMembers} {t.team.onlineMembers}</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-neon-green via-electric-blue to-cyber-purple bg-clip-text text-transparent leading-tight font-heading mb-6">
                            {t.team.title}
                        </h1>

                        <p className="text-xl md:text-2xl text-medium-contrast max-w-3xl mx-auto leading-relaxed font-body">
                            {t.team.subtitle}
                        </p>
                    </div>

                    {/* Team Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                        <Card className="glass-card text-center">
                            <CardContent className="p-6">
                                <div className="text-3xl font-bold text-neon-green mb-2 font-heading">
                                    {stats.totalMembers}
                                </div>
                                <div className="text-sm text-medium-contrast uppercase tracking-widest">
                                    {t.team.memberCount}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card text-center">
                            <CardContent className="p-6">
                                <div className="text-3xl font-bold text-electric-blue mb-2 font-heading">
                                    {stats.onlineMembers}
                                </div>
                                <div className="text-sm text-medium-contrast uppercase tracking-widest">
                                    Online Now
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card text-center">
                            <CardContent className="p-6">
                                <div className="text-3xl font-bold text-cyber-purple mb-2 font-heading">
                                    {stats.departments}
                                </div>                                <div className="text-sm text-medium-contrast uppercase tracking-widest">
                                    {t.team.departmentsLabel}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card text-center">
                            <CardContent className="p-6">
                                <div className="text-3xl font-bold text-neon-green mb-2 font-heading">
                                    {stats.averageProjects}
                                </div>
                                <div className="text-sm text-medium-contrast uppercase tracking-widest">
                                    Avg {t.team.projects}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="py-8 border-t border-border/20">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                        {/* Department Filter */}
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-medium-contrast mr-2">Department:</span>
                            {departments.map((dept) => (
                                <Button
                                    key={dept}
                                    variant={selectedDepartment === dept ? "default" : "outline"}
                                    size="sm"
                                    className={`capitalize ${selectedDepartment === dept
                                        ? "bg-neon-green text-black hover:bg-neon-green/90"
                                        : "border-border/30 hover:border-neon-green/50"
                                        }`}
                                    onClick={() => setSelectedDepartment(dept)}                                >
                                    {dept === "all" ? "All" :
                                        dept === "engineering" ? t.team.departments.engineering :
                                            dept === "design" ? t.team.departments.design :
                                                dept === "product" ? t.team.departments.product :
                                                    dept === "marketing" ? t.team.departments.marketing :
                                                        dept === "operations" ? t.team.departments.operations :
                                                            dept.charAt(0).toUpperCase() + dept.slice(1)
                                    }
                                </Button>
                            ))}
                        </div>

                        {/* Status Filter */}
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-medium-contrast mr-2">Status:</span>
                            {statusFilters.map((status) => (
                                <Button
                                    key={status}
                                    variant={selectedStatus === status ? "default" : "outline"}
                                    size="sm"
                                    className={`capitalize ${selectedStatus === status
                                        ? "bg-electric-blue text-black hover:bg-electric-blue/90"
                                        : "border-border/30 hover:border-electric-blue/50"
                                        }`}
                                    onClick={() => setSelectedStatus(status)}                                >
                                    {status === "all" ? "All" :
                                        status === "online" ? t.team.status.online :
                                            status === "away" ? t.team.status.away :
                                                status === "busy" ? t.team.status.busy :
                                                    status === "offline" ? t.team.status.offline :
                                                        status.charAt(0).toUpperCase() + status.slice(1)
                                    }
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Grid */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredMembers.map((member) => {
                            const isHovered = hoveredMember === member.id
                            const RoleIcon = getRoleIcon(member.role)

                            return (
                                <Card
                                    key={member.id}
                                    className="glass-card relative overflow-hidden group hover:glow-green transition-all duration-500 cursor-pointer"
                                    onMouseEnter={() => setHoveredMember(member.id)}
                                    onMouseLeave={() => setHoveredMember(null)}
                                    style={{
                                        transform: isHovered ? 'perspective(1000px) rotateX(5deg) rotateY(5deg)' : 'none',
                                        transition: 'transform 0.3s ease-out'
                                    }}
                                >
                                    {/* Holographic effect */}
                                    <div className={`absolute inset-0 bg-gradient-to-br from-neon-green/5 via-electric-blue/5 to-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    {/* Real-time status indicator */}
                                    <div className="absolute top-4 right-4 z-20">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-3 h-3 rounded-full ${getStatusColor(member.status)} animate-pulse`} />                                            <span className="text-xs text-medium-contrast capitalize">
                                                {member.status === "online" ? t.team.status.online :
                                                    member.status === "away" ? t.team.status.away :
                                                        member.status === "busy" ? t.team.status.busy :
                                                            member.status === "offline" ? t.team.status.offline :
                                                                member.status.charAt(0).toUpperCase() + member.status.slice(1)
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <CardContent className="p-8 relative z-10">
                                        {/* Avatar and basic info */}
                                        <div className="text-center mb-6">
                                            <div className="relative w-24 h-24 mx-auto mb-4">
                                                <img
                                                    src={member.avatar}
                                                    alt={member.name}
                                                    className="w-full h-full rounded-full object-cover border-2 border-neon-green/30 group-hover:border-neon-green transition-colors duration-300"
                                                />
                                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${getStatusColor(member.status)} border-2 border-background flex items-center justify-center`}>
                                                    {getStatusIcon(member.status)}
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold text-high-contrast mb-2 font-heading">
                                                {member.name}
                                            </h3>

                                            <div className="flex items-center justify-center space-x-2 mb-2">
                                                <div className="text-neon-green">
                                                    {RoleIcon}
                                                </div>                                                <span className="text-sm text-medium-contrast">
                                                    {member.role === "founder" ? t.team.roles.founder :
                                                        member.role === "cto" ? t.team.roles.cto :
                                                            member.role === "lead" ? t.team.roles.lead :
                                                                member.role === "senior" ? t.team.roles.senior :
                                                                    member.role === "developer" ? t.team.roles.developer :
                                                                        member.role === "designer" ? t.team.roles.designer :
                                                                            member.role === "analyst" ? t.team.roles.analyst :
                                                                                member.role === "manager" ? t.team.roles.manager :
                                                                                    member.role.charAt(0).toUpperCase() + member.role.slice(1)
                                                    }
                                                </span>
                                            </div>                                            <Badge variant="outline" className="border-electric-blue/50 text-electric-blue">
                                                {member.department === "engineering" ? t.team.departments.engineering :
                                                    member.department === "design" ? t.team.departments.design :
                                                        member.department === "product" ? t.team.departments.product :
                                                            member.department === "marketing" ? t.team.departments.marketing :
                                                                member.department === "operations" ? t.team.departments.operations :
                                                                    member.department.charAt(0).toUpperCase() + member.department.slice(1)
                                                }
                                            </Badge>
                                        </div>

                                        {/* Bio */}
                                        <p className="text-sm text-medium-contrast text-center mb-6 leading-relaxed">
                                            {member.bio}
                                        </p>

                                        {/* Skills */}
                                        <div className="mb-6">
                                            <h4 className="text-sm font-medium text-high-contrast mb-3">{t.team.skills}:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {member.skills.map((skill) => (
                                                    <Badge key={skill} variant="outline" className="text-xs border-border/30">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-neon-green">{member.projects}</div>
                                                <div className="text-xs text-medium-contrast">{t.team.projects}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-electric-blue">
                                                    {new Date(member.joinedDate).getFullYear()}
                                                </div>
                                                <div className="text-xs text-medium-contrast">{t.team.joinedDate}</div>
                                            </div>
                                        </div>

                                        {/* Contact info */}
                                        <div className="space-y-2 text-xs text-medium-contrast">
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="w-3 h-3" />
                                                <span>{member.location}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Clock className="w-3 h-3" />
                                                <span>{member.workingHours}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Coffee className="w-3 h-3" />
                                                <span>Last active: {member.lastActive}</span>
                                            </div>
                                        </div>

                                        {/* Social links */}
                                        <div className="flex justify-center space-x-3 mt-6 pt-6 border-t border-border/20">
                                            <Button size="sm" variant="ghost" className="hover:text-neon-green">
                                                <Mail className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="hover:text-neon-green">
                                                <Github className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="hover:text-neon-green">
                                                <Twitter className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="hover:text-neon-green">
                                                <Linkedin className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6 text-center">
                    <Card className="glass-card max-w-4xl mx-auto">
                        <CardContent className="p-12">
                            <h2 className="text-4xl md:text-6xl font-bold text-high-contrast mb-6 font-heading">
                                Want to Join Our Team?
                            </h2>
                            <p className="text-xl text-medium-contrast mb-8 max-w-2xl mx-auto font-body">
                                We're always looking for talented individuals who share our passion for innovation and excellence.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Button
                                    size="lg"
                                    className="btn-hover-glow bg-neon-green hover:bg-neon-green/90 text-black font-bold text-lg px-12 py-6 rounded-full"
                                >
                                    <Users className="mr-3 h-6 w-6" />
                                    View Open Positions
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="btn-hover-glow glass font-mono text-lg px-8 py-6 border-electric-blue/50 hover:border-electric-blue hover:bg-electric-blue/10 rounded-full"
                                >
                                    <MessageSquare className="mr-3 h-6 w-6" />
                                    Contact Us
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}
