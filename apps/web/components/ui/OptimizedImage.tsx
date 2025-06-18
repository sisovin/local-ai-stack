import React from 'react'
import Image from 'next/image'

interface OptimizedImageProps {
    src: string
    alt: string
    width?: number
    height?: number
    className?: string
    priority?: boolean
    fill?: boolean
    sizes?: string
    quality?: number
    placeholder?: 'blur' | 'empty'
    blurDataURL?: string
}

// Utility to generate blur placeholder
const generateBlurDataURL = (width: number = 10, height: number = 10) => {
    return `data:image/svg+xml;base64,${Buffer.from(
        `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:oklch(0.12 0.02 220);stop-opacity:1" />
          <stop offset="100%" style="stop-color:oklch(0.08 0.02 220);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
    </svg>`
    ).toString('base64')}`
}

export function OptimizedImage({
    src,
    alt,
    width,
    height,
    className = "",
    priority = false,
    fill = false,
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    quality = 85,
    placeholder = 'blur',
    blurDataURL,
    ...props
}: OptimizedImageProps) {
    // Convert src to WebP if it's not already
    const optimizedSrc = src.includes('.webp') ? src : src.replace(/\.(jpg|jpeg|png)$/i, '.webp')

    // Generate blur placeholder if not provided
    const defaultBlurDataURL = blurDataURL || generateBlurDataURL(width, height)

    return (
        <Image
            src={optimizedSrc}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            className={`transition-all duration-300 ${className}`}
            priority={priority}
            sizes={sizes}
            quality={quality}
            placeholder={placeholder}
            blurDataURL={placeholder === 'blur' ? defaultBlurDataURL : undefined}
            {...props}
        />
    )
}

// Avatar component with optimized loading
export function Avatar({
    src,
    alt,
    size = 40,
    className = "",
    priority = false
}: {
    src: string
    alt: string
    size?: number
    className?: string
    priority?: boolean
}) {
    return (
        <div className={`relative overflow-hidden rounded-full ${className}`} style={{ width: size, height: size }}>
            <OptimizedImage
                src={src}
                alt={alt}
                width={size}
                height={size}
                className="object-cover"
                priority={priority}
                sizes={`${size}px`}
            />
        </div>
    )
}

// Hero image component with multiple formats
export function HeroImage({
    src,
    alt,
    className = "",
    priority = true
}: {
    src: string
    alt: string
    className?: string
    priority?: boolean
}) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <OptimizedImage
                src={src}
                alt={alt}
                fill
                className="object-cover"
                priority={priority}
                sizes="100vw"
                quality={90}
            />

            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        </div>
    )
}

// Logo component with SVG fallback
export function Logo({
    size = 40,
    className = "",
    variant = 'default'
}: {
    size?: number
    className?: string
    variant?: 'default' | 'light' | 'dark'
}) {
    const logoSrc = variant === 'light' ? '/logo-light.svg' :
        variant === 'dark' ? '/logo-dark.svg' :
            '/logo.svg'

    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-all duration-300"
            >
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--neon-green)" />
                        <stop offset="50%" stopColor="var(--electric-blue)" />
                        <stop offset="100%" stopColor="var(--cyber-purple)" />
                    </linearGradient>
                </defs>

                {/* Futuristic P logo */}
                <g fill="url(#logoGradient)">
                    <path d="M20 20 L20 80 L30 80 L30 55 L55 55 Q70 55 70 40 Q70 25 55 25 L20 25 Z" />
                    <path d="M30 35 L50 35 Q60 35 60 40 Q60 45 50 45 L30 45 Z" />

                    {/* Circuit pattern */}
                    <circle cx="75" cy="25" r="3" opacity="0.8">
                        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="85" cy="35" r="2" opacity="0.6">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="75" cy="45" r="2" opacity="0.4">
                        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="1s" repeatCount="indefinite" />
                    </circle>

                    {/* Connecting lines */}
                    <line x1="78" y1="25" x2="82" y2="35" stroke="url(#logoGradient)" strokeWidth="1" opacity="0.5" />
                    <line x1="78" y1="45" x2="82" y2="35" stroke="url(#logoGradient)" strokeWidth="1" opacity="0.5" />
                </g>
            </svg>
        </div>
    )
}

// Image gallery with lazy loading
export function ImageGallery({
    images,
    columns = 3,
    gap = 4,
    className = ""
}: {
    images: Array<{ src: string; alt: string; caption?: string }>
    columns?: number
    gap?: number
    className?: string
}) {
    return (
        <div
            className={`grid gap-${gap} ${className}`}
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
            {images.map((image, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg">
                    <OptimizedImage
                        src={image.src}
                        alt={image.alt}
                        width={400}
                        height={300}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes={`(max-width: 768px) 100vw, (max-width: 1200px) ${100 / columns}vw, ${100 / columns}vw`}
                    />

                    {image.caption && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <p className="text-white text-sm">{image.caption}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default OptimizedImage
