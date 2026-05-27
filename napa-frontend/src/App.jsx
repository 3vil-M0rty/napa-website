// src/App.jsx

import { useState, useEffect, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useProgress } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'

import Navbar    from './components/Navbar'
import Cursor    from './components/Cursor'
import HeroPage  from './pages/HeroPage'
import ReservePage   from './pages/ReservePage'
import AuthPage      from './pages/AuthPage'
import MyBookingsPage from './pages/MyBookingsPage'
import AdminPage     from './pages/AdminPage'

/* =======================
   GLOBAL LOADER
   Sits above everything. Waits for:
     1. Three.js assets (bottle.glb + HDR) via useProgress
     2. A minimum 3-second display so the SVG draw animation
        always plays to completion
   Once both are satisfied it fades out and the app is shown.
======================= */
function GlobalLoader() {
  const { progress } = useProgress()
  const [minTimePassed, setMinTimePassed] = useState(false)
  const [visible, setVisible] = useState(true)

  // Minimum display time — keeps the draw animation visible
  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 3000)
    return () => clearTimeout(t)
  }, [])

  const ready = progress >= 100 && minTimePassed

  useEffect(() => {
    if (ready) {
      // Small extra delay so the last stroke finishes drawing
      const t = setTimeout(() => setVisible(false), 200)
      return () => clearTimeout(t)
    }
  }, [ready])

  // Lock scroll while loading
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

/* =======================
   LOADER OVERLAY
   Extracted so AnimatePresence can unmount it cleanly.
   SVG draw animation runs here — same logic as before,
   just lifted out of HeroPage into App level.
======================= */
import NapaCo from './assets/napasolo.svg?react'
import { useRef, useCallback } from 'react'

function LoaderOverlay({ progress }) {
  const svgRef      = useRef(null)
  const pathsRef    = useRef([])
  const measuredRef = useRef(false)
  const startTimeRef = useRef(Date.now())

  const measurePaths = useCallback(() => {
    if (!svgRef.current || measuredRef.current) return
    const paths = Array.from(
      svgRef.current.querySelectorAll('path, polyline, line, circle, ellipse, rect, polygon')
    )
    if (!paths.length) return
    const hasLength = paths.some((el) => {
      try { return (el.getTotalLength?.() ?? 0) > 0 } catch { return false }
    })
    if (!hasLength) return
    pathsRef.current = paths
    measuredRef.current = true
    paths.forEach((el) => {
      try {
        const len = el.getTotalLength?.() ?? 400
        el.setAttribute('fill', 'none')
        el.setAttribute('stroke', '#8b1d1f')
        el.setAttribute('stroke-width', '1.5')
        el.style.fill = 'none'
        el.style.stroke = '#8b1d1f'
        el.style.strokeWidth = '1.5px'
        el.style.strokeDasharray = `${len}`
        el.style.strokeDashoffset = `${len}`
      } catch (_) {}
    })
    if (svgRef.current) svgRef.current.style.opacity = '1'
  }, [])

  useEffect(() => {
    let raf
    let retries = 0
    const attempt = () => {
      measurePaths()
      if (!measuredRef.current && retries < 30) {
        retries++
        raf = requestAnimationFrame(attempt)
      }
    }
    raf = requestAnimationFrame(attempt)
    return () => cancelAnimationFrame(raf)
  }, [measurePaths])

  useEffect(() => {
    const tick = () => {
      if (!pathsRef.current.length) return
      const elapsed = Date.now() - startTimeRef.current
      const timeProgress = Math.min(100, (elapsed / 4000) * 100)
      const effectiveProgress = Math.min(progress, timeProgress)
      pathsRef.current.forEach((el) => {
        try {
          const len = el.getTotalLength?.() ?? 400
          gsap.to(el, {
            strokeDashoffset: len * (1 - effectiveProgress / 100),
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        } catch (_) {}
      })
    }
    tick()
    const interval = setInterval(tick, 50)
    return () => clearInterval(interval)
  }, [progress])

  const isMobile = window.innerWidth < 768

  return (
    <motion.div
      key="global-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } }}
      style={{
        position: 'fixed',      // fixed so it covers everything regardless of scroll
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(160deg, #8b1d1f 0%, #cc5355 45%, #ebb3b3 100%)',
        pointerEvents: 'none',
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <NapaCo
          ref={svgRef}
          style={{
            position: 'absolute',
            bottom: isMobile ? '-20px' : '-53px',
            left: isMobile ? '50%' : '-30px',
            transform: isMobile ? 'translateX(-50%)' : 'none',
            width: 'min(500px, 90vw)',
            height: 'auto',
            display: 'block',
            background: 'transparent',
            opacity: 0,
          }}
        />
      </div>
    </motion.div>
  )
}

/* =======================
   APP
======================= */
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