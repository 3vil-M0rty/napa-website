// src/pages/HeroPage.jsx

import { useEffect, useRef, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import ScrollSection from '../components/ScrollSection'
import MobileStack from '../components/MobileStack'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useTexture } from '@react-three/drei'

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BarOrPub',
      '@id': 'https://napachapterone.com/#bar',
      name: 'NAPA Chapter One',
      description:
        'An intimate Art Deco wine and cocktail bar in Gueliz, Marrakech.',
      url: 'https://napachapterone.com',
    },
  ],
}

function HDRBackground() {
  const { scene, gl } = useThree()
  const isMobile = window.innerWidth < 768
  const tex = useTexture(isMobile ? '/images/a0.webp' : '/images/a1.webp')

  useEffect(() => {
    if (!tex) return

    tex.colorSpace = THREE.SRGBColorSpace
    tex.needsUpdate = true
    scene.background = tex

    const envTex = tex.clone()
    envTex.mapping = THREE.EquirectangularReflectionMapping
    envTex.colorSpace = THREE.SRGBColorSpace
    envTex.needsUpdate = true

    const pmrem = new THREE.PMREMGenerator(gl)
    pmrem.compileEquirectangularShader()
    scene.environment = pmrem.fromEquirectangular(envTex).texture

    pmrem.dispose()
    envTex.dispose()

    return () => {
      scene.background = null
      scene.environment = null
    }
  }, [tex, scene, gl])

  return null
}

function BottleModel({ scrollProgress }) {
  const model = useGLTF('/models/bottle.glb')
  const group = useRef()
  const labelRotY = useRef(0)

  useEffect(() => {
    let labelOffset = 0

    model.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = false

        const name = (child.name || '').toLowerCase()

        if (
          name.includes('label') ||
          name.includes('sticker') ||
          name.includes('paper') ||
          name.includes('decal')
        ) {
          const pos = child.getWorldPosition(new THREE.Vector3())
          labelOffset = Math.atan2(pos.x, pos.z)
        }
      }
    })

    labelRotY.current = -labelOffset
  }, [model])

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight
      const raw = window.scrollY / vh
      scrollProgress.current = Math.min(Math.max(raw, 0), 1)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scrollProgress])

  useFrame((state) => {
    if (!group.current) return

    const elapsed = state.clock.elapsedTime
    const sp = scrollProgress.current

    const floatY = Math.sin(elapsed * 0.65) * 0.22
    const rotY = Math.sin(elapsed * 0.4) * 0.08
    const rotZ = Math.sin(elapsed * 0.3) * 0.02

    group.current.position.y = -0.5 + floatY + sp * 0.5

    const targetZ = sp * 5
    group.current.position.z +=
      (targetZ - group.current.position.z) * 0.1

    group.current.rotation.x = 0
    group.current.rotation.y +=
      (rotY - group.current.rotation.y) * 0.05

    group.current.rotation.z +=
      (rotZ - group.current.rotation.z) * 0.05

    const targetScale = 1 + sp * 4

    group.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    )
  })

  return (
    <group ref={group}>
      <primitive object={model.scene} scale={18} position={[0, -1, 0]} />
    </group>
  )
}

function CursorLight() {
  const keyLight = useRef()

  useFrame((state) => {
    if (keyLight.current) {
      keyLight.current.position.x +=
        (state.mouse.x * 5 - keyLight.current.position.x) * 0.08

      keyLight.current.position.y +=
        (state.mouse.y * 4 + 2 - keyLight.current.position.y) * 0.08

      keyLight.current.position.z = 4
    }
  })

  return (
    <>
      <pointLight
        ref={keyLight}
        intensity={40}
        color="#ffe4b0"
        distance={18}
        decay={2}
      />

      <pointLight
        intensity={12}
        color="#8b6fff"
        distance={20}
        decay={2}
        position={[-3, 2, -6]}
      />
    </>
  )
}

function ResponsiveCamera() {
  const { camera, size } = useThree()

  useEffect(() => {
    camera.fov = size.width < 600 ? 65 : 50
    camera.updateProjectionMatrix()
  }, [camera, size.width])

  return null
}

function FilmGrain() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        pointerEvents: 'none',
        opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
        mixBlendMode: 'overlay',
      }}
    />
  )
}

function Vignette() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        background:
          'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(10,0,2,0.6) 100%)',
      }}
    />
  )
}

function HeroOverlay() {
  const { t } = useTranslation()

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 5,
        pointerEvents: 'none',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          color: '#fff',
          pointerEvents: 'auto',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(32px,5vw,72px)',
            marginBottom: '1rem',
          }}
        >
          {t('hero.title')}
        </h1>

        <Link to="/reserve">
          <button
            style={{
              padding: '12px 24px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Reserve
          </button>
        </Link>
      </motion.div>
    </div>
  )
}

export default function HeroPage() {
  const scrollProgress = useRef(0)
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'fr' ? 'fr' : 'en'

  return (
    <>
      <Helmet>
        <html lang={lang} />
        <title>{t('seo.title')}</title>

        <script type="application/ld+json">
          {JSON.stringify(STRUCTURED_DATA)}
        </script>
      </Helmet>

      <main id="main-content">
        <section
          aria-label={t('hero.sectionAriaLabel')}
          style={{
            width: '100vw',
            height: '100vh',
            position: 'relative',
            overflow: 'hidden',

            isolation: 'isolate',
            contain: 'layout paint size',
          }}
        >
          <Canvas
            shadows
            camera={{ position: [0, 1.5, 20], fov: 50 }}
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.1,
            }}
            dpr={[1, Math.min(window.devicePixelRatio, 2)]}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,

              pointerEvents: 'none',
              touchAction: 'none',
            }}
            aria-hidden="true"
          >
            <Suspense fallback={null}>
              <HDRBackground />

              <ResponsiveCamera />

              <ambientLight intensity={0.3} color="#ffccd5" />

              <directionalLight
                position={[3, 14, 8]}
                intensity={3.5}
                color="#fff5e0"
              />

              <directionalLight
                position={[5, 2, 4]}
                intensity={0.8}
                color="#ffb870"
              />

              <directionalLight
                position={[-5, 6, -8]}
                intensity={1.4}
                color="#7baeff"
              />

              <CursorLight />

              <BottleModel scrollProgress={scrollProgress} />
            </Suspense>
          </Canvas>

          <Vignette />

          <FilmGrain />

          <HeroOverlay />
        </section>

        <MobileStack />

        <ScrollSection />
      </main>
    </>
  )
}