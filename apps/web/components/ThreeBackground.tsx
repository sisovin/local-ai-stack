"use client"

import { useEffect, useRef, useMemo } from 'react'
import * as THREE from 'three'

interface ThreeBackgroundProps {
    className?: string
    particleCount?: number
    enableInteraction?: boolean
}

export function ThreeBackground({
    className = "",
    particleCount = 200,
    enableInteraction = true
}: ThreeBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const sceneRef = useRef<THREE.Scene | null>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const animationIdRef = useRef<number | null>(null)

    const particlesData = useMemo(() => {
        const data = []
        for (let i = 0; i < particleCount; i++) {
            data.push({
                x: (Math.random() - 0.5) * 50,
                y: (Math.random() - 0.5) * 50,
                z: (Math.random() - 0.5) * 50,
                vx: (Math.random() - 0.5) * 0.02,
                vy: (Math.random() - 0.5) * 0.02,
                vz: (Math.random() - 0.5) * 0.02,
                rotationSpeed: Math.random() * 0.02,
                scale: Math.random() * 0.5 + 0.5
            })
        }
        return data
    }, [particleCount])

    useEffect(() => {
        if (!containerRef.current) return

        // Scene setup
        const scene = new THREE.Scene()
        sceneRef.current = scene

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        camera.position.z = 30

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        })
        rendererRef.current = renderer
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x000000, 0)
        containerRef.current.appendChild(renderer.domElement)

        // Geometric shapes
        const geometries = [
            new THREE.TetrahedronGeometry(0.5),
            new THREE.OctahedronGeometry(0.5),
            new THREE.IcosahedronGeometry(0.5),
            new THREE.BoxGeometry(0.8, 0.8, 0.8),
            new THREE.ConeGeometry(0.5, 1, 6),
        ]

        // Materials with futuristic colors
        const materials = [
            new THREE.MeshBasicMaterial({
                color: 0x00ff96,
                wireframe: true,
                transparent: true,
                opacity: 0.6
            }),
            new THREE.MeshBasicMaterial({
                color: 0x0096ff,
                wireframe: true,
                transparent: true,
                opacity: 0.6
            }),
            new THREE.MeshBasicMaterial({
                color: 0x9600ff,
                wireframe: true,
                transparent: true,
                opacity: 0.6
            }),
            new THREE.MeshBasicMaterial({
                color: 0xff0096,
                wireframe: true,
                transparent: true,
                opacity: 0.4
            }),
        ]

        // Create floating particles
        const particles: THREE.Mesh[] = []

        particlesData.forEach((data, i) => {
            const geometry = geometries[i % geometries.length]
            const material = materials[i % materials.length]

            if (!geometry || !material) return

            const clonedMaterial = material.clone()
            const mesh = new THREE.Mesh(geometry, clonedMaterial)
            mesh.position.set(data.x, data.y, data.z)
            mesh.scale.setScalar(data.scale)

            scene.add(mesh)
            particles.push(mesh)
        })

        // Background ambient lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
        scene.add(ambientLight)

        // Directional light for subtle illumination
        const directionalLight = new THREE.DirectionalLight(0x00ff96, 0.6)
        directionalLight.position.set(10, 10, 5)
        scene.add(directionalLight)

        // Mouse interaction
        let mouseX = 0
        let mouseY = 0
        let targetRotationX = 0
        let targetRotationY = 0

        const handleMouseMove = (event: MouseEvent) => {
            if (!enableInteraction) return

            mouseX = (event.clientX / window.innerWidth) * 2 - 1
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1

            targetRotationX = mouseY * 0.1
            targetRotationY = mouseX * 0.1
        }

        if (enableInteraction) {
            window.addEventListener('mousemove', handleMouseMove)
        }

        // Animation loop
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate)

            // Animate particles
            particles.forEach((particle, i) => {
                const data = particlesData[i]

                if (!data) return

                // Move particles
                particle.position.x += data.vx
                particle.position.y += data.vy
                particle.position.z += data.vz

                // Bounce off boundaries
                if (particle.position.x > 25 || particle.position.x < -25) data.vx *= -1
                if (particle.position.y > 25 || particle.position.y < -25) data.vy *= -1
                if (particle.position.z > 25 || particle.position.z < -25) data.vz *= -1

                // Rotate particles
                particle.rotation.x += data.rotationSpeed
                particle.rotation.y += data.rotationSpeed * 0.7
                particle.rotation.z += data.rotationSpeed * 0.5

                // Pulse effect
                const pulse = Math.sin(Date.now() * 0.001 + i * 0.1) * 0.1 + 1
                particle.scale.setScalar(data.scale * pulse)

                // Color shift
                const time = Date.now() * 0.001
                const material = particle.material as THREE.MeshBasicMaterial
                const hue = (time * 0.1 + i * 0.1) % 1
                material.color.setHSL(hue, 0.8, 0.6)
            })

            // Mouse interaction rotation
            if (enableInteraction) {
                scene.rotation.x += (targetRotationX - scene.rotation.x) * 0.02
                scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.02
            }

            // Auto rotation
            scene.rotation.y += 0.001
            scene.rotation.x += 0.0005

            renderer.render(scene, camera)
        }

        animate()

        // Handle resize
        const handleResize = () => {
            if (!containerRef.current) return

            const width = containerRef.current.clientWidth
            const height = containerRef.current.clientHeight

            camera.aspect = width / height
            camera.updateProjectionMatrix()
            renderer.setSize(width, height)
        }

        window.addEventListener('resize', handleResize)
        handleResize()

        // Cleanup
        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current)
            }

            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('resize', handleResize)

            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement)
            }

            // Dispose of Three.js resources
            geometries.forEach(geometry => geometry.dispose())
            materials.forEach(material => material.dispose())
            particles.forEach(particle => {
                scene.remove(particle)
                if (particle.geometry) particle.geometry.dispose()
                if (particle.material) {
                    if (Array.isArray(particle.material)) {
                        particle.material.forEach(mat => mat.dispose())
                    } else {
                        particle.material.dispose()
                    }
                }
            })

            renderer.dispose()
        }
    }, [particlesData, enableInteraction])

    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 pointer-events-none z-0 overflow-hidden bg-transparent ${className}`}
        />
    )
}

export default ThreeBackground
