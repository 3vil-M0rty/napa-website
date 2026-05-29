import { useEffect, useRef } from 'react'
import { SLIDES } from './ScrollSection'

const ID = 'mbs3'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300;1,400&family=Montserrat:wght@200;300&display=swap');

.mbs3 { display: none; }

@media (pointer: coarse) {
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

  .mbs3-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-color: #0a0a0a;
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
    color: #faf6ef;
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

  // ─── Z-index management ──────────────────────────────────────────────────
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const slides = wrap.querySelectorAll('.mbs3-slide')
    const total  = slides.length

    function updateZIndex() {
      const y = window.scrollY
      const wrapTop    = wrap.offsetTop
      const wrapBottom = wrapTop + wrap.offsetHeight
      const vh         = window.innerHeight

      // ── Only manage z-index while scroll is within the MobileStack zone.
      // Once the user scrolls past the last slide (into ImageGallery),
      // lock all slides at their final stacked state and do nothing more.
      // This prevents the listener from interfering with sections below.
      if (y < wrapTop) {
        // Above MobileStack — reset to natural order
        slides.forEach((slide, i) => { slide.style.zIndex = String(i) })
        return
      }

      if (y >= wrapBottom - vh) {
        // At or past the end of MobileStack — lock all slides as fully stacked
        slides.forEach((slide, i) => { slide.style.zIndex = String(total + i) })
        return
      }

      // Inside MobileStack — calculate which slide we're on
      const relY    = y - wrapTop
      const current = Math.min(Math.floor(relY / vh), total - 1)

      slides.forEach((slide, i) => {
        slide.style.zIndex = i <= current
          ? String(total + i)   // on top: stacked
          : String(i)           // below: natural order
      })
    }

    window.addEventListener('scroll', updateZIndex, { passive: true })
    updateZIndex() // init on mount

    return () => window.removeEventListener('scroll', updateZIndex)
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