"use client"

import React, { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useGSAPAnimation, animationUtils, animations } from '@/lib/animations/gsap-utils'

export function GSAPExample() {
    // Example usage of the GSAP hook
    const cardRef = useGSAPAnimation(() => {
        // Initialize animations when component mounts
        animationUtils.animateOnScroll('.gsap-fade-in', animations.fadeInUp)
        animationUtils.animateOnScroll('.gsap-scale-in', animations.scaleIn, { start: "top 70%" })
        animationUtils.magneticEffect('.magnetic-button', 0.2)
    }, [])

    return (
        <div className="space-y-8 p-8">
            <h2 className="text-2xl font-bold text-center mb-8">GSAP Animation Examples</h2>

            {/* Fade in animation */}
            <Card className="gsap-fade-in glass-card">
                <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-neon-green">Fade In Up Animation</h3>
                    <p className="text-medium-contrast">
                        This card animates with a fade-in-up effect when it enters the viewport.
                    </p>
                </CardContent>
            </Card>

            {/* Scale in animation */}
            <Card className="gsap-scale-in glass-card">
                <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-electric-blue">Scale In Animation</h3>
                    <p className="text-medium-contrast">
                        This card scales in with a bounce effect when scrolling.
                    </p>
                </CardContent>
            </Card>

            {/* Magnetic button */}
            <div className="text-center">
                <Button className="magnetic-button bg-neon-green hover:bg-neon-green/90 text-black font-bold px-8 py-4">
                    Magnetic Button Effect
                </Button>
            </div>

            {/* Multiple cards for stagger effect */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="gsap-fade-in glass-card" style={{ '--stagger-delay': `${i * 0.1}s` } as React.CSSProperties}>
                        <CardContent className="p-4">
                            <h4 className="font-semibold text-cyber-purple">Card {i}</h4>
                            <p className="text-sm text-medium-contrast">Staggered animation</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default GSAPExample
