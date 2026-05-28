// MobileStack.jsx — DEFINITIVE FIX
//
// ROOT CAUSE (confirmed after full pixel math):
// All 6 .mbs3-slide elements are sticky children of a single parent (.mbs3 = 600vh).
// CSS sticky rule: an element sticks until (parent_bottom - element_height) = scrollY.
// For ALL slides that unstick point is the same: 700vh - 100vh = 600vh.
//
// This means going UP with touch momentum:
//   iOS/Android commits inertia momentum to the scroll context that "won" the touchstart.
//   The sticky element absorbs momentum without producing visual change, because the browser
//   is resolving the sticky constraint rather than advancing the page position noticeably.
//   Result: user flings up hard and nearly nothing happens visually for multiple swipes.
//
// WHY DevTools phone mode doesn't show this:
//   DevTools simulates touch as mouse/pointer events. Real momentum scrolling is not simulated.
//   The sticky absorption only manifests with real touch inertia on a real device.
//
// THE FIX — scroll-direction toggle with boundary snap:
//   • Keep the original CSS sticky stacking (going DOWN works perfectly, don't break it)
//   • On direction change DOWN→UP: snap to the nearest slide boundary, then switch all
//     slides to position:relative. Going UP is then clean normal scroll, zero trap.
//   • On direction change UP→DOWN: restore position:sticky. Going DOWN works as before.
//   • The snap (≤ 1 viewport, same direction as swipe) is imperceptible.
//   • At a slide boundary, natural position === sticky position → zero visual jump.

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
    /* FIX: tell iOS browser this element does not want to own horizontal scroll */
    touch-action: pan-y;
  }

  /*
   * FIX: when scrolling UP, disable sticky on all slides so momentum passes through
   * cleanly. Each slide reverts to normal document flow (its natural position matches
   * the snapped scrollY, so there is no visual jump).
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
    // Only apply on actual touch devices — desktop keeps the original behaviour.
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (!isTouch) return

    const wrap = wrapRef.current
    if (!wrap) return

    const vh         = window.innerHeight
    const heroH      = vh                       // hero section is exactly 100vh
    const slideCount = SLIDES.length
    const mbs3H      = slideCount * vh          // total height of mbs3
    const mbs3End    = heroH + mbs3H

    let lastScrollY   = window.scrollY
    let goingUp       = false                   // current detected direction is UP
    let snapDone      = false                   // have we already snapped for this UP run?

    function onScroll() {
      const y     = window.scrollY
      const delta = y - lastScrollY

      if (delta === 0) return

      const nowGoingUp = delta < 0

      if (nowGoingUp !== goingUp) {
        // ── Direction changed ──────────────────────────────────────────────
        goingUp  = nowGoingUp
        snapDone = false

        if (nowGoingUp) {
          // Switched to scrolling UP
          // Only act if we're inside the mbs3 scroll region
          if (y >= heroH && y <= mbs3End) {
            if (!snapDone) {
              snapDone = true

              // Snap to the nearest slide boundary ≤ current scrollY
              // so that natural slide position === sticky position → zero visual jump.
              const relY       = y - heroH
              const slideIndex = Math.max(0, Math.min(Math.floor(relY / vh), slideCount - 1))
              const snapTarget = heroH + slideIndex * vh

              // Only snap if we're not already on a boundary (saves a pointless scrollTo)
              if (Math.abs(y - snapTarget) > 2) {
                window.scrollTo({ top: snapTarget, behavior: 'instant' })
              }

              // Remove sticky from all slides so upward momentum scrolls cleanly
              wrap.classList.add('mbs3--scrolling-up')
            }
          }
        } else {
          // Switched to scrolling DOWN — restore sticky stacking effect
          wrap.classList.remove('mbs3--scrolling-up')
        }
      }

      lastScrollY = y
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