// Translation files for the LocalAI Stack application

export interface Translation {    // Navigation
    nav: {
        home: string
        chat: string
        models: string
        search: string
        docs: string
        settings: string
        monitoring: string
        playground: string
        analytics: string
        debug: string
        team: string
        about: string
        pricing: string
    }
    // Common UI elements
    common: {
        loading: string
        error: string
        success: string
        cancel: string
        save: string
        delete: string
        edit: string
        view: string
        close: string
        back: string
        next: string
        previous: string
        search: string
        filter: string
        sort: string
        refresh: string
        export: string
        import: string
    }
    // Auth related
    auth: {
        signIn: string
        signUp: string
        signOut: string
        email: string
        password: string
        confirmPassword: string
        forgotPassword: string
        resetPassword: string
        verifyEmail: string
        profile: string
        account: string
    }
    // Homepage/Marketing
    marketing: {
        title: string
        subtitle: string
        description: string
        getStarted: string
        learnMore: string
        features: {
            aiChat: {
                title: string
                description: string
            }
            webSearch: {
                title: string
                description: string
            }
            monitoring: {
                title: string
                description: string
            }
        }
    }
    // Analytics/Views page
    analytics: {
        title: string
        subtitle: string
        liveData: string
        metrics: {
            totalUsers: string
            activeModels: string
            requestsToday: string
            uptime: string
            avgLatency: string
            bandwidth: string
            storage: string
            errorRate: string
            cpuUsage: string
            memory: string
            network: string
        }
        tabs: {
            overview: string
            performance: string
            services: string
            activity: string
        }
        systemPerformance: string
        liveMetrics: string
        recentActivity: string
        activityDescription: string
    }
    // Chat interface
    chat: {
        title: string
        placeholder: string
        send: string
        clear: string
        model: string
        temperature: string
        maxTokens: string
        streaming: string
        thinking: string
        generating: string
    }
    // Services and status
    services: {
        aiChatService: string
        modelManagement: string
        webSearchApi: string
        authentication: string
        database: string
        online: string
        offline: string
        healthy: string
        error: string
        uptime: string
        responseTime: string
    }
    // Performance indicators
    performance: {
        high: string
        normal: string
        low: string
        excellent: string
        good: string
        fair: string
        poor: string
    }
    // Time and dates
    time: {
        justNow: string
        minutesAgo: string
        hoursAgo: string
        daysAgo: string
        weeksAgo: string
        monthsAgo: string
    }
    // Team page
    team: {
        title: string
        subtitle: string
        memberCount: string
        onlineMembers: string
        departmentsLabel: string
        roles: {
            founder: string
            cto: string
            lead: string
            senior: string
            developer: string
            designer: string
            analyst: string
            manager: string
        }
        status: {
            online: string
            away: string
            busy: string
            offline: string
        }
        departments: {
            engineering: string
            design: string
            product: string
            marketing: string
            operations: string
        }
        contact: string
        joinedDate: string
        skills: string
        projects: string
        expertise: string
    }
    // About page
    about: {
        title: string
        subtitle: string
        mission: {
            title: string
            description: string
        }
        vision: {
            title: string
            description: string
        }
        values: {
            title: string
            innovation: {
                title: string
                description: string
            }
            accessibility: {
                title: string
                description: string
            }
            security: {
                title: string
                description: string
            }
            performance: {
                title: string
                description: string
            }
        }
        timeline: {
            title: string
            events: {
                founded: {
                    date: string
                    title: string
                    description: string
                }
                firstRelease: {
                    date: string
                    title: string
                    description: string
                }
                aiIntegration: {
                    date: string
                    title: string
                    description: string
                },
                scalingUp: {
                    date: string
                    title: string
                    description: string
                },
                future: {
                    date: string
                    title: string
                    description: string
                }
            }
        }
        stats: {
            yearsOfExperience: string
            projectsCompleted: string
            satisfiedClients: string
            linesOfCode: string
        }
        technologies: {
            title: string
            frontend: string
            backend: string
            database: string
            ai: string
            cloud: string
        }
    }
    // Pricing page
    pricing: {
        title: string
        subtitle: string
        monthly: string
        yearly: string
        saveLabel: string
        starterPlan: {
            name: string
            description: string
            features: string[]
        }
        developmentPlan: {
            name: string
            description: string
            features: string[]
        }
        enterprisePlan: {
            name: string
            description: string
            features: string[]
        }
        getStarted: string
        startJourney: string
        mostPopular: string
        compareFeatures: string
        faq: string
        readyToStart: string
        startFreeTrial: string
        talkToSales: string
    }
}

// English translations
export const en: Translation = {
    nav: {
        home: "Home",
        chat: "Chat",
        models: "Models",
        search: "Search",
        docs: "Docs",
        settings: "Settings",
        monitoring: "Monitoring",
        playground: "Playground",
        analytics: "Analytics",
        debug: "Debug",
        team: "Team",
        about: "About",
        pricing: "Pricing"
    },
    common: {
        loading: "Loading...",
        error: "Error",
        success: "Success",
        cancel: "Cancel",
        save: "Save",
        delete: "Delete",
        edit: "Edit",
        view: "View",
        close: "Close",
        back: "Back",
        next: "Next",
        previous: "Previous",
        search: "Search",
        filter: "Filter",
        sort: "Sort",
        refresh: "Refresh",
        export: "Export",
        import: "Import"
    },
    auth: {
        signIn: "Sign In",
        signUp: "Sign Up",
        signOut: "Sign Out",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        forgotPassword: "Forgot Password",
        resetPassword: "Reset Password",
        verifyEmail: "Verify Email",
        profile: "Profile",
        account: "Account"
    },
    marketing: {
        title: "Welcome to PeanechWeb",
        subtitle: "Your Local AI Stack",
        description: "Harness the power of local AI models with web search, chat capabilities, and real-time monitoring.",
        getStarted: "Get Started",
        learnMore: "Learn More",
        features: {
            aiChat: {
                title: "AI Chat",
                description: "Conversational AI powered by local models"
            },
            webSearch: {
                title: "Web Search",
                description: "Intelligent search with AI analysis"
            },
            monitoring: {
                title: "Monitoring",
                description: "Real-time system performance tracking"
            }
        }
    },
    analytics: {
        title: "Analytics & Insights",
        subtitle: "Real-time monitoring and performance analytics for the LocalAI Stack",
        liveData: "LIVE DATA",
        metrics: {
            totalUsers: "Total Users",
            activeModels: "Active Models",
            requestsToday: "Requests Today",
            uptime: "Uptime",
            avgLatency: "Avg Latency",
            bandwidth: "Bandwidth",
            storage: "Storage",
            errorRate: "Error Rate",
            cpuUsage: "CPU Usage",
            memory: "Memory",
            network: "Network"
        },
        tabs: {
            overview: "Overview",
            performance: "Performance",
            services: "Services",
            activity: "Activity"
        },
        systemPerformance: "System Performance",
        liveMetrics: "Live Metrics",
        recentActivity: "Recent Activity",
        activityDescription: "Live feed of system events and user actions"
    },
    chat: {
        title: "AI Chat",
        placeholder: "Type your message here...",
        send: "Send",
        clear: "Clear",
        model: "Model",
        temperature: "Temperature",
        maxTokens: "Max Tokens",
        streaming: "Streaming",
        thinking: "Thinking...",
        generating: "Generating response..."
    },
    services: {
        aiChatService: "AI Chat Service",
        modelManagement: "Model Management",
        webSearchApi: "Web Search API",
        authentication: "Authentication",
        database: "Database",
        online: "online",
        offline: "offline",
        healthy: "healthy",
        error: "error",
        uptime: "Uptime",
        responseTime: "Response"
    },
    performance: {
        high: "High",
        normal: "Normal",
        low: "Low",
        excellent: "Excellent",
        good: "Good",
        fair: "Fair",
        poor: "Poor"
    }, time: {
        justNow: "just now",
        minutesAgo: "minutes ago",
        hoursAgo: "hours ago",
        daysAgo: "days ago",
        weeksAgo: "weeks ago",
        monthsAgo: "months ago"
    }, team: {
        title: "Our Team",
        subtitle: "Meet the brilliant minds behind PeanechWeb",
        memberCount: "Team Members",
        onlineMembers: "Online Now",
        departmentsLabel: "Departments",
        roles: {
            founder: "Founder & CEO",
            cto: "Chief Technology Officer",
            lead: "Lead Developer",
            senior: "Senior Developer",
            developer: "Developer",
            designer: "UI/UX Designer",
            analyst: "Data Analyst",
            manager: "Project Manager"
        },
        status: {
            online: "Online",
            away: "Away",
            busy: "Busy",
            offline: "Offline"
        },
        departments: {
            engineering: "Engineering",
            design: "Design",
            product: "Product",
            marketing: "Marketing",
            operations: "Operations"
        },
        contact: "Contact",
        joinedDate: "Joined",
        skills: "Skills",
        projects: "Projects",
        expertise: "Expertise"
    },
    about: {
        title: "About PeanechWeb",
        subtitle: "Building the future of AI-powered applications",
        mission: {
            title: "Our Mission",
            description: "To democratize AI technology and make advanced artificial intelligence accessible to everyone through intuitive, powerful, and secure applications."
        },
        vision: {
            title: "Our Vision",
            description: "To become the leading platform for local AI deployment, enabling developers and organizations to harness the full potential of artificial intelligence."
        },
        values: {
            title: "Our Values",
            innovation: {
                title: "Innovation",
                description: "Constantly pushing the boundaries of what's possible with AI technology"
            },
            accessibility: {
                title: "Accessibility",
                description: "Making AI tools available and usable for everyone, regardless of technical background"
            },
            security: {
                title: "Security",
                description: "Ensuring data privacy and security in all our AI implementations"
            },
            performance: {
                title: "Performance",
                description: "Delivering lightning-fast, reliable AI solutions that scale with your needs"
            }
        },
        timeline: {
            title: "Our Journey",
            events: {
                founded: {
                    date: "2024",
                    title: "Company Founded",
                    description: "Started with a vision to make AI more accessible and powerful"
                },
                firstRelease: {
                    date: "Q2 2024",
                    title: "First Release",
                    description: "Launched our initial platform with basic AI capabilities"
                },
                aiIntegration: {
                    date: "Q3 2024",
                    title: "Advanced AI Integration",
                    description: "Integrated DeepSeek R1 and Qwen models for enhanced performance"
                },
                scalingUp: {
                    date: "Q4 2024",
                    title: "Scaling Up",
                    description: "Expanded our infrastructure and team to serve more users"
                },
                future: {
                    date: "2025",
                    title: "Future Innovations",
                    description: "Continued development of cutting-edge AI features and capabilities"
                }
            }
        },
        stats: {
            yearsOfExperience: "Years of Experience",
            projectsCompleted: "Projects Completed",
            satisfiedClients: "Satisfied Clients",
            linesOfCode: "Lines of Code"
        },
        technologies: {
            title: "Technologies We Use",
            frontend: "Frontend",
            backend: "Backend",
            database: "Database",
            ai: "AI & ML",
            cloud: "Cloud & DevOps"
        }
    },
    pricing: {
        title: "Pricing Plans",
        subtitle: "Choose the perfect plan for your needs",
        monthly: "Monthly",
        yearly: "Yearly",
        saveLabel: "Save 20%",
        starterPlan: {
            name: "Starter",
            description: "Perfect for individuals and small projects",
            features: [
                "5 AI Model Access",
                "1,000 API Calls/month",
                "Basic Web Search",
                "Email Support",
                "Community Access"
            ]
        },
        developmentPlan: {
            name: "Development",
            description: "Ideal for developers and growing teams",
            features: [
                "15 AI Model Access",
                "10,000 API Calls/month",
                "Advanced Web Search",
                "Real-time Monitoring",
                "Priority Support",
                "Team Collaboration",
                "Custom Integrations"
            ]
        },
        enterprisePlan: {
            name: "Enterprise",
            description: "Complete solution for large organizations",
            features: [
                "Unlimited AI Models",
                "Unlimited API Calls",
                "Enterprise Web Search",
                "Advanced Analytics",
                "24/7 Phone Support",
                "Dedicated Account Manager",
                "Custom Development",
                "SLA Guarantee"
            ]
        },
        getStarted: "Get Started",
        startJourney: "Start Your Journey",
        mostPopular: "Most Popular",
        compareFeatures: "Compare Features",
        faq: "Frequently Asked Questions",
        readyToStart: "Ready to get started?",
        startFreeTrial: "Start Free Trial",
        talkToSales: "Talk to Sales"
    }
}

// Chinese (Simplified) translations
export const zhCn: Translation = {
    nav: {
        home: "首页",
        chat: "聊天",
        models: "模型",
        search: "搜索",
        docs: "文档",
        settings: "设置",
        monitoring: "监控",
        playground: "游戏场",
        analytics: "分析",
        debug: "调试",
        team: "团队",
        about: "关于",
        pricing: "定价"
    },
    common: {
        loading: "加载中...",
        error: "错误",
        success: "成功",
        cancel: "取消",
        save: "保存",
        delete: "删除",
        edit: "编辑",
        view: "查看",
        close: "关闭",
        back: "返回",
        next: "下一个",
        previous: "上一个",
        search: "搜索",
        filter: "筛选",
        sort: "排序",
        refresh: "刷新",
        export: "导出",
        import: "导入"
    },
    auth: {
        signIn: "登录",
        signUp: "注册",
        signOut: "退出",
        email: "邮箱",
        password: "密码",
        confirmPassword: "确认密码",
        forgotPassword: "忘记密码",
        resetPassword: "重置密码",
        verifyEmail: "验证邮箱",
        profile: "个人资料",
        account: "账户"
    },
    marketing: {
        title: "欢迎使用 PeanechWeb",
        subtitle: "您的本地AI堆栈",
        description: "利用本地AI模型的强大功能，集成网络搜索、聊天功能和实时监控。",
        getStarted: "开始使用",
        learnMore: "了解更多",
        features: {
            aiChat: {
                title: "AI聊天",
                description: "由本地模型驱动的对话AI"
            },
            webSearch: {
                title: "网络搜索",
                description: "智能搜索与AI分析"
            },
            monitoring: {
                title: "监控",
                description: "实时系统性能跟踪"
            }
        }
    },
    analytics: {
        title: "分析与洞察",
        subtitle: "LocalAI Stack的实时监控和性能分析",
        liveData: "实时数据",
        metrics: {
            totalUsers: "总用户数",
            activeModels: "活跃模型",
            requestsToday: "今日请求",
            uptime: "运行时间",
            avgLatency: "平均延迟",
            bandwidth: "带宽",
            storage: "存储",
            errorRate: "错误率",
            cpuUsage: "CPU使用率",
            memory: "内存",
            network: "网络"
        },
        tabs: {
            overview: "概览",
            performance: "性能",
            services: "服务",
            activity: "活动"
        },
        systemPerformance: "系统性能",
        liveMetrics: "实时指标",
        recentActivity: "最近活动",
        activityDescription: "系统事件和用户操作的实时动态"
    },
    chat: {
        title: "AI聊天",
        placeholder: "在此输入您的消息...",
        send: "发送",
        clear: "清除",
        model: "模型",
        temperature: "温度",
        maxTokens: "最大令牌",
        streaming: "流式传输",
        thinking: "思考中...",
        generating: "正在生成回复..."
    },
    services: {
        aiChatService: "AI聊天服务",
        modelManagement: "模型管理",
        webSearchApi: "网络搜索API",
        authentication: "身份验证",
        database: "数据库",
        online: "在线",
        offline: "离线",
        healthy: "健康",
        error: "错误",
        uptime: "运行时间",
        responseTime: "响应时间"
    },
    performance: {
        high: "高",
        normal: "正常",
        low: "低",
        excellent: "优秀",
        good: "良好",
        fair: "一般",
        poor: "差"
    }, time: {
        justNow: "刚刚",
        minutesAgo: "分钟前",
        hoursAgo: "小时前",
        daysAgo: "天前",
        weeksAgo: "周前",
        monthsAgo: "月前"
    }, team: {
        title: "我们的团队",
        subtitle: "认识PeanechWeb背后的杰出人才",
        memberCount: "团队成员",
        onlineMembers: "在线成员",
        departmentsLabel: "部门",
        roles: {
            founder: "创始人兼首席执行官",
            cto: "首席技术官",
            lead: "首席开发员",
            senior: "高级开发员",
            developer: "开发员",
            designer: "UI/UX设计师",
            analyst: "数据分析师",
            manager: "项目经理"
        },
        status: {
            online: "在线",
            away: "离开",
            busy: "忙碌",
            offline: "离线"
        },
        departments: {
            engineering: "工程",
            design: "设计",
            product: "产品",
            marketing: "市场营销",
            operations: "运营"
        },
        contact: "联系",
        joinedDate: "加入时间",
        skills: "技能",
        projects: "项目",
        expertise: "专业领域"
    },
    about: {
        title: "关于PeanechWeb",
        subtitle: "构建AI驱动应用的未来",
        mission: {
            title: "我们的使命",
            description: "民主化AI技术，通过直观、强大且安全的应用程序让每个人都能使用先进的人工智能。"
        },
        vision: {
            title: "我们的愿景",
            description: "成为本地AI部署的领先平台，使开发者和组织能够充分发挥人工智能的潜力。"
        },
        values: {
            title: "我们的价值观",
            innovation: {
                title: "创新",
                description: "不断推动AI技术可能性的边界"
            },
            accessibility: {
                title: "可访问性",
                description: "让AI工具对每个人都可用，无论技术背景如何"
            },
            security: {
                title: "安全",
                description: "确保我们所有AI实现中的数据隐私和安全"
            },
            performance: {
                title: "性能",
                description: "提供闪电般快速、可靠且可扩展的AI解决方案"
            }
        },
        timeline: {
            title: "我们的历程",
            events: {
                founded: {
                    date: "2024年",
                    title: "公司成立",
                    description: "以让AI更加便民和强大的愿景开始"
                },
                firstRelease: {
                    date: "2024年第二季度",
                    title: "首次发布",
                    description: "推出了具有基本AI功能的初始平台"
                },
                aiIntegration: {
                    date: "2024年第三季度",
                    title: "高级AI集成",
                    description: "集成DeepSeek R1和Qwen模型以增强性能"
                },
                scalingUp: {
                    date: "2024年第四季度",
                    title: "扩大规模",
                    description: "扩展我们的基础设施和团队以服务更多用户"
                },
                future: {
                    date: "2025年",
                    title: "未来创新",
                    description: "继续开发尖端AI功能和能力"
                }
            }
        },
        stats: {
            yearsOfExperience: "年经验",
            projectsCompleted: "完成项目",
            satisfiedClients: "满意客户",
            linesOfCode: "代码行数"
        },
        technologies: {
            title: "我们使用的技术", frontend: "前端",
            backend: "后端",
            database: "数据库",
            ai: "AI与机器学习",
            cloud: "云计算与DevOps"
        }
    },
    pricing: {
        title: "定价方案",
        subtitle: "选择适合您需求的完美方案",
        monthly: "月付",
        yearly: "年付",
        saveLabel: "节省20%",
        starterPlan: {
            name: "入门版",
            description: "适合个人和小型项目",
            features: [
                "5个AI模型访问",
                "每月1,000次API调用",
                "基础网络搜索",
                "邮件支持",
                "社区访问"
            ]
        },
        developmentPlan: {
            name: "开发版",
            description: "适合开发者和成长中的团队",
            features: [
                "15个AI模型访问",
                "每月10,000次API调用",
                "高级网络搜索",
                "实时监控",
                "优先支持",
                "团队协作",
                "自定义集成"
            ]
        },
        enterprisePlan: {
            name: "企业版",
            description: "大型组织的完整解决方案",
            features: [
                "无限AI模型",
                "无限API调用",
                "企业级网络搜索",
                "高级分析",
                "24/7电话支持",
                "专属客户经理",
                "定制开发",
                "SLA保证"
            ]
        },
        getStarted: "开始使用",
        startJourney: "开始您的旅程",
        mostPopular: "最受欢迎",
        compareFeatures: "比较功能",
        faq: "常见问题",
        readyToStart: "准备开始了吗？",
        startFreeTrial: "开始免费试用",
        talkToSales: "联系销售"
    }
}

// Khmer translations
export const km: Translation = {
    nav: {
        home: "ទំព័រដើម",
        chat: "ការជជែក",
        models: "គំរូ",
        search: "ស្វែងរក",
        docs: "ឯកសារ",
        settings: "ការកំណត់",
        monitoring: "ការតាមដាន",
        playground: "កន្លែងលេង",
        analytics: "ការវិភាគ",
        debug: "ការកែសំណអ",
        team: "ក្រុម",
        about: "អំពី",
        pricing: "តម្លៃ"
    },
    common: {
        loading: "កំពុងផ្ទុក...",
        error: "កំហុស",
        success: "ជោគជ័យ",
        cancel: "បោះបង់",
        save: "រក្សាទុក",
        delete: "លុប",
        edit: "កែសម្រួល",
        view: "មើល",
        close: "បិទ",
        back: "ត្រឡប់",
        next: "បន្ទាប់",
        previous: "មុន",
        search: "ស្វែងរក",
        filter: "តម្រង",
        sort: "តម្រៀប",
        refresh: "ធ្វើឱ្យស្រស់",
        export: "នាំចេញ",
        import: "នាំចូល"
    },
    auth: {
        signIn: "ចូល",
        signUp: "ចុះឈ្មោះ",
        signOut: "ចេញ",
        email: "អ៊ីមែល",
        password: "ពាក្យសម្ងាត់",
        confirmPassword: "បញ្ជាក់ពាក្យសម្ងាត់",
        forgotPassword: "ភ្លេចពាក្យសម្ងាត់",
        resetPassword: "កំណត់ពាក្យសម្ងាត់ឡើងវិញ",
        verifyEmail: "ផ្ទៀងផ្ទាត់អ៊ីមែល",
        profile: "ប្រវត្តិរូប",
        account: "គណនី"
    },
    marketing: {
        title: "សូមស្វាគមន៍មកកាន់ PeanechWeb",
        subtitle: "ជង់ AI មូលដ្ឋានរបស់អ្នក",
        description: "ប្រើប្រាស់ថាមពលនៃគំរូ AI មូលដ្ឋាន ជាមួយនឹងការស្វែងរកតាមវេបសាយ ការជជែក និងការតាមដានទាន់ពេលវេលា។",
        getStarted: "ចាប់ផ្តើម",
        learnMore: "ស្វែងយល់បន្ថែម",
        features: {
            aiChat: {
                title: "ការជជែក AI",
                description: "AI ការសន្ទនាដោយគំរូមូលដ្ឋាន"
            },
            webSearch: {
                title: "ការស្វែងរកតាមវេប",
                description: "ការស្វែងរកឆ្លាតវៃជាមួយនឹងការវិភាគ AI"
            },
            monitoring: {
                title: "ការតាមដាន",
                description: "ការតាមដានសមត្ថភាពប្រព័ន្ធទាន់ពេលវេលា"
            }
        }
    },
    analytics: {
        title: "ការវិភាគ និងការយល់ដឹង",
        subtitle: "ការតាមដានទាន់ពេលវេលា និងការវិភាគសមត្ថភាពសម្រាប់ LocalAI Stack",
        liveData: "ទិន្នន័យផ្ទាល់",
        metrics: {
            totalUsers: "អ្នកប្រើប្រាស់សរុប",
            activeModels: "គំរូសកម្ម",
            requestsToday: "សំណើថ្ងៃនេះ",
            uptime: "ពេលវេលាដំណើរការ",
            avgLatency: "ពន្យារពេលជាមធ្យម",
            bandwidth: "ធនធានបណ្តាញ",
            storage: "ការទុកដាក់",
            errorRate: "អត្រាកំហុស",
            cpuUsage: "ការប្រើប្រាស់ CPU",
            memory: "ការចងចាំ",
            network: "បណ្តាញ"
        },
        tabs: {
            overview: "ទិដ្ឋភាពទូទៅ",
            performance: "សមត្ថភាព",
            services: "សេវាកម្ម",
            activity: "សកម្មភាព"
        },
        systemPerformance: "សមត្ថភាពប្រព័ន្ធ",
        liveMetrics: "ការវាស់វែងផ្ទាល់",
        recentActivity: "សកម្មភាពថ្មីៗ",
        activityDescription: "ការផ្ញើផ្ទាល់នៃព្រឹត្តិការណ៍ប្រព័ន្ធ និងសកម្មភាពអ្នកប្រើប្រាស់"
    },
    chat: {
        title: "ការជជែក AI",
        placeholder: "វាយបញ្ចូលសារនៅទីនេះ...",
        send: "ផ្ញើ",
        clear: "សម្អាត",
        model: "គំរូ",
        temperature: "សីតុណ្ហភាព",
        maxTokens: "និម្មិតសញ្ញាអតិបរមា",
        streaming: "ការស្ទ្រីម",
        thinking: "កំពុងគិត...",
        generating: "កំពុងបង្កើតចម្លើយ..."
    },
    services: {
        aiChatService: "សេវាកម្មការជជែក AI",
        modelManagement: "ការគ្រប់គ្រងគំរូ",
        webSearchApi: "API ស្វែងរកតាមវេប",
        authentication: "ការផ្ទៀងផ្ទាត់",
        database: "មូលដ្ឋានទិន្នន័យ",
        online: "អនឡាញ",
        offline: "ក្រៅបណ្តាញ",
        healthy: "ស្វាភាវិក",
        error: "កំហុស",
        uptime: "ពេលវេលាដំណើរការ",
        responseTime: "ពេលវេលាឆ្លើយតប"
    },
    performance: {
        high: "ខ្ពស់",
        normal: "ធម្មតា",
        low: "ទាប",
        excellent: "ល្អបំផុត",
        good: "ល្អ",
        fair: "មធ្យម",
        poor: "មិនល្អ"
    }, time: {
        justNow: "ទើបតែ",
        minutesAgo: "នាទីមុន",
        hoursAgo: "ម៉ោងមុន",
        daysAgo: "ថ្ងៃមុន",
        weeksAgo: "សប្តាហ៍មុន",
        monthsAgo: "ខែមុន"
    }, team: {
        title: "ក្រុមការងាររបស់យើង",
        subtitle: "ស្គាល់ជាមួយបញ្ញាវន្តដ៏អស្ចារ្យនៅពីក្រោយ PeanechWeb",
        memberCount: "សមាជិកក្រុម",
        onlineMembers: "នៅអនឡាញឥឡូវ",
        departmentsLabel: "នាយកដ្ឋាន",
        roles: {
            founder: "ស្ថាបនិក និងប្រធានគ្រប់គ្រង",
            cto: "ប្រធានបច្ចេកទេស",
            lead: "អ្នកអភិវឌ្ឍន៍ដឹកនាំ",
            senior: "អ្នកអភិវឌ្ឍន៍ជាន់ខ្ពស់",
            developer: "អ្នកអភិវឌ្ឍន៍",
            designer: "អ្នករចនា UI/UX",
            analyst: "អ្នកវិភាគទិន្នន័យ",
            manager: "អ្នកគ្រប់គ្រងគម្រោង"
        },
        status: {
            online: "អនឡាញ",
            away: "ចាកចេញ",
            busy: "រវល់",
            offline: "ក្រៅបណ្តាញ"
        },
        departments: {
            engineering: "វិស្វកម្ម",
            design: "ការរចនា",
            product: "ផលិតផល",
            marketing: "ទីផ្សារ",
            operations: "ប្រតិបត្តិការ"
        },
        contact: "ទំនាក់ទំនង",
        joinedDate: "ចូលរួម",
        skills: "ជំនាញ",
        projects: "គម្រោង",
        expertise: "ជំនាញពិសេស"
    },
    about: {
        title: "អំពី PeanechWeb",
        subtitle: "កសាងអនាគតនៃកម្មវិធីដែលដំណើរការដោយ AI",
        mission: {
            title: "បេសកកម្មរបស់យើង",
            description: "ធ្វើឱ្យបច្ចេកវិទ្យា AI មានលក្ខណៈប្រជាធិបតេយ្យ និងធ្វើឱ្យបញ្ញាសិប្បនិម្មិតកម្រិតខ្ពស់អាចចូលប្រើបានសម្រាប់គ្រប់គ្នាតាមរយៈកម្មវិធីដែលមានភាពវិចិត្រ មានថាមពល និងមានសុវត្ថិភាព។"
        },
        vision: {
            title: "ចក្ខុវិស័យរបស់យើង",
            description: "ក្លាយជាវេទិកាឈានមុខគេសម្រាប់ការផ្សាយ AI ក្នុងមូលដ្ឋាន ដែលអាចឱ្យអ្នកអភិវឌ្ឍន៍ និងអង្គការបានប្រើប្រាស់សក្តានុពលពេញលេញនៃបញ្ញាសិប្បនិម្មិត។"
        },
        values: {
            title: "តម្លៃរបស់យើង",
            innovation: {
                title: "ការច្នៃប្រឌិត",
                description: "រុញច្រានព្រំដែននៃអ្វីដែលអាចធ្វើទៅបានជាមួយបច្ចេកវិទ្យា AI"
            },
            accessibility: {
                title: "ភាពអាចចូលប្រើបាន",
                description: "ធ្វើឱ្យឧបករណ៍ AI អាចប្រើប្រាស់បានសម្រាប់គ្រប់គ្នា ដោយមិនចាំបាច់មានប្រវត្តិបច្ចេកទេស"
            },
            security: {
                title: "សុវត្ថិភាព",
                description: "ធានានូវភាពឯកជននៃទិន្នន័យ និងសុវត្ថិភាពក្នុងការអនុវត្ត AI ទាំងអស់របស់យើង"
            },
            performance: {
                title: "ដំណើរការ",
                description: "ផ្តល់នូវដំណោះស្រាយ AI ដែលលឿនដូចរន្ទះ ទុកចិត្តបាន និងអាចពង្រីកបានតាមតម្រូវការរបស់អ្នក"
            }
        },
        timeline: {
            title: "ដំណើរយើង",
            events: {
                founded: {
                    date: "២០២៤",
                    title: "ចាប់ផ្តើមបង្កើតក្រុមហ៊ុន",
                    description: "ចាប់ផ្តើមជាមួយនឹងចក្ខុវិស័យដើម្បីធ្វើឱ្យ AI កាន់តែងាយស្រួលនិងមានថាមពល"
                },
                firstRelease: {
                    date: "ត្រីមាសទី២ ឆ្នាំ២០២៤",
                    title: "ការចេញផ្សាយដំបូង",
                    description: "បានបើកដំណើរការវេទិកាដំបូងរបស់យើងជាមួយនឹងលក្ខណៈពិសេស AI មូលដ្ឋាន"
                },
                aiIntegration: {
                    date: "ត្រីមាសទី៣ ឆ្នាំ២០២៤",
                    title: "ការរួមបញ្ចូល AI កម្រិតខ្ពស់",
                    description: "បានរួមបញ្ចូលគំរូ DeepSeek R1 និង Qwen ដើម្បីបង្កើនដំណើរការ"
                },
                scalingUp: {
                    date: "ត្រីមាសទី៤ ឆ្នាំ២០២៤",
                    title: "ការពង្រីក",
                    description: "បានពង្រីករចនាសម្ព័ន្ធ និងក្រុមការងាររបស់យើងដើម្បីបម្រើអ្នកប្រើប្រាស់បន្ថែមទៀត"
                },
                future: {
                    date: "២០២៥",
                    title: "ការច្នៃប្រឌិតអនាគត",
                    description: "បន្តអភិវឌ្ឍលក្ខណៈពិសេស និងសមត្ថភាព AI ជាន់ខ្ពស់"
                }
            }
        },
        stats: {
            yearsOfExperience: "ឆ្នាំនៃបទពិសោធន៍",
            projectsCompleted: "គម្រោងបានបញ្ចប់",
            satisfiedClients: "អតិថិជនពេញចិត្ត",
            linesOfCode: "បន្ទាត់កូដ"
        },
        technologies: {
            title: "បច្ចេកវិទ្យាដែលយើងប្រើ", frontend: "ផ្នែកមុខ",
            backend: "ផ្នែកក្រោយ",
            database: "មូលដ្ឋានទិន្នន័យ",
            ai: "AI និងការរៀនម៉ាស៊ីន",
            cloud: "ពពក និង DevOps"
        }
    },
    pricing: {
        title: "គម្រោងតម្លៃ",
        subtitle: "ជ្រើសរើសគម្រោងដ៏ល្អឥតខ្ចោះសម្រាប់តម្រូវការរបស់អ្នក",
        monthly: "ប្រចាំខែ",
        yearly: "ប្រចាំឆ្នាំ",
        saveLabel: "សន្សំ 20%",
        starterPlan: {
            name: "ចាប់ផ្តើម",
            description: "ល្អឥតខ្ចោះសម្រាប់បុគ្គល និងគម្រោងតូច",
            features: [
                "ចូលប្រើគំរូ AI ចំនួន 5",
                "ការហៅ API 1,000 ដង/ខែ",
                "ការស្វែងរកតាមវេបមូលដ្ឋាន",
                "ការគាំទ្រតាមអ៊ីមែល",
                "ការចូលប្រើសហគមន៍"
            ]
        },
        developmentPlan: {
            name: "អភិវឌ្ឍន៍",
            description: "ល្អសម្រាប់អ្នកអភិវឌ្ឍន៍ និងក្រុមដែលកំពុងរីកចម្រើន",
            features: [
                "ចូលប្រើគំរូ AI ចំនួន 15",
                "ការហៅ API 10,000 ដង/ខែ",
                "ការស្វែងរកតាមវេបកម្រិតខ្ពស់",
                "ការតាមដានទាន់ពេលវេលា",
                "ការគាំទ្រអាទិភាព",
                "ការសហការក្រុម",
                "ការរួមបញ្ចូលតាមបំណង"
            ]
        },
        enterprisePlan: {
            name: "សហគ្រាស",
            description: "ដំណោះស្រាយពេញលេញសម្រាប់អង្គការធំ",
            features: [
                "គំរូ AI គ្មានដែនកំណត់",
                "ការហៅ API គ្មានដែនកំណត់",
                "ការស្វែងរកតាមវេបសហគ្រាស",
                "ការវិភាគកម្រិតខ្ពស់",
                "ការគាំទ្រតាមទូរស័ព្ទ 24/7",
                "អ្នកគ្រប់គ្រងគណនីជំនាញ",
                "ការអភិវឌ្ឍតាមបំណង",
                "ការធានា SLA"
            ]
        },
        getStarted: "ចាប់ផ្តើម",
        startJourney: "ចាប់ផ្តើមដំណើររបស់អ្នក",
        mostPopular: "ពេញនិយមបំផុត",
        compareFeatures: "ប្រៀបធៀបលក្ខណៈពិសេស",
        faq: "សំណួរដែលសួរញឹកញាប់",
        readyToStart: "ត្រៀមរួចដើម្បីចាប់ផ្តើម?",
        startFreeTrial: "ចាប់ផ្តើមការសាកល្បងដោយឥតគិតថ្លៃ",
        talkToSales: "និយាយជាមួយការលក់"
    }
}

export const translations = {
    en,
    'zh-cn': zhCn,
    km
}

export type SupportedLanguage = keyof typeof translations
