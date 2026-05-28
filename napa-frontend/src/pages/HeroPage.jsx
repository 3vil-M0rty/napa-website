// src/pages/HeroPage.jsx
// NAPA Chapter One — Hero Page
// Fully responsive + all text via i18n (EN/FR)

import { useEffect, useRef, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import ScrollSection from '../components/ScrollSection'
import MobileStack from '../components/MobileStack'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useEnvironment } from '@react-three/drei'

/* =======================
   JSON-LD STRUCTURED DATA
======================= */
const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WineryOrVinyard',
      '@id': 'https://napachapterone.com/#winery',
      name: 'NAPA Chapter One',
      description: 'A single-vine, single-vintage Burgundy estate wine. Chapter One — First Release, Lot 001/320. Produced in Bourgogne, France.',
      url: 'https://napachapterone.com',
      logo: 'https://napachapterone.com/napaco.svg',
      address: { '@type': 'PostalAddress', addressRegion: 'Bourgogne', addressCountry: 'FR', addressLocality: 'Burgundy' },
      geo: { '@type': 'GeoCoordinates', latitude: '47.0333', longitude: '4.8333' },
      offers: {
        '@type': 'Offer',
        name: 'Reserve a Tasting — NAPA Chapter One',
        url: 'https://napachapterone.com/reserve',
        availability: 'https://schema.org/LimitedAvailability',
        description: 'Exclusive tasting experiences at the estate. Limited to 320 bottles — First Release.',
      },
    },
    {
      '@type': 'Product',
      name: 'NAPA Chapter One — MMXXIV First Release',
      description: 'Single-vine, single-vintage Burgundy wine. Lot 001/320. Bourgogne Appellation. Harvested and bottled at 47°02N · 4°50E.',
      brand: { '@type': 'Brand', name: 'NAPA Chapter One' },
      releaseDate: '2024',
      offers: { '@type': 'Offer', url: 'https://napachapterone.com/reserve', availability: 'https://schema.org/LimitedAvailability' },
    },
  ],
}

/* =======================
   HDR BACKGROUND
======================= */
const HDR_ROTATION_OFFSET = 0
const MOUSE_PARALLAX = 0.06

function HDRBackground() {
  const { scene } = useThree()
  const hdr = useEnvironment({ files: '/scene.hdr' })
  const sphereRef = useRef()

  useEffect(() => {
    if (!hdr) return
    scene.environment = hdr
    return () => { scene.environment = null }
  }, [hdr, scene])

  useFrame((state) => {
    if (!sphereRef.current) return
    const targetY = HDR_ROTATION_OFFSET + state.mouse.x * MOUSE_PARALLAX
    const targetX = state.mouse.y * MOUSE_PARALLAX * 0.4
    sphereRef.current.rotation.y += (targetY - sphereRef.current.rotation.y) * 0.04
    sphereRef.current.rotation.x += (targetX - sphereRef.current.rotation.x) * 0.04
  })

  if (!hdr) return null
  return (
    <mesh ref={sphereRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[400, 60, 40]} />
      <meshBasicMaterial map={hdr} side={THREE.BackSide} />
    </mesh>
  )
}

/* =======================
   BLOB SHADOW
======================= */
/* function BlobShadow({ scrollProgress }) {
  const meshRef = useRef()
  const texture = useRef((() => {
    const size = 30
    const c = document.createElement('canvas')
    c.width = size; c.height = size
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, 'rgba(10, 0, 2, 0.95)')
    g.addColorStop(0.5, 'rgba(10, 0, 2, 0.55)')
    g.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  })())

  useFrame(() => {
    if (!meshRef.current) return
    const s = 1 + scrollProgress.current * 0.35
    meshRef.current.scale.set(s * 2.2, s * 2.2, 1)
    meshRef.current.material.opacity = 0.82 * (1 - scrollProgress.current * 0.4)
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.08, 0]}>
      <planeGeometry args={[3, 3]} />
      <meshBasicMaterial map={texture.current} transparent depthWrite={false} opacity={0.82} />
    </mesh>
  )
}
 */
/* =======================
   BOTTLE MODEL
======================= */
function BottleModel({ scrollProgress }) {
  const model = useGLTF('/models/bottle.glb')
  const group = useRef()
  const isVisible = useRef(true)
  const frozenRotY = useRef(0)
  const frozenRotX = useRef(0)
  const labelRotY = useRef(0)
  const isTouch = useRef('ontouchstart' in window || navigator.maxTouchPoints > 0)

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
          name.includes('decal') ||
          name.includes('etiquette')
        ) {
          const pos = child.getWorldPosition(new THREE.Vector3())
          labelOffset = Math.atan2(pos.x, pos.z)
          console.log('[NAPA] Label mesh found:', child.name, 'rotY offset', labelOffset.toFixed(3))
        }
      }
    })
    labelRotY.current = -labelOffset
  }, [model])

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      scrollProgress.current = Math.min(Math.max(window.scrollY / maxScroll, 0), 1)
      isVisible.current = window.scrollY < window.innerHeight * 0.9
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollProgress])

  // Replace the entire useFrame callback inside BottleModel with this.
  // Changes for mobile/touch:
  //   - No rotation at all
  //   - Dramatic slow float: larger amplitude, slower sine, gentle side sway

  useFrame((state) => {
    if (!group.current) return
    const elapsed = state.clock.elapsedTime
    const sp = scrollProgress.current

    if (isTouch.current) {
      // Mobile: dramatic float, zero rotation
      const floatY = Math.sin(elapsed * 0.5) * 2.22          // slow, big vertical bob
      const swayX = Math.sin(elapsed * 0.31 + 1.2) * 0.06   // very subtle side drift
      const breathe = Math.sin(elapsed * 0.7 + 0.5) * 0.03    // tiny z breathe

      group.current.position.x += (swayX - group.current.position.x) * 0.03
      group.current.position.y = -0.5 + floatY + sp * 0.6
      group.current.position.z += (breathe - group.current.position.z) * 0.03

      // Lock rotation completely
      group.current.rotation.x = 0
      group.current.rotation.y = 0
      group.current.rotation.z = 0

    } else {
      // Desktop: original behaviour
      const bobAmp = 0.09 * (1 - sp * 0.8)
      const baseY = -0.5 + Math.sin(elapsed * 0.9) * bobAmp
      group.current.position.y = baseY + sp * 0.6

      if (sp < 0.5) {
        if (isVisible.current) {
          const targetY = state.mouse.x * Math.PI * 0.18
          const targetX = -state.mouse.y * Math.PI * 0.08
          group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05
          group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05
          frozenRotY.current = group.current.rotation.y
          frozenRotX.current = group.current.rotation.x
        }
      } else {
        const t2 = (sp - 0.5) / 0.5
        const ease = t2 * t2 * (3 - 2 * t2)
        group.current.rotation.y = frozenRotY.current + (labelRotY.current - frozenRotY.current) * ease
        group.current.rotation.x = frozenRotX.current * (1 - ease)
      }
    }

    // Scroll zoom — both platforms
    const targetZ = sp * 100
    group.current.position.z += (targetZ - group.current.position.z) * 0.06

    const targetScale = 1 + sp * 16
    group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.06)
  })

  return (
    <group ref={group}>
      {/* <BlobShadow scrollProgress={scrollProgress} /> */}
      <primitive object={model.scene} scale={18} position={[0, -1, 0]} />
    </group>
  )
}

/* =======================
   CURSOR LIGHT
======================= */
function CursorLight() {
  const keyLight = useRef()
  const rimLight = useRef()
  useFrame((state) => {
    if (keyLight.current) {
      keyLight.current.position.x += (state.mouse.x * 5 - keyLight.current.position.x) * 0.08
      keyLight.current.position.y += (state.mouse.y * 4 + 2 - keyLight.current.position.y) * 0.08
      keyLight.current.position.z = 4
    }
    if (rimLight.current) {
      rimLight.current.position.x += (-state.mouse.x * 3 - rimLight.current.position.x) * 0.04
      rimLight.current.position.y += (-state.mouse.y * 2 + 1 - rimLight.current.position.y) * 0.04
    }
  })
  return (
    <>
      <pointLight ref={keyLight} intensity={40} color="#ffe4b0" distance={18} decay={2} castShadow={false} />
      <pointLight ref={rimLight} intensity={12} color="#8b6fff" distance={20} decay={2} position={[-3, 2, -6]} castShadow={false} />
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
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', opacity: 0.035,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat', backgroundSize: '128px 128px', mixBlendMode: 'overlay',
    }} />
  )
}

function Vignette() {
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(40, 0, 5, 0.55) 100%)',
    }} />
  )
}

/* =======================
   HERO OVERLAY
======================= */
function HeroOverlay() {
  const { t } = useTranslation()
  const fontSerif = "'Cormorant Garamond', 'Cormorant', Georgia, 'Times New Roman', serif"
  const fontSans = "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
  const wineRed = '#A11C24'
  const inkDark = '#1a1614'
  const parchment = '#faf6ef'

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  )
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div aria-hidden="false" style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}>

      {/* Right-side tagline + CTAs */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.8, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          right: isMobile ? '1rem' : '3vw',
          left: isMobile ? '1rem' : '55%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'flex-end',
          gap: '22px',
          textAlign: isMobile ? 'center' : 'right',
          pointerEvents: 'auto',
        }}
      >
        <h1 style={{
          fontFamily: fontSerif,
          fontStyle: 'italic',
          fontSize: isMobile ? '17px' : 'clamp(19px, 1.8vw, 26px)',
          fontWeight: 400,
          lineHeight: 1.6,
          color: inkDark,
          margin: 0,
          letterSpacing: '0.02em',
          maxWidth: isMobile ? '100%' : '380px',
        }}>
          {t('hero.taglinePre', 'A single vine. A single vintage.')}{' '}
          <span style={{ color: wineRed }}>{t('hero.subtitle', 'Chapter One')}</span>{' '}
          {t('hero.taglinePost', 'begins now.')}
        </h1>

        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '12px',
          alignItems: isMobile ? 'center' : 'flex-end',
        }}>
          <Link to="/reserve"
            aria-label={t('hero.ctaPrimaryAriaLabel')}
            style={{ textDecoration: 'none' }}>
            <button style={{
              fontFamily: fontSans, fontSize: '10px', fontWeight: 500,
              letterSpacing: '3px', textTransform: 'uppercase',
              padding: '12px 24px', background: wineRed, color: parchment,
              border: 'none', borderRadius: 0, cursor: 'pointer',
              transition: 'background 0.2s ease', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#7a1318' }}
              onMouseLeave={e => { e.currentTarget.style.background = wineRed }}
            >
              {t('hero.ctaPrimary', 'Reserve a Tasting')}
            </button>
          </Link>

          <Link to="/cellar"
            aria-label={t('hero.ctaGhostAriaLabel')}
            style={{ textDecoration: 'none' }}>
            <button style={{
              fontFamily: fontSans, fontSize: '10px', fontWeight: 500,
              letterSpacing: '3px', textTransform: 'uppercase',
              padding: '12px 24px', background: 'transparent', color: inkDark,
              border: `1px solid ${inkDark}`, borderRadius: 0, cursor: 'pointer',
              transition: 'background 0.2s ease, color 0.2s ease', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = inkDark; e.currentTarget.style.color = parchment }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = inkDark }}
            >
              {t('hero.ctaGhost', 'Discover the Vintage')}
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Bottom-left estate block */}
      <motion.address
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 1.2 }}
        style={{
          position: 'absolute',
          bottom: isMobile ? '1.5rem' : '2.5rem',
          left: isMobile ? '1rem' : '2rem',
          fontStyle: 'normal',
          display: 'flex', flexDirection: 'column', gap: '3px',
        }}
      >
        <span style={{ fontFamily: fontSans, fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: inkDark }}>
          {t('hero.estateLabel', 'The Estate')}
        </span>
        <span style={{ fontFamily: fontSans, fontSize: '10px', fontWeight: 400, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(26,22,20,0.65)' }}>
          {t('hero.estateLocation', 'Bourgogne, France')}
        </span>
        {!isMobile && (
          <span style={{ fontFamily: fontSans, fontSize: '10px', fontWeight: 400, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(26,22,20,0.5)' }}>
            47°02N · 4°50E
          </span>
        )}
      </motion.address>

      {/* Bottom-right vintage block — desktop only */}
      {!isMobile && (
        <motion.aside
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 1.2 }}
          aria-label={t('hero.vintageAriaLabel')}
          style={{
            position: 'absolute', bottom: '2.5rem', right: '3vw',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px',
          }}
        >
          <span style={{ fontFamily: fontSerif, fontSize: 'clamp(38px, 4.5vw, 56px)', fontWeight: 600, letterSpacing: '0.04em', color: wineRed, lineHeight: 1 }}>
            MMXXIV
          </span>
          <span style={{ display: 'block', width: '40px', height: '1px', background: wineRed, alignSelf: 'flex-end' }} />
          <span style={{ fontFamily: fontSans, fontSize: '10px', fontWeight: 400, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(26,22,20,0.6)' }}>
            {t('hero.vintageCaption', 'First Release · Lot 001 / 320')}
          </span>
        </motion.aside>
      )}

      {/* Scroll cue — desktop only */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1.2 }}
          style={{
            position: 'absolute', bottom: '1.5rem', left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          }}
        >
          <span style={{ fontFamily: fontSans, fontSize: '9px', fontWeight: 500, letterSpacing: '3px', textTransform: 'uppercase', color: 'white' }}>
            {t('hero.scroll', 'Scroll')}
          </span>
          <motion.span
            animate={{ opacity: [1, 0.1, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            style={{ display: 'block', width: '1px', height: '40px', background: `linear-gradient(to bottom, white, transparent)` }}
          />
        </motion.div>
      )}
    </div>
  )
}

/* =======================
   PAGE
======================= */
export default function HeroPage() {
  const scrollProgress = useRef(0)
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'fr' ? 'fr' : 'en'

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <>
      <Helmet>
        <html lang={lang} />
        <title>{t('seo.title', 'NAPA Chapter One — Single-Vine Burgundy Wine | First Release MMXXIV')}</title>
        <meta name="description" content={t('seo.description')} />
        <meta name="keywords" content={t('seo.keywords')} />
        <link rel="canonical" href="https://napachapterone.com/" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NAPA Chapter One" />
        <meta property="og:title" content={t('seo.ogTitle')} />
        <meta property="og:description" content={t('seo.ogDescription')} />
        <meta property="og:image" content="https://napachapterone.com/og-image.jpg" />
        <meta property="og:image:alt" content={t('seo.ogImageAlt')} />
        <meta property="og:url" content="https://napachapterone.com/" />
        <meta property="og:locale" content={lang === 'fr' ? 'fr_FR' : 'en_US'} />
        <meta property="og:locale:alternate" content={lang === 'fr' ? 'en_US' : 'fr_FR'} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('seo.ogTitle')} />
        <meta name="twitter:description" content={t('seo.ogDescription')} />
        <meta name="twitter:image" content="https://napachapterone.com/og-image.jpg" />
        <meta name="twitter:image:alt" content={t('seo.ogImageAlt')} />

        <meta name="geo.region" content="FR-21" />
        <meta name="geo.placename" content="Bourgogne, France" />
        <meta name="geo.position" content="47.0333;4.8333" />
        <meta name="ICBM" content="47.0333, 4.8333" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="NAPA Chapter One" />
        <meta name="theme-color" content="#A11C24" />

        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json">{JSON.stringify(STRUCTURED_DATA)}</script>
      </Helmet>

      <main id="main-content">
        <section
          aria-label={t('hero.sectionAriaLabel')}
          style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}
        >
          <Canvas
            shadows                    // deprecated PCFSoftShadowMap removed — r3f default is PCFShadowMap
            camera={{ position: [0, 1.5, 20], fov: 50 }}
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.1,
            }}
            dpr={[1, Math.min(window.devicePixelRatio, 2)]}
            style={{ position: 'absolute', inset: 0, zIndex: 1 }}
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
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-near={0.5}
                shadow-camera-far={40}
                shadow-camera-left={-8}
                shadow-camera-right={8}
                shadow-camera-top={8}
                shadow-camera-bottom={-8}
                shadow-bias={-0.0004}
                shadow-radius={6}
              />
              <directionalLight position={[5, 2, 4]} intensity={0.8} color="#ffb870" castShadow={false} />
              <directionalLight position={[-5, 6, -8]} intensity={1.4} color="#7baeff" castShadow={false} />
              <CursorLight />
              <BottleModel scrollProgress={scrollProgress} />
            </Suspense>
          </Canvas>

          <Vignette />
          <FilmGrain />
          <HeroOverlay />
        </section>

        {/*
          Desktop: full GSAP sticky-track clip-path animation
          Mobile:  pure CSS sticky card stack (MobileStack)
          Rendered conditionally via React state to avoid
          mounting GSAP/ScrollTrigger on mobile at all.
        */}


      </main>
      <MobileStack />
      <ScrollSection />

      <div style={{ height: '100vh', width: '100%' }} />
    </>
  )
}