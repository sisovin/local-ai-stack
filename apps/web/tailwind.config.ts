import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-green': 'oklch(0.85 0.30 145)',
                'electric-blue': 'oklch(0.75 0.25 220)',
                'cyber-purple': 'oklch(0.70 0.25 280)',
                'tech-gray': 'oklch(0.35 0.02 220)',
                'glow-green': 'oklch(0.90 0.35 145)',
                'surface-glass': 'oklch(0.12 0.02 220 / 0.85)',
                'text-high-contrast': 'oklch(0.98 0.01 180)',
                'text-medium-contrast': 'oklch(0.85 0.02 180)',
                'text-accent': 'oklch(0.85 0.30 145)',
                'shimmer': 'oklch(0.90 0.35 145)',
            },
            fontFamily: {
                'heading': ['Rajdhani', 'Exo 2', 'system-ui', 'sans-serif'],
                'body': ['Exo 2', 'Rajdhani', 'system-ui', 'sans-serif'],
                'mono': ['JetBrains Mono', 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'Courier New', 'monospace'],
            },
            animation: {
                'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',
                'shimmer': 'shimmer 3s linear infinite',
                'holographic': 'holographic 4s ease infinite',
                'particle-float': 'particle-float 6s ease-in-out infinite',
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': {
                        boxShadow: '0 0 20px oklch(var(--glow-green) / 0.3)',
                        transform: 'scale(1)'
                    },
                    '50%': {
                        boxShadow: '0 0 40px oklch(var(--glow-green) / 0.6)',
                        transform: 'scale(1.05)'
                    },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '300% 0' },
                    '100%': { backgroundPosition: '-300% 0' },
                },
                'holographic': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
                'particle-float': {
                    '0%, 100%': {
                        transform: 'translateY(0px) rotate(0deg)',
                        opacity: '0.3'
                    },
                    '50%': {
                        transform: 'translateY(-20px) rotate(180deg)',
                        opacity: '0.8'
                    },
                },
            },
            perspective: {
                '1000': '1000px',
            },
            backfaceVisibility: {
                'hidden': 'hidden',
            },
        },
    },
    darkMode: "class",
    plugins: [],
} satisfies Config;

export default config;
