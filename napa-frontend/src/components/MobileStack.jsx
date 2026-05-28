// MobileStack.jsx
// Mobile-only: sticky card stack — each card pins at top:0
// while the next card scrolls up over it.
// COMPLETELY ISOLATED — zero shared classnames with ScrollSection or anything else.
// All classnames prefixed with "mbs__" to guarantee no collision.

import { useEffect } from 'react'
import { SLIDES } from './ScrollSection'

/* ─── ISOLATED CSS ───────────────────────────────────────────────────────── */
const MBS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Montserrat:wght@200;300&display=swap');

/* ── Only show on phones ── */
.mbs__section {
  display: none;
}
@media (max-width: 767px) {
  .mbs__section {
    display: block;
    /* CRITICAL: kill any horizontal overflow at this root */
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
    /* no overflow-y — must not create a scroll container */
    position: relative;
  }
}

/*
  Each slide occupies 200svh of scroll distance except the last (100svh).
  CRITICAL: NO overflow property on .mbs__slide — any value except
  the default "visible" breaks position:sticky inside it.
*/
.mbs__slide {
  position: relative;
  width: 100%;
}

/*
  The sticky panel pins at top:0 for 100svh.
  overflow:hidden here is safe — it only clips the panel's own
  contents, not the sticky positioning mechanism.
  z-index increments so each new card visually covers the previous.
*/
.mbs__pin {
  position: sticky;
  top: 0;
  height: 100svh;
  width: 100%;
  overflow: hidden;
}

/* Background image — vertically oversized for parallax, flush horizontally */
.mbs__bg {
  position: absolute;
  top: -8%;
  left: 0;
  right: 0;
  bottom: -8%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  will-change: transform;
}

/* Dark overlays */
.mbs__ov-top {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(8,6,4,.45) 0%, transparent 35%);
  pointer-events: none;
}
.mbs__ov-bot {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(8,6,4,.85) 0%, rgba(8,6,4,.15) 55%, transparent 75%);
  pointer-events: none;
}

/* Portrait image — centred, lifted slightly */
.mbs__portrait-wrap {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.mbs__portrait {
  display: block;
  width: 62%;
  max-width: 280px;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: 2px;
  transform: translateY(-5%);
  box-shadow: 0 32px 72px rgba(0,0,0,.65), 0 0 0 1px rgba(201,169,110,.12);
}

/* Badge top-right */
.mbs__badge {
  position: absolute;
  top: 24px;
  right: 20px;
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  font-weight: 200;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: rgba(201,169,110,.6);
  pointer-events: none;
}

/* Text block bottom-centre — fades in via .mbs__text--visible */
.mbs__text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 26px 50px;
  text-align: center;
  pointer-events: none;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity .65s cubic-bezier(.23,1,.32,1),
              transform .65s cubic-bezier(.23,1,.32,1);
}
.mbs__text--visible {
  opacity: 1;
  transform: translateY(0);
}

.mbs__slug {
  display: block;
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  font-weight: 200;
  letter-spacing: .32em;
  text-transform: uppercase;
  color: #c9a96e;
  margin-bottom: 10px;
}
.mbs__rule {
  display: block;
  width: 24px;
  height: 1px;
  background: #c9a96e;
  opacity: .5;
  margin: 0 auto 10px;
}
.mbs__title {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 300;
  font-size: clamp(24px, 8vw, 36px);
  line-height: 1.08;
  color: #f5f0e8;
  letter-spacing: .01em;
  margin: 0 0 6px;
}
.mbs__sub {
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  font-weight: 200;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: rgba(245,240,232,.55);
}
`

/* ─── COMPONENT ──────────────────────────────────────────────────────────── */
export default function MobileStack() {

  /* Inject isolated stylesheet once */
  useEffect(() => {
    const ID = 'mbs-styles-v1'
    if (document.getElementById(ID)) return
    const el = document.createElement('style')
    el.id = ID
    el.textContent = MBS_CSS
    document.head.appendChild(el)
    return () => document.getElementById(ID)?.remove()
  }, [])

  /* Scroll handler: parallax + text fade */
  useEffect(() => {
    const pins   = document.querySelectorAll('.mbs__pin')
    const bgs    = document.querySelectorAll('.mbs__bg')
    const texts  = document.querySelectorAll('.mbs__text')
    const VH     = () => window.innerHeight

    const onScroll = () => {
      const vh = VH()
      pins.forEach((pin, i) => {
        const rect = pin.getBoundingClientRect()

        /* Parallax: bg drifts up as card scrolls through */
        const progress = Math.max(0, Math.min(1, -rect.top / vh))
        if (bgs[i]) {
          bgs[i].style.transform = `translateZ(0) translateY(${progress * 8}%)`
        }

        /* Text visible while card is on screen */
        const onScreen = rect.top < vh * 0.9 && rect.bottom > 0
        if (texts[i]) {
          texts[i].classList.toggle('mbs__text--visible', onScreen)
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const total = SLIDES.length

  return (
    <section className="mbs__section" aria-label="Featured collection">
      {SLIDES.map((slide, i) => {
        const isLast = i === total - 1
        return (
          <div
            key={slide.slug || i}
            className="mbs__slide"
            style={{
              height:  isLast ? '100svh' : '200svh',
              zIndex:  i + 1,
            }}
          >
            <div className="mbs__pin">

              {/* Background */}
              <div
                className="mbs__bg"
                style={{
                  backgroundImage:   slide.background ? `url(${slide.background})` : 'none',
                  backgroundColor:  '#0f0d0a',
                }}
                role="img"
                aria-label={slide.bgAlt || slide.altFallback || ''}
              />

              <div className="mbs__ov-top" aria-hidden="true" />
              <div className="mbs__ov-bot" aria-hidden="true" />

              {/* Portrait */}
              <div className="mbs__portrait-wrap">
                <img
                  className="mbs__portrait"
                  src={slide.img || ''}
                  alt={slide.altFallback || ''}
                  loading="eager"
                  decoding="sync"
                />
              </div>

              {/* Badge */}
              <div className="mbs__badge" aria-hidden="true">
                {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </div>

              {/* Text */}
              <div className="mbs__text">
                <span className="mbs__slug">{slide.slug || `chapter ${i + 1}`}</span>
                <div className="mbs__rule" aria-hidden="true" />
                <h2 className="mbs__title">{slide.altFallback || `Slide ${i + 1}`}</h2>
                {slide.subKey && <p className="mbs__sub">{slide.subKey}</p>}
              </div>

            </div>
          </div>
        )
      })}
    </section>
  )
}