import React from 'react'

interface IconProps {
    className?: string
    size?: number
    color?: string
}

// Optimized SVG icons for better performance
export const OptimizedIcons = {
    // Loading spinner
    Spinner: ({ className = "", size = 24, color = "currentColor" }: IconProps) => (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="12"
                cy="12"
                r="10"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="32"
                strokeDashoffset="32"
            >
                <animate
                    attributeName="stroke-dasharray"
                    dur="2s"
                    values="0 32;16 16;0 32;0 32"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="stroke-dashoffset"
                    dur="2s"
                    values="0;-16;-32;-32"
                    repeatCount="indefinite"
                />
            </circle>
        </svg>
    ),

    // Cyber grid background
    CyberGrid: ({ className = "", size = 24 }: IconProps) => (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                </pattern>
                <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--neon-green)" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="var(--electric-blue)" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="var(--cyber-purple)" stopOpacity="0.1" />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#gridGradient)" />
        </svg>
    ),

    // Neural network pattern
    NeuralNetwork: ({ className = "", size = 24 }: IconProps) => (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <radialGradient id="nodeGradient">
                    <stop offset="0%" stopColor="var(--neon-green)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="var(--neon-green)" stopOpacity="0.2" />
                </radialGradient>
            </defs>

            {/* Connections */}
            <g stroke="var(--electric-blue)" strokeWidth="1" opacity="0.4">
                <line x1="50" y1="50" x2="150" y2="75">
                    <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
                </line>
                <line x1="50" y1="50" x2="150" y2="125">
                    <animate attributeName="stroke-opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
                </line>
                <line x1="75" y1="100" x2="150" y2="75">
                    <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite" />
                </line>
                <line x1="75" y1="100" x2="150" y2="125">
                    <animate attributeName="stroke-opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                </line>
            </g>

            {/* Nodes */}
            <g fill="url(#nodeGradient)">
                <circle cx="50" cy="50" r="5">
                    <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="75" cy="100" r="5">
                    <animate attributeName="r" values="6;4;6" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="150" cy="75" r="5">
                    <animate attributeName="r" values="4;6;4" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="150" cy="125" r="5">
                    <animate attributeName="r" values="6;4;6" dur="3s" repeatCount="indefinite" />
                </circle>
            </g>
        </svg>
    ),

    // Holographic effect
    Hologram: ({ className = "", size = 24 }: IconProps) => (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--neon-green)">
                        <animate attributeName="stop-color"
                            values="var(--neon-green);var(--electric-blue);var(--cyber-purple);var(--neon-green)"
                            dur="4s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="50%" stopColor="var(--electric-blue)">
                        <animate attributeName="stop-color"
                            values="var(--electric-blue);var(--cyber-purple);var(--neon-green);var(--electric-blue)"
                            dur="4s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor="var(--cyber-purple)">
                        <animate attributeName="stop-color"
                            values="var(--cyber-purple);var(--neon-green);var(--electric-blue);var(--cyber-purple)"
                            dur="4s" repeatCount="indefinite" />
                    </stop>
                </linearGradient>
            </defs>

            <rect width="100%" height="100%" fill="url(#holoGradient)" opacity="0.3">
                <animate attributeName="opacity" values="0.1;0.5;0.1" dur="2s" repeatCount="indefinite" />
            </rect>

            <g stroke="url(#holoGradient)" strokeWidth="2" fill="none">
                <rect x="10" y="10" width="80" height="80" rx="5">
                    <animate attributeName="stroke-dasharray" values="0 320;160 160;0 320" dur="3s" repeatCount="indefinite" />
                </rect>
            </g>
        </svg>
    ),

    // Data flow
    DataFlow: ({ className = "", size = 24 }: IconProps) => (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 200 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--neon-green)" stopOpacity="0" />
                    <stop offset="50%" stopColor="var(--electric-blue)" stopOpacity="1" />
                    <stop offset="100%" stopColor="var(--cyber-purple)" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Flow lines */}
            <g stroke="url(#flowGradient)" strokeWidth="2" fill="none">
                <path d="M0,30 Q50,10 100,30 T200,30">
                    <animate attributeName="stroke-dasharray" values="0 400;200 200;0 400" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="stroke-dashoffset" values="0;-200;-400" dur="3s" repeatCount="indefinite" />
                </path>
                <path d="M0,50 Q50,70 100,50 T200,50">
                    <animate attributeName="stroke-dasharray" values="200 200;0 400;200 200" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="stroke-dashoffset" values="0;-200;-400" dur="3s" repeatCount="indefinite" />
                </path>
                <path d="M0,70 Q50,50 100,70 T200,70">
                    <animate attributeName="stroke-dasharray" values="0 400;200 200;0 400" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="stroke-dashoffset" values="0;-200;-400" dur="3s" repeatCount="indefinite" />
                </path>
            </g>
        </svg>
    )
}

// Background patterns for sections
export const BackgroundPatterns = {
    CyberGrid: () => (
        <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="cyber-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="var(--neon-green)" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cyber-grid)" />
            </svg>
        </div>
    ),

    NeuralMesh: () => (
        <div className="absolute inset-0 opacity-20">
            <OptimizedIcons.NeuralNetwork className="w-full h-full" />
        </div>
    ),

    HolographicOverlay: () => (
        <div className="absolute inset-0 opacity-30">
            <OptimizedIcons.Hologram className="w-full h-full" />
        </div>
    )
}

export default OptimizedIcons
