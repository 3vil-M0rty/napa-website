// src/pages/HeroPage.jsx

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

import gsap from 'gsap'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'

import ImageZoomSection from '../components/ImageZoomSection'

/* =======================
   CURSOR STYLE
======================= */
const CURSOR_STYLE = `
  *, *::before, *::after {
    cursor: none !important;
  }

  .cursor-dot {
    position: fixed;
    top: 0;
    left: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fff;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    mix-blend-mode: difference;
    transition: width .2s ease, height .2s ease, background .2s ease;
  }

  .cursor-dot.active {
    width: 20px;
    height: 20px;
  }

  .cursor-dot.model-hover {
    width: 32px;
    height: 32px;
    background: #ff4fa3;
  }

  .cursor-ring {
    position: fixed;
    top: 0;
    left: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.6);
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    mix-blend-mode: difference;
  }
`

/* =======================
   CURSOR
======================= */
function CursorDot({ isModelHovered }) {
    const dotRef = useRef()
    const ringRef = useRef()

    const [isClickable, setIsClickable] = useState(false)
    const [isTouch, setIsTouch] = useState(false)

    useEffect(() => {
        const style = document.createElement('style')
        style.innerHTML = CURSOR_STYLE
        document.head.appendChild(style)

        const touch =
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0

        setIsTouch(touch)

        const dot = dotRef.current
        const ring = ringRef.current

        const onMove = (e) => {
            gsap.set(dot, {
                x: e.clientX,
                y: e.clientY,
            })

            gsap.to(ring, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.15,
                ease: 'power2.out',
            })

            const clickable = e.target.closest(
                'a, button, input, [role="button"], .clickable'
            )

            setIsClickable(!!clickable)
        }

        window.addEventListener('mousemove', onMove)

        return () => {
            window.removeEventListener('mousemove', onMove)
            document.head.removeChild(style)
        }
    }, [])

    if (isTouch) return null

    return (
        <>
            <div
                ref={dotRef}
                className={
                    isModelHovered
                        ? 'cursor-dot model-hover'
                        : isClickable
                            ? 'cursor-dot active'
                            : 'cursor-dot'
                }
            />
            <div ref={ringRef} className="cursor-ring" />
        </>
    )
}

/* =======================
   3D ROOM (THE BOX YOU ARE INSIDE)
======================= */
function Room() {
    return (
        <group>
            {/* floor */}
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#d44040" roughness={1} />
            </mesh>

            {/* back wall */}
            <mesh receiveShadow position={[0, 3, -6]}>
                <planeGeometry args={[20, 12]} />
                <meshStandardMaterial color="#ff6d6d" roughness={1} />
            </mesh>

            {/* left wall */}
            <mesh receiveShadow rotation={[0, Math.PI / 2, 0]} position={[-10, 3, 0]}>
                <planeGeometry args={[12, 20]} />
                <meshStandardMaterial color="#ff6d6d" roughness={1} />
            </mesh>

            {/* right wall */}
            <mesh receiveShadow rotation={[0, -Math.PI / 2, 0]} position={[10, 3, 0]}>
                <planeGeometry args={[12, 20]} />
                <meshStandardMaterial color="#ff6d6d" roughness={1} />
            </mesh>

            {/* ceiling */}
            <mesh receiveShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#ff6d6d" roughness={1} />
            </mesh>
        </group>
    )
}

/* =======================
   MODEL
======================= */
function RestaurantModel({ setModelHover }) {
    const model = useGLTF('/models/restaurant.glb')
    const group = useRef()

    const { camera, gl } = useThree()

    const raycaster = useRef(new THREE.Raycaster())
    const mouse = useRef(new THREE.Vector2())

    useEffect(() => {
        model.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }, [model])

    useFrame((state) => {
        if (!group.current) return

        const t = state.clock.elapsedTime

        // floating
        const floatY = Math.sin(t * 1.2) * 0.15
        const floatX = Math.sin(t * 0.8) * 0.05
        const floatZ = Math.cos(t * 0.6) * 0.05

        // mouse rotation
        const targetRotY = state.mouse.x * 0.6
        const targetRotX = state.mouse.y * 0.2

        group.current.rotation.y += (targetRotY - group.current.rotation.y) * 0.08
        group.current.rotation.x += (targetRotX - group.current.rotation.x) * 0.08

        group.current.position.y = -0.5 + floatY
        group.current.position.x = floatX
        group.current.position.z = floatZ
    })

    useEffect(() => {
        const onMove = (e) => {
            const rect = gl.domElement.getBoundingClientRect()

            mouse.current.x =
                ((e.clientX - rect.left) / rect.width) * 2 - 1
            mouse.current.y =
                -((e.clientY - rect.top) / rect.height) * 2 + 1

            raycaster.current.setFromCamera(mouse.current, camera)

            const intersects = raycaster.current.intersectObject(model.scene, true)

            setModelHover(intersects.length > 0)
        }

        gl.domElement.addEventListener('mousemove', onMove)

        return () => gl.domElement.removeEventListener('mousemove', onMove)
    }, [camera, gl, model, setModelHover])

    return (
        <group ref={group}>
            <primitive object={model.scene} scale={1.5} position={[0, -1, 0]} />
        </group>
    )
}

/* =======================
   CURSOR LIGHT
======================= */
function CursorLight() {
    const light = useRef()

    useFrame((state) => {
        if (!light.current) return

        light.current.position.x = state.mouse.x * 5
        light.current.position.y = state.mouse.y * 5 + 1
        light.current.position.z = 2
    })

    return (
        <spotLight
            ref={light}
            intensity={350}
            angle={0.5}
            color="#ff4fa3"
            penumbra={1}
            distance={40}
            decay={2}
            castShadow
        />
    )
}

/* =======================
   PAGE
======================= */
export default function HeroPage() {
    const { t } = useTranslation()
    const heroRef = useRef()

    const [isModelHovered, setModelHover] = useState(false)

    return (
        <>
            <CursorDot isModelHovered={isModelHovered} />

            <div
                style={{
                    background:
                        'linear-gradient(180deg, #ff6d6d 0%, #ffc0c0 50%, #ffffff 100%)',
                    color: '#fff',
                }}
            >
                <div
                    ref={heroRef}
                    style={{
                        height: '100vh',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* 3D SCENE */}
                    <div style={{ position: 'absolute', inset: 0 }}>
                        <Canvas
                            shadows
                            camera={{ position: [0, 1.5, 6], fov: 50 }}
                        >
                            <ambientLight intensity={0.7} />

                            <directionalLight
                                position={[3, 8, 3]}
                                intensity={2.5}
                                castShadow
                                shadow-mapSize-width={2048}
                                shadow-mapSize-height={2048}
                            />

                            <Environment preset="city" />

                            <Room />

                            <RestaurantModel setModelHover={setModelHover} />

                            <CursorLight />

                            <OrbitControls
                                enableZoom={false}
                                enableRotate={false}
                                enablePan={false}
                            />
                        </Canvas>
                    </div>

                    {/* TEXT */}
                    <div
                        style={{
                            position: 'relative',
                            zIndex: 2,
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            pointerEvents: 'none',
                        }}
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            style={{
                                fontSize: '4rem',
                                fontWeight: 700,
                                textShadow: '0 10px 40px rgba(0,0,0,0.5)',
                            }}
                        >
                            {t('hero.title') || 'Luxury Experience'}
                        </motion.h1>
                    </div>
                </div>
            </div>

            <div className="imageScroll">
                <ImageZoomSection />
                <footer className="footerScroll" />
            </div>
        </>
    )
}