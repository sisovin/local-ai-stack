import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

// TypeScript interfaces for animation configurations
interface AnimationConfig {
    x?: number
    y?: number
    scale?: number
    opacity?: number
    duration?: number
    ease?: string
    delay?: number
    repeat?: number
    yoyo?: boolean
    stagger?: number
    yPercent?: number
    rotationY?: number
    boxShadow?: string
    width?: string | number
}

interface ScrollTriggerConfig {
    trigger?: string | Element
    start?: string
    end?: string
    scrub?: boolean
    toggleActions?: string
    pin?: boolean
    pinSpacing?: boolean
}

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

// Animation presets for consistent motion design
export const animations = {
    // Entrance animations
    fadeInUp: {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    },

    fadeInLeft: {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    },

    fadeInRight: {
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    },

    scaleIn: {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
    },

    // Hover animations
    hoverScale: {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
    },

    hoverGlow: {
        boxShadow: "0 0 30px rgba(133, 255, 144, 0.5)",
        duration: 0.3,
        ease: "power2.out"
    },

    // Loading animations
    pulse: {
        scale: 1.1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
    },

    // Page transitions
    pageExit: {
        y: -50,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in"
    },

    pageEnter: {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out"
    }
}

// Utility functions for common animations
export const animationUtils = {
    // Animate elements on scroll
    animateOnScroll: (selector: string, animation: AnimationConfig, triggerOptions?: ScrollTriggerConfig) => {
        if (typeof window === 'undefined') return

        const elements = document.querySelectorAll(selector)

        elements.forEach((element) => {
            gsap.fromTo(element, animation, {
                ...animation,
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse",
                    ...triggerOptions
                }
            })
        })
    },

    // Stagger animation for multiple elements
    staggerAnimation: (selector: string, animation: AnimationConfig, stagger: number = 0.1) => {
        if (typeof window === 'undefined') return

        gsap.fromTo(selector, animation, {
            ...animation,
            stagger: stagger
        })
    },

    // Parallax effect
    parallax: (selector: string, speed: number = 0.5) => {
        if (typeof window === 'undefined') return

        gsap.to(selector, {
            yPercent: -50 * speed,
            ease: "none",
            scrollTrigger: {
                trigger: selector,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        })
    },

    // Theme transition animation
    themeTransition: (callback: () => void) => {
        const tl = gsap.timeline()

        // Fade out
        tl.to("body", {
            opacity: 0.7,
            duration: 0.15,
            ease: "power2.inOut"
        })

        // Change theme
        tl.call(callback)

        // Fade in
        tl.to("body", {
            opacity: 1,
            duration: 0.15,
            ease: "power2.inOut"
        })

        return tl
    },

    // Card flip animation
    cardFlip: (element: Element, frontSelector: string, backSelector: string) => {
        const front = element.querySelector(frontSelector)
        const back = element.querySelector(backSelector)

        if (!front || !back) return

        const tl = gsap.timeline({ paused: true })

        tl.to(front, {
            rotationY: 90,
            duration: 0.3,
            ease: "power2.in"
        })
            .set(front, { display: "none" })
            .set(back, { display: "block", rotationY: -90 })
            .to(back, {
                rotationY: 0,
                duration: 0.3,
                ease: "power2.out"
            })

        return tl
    },

    // Magnetic cursor effect
    magneticEffect: (selector: string, strength: number = 0.3) => {
        if (typeof window === 'undefined') return

        const elements = document.querySelectorAll(selector)

        elements.forEach((element) => {
            const rect = element.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            element.addEventListener('mousemove', (e: Event) => {
                const mouseEvent = e as MouseEvent
                const deltaX = (mouseEvent.clientX - centerX) * strength
                const deltaY = (mouseEvent.clientY - centerY) * strength

                gsap.to(element, {
                    x: deltaX,
                    y: deltaY,
                    duration: 0.3,
                    ease: "power2.out"
                })
            })

            element.addEventListener('mouseleave', () => {
                gsap.to(element, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.3)"
                })
            })
        })
    },

    // Text animation utilities
    typewriter: (selector: string, speed: number = 0.05) => {
        if (typeof window === 'undefined') return

        const elements = document.querySelectorAll(selector)

        elements.forEach((element) => {
            const text = element.textContent || ''
            element.textContent = ''

            gsap.fromTo(element,
                { width: 0 },
                {
                    width: "auto",
                    duration: text.length * speed,
                    ease: "none",
                    onUpdate: function () {
                        const progress = this.progress()
                        const currentLength = Math.floor(text.length * progress)
                        element.textContent = text.substring(0, currentLength)
                    }
                }
            )
        })
    },

    // Cleanup function
    cleanup: () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        gsap.killTweensOf("*")
    }
}

// React hook for GSAP animations
export const useGSAPAnimation = (callback: () => void, dependencies: any[] = []) => {
    const ref = useRef<HTMLElement>(null)

    useEffect(() => {
        if (ref.current) {
            callback()
        }

        return () => {
            animationUtils.cleanup()
        }
    }, dependencies)

    return ref
}

export default animations
