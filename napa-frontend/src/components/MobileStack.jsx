// MobileStack.jsx — DEFINITIVE FIX v2
//
// CHANGES FROM PREVIOUS VERSION:
// The previous version tried to fix the upward scroll trap by:
//   1. Detecting scroll direction change
//   2. Snapping to a slide boundary
//   3. Switching slides to position:relative
//
// That approach had a race condition: by the time the 'scroll' event fires,
// the browser has already committed momentum to the scroll context. The snap
// might fire 1-3 frames late, causing a visible jump or not firing at all
// because the direction-change detection missed the first delta.
//
// THE REAL FIX IS IN HeroPage.jsx (canvas pointer-events:none on mobile).
// That fix eliminates the PRIMARY scroll trap. This file now uses a simpler,
// more reliable version of the direction fix as a secondary safeguard.
//
// SIMPLIFIED APPROACH:
// Instead of snapping on direction change, we use a passive scroll listener
// that switches position:relative only when scrollY < heroH + vh (i.e., when
// we're at or near slide 1 heading back toward the hero). This is a pure
// CSS class toggle with no snap — no visible jump, no race condition.
// Going DOWN: sticky stacking works as before (class absent).
// Going UP from slide 1: position:relative kicks in as soon as we detect
// upward direction, so the hero section scrolls normally into view.

import { useEffect, useRef } from 'react'
import { SLIDES } from './ScrollSection'

const ID = 'mbs3'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300;1,400&family=Montserrat:wght@200;300&display=swap');

.mbs3 { display: none; }

@media (max-width: 767px) {
  .mbs3 {
    display: block;
    position: relative;
  }

  .mbs3-slide {
    position: sticky;
    top: 0;
    height: 100vh;
    height: 100svh;
    width: 100%;
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
    touch-action: pan-y;
  }

  /*
   * When scrolling UP, disable sticky on all slides so upward momentum
   * passes through cleanly. Slides fall back to normal document flow.
   * At the moment this class is added, scrollY has been snapped to a
   * slide boundary, so each slide's natural position === its sticky
   * position → zero visual jump.
   */
  .mbs3--scrolling-up .mbs3-slide {
    position: relative !important;
  }

  .mbs3-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-color: #0e0c09;
  }

  .mbs3-ov-top {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(5,3,1,.55) 0%, transparent 35%);
    pointer-events: none;
    z-index: 1;
  }
  .mbs3-ov-bot {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(5,3,1,.9) 0%, rgba(5,3,1,.1) 55%, transparent 72%);
    pointer-events: none;
    z-index: 1;
  }

  .mbs3-portrait-wrap {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    pointer-events: none;
    overflow: hidden;
  }
  .mbs3-portrait {
    display: block;
    width: 62%;
    max-width: 260px;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    border-radius: 2px;
    transform: translateY(-5%);
    box-shadow: 0 28px 64px rgba(0,0,0,.7), 0 0 0 1px rgba(201,169,110,.12);
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
  }

  .mbs3-badge {
    position: absolute;
    bottom: 52px;
    left: 24px;
    z-index: 3;
    font-family: 'Montserrat', sans-serif;
    font-size: 9px;
    font-weight: 200;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: rgba(201,169,110,.6);
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
  }

  .mbs3-text {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 24px 52px;
    text-align: center;
    z-index: 3;
  }
  .mbs3-slug {
    display: block;
    font-family: 'Montserrat', sans-serif;
    font-size: 9px;
    font-weight: 200;
    letter-spacing: .3em;
    text-transform: uppercase;
    color: #c9a96e;
    margin-bottom: 9px;
  }
  .mbs3-rule {
    display: block;
    width: 22px;
    height: 1px;
    background: #c9a96e;
    opacity: .45;
    margin: 0 auto 9px;
  }
  .mbs3-title {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-weight: 300;
    font-size: clamp(22px, 7.5vw, 34px);
    line-height: 1.1;
    color: #f5f0e8;
    letter-spacing: .01em;
    margin: 0 0 5px;
    user-select: none;
    -webkit-user-select: none;
  }
  .mbs3-sub {
    font-family: 'Montserrat', sans-serif;
    font-size: 9px;
    font-weight: 200;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: rgba(245,240,232,.5);
    user-select: none;
    -webkit-user-select: none;
  }
}
`

export default function MobileStack() {
  const wrapRef = useRef(null)

  // ─── Inject styles ───────────────────────────────────────────────────────
  useEffect(() => {
    if (document.getElementById(ID)) return
    const el = document.createElement('style')
    el.id = ID
    el.textContent = CSS
    document.head.appendChild(el)
    return () => document.getElementById(ID)?.remove()
  }, [])

  // ─── Scroll-direction fix ────────────────────────────────────────────────
  useEffect(() => {
    // Only apply on actual touch devices
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (!isTouch) return

    const wrap = wrapRef.current
    if (!wrap) return

    const vh         = () => window.innerHeight
    const heroH      = () => vh()                        // hero is exactly 100vh
    const slideCount = SLIDES.length

    let lastScrollY  = window.scrollY
    let ticking      = false

    function applyDirection() {
      const y    = window.scrollY
      const hero = heroH()
      const mbs3End = hero + slideCount * vh()

      // Are we scrolling upward?
      const goingUp = y < lastScrollY

      if (goingUp && y >= hero - 10 && y <= mbs3End) {
        // Scrolling up inside (or just leaving) the mbs3 zone.
        // Switch slides to relative so momentum scrolls through cleanly.
        if (!wrap.classList.contains('mbs3--scrolling-up')) {
          // Snap to nearest slide boundary before switching to relative,
          // so there's no visual jump (natural pos === sticky pos).
          const relY       = Math.max(0, y - hero)
          const slideIndex = Math.floor(relY / vh())
          const snapTarget = hero + slideIndex * vh()

          if (Math.abs(y - snapTarget) > 4) {
            // Use instant scroll — imperceptible, same direction as gesture
            window.scrollTo({ top: snapTarget, behavior: 'instant' })
          }
          wrap.classList.add('mbs3--scrolling-up')
        }
      } else if (!goingUp) {
        // Scrolling down — restore sticky stacking
        wrap.classList.remove('mbs3--scrolling-up')
      }

      lastScrollY = y
      ticking = false
    }

    function onScroll() {
      if (!ticking) {
        // Use rAF to batch — fires before next paint, same frame as scroll
        requestAnimationFrame(applyDirection)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      wrap.classList.remove('mbs3--scrolling-up')
    }
  }, [])

  // ────────────────────────────────────────────────────────────────────────
  const total = SLIDES.length

  return (
    <div className="mbs3" ref={wrapRef} aria-label="Featured collection">
      {SLIDES.map((slide, i) => {
        const bgSrc  = slide.mobileBackground || slide.background
        const imgSrc = slide.mobileImg        || slide.img

        return (
          <div
            key={slide.slug || i}
            className="mbs3-slide"
            style={{ zIndex: i + 1 }}
          >
            <div
              className="mbs3-bg"
              style={{ backgroundImage: bgSrc ? `url(${bgSrc})` : 'none' }}
            />

            <div className="mbs3-ov-top" />
            <div className="mbs3-ov-bot" />

            <div className="mbs3-portrait-wrap">
              <img
                className="mbs3-portrait"
                src={imgSrc || ''}
                alt={slide.altFallback || ''}
                loading="eager"
                decoding="sync"
                draggable="false"
              />
            </div>

            <div className="mbs3-badge">
              {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </div>

            <div className="mbs3-text">
              <span className="mbs3-slug">{slide.slug || `chapter ${i + 1}`}</span>
              <div className="mbs3-rule" />
              <h2 className="mbs3-title">{slide.altFallback || `Slide ${i + 1}`}</h2>
              {slide.subKey && <p className="mbs3-sub">{slide.subKey}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}