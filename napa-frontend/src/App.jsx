// src/App.jsx

import { useState, useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useProgress } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'

import Navbar         from './components/Navbar'
import Cursor         from './components/Cursor'
import HeroPage       from './pages/HeroPage'
import ReservePage    from './pages/ReservePage'
import AuthPage       from './pages/AuthPage'
import MyBookingsPage from './pages/MyBookingsPage'
import AdminPage      from './pages/AdminPage'
import NapaCo         from './assets/napasolo.svg?react'
import { SLIDES }     from './components/ScrollSection'

/* =========================================================
   TIMING DIAGNOSTICS
   Open DevTools console — you'll see exactly what's slow.
========================================================= */
const T0 = Date.now()
const log = (msg) => console.log(`[NAPA loader] +${Date.now() - T0}ms — ${msg}`)

log('App.jsx evaluated')

/* =========================================================
   PRELOAD SLIDE IMAGES
   — only the first image of each slide (background),
     portrait images load lazily after the loader dismisses.
   — times each image individually so you can see which is slow.
========================================================= */
const slideImagePromise = Promise.all(
  SLIDES.map((s, i) => {
    const src = s.background
    const t   = Date.now()
    return new Promise(resolve => {
      const img   = new Image()
      img.onload  = () => { log(`slide[${i}] bg loaded: ${src} (${Date.now() - t}ms)`); resolve() }
      img.onerror = () => { log(`slide[${i}] bg FAILED: ${src} (${Date.now() - t}ms)`); resolve() }
      img.src     = src
    })
  })
)

slideImagePromise.then(() => log('ALL slide images done'))

/* =========================================================
   CONSTANTS — reduced minimum display time
========================================================= */
const MIN_DISPLAY_MS   = 1200   // was 3200 — only cosmetic minimum now
const DRAW_DURATION_MS = 2800
const WINE_RED         = '#8b1d1f'
const ROSE             = '#cc5355'
const BLUSH            = '#ebb3b3'
const FONT_SANS        = "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"

/* =========================================================
   LOADER OVERLAY
========================================================= */
function LoaderOverlay({ progress }) {
  const svgRef       = useRef(null)
  const pathsRef     = useRef([])
  const animStartRef = useRef(null)
  const rafRef       = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const setup = () => {
      const els = Array.from(
        svg.querySelectorAll('path, polyline, line, circle, ellipse, rect, polygon')
      )
      if (!els.length) {
        rafRef.current = requestAnimationFrame(setup)
        return
      }

      els.forEach(el => {
        let len = 0
        try { len = el.getTotalLength?.() ?? 0 } catch (_) {}
        if (!len) len = 400

        el.style.fill             = 'none'
        el.style.stroke           = '#8b1d1f'
        el.style.strokeWidth      = '1.2px'
        el.style.strokeDasharray  = `${len}`
        el.style.strokeDashoffset = `${len}`
        el.style.transition       = 'none'
      })

      pathsRef.current     = els
      svg.style.opacity    = '1'
      animStartRef.current = Date.now()

      const draw = () => {
        const elapsed = Date.now() - animStartRef.current
        const t       = Math.min(1, elapsed / DRAW_DURATION_MS)
        const eased   = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2

        els.forEach(el => {
          let len = 0
          try { len = el.getTotalLength?.() ?? 400 } catch (_) { len = 400 }
          el.style.strokeDashoffset = `${len * (1 - eased)}`
        })

        if (t < 1) rafRef.current = requestAnimationFrame(draw)
      }
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(setup)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  const isMobile        = window.innerWidth < 768
  const displayProgress = Math.round(Math.min(progress, 100))

  return (
    <motion.div
      key="global-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1] } }}
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         9999,
        background:     `linear-gradient(160deg, ${WINE_RED} 0%, ${ROSE} 45%, ${BLUSH} 100%)`,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        overflow:       'hidden',
      }}
    >
      <NapaCo
        ref={svgRef}
        aria-hidden="true"
        style={{
          position:  'absolute',
          bottom:    isMobile ? '-20px' : '-53px',
          left:      isMobile ? '50%'   : '-30px',
          transform: isMobile ? 'translateX(-50%)' : 'none',
          width:     'min(500px, 90vw)',
          height:    'auto',
          display:   'block',
          opacity:   0,
        }}
      />

      <div style={{
        position:      'absolute',
        bottom:        isMobile ? '3rem' : '2.5rem',
        left:          '50%',
        transform:     'translateX(-50%)',
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           '10px',
        pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily:         FONT_SANS,
          fontSize:           '11px',
          fontWeight:         500,
          letterSpacing:      '3px',
          textTransform:      'uppercase',
          color:              '#8b1d1f',
          fontVariantNumeric: 'tabular-nums',
          minWidth:           '3ch',
          textAlign:          'center',
        }}>
          {displayProgress}%
        </span>

        <div style={{
          width:      'min(200px, 55vw)',
          height:     '1px',
          background: '#8b1d1f',
          position:   'relative',
          overflow:   'hidden',
        }}>
          <motion.div
            style={{
              position:   'absolute',
              top: 0, left: 0, bottom: 0,
              background: '#8b1d1f',
              originX:    0,
            }}
            animate={{ width: `${displayProgress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        <span style={{
          fontFamily:    FONT_SANS,
          fontSize:      '9px',
          fontWeight:    400,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color:         '#8b1d1f',
        }}>
          Loading
        </span>
      </div>
    </motion.div>
  )
}

/* =========================================================
   GLOBAL LOADER CONTROLLER
========================================================= */
function GlobalLoader() {
  const { progress, total, loaded, item } = useProgress()
  const [imagesReady, setImagesReady]     = useState(false)
  const [visible, setVisible]             = useState(true)
  const openedAt                          = useRef(Date.now())
  const threeReadyAt                      = useRef(null)
  const imagesReadyAt                     = useRef(null)

  // Log Three.js progress every time it changes
  useEffect(() => {
    log(`three.js progress=${progress}% loaded=${loaded}/${total} item="${item}"`)
    if (progress >= 100 && !threeReadyAt.current) {
      threeReadyAt.current = Date.now()
      log(`THREE READY at +${threeReadyAt.current - T0}ms`)
    }
  }, [progress, total, loaded, item])

  useEffect(() => {
    slideImagePromise.then(() => {
      imagesReadyAt.current = Date.now()
      log(`IMAGES READY at +${imagesReadyAt.current - T0}ms`)
      setImagesReady(true)
    })
  }, [])

  useEffect(() => {
    if (progress < 100 || !imagesReady) return

    const elapsed   = Date.now() - openedAt.current
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed)
    log(`Both ready — waiting ${remaining}ms more (min display), then dismissing`)
    const t = setTimeout(() => {
      log(`LOADER DISMISSED at +${Date.now() - T0}ms`)
      setVisible(false)
    }, remaining)
    return () => clearTimeout(t)
  }, [progress, imagesReady])

  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [visible])

  return (
    <AnimatePresence>
      {visible && <LoaderOverlay progress={progress} />}
    </AnimatePresence>
  )
}

if (typeof document !== 'undefined') {
  const existing = document.getElementById('napa-loader-critical')
  if (!existing) {
    const style = document.createElement('style')
    style.id = 'napa-loader-critical'
    style.textContent = `
      html, body { margin: 0; padding: 0; }
      body { background: linear-gradient(160deg, #8b1d1f 0%, #cc5355 45%, #ebb3b3 100%); }
    `
    document.head.appendChild(style)
  }
}

export default function App() {
  return (
    <>
      <GlobalLoader />
      <Cursor />
      <Navbar />
      <Routes>
        <Route path="/"         element={<HeroPage />} />
        <Route path="/reserve"  element={<ReservePage />} />
        <Route path="/auth"     element={<AuthPage />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        <Route path="/admin"    element={<AdminPage />} />
      </Routes>
    </>
  )
}