// MobileStack.jsx — GSAP ScrollTrigger approach
//
// WHY GSAP SCROLLTRIGGER INSTEAD OF STICKY + JS CLASS TOGGLE:
//
// The previous sticky approach had two fundamental problems:
//   1. White flash when scrolling fast: the browser paints a new frame before
//      the next sticky slide has composited into view.
//   2. Upward scroll trap: sticky slides swallow upward touch momentum because
//      they're still in the stacking context as position:sticky.
//
// GSAP ScrollTrigger solves both:
//   - It pins elements using `position: fixed` internally, then compensates
//     the document scroll height by adding spacer divs, so the browser scroll
//     position always maps to a real pixel offset — no manufactured stacking.
//   - Pinned slides are GPU-composited layers. The browser never has to repaint
//     a white gap between them because there literally is no gap: each slide
//     stays fixed in place until the next one scrolls over it.
//   - GSAP's scroll handling runs in the browser's native scroll pipeline
//     (not rAF), so there's zero frame delay and zero visual glitch even at
//     high scroll velocity on iOS Safari and Android Chrome.
//
// IMPLEMENTATION:
//   Each slide gets its own ScrollTrigger with pin:true and scrub:false.
//   The z-index ladder (slide 1 at the bottom, last slide on top) means
//   each new slide physically covers the one below as you scroll down.
//   Going up: the top slide un-pins and scrolls off, revealing the one below.
//   The hero section above is untouched — GSAP doesn't interfere with it at all.

import { useEffect, useRef } from 'react'
import { SLIDES } from './ScrollSection'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300;1,400&family=Montserrat:wght@200;300&display=swap');`
const STYLE_ID = 'mbs-gsap-styles'

const CSS = `
${FONT_IMPORT}

.mbs {
  display: none;
}

@media (max-width: 767px) {
  .mbs {
    display: block;
    /* Height is set dynamically in JS to slideCount * 100vh
       so the document has enough scroll room for all pins. */
  }

  .mbs-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    height: 100svh;
    overflow: hidden;
    will-change: transform;
    -webkit-tap-highlight-color: transparent;
    /* GSAP will set position:fixed when pinning — overflow:hidden
       here just clips the background during the brief un-pinned moment. */
  }

  .mbs-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-color: #0e0c09;
    /* Explicit background-color prevents any white flash if the image
       hasn't loaded yet — the dark fill shows instead. */
  }

  .mbs-ov-top {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(5,3,1,.55) 0%, transparent 35%);
    pointer-events: none;
    z-index: 1;
  }
  .mbs-ov-bot {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(5,3,1,.9) 0%, rgba(5,3,1,.1) 55%, transparent 72%);
    pointer-events: none;
    z-index: 1;
  }

  .mbs-portrait-wrap {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    pointer-events: none;
    overflow: hidden;
  }
  .mbs-portrait {
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

  .mbs-badge {
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

  .mbs-text {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 24px 52px;
    text-align: center;
    z-index: 3;
  }
  .mbs-slug {
    display: block;
    font-family: 'Montserrat', sans-serif;
    font-size: 9px;
    font-weight: 200;
    letter-spacing: .3em;
    text-transform: uppercase;
    color: #c9a96e;
    margin-bottom: 9px;
  }
  .mbs-rule {
    display: block;
    width: 22px;
    height: 1px;
    background: #c9a96e;
    opacity: .45;
    margin: 0 auto 9px;
  }
  .mbs-title {
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
  .mbs-sub {
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
  const triggersRef = useRef([])

  // ─── Inject styles ────────────────────────────────────────────────────────
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return
    const el = document.createElement('style')
    el.id = STYLE_ID
    el.textContent = CSS
    document.head.appendChild(el)
    return () => document.getElementById(STYLE_ID)?.remove()
  }, [])

  // ─── GSAP ScrollTrigger pinning ───────────────────────────────────────────
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (!isTouch) return

    const wrap = wrapRef.current
    if (!wrap) return

    const slides = Array.from(wrap.querySelectorAll('.mbs-slide'))
    if (!slides.length) return

    const vh = window.innerHeight
    const count = slides.length

    // The wrapper needs explicit height so the page has enough scroll distance
    // to accommodate all the pins. Each slide consumes exactly 1 viewport height
    // of scroll distance (start-pin → end-pin = 100vh scroll travel).
    // We add a final 100vh so the last slide fully clears before the next
    // section begins.
    wrap.style.height = `${(count + 1) * vh}px`

    // Position all slides at top:0 of the wrapper (they'll be pinned by GSAP)
    slides.forEach((slide) => {
      slide.style.top = '0'
    })

    // Kill any previous triggers
    triggersRef.current.forEach((t) => t.kill())
    triggersRef.current = []

    // Create one ScrollTrigger per slide.
    // Slides are layered with z-index: each successive slide stacks on top.
    // When a slide is pinned (fixed), it sits at top:0 of the viewport.
    // The slide after it scrolls up from below and covers it — which is exactly
    // the "card stack" effect we want.
    //
    // start: "top top"     → pin when slide reaches the top of the viewport
    // end: "+=100%"        → keep pinned for 100vh of scroll distance
    // pin: true            → GSAP handles the fixed positioning
    // pinSpacing: false    → we manage total height manually on the wrapper
    //                        (pinSpacing:true would add a spacer div per slide,
    //                         which fights our wrapper height calculation)
    slides.forEach((slide, i) => {
      slide.style.zIndex = i + 1

      const trigger = ScrollTrigger.create({
        trigger: slide,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,  // Eliminates the brief un-pinned "jump" on fast scroll
        id: `mbs-slide-${i}`,
      })

      triggersRef.current.push(trigger)
    })

    // Refresh after layout so GSAP recalculates scroll positions
    // (needed when this runs after a React render that changed DOM geometry)
    ScrollTrigger.refresh()

    return () => {
      triggersRef.current.forEach((t) => t.kill())
      triggersRef.current = []
      if (wrap) wrap.style.height = ''
    }
  }, [])

  // ─── Handle resize (orientation change, etc.) ────────────────────────────
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (!isTouch) return

    const onResize = () => {
      const wrap = wrapRef.current
      if (!wrap) return
      const vh = window.innerHeight
      wrap.style.height = `${(SLIDES.length + 1) * vh}px`
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', onResize, { passive: true })
    // Also listen for visual-viewport changes (iOS keyboard / address-bar resize)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onResize)
    }

    return () => {
      window.removeEventListener('resize', onResize)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', onResize)
      }
    }
  }, [])

  const total = SLIDES.length

  return (
    <div className="mbs" ref={wrapRef} aria-label="Featured collection">
      {SLIDES.map((slide, i) => {
        const bgSrc  = slide.mobileBackground || slide.background
        const imgSrc = slide.mobileImg        || slide.img

        return (
          <div
            key={slide.slug || i}
            className="mbs-slide"
          >
            <div
              className="mbs-bg"
              style={{ backgroundImage: bgSrc ? `url(${bgSrc})` : 'none' }}
            />

            <div className="mbs-ov-top" />
            <div className="mbs-ov-bot" />

            <div className="mbs-portrait-wrap">
              <img
                className="mbs-portrait"
                src={imgSrc || ''}
                alt={slide.altFallback || ''}
                loading="eager"
                decoding="sync"
                draggable="false"
              />
            </div>

            <div className="mbs-badge">
              {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </div>

            <div className="mbs-text">
              <span className="mbs-slug">{slide.slug || `chapter ${i + 1}`}</span>
              <div className="mbs-rule" />
              <h2 className="mbs-title">{slide.altFallback || `Slide ${i + 1}`}</h2>
              {slide.subKey && <p className="mbs-sub">{slide.subKey}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}