// src/components/Cursor.jsx

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const CURSOR_STYLE = `
  *, *::before, *::after {
    cursor: none !important;
  }

  .cursor-dot {
    position: fixed;
    top: 0;
    left: 0;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ffffff;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    mix-blend-mode: difference;
    will-change: transform;
    transition: width 0.2s ease, height 0.2s ease;
  }

  .cursor-dot.active     { width: 16px; height: 16px; }
  .cursor-dot.model-hover { width: 28px; height: 28px; }

  .cursor-ring {
    position: fixed;
    top: 0;
    left: 0;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1.5px solid #ffffff;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    mix-blend-mode: difference;
    will-change: transform;
    transition: width 0.25s ease, height 0.25s ease, opacity 0.2s ease;
  }

  .cursor-ring.active      { width: 52px; height: 52px; }
  .cursor-ring.model-hover { width: 64px; height: 64px; opacity: 0.6; }
`

// Detect touch synchronously so the very first render is correct.
// Using useState(false) causes a flash where cursor divs render before
// the useEffect touch-check fires — visible in DevTools mobile emulation.
const IS_TOUCH = typeof window !== 'undefined'
  && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export default function Cursor({ isModelHovered = false }) {
  const dotRef      = useRef()
  const ringRef     = useRef()
  const ringTween   = useRef(null)
  const [isClickable, setIsClickable] = useState(false)

  useEffect(() => {
    // Don't attach anything on touch devices
    if (IS_TOUCH) return

    const style = document.createElement('style')
    style.innerHTML = CURSOR_STYLE
    document.head.appendChild(style)

    const dot  = dotRef.current
    const ring = ringRef.current

    const onMove = (e) => {
      const { clientX: x, clientY: y } = e

      gsap.to(dot, { x, y, duration: 0.08, ease: 'power2.out', overwrite: true })

      if (ringTween.current) ringTween.current.kill()
      ringTween.current = gsap.to(ring, { x, y, duration: 0.18, ease: 'power2.out' })

      setIsClickable(!!e.target.closest('a, button, input, [role="button"], .clickable'))
    }

    window.addEventListener('mousemove', onMove)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (ringTween.current) ringTween.current.kill()
      document.head.removeChild(style)
    }
  }, [])

  // Bail out on first render for touch — no divs painted at all
  if (IS_TOUCH) return null

  const state = isModelHovered ? 'model-hover' : isClickable ? 'active' : ''

  return (
    <>
      <div ref={dotRef}  className={`cursor-dot  ${state}`} />
      <div ref={ringRef} className={`cursor-ring ${state}`} />
    </>
  )
}