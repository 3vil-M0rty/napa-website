// src/App.jsx
import { useState, useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import Navbar         from './components/Navbar'
import Cursor         from './components/Cursor'
import HeroPage       from './pages/HeroPage'
import NapaCo         from './assets/napasolo.svg?react'
import { SLIDES }     from './components/ScrollSection'
import { BookOverlay } from './components/BookOverlay'

const IS_DESKTOP =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches

const slideImagePromise = Promise.all(
  SLIDES.map(s => new Promise(resolve => {
    const img   = new Image()
    img.onload  = resolve
    img.onerror = resolve
    img.src     = s.background
  }))
)

let glbProgressCallback = null
let glbProgress         = 0

const glbPromise = !IS_DESKTOP
  ? Promise.resolve()
  : fetch('/models/bottle.glb')
      .then(async res => {
        const total  = Number(res.headers.get('content-length') || 0)
        const reader = res.body.getReader()
        const chunks = []
        let   loaded = 0

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(value)
          loaded += value.byteLength
          if (total) {
            glbProgress = Math.round((loaded / total) * 90)
            glbProgressCallback?.(glbProgress)
          }
        }

        const buffer = await new Blob(chunks).arrayBuffer()
        const THREE  = await import('three')
        THREE.Cache.add('/models/bottle.glb', buffer)

        glbProgress = 100
        glbProgressCallback?.(100)
      })
      .catch(() => {
        glbProgress = 100
        glbProgressCallback?.(100)
      })

const MIN_DISPLAY_MS   = 2000
const DRAW_DURATION_MS = 400
const WINE_RED         = '#8b1d1f'
const ROSE             = '#cc5355'
const BLUSH            = '#ebb3b3'
const FONT_SANS        = "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"

function LoaderOverlay({ progress }) {
  const svgRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const svg       = svgRef.current
    if (!svg) return
    const mountTime = Date.now()

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
        el.style.strokeWidth      = '3px'
        el.style.strokeDasharray  = `${len}`
        el.style.strokeDashoffset = `${len}`
        el.style.transition       = 'none'
      })

      svg.style.opacity = '1'

      const draw = () => {
        const elapsed = Date.now() - mountTime
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
    return () => rafRef.current && cancelAnimationFrame(rafRef.current)
  }, [])

  const isMobile        = !IS_DESKTOP
  const displayProgress = Math.round(Math.min(progress, 100))

  return (
    <motion.div
      key="global-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1] } }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: `linear-gradient(160deg, ${WINE_RED} 0%, ${ROSE} 45%, ${BLUSH} 100%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <NapaCo
        ref={svgRef}
        aria-hidden="true"
        style={{
          position:  'absolute',
          bottom:    isMobile ? '-20px' : '-53px',
          left:      isMobile ? '50%' : '-30px',
          transform: isMobile ? 'translateX(-50%)' : 'none',
          width:     'min(500px, 90vw)',
          height:    'auto',
          opacity:   0,
        }}
      />

      <div style={{
        position: 'absolute',
        bottom: isMobile ? '3rem' : '2.5rem',
        left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '10px',
        pointerEvents: 'none',
      }}>
        <span style={{ fontFamily: FONT_SANS, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#8b1d1f' }}>
          {displayProgress}%
        </span>
        <div style={{ width: 'min(200px, 55vw)', height: '1px', background: 'rgba(139,29,31,0.25)', position: 'relative' }}>
          <motion.div
            style={{ position: 'absolute', top: 0, left: 0, bottom: 0, background: '#8b1d1f', originX: 0 }}
            animate={{ width: `${displayProgress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <span style={{ fontFamily: FONT_SANS, fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#8b1d1f' }}>
          Loading
        </span>
      </div>
    </motion.div>
  )
}

function GlobalLoader() {
  const [progress,    setProgress]    = useState(glbProgress)
  const [imagesReady, setImagesReady] = useState(false)
  const [glbReady,    setGlbReady]    = useState(!IS_DESKTOP)
  const [visible,     setVisible]     = useState(IS_DESKTOP)
  const openedAt                      = useRef(Date.now())

  useEffect(() => {
    if (!IS_DESKTOP) return
    glbProgressCallback = setProgress
    if (glbProgress >= 100) setGlbReady(true)
    return () => { glbProgressCallback = null }
  }, [])

  useEffect(() => {
    if (!IS_DESKTOP) return
    glbPromise.then(() => {
      setProgress(100)
      setGlbReady(true)
    })
  }, [])

  useEffect(() => {
    slideImagePromise.then(() => setImagesReady(true))
  }, [])

  useEffect(() => {
    if (!glbReady || !imagesReady) return
    const elapsed   = Date.now() - openedAt.current
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed)
    const t = setTimeout(() => setVisible(false), remaining)
    return () => clearTimeout(t)
  }, [glbReady, imagesReady])

  // ── CHANGED: reset body background to dark once loader exits ──
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      // Remove the pink gradient — set to site dark background
      document.body.style.background = '#0a0a0a'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  if (!IS_DESKTOP) return null

  return (
    <AnimatePresence>
      {visible && <LoaderOverlay progress={progress} />}
    </AnimatePresence>
  )
}

/* =========================================================
   CRITICAL CSS
   ── CHANGED: body starts dark, not pink.
   The loader overlay covers it with the gradient anyway,
   so the pink body bg was only ever visible as a flash
   on slow paints or after the loader exits.
========================================================= */
if (typeof document !== 'undefined') {
  const existing = document.getElementById('napa-loader-critical')
  if (!existing) {
    const style = document.createElement('style')
    style.id    = 'napa-loader-critical'
    style.textContent = `
      html, body { margin: 0; padding: 0; }
      body { background: #0a0a0a; }
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
        <Route path="/" element={<HeroPage />} />
        {/*
        <Route path="/reserve"  element={<ReservePage />} />
        <Route path="/auth"     element={<AuthPage />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        <Route path="/admin"    element={<AdminPage />} />
        */}
      </Routes>
      <BookOverlay />
    </>
  )
}