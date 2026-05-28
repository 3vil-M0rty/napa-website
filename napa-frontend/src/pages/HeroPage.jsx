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
      description: 'An intimate Art Deco wine and cocktail bar in Gueliz, Marrakech. Natural and organic wines, farm-to-bar cocktails, and small plates. A project by Aziz Nahas, Benjamin Pastor, and Simone Mérette.',
      url: 'https://napachapterone.com',
      logo: 'https://napachapterone.com/napaco.svg',
      address: { '@type': 'PostalAddress', streetAddress: 'Gueliz', addressLocality: 'Marrakech', addressCountry: 'MA' },
      geo: { '@type': 'GeoCoordinates', latitude: '31.6351689', longitude: '-8.0152064' },
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '17:00', closes: '01:00' },
      ],
      servesCuisine: ['Wine Bar', 'Cocktail Bar', 'Small Plates', 'Natural Wine'],
      priceRange: '$$',
      telephone: '+212 524 423 022',
      sameAs: ['https://www.instagram.com/napachapterone'],
      offers: { '@type': 'Offer', name: 'Reserve a Table — NAPA Chapter One', url: 'https://napachapterone.com/reserve', availability: 'https://schema.org/InStock' },
    },
    {
      '@type': 'LocalBusiness',
      name: 'NAPA Chapter One',
      description: 'Wine bar and cocktail lounge in Gueliz, Marrakech. Natural wines, farm-to-bar cocktails with Moroccan botanicals from Sanctuary Slimane, and sharing plates. Open Tue–Sat from 5pm.',
      address: { '@type': 'PostalAddress', addressLocality: 'Marrakech', addressRegion: 'Marrakech-Safi', addressCountry: 'MA' },
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

    return () => { scene.background = null; scene.environment = null }
  }, [tex, scene, gl])

  return null
}

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
        if (name.includes('label') || name.includes('sticker') || name.includes('paper') || name.includes('decal') || name.includes('etiquette')) {
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
      // Progress completes over 100vh (one full viewport scroll)
      const raw = window.scrollY / vh
      scrollProgress.current = Math.min(Math.max(raw, 0), 1)
      isVisible.current = window.scrollY < vh
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollProgress])

  useFrame((state) => {
    if (!group.current) return

    // When fully scrolled past the hero, snap everything to rest and stop
    // This means no wasted animation while user scrolls through MobileStack
    if (scrollProgress.current >= 1) {
      group.current.scale.set(1 + (isTouch.current ? 3 : 8), 1 + (isTouch.current ? 3 : 8), 1 + (isTouch.current ? 3 : 8))
      group.current.position.z = isTouch.current ? 5 : 5
      return  // ← exit early, zero GPU work
    }

    const elapsed = state.clock.elapsedTime
    const sp = scrollProgress.current

    if (isTouch.current) {
      const floatY = Math.sin(elapsed * 0.65) * 0.38
      const swayX = Math.sin(elapsed * 0.42 + 1.2) * 0.09
      const rotY = Math.sin(elapsed * 0.52) * 0.12
      const rotZ = Math.sin(elapsed * 0.33 + 0.8) * 0.03

      group.current.position.x += (swayX - group.current.position.x) * 0.05
      group.current.position.y = -0.5 + floatY + sp * 0.6

      const targetZ = sp * 5
      group.current.position.z += (targetZ - group.current.position.z) * 0.12

      group.current.rotation.x = 0
      group.current.rotation.y += (rotY - group.current.rotation.y) * 0.06
      group.current.rotation.z += (rotZ - group.current.rotation.z) * 0.06

      const targetScale = 1 + sp * 3
      group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12)

    } else {
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

      const targetZ = sp * 5
      group.current.position.z += (targetZ - group.current.position.z) * 0.12

      const targetScale = 1 + sp * 8
      group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12)
    }
  })

  return (
    <group ref={group}>
      <primitive object={model.scene} scale={18} position={[0, -1, 0]} />
    </group>
  )
}

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
      background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(10,0,2,0.6) 100%)',
    }} />
  )
}

function HeroOverlay() {
  const { t } = useTranslation()
  const fontSerif = "'Cormorant Garamond', 'Cormorant', Georgia, 'Times New Roman', serif"
  const fontSans = "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
  const wineRed = '#8b1d1f'
  const cream = '#faf6ef'
  const creamy60 = 'rgba(250,246,239,0.6)'
  const creamy45 = 'rgba(250,246,239,0.45)'

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
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.8, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute', top: '50%', transform: 'translateY(-50%)',
          right: isMobile ? '1rem' : '3vw',
          left: isMobile ? '1rem' : '55%',
          display: 'flex', flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'flex-end',
          gap: '22px', textAlign: isMobile ? 'center' : 'right',
          pointerEvents: 'auto',
        }}
      >
        <h1 style={{
          fontFamily: fontSerif, fontStyle: 'italic', fontWeight: 400,
          fontSize: isMobile ? '17px' : 'clamp(19px, 1.8vw, 26px)',
          lineHeight: 1.6, color: cream, margin: 0, letterSpacing: '0.02em',
          maxWidth: isMobile ? '100%' : '380px',
          textShadow: '0 1px 12px rgba(0,0,0,0.5)',
        }}>
          {t('hero.taglinePre')}<br />
          {t('hero.taglinePost')}
        </h1>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', alignItems: isMobile ? 'center' : 'flex-end' }}>
          <Link to="/reserve" aria-label={t('hero.ctaPrimaryAriaLabel')} style={{ textDecoration: 'none' }}>
            <button style={{
              fontFamily: fontSans, fontSize: '10px', fontWeight: 500,
              letterSpacing: '3px', textTransform: 'uppercase',
              padding: '12px 24px', background: wineRed, color: cream,
              border: 'none', borderRadius: 0, cursor: 'pointer',
              transition: 'background 0.2s ease', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#b03040' }}
              onMouseLeave={e => { e.currentTarget.style.background = wineRed }}
            >
              {t('hero.ctaPrimary')}
            </button>
          </Link>
          <Link to="/cellar" aria-label={t('hero.ctaGhostAriaLabel')} style={{ textDecoration: 'none' }}>
            <button style={{
              fontFamily: fontSans, fontSize: '10px', fontWeight: 500,
              letterSpacing: '3px', textTransform: 'uppercase',
              padding: '12px 24px', background: 'transparent', color: cream,
              border: `1px solid rgba(250,246,239,0.55)`, borderRadius: 0, cursor: 'pointer',
              transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = cream; e.currentTarget.style.color = '#1a1614'; e.currentTarget.style.borderColor = cream }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = cream; e.currentTarget.style.borderColor = 'rgba(250,246,239,0.55)' }}
            >
              {t('hero.ctaGhost')}
            </button>
          </Link>
        </div>
      </motion.div>

      <motion.address
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 1.2 }}
        style={{
          position: 'absolute',
          bottom: isMobile ? '1.5rem' : '2.5rem',
          left: isMobile ? '1rem' : '2rem',
          fontStyle: 'normal', display: 'flex', flexDirection: 'column', gap: '3px',
        }}
      >
        <span style={{ fontFamily: fontSans, fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: cream }}>
          {t('hero.estateLabel')}
        </span>
        <span style={{ fontFamily: fontSans, fontSize: '10px', fontWeight: 400, letterSpacing: '3px', textTransform: 'uppercase', color: creamy60 }}>
          {t('hero.estateLocation')}
        </span>
        {!isMobile && (
          <span style={{ fontFamily: fontSans, fontSize: '10px', fontWeight: 400, letterSpacing: '2px', textTransform: 'uppercase', color: creamy45 }}>
            {t('hero.estateHours')}
          </span>
        )}
      </motion.address>

      {!isMobile && (
        <motion.aside
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 1.2 }}
          aria-label={t('hero.vintageAriaLabel')}
          style={{ position: 'absolute', bottom: '2.5rem', right: '3vw', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}
        >
          <span style={{ fontFamily: fontSerif, fontSize: 'clamp(38px, 4.5vw, 56px)', fontWeight: 600, letterSpacing: '0.04em', color: wineRed, lineHeight: 1 }}>
            MMXXVI
          </span>
          <span style={{ display: 'block', width: '40px', height: '1px', background: wineRed, alignSelf: 'flex-end' }} />
          <span style={{ fontFamily: fontSans, fontSize: '10px', fontWeight: 400, letterSpacing: '2.5px', textTransform: 'uppercase', color: creamy60 }}>
            {t('hero.vintageCaption')}
          </span>
        </motion.aside>
      )}

      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1.2 }}
          style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
        >
          <span style={{ fontFamily: fontSans, fontSize: '9px', fontWeight: 500, letterSpacing: '3px', textTransform: 'uppercase', color: creamy60 }}>
            {t('hero.scroll')}
          </span>
          <motion.span
            animate={{ opacity: [1, 0.1, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            style={{ display: 'block', width: '1px', height: '40px', background: `linear-gradient(to bottom, ${cream}, transparent)` }}
          />
        </motion.div>
      )}
    </div>
  )
}

export default function HeroPage() {
  const scrollProgress = useRef(0)
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'fr' ? 'fr' : 'en'
  const isTouch = useRef('ontouchstart' in window || navigator.maxTouchPoints > 0)

  return (
    <>
      <Helmet>
        <html lang={lang} />
        <title>{t('seo.title')}</title>
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
        <meta name="geo.region" content="MA-09" />
        <meta name="geo.placename" content="Marrakech, Morocco" />
        <meta name="geo.position" content="31.6351689;-8.0152064" />
        <meta name="ICBM" content="31.6351689, -8.0152064" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="NAPA Chapter One" />
        <meta name="theme-color" content="#A11C24" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <script type="application/ld+json">{JSON.stringify(STRUCTURED_DATA)}</script>
      </Helmet>

      <main id="main-content">
        <section
          aria-label={t('hero.sectionAriaLabel')}
          style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}
        >
          <Canvas
            shadows
            camera={{ position: [0, 1.5, 20], fov: 50 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
            dpr={[1, Math.min(window.devicePixelRatio, 2)]}
            style={{ position: 'absolute', inset: 0, zIndex: 1 }}
            aria-hidden="true"
            eventSource={isTouch.current ? null : undefined}
            events={isTouch.current ? () => ({}) : undefined}
          >
            <Suspense fallback={null}>
              <HDRBackground />
              <ResponsiveCamera />
              <ambientLight intensity={0.3} color="#ffccd5" />
              <directionalLight
                position={[3, 14, 8]} intensity={3.5} color="#fff5e0" castShadow
                shadow-mapSize-width={2048} shadow-mapSize-height={2048}
                shadow-camera-near={0.5} shadow-camera-far={40}
                shadow-camera-left={-8} shadow-camera-right={8}
                shadow-camera-top={8} shadow-camera-bottom={-8}
                shadow-bias={-0.0004} shadow-radius={6}
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

        <MobileStack />
        <ScrollSection />
      </main>
    </>
  )
}