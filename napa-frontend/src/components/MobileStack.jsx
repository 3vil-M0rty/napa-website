// MobileStack.jsx
import { useEffect } from 'react'
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
  }

  /*
    Extra vertical room = more visible parallax travel.
    -20%/+20% means the bg can shift 20% before clipping.
  */
  .mbs3-bg {
    position: absolute;
    top: -20%;
    bottom: -20%;
    left: 0;
    right: 0;
    background-size: cover;
    background-position: center;
    background-color: #0e0c09;
    will-change: transform;
  }

  .mbs3-portrait-img {
    position: absolute;
    top: -15%;
    bottom: -15%;
    left: 0;
    right: 0;
    background-size: cover;
    background-position: center top;
    will-change: transform;
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
  /* Portrait moves at a slower rate than bg = depth layering */
  .mbs3-portrait {
    display: block;
    width: 62%;
    max-width: 260px;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    border-radius: 2px;
    will-change: transform;
    box-shadow: 0 28px 64px rgba(0,0,0,.7), 0 0 0 1px rgba(201,169,110,.12);
  }

  .mbs3-badge {
    position: absolute;
    top: 22px;
    right: 18px;
    z-index: 3;
    font-family: 'Montserrat', sans-serif;
    font-size: 9px;
    font-weight: 200;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: rgba(201,169,110,.6);
  }

  .mbs3-text {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 24px 52px;
    text-align: center;
    z-index: 3;
    will-change: transform;
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
  }
  .mbs3-sub {
    font-family: 'Montserrat', sans-serif;
    font-size: 9px;
    font-weight: 200;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: rgba(245,240,232,.5);
  }
}
`

export default function MobileStack() {
  useEffect(() => {
    if (document.getElementById(ID)) return
    const el = document.createElement('style')
    el.id = ID
    el.textContent = CSS
    document.head.appendChild(el)
    return () => document.getElementById(ID)?.remove()
  }, [])

  useEffect(() => {
    const slides   = Array.from(document.querySelectorAll('.mbs3-slide'))
    const bgs      = Array.from(document.querySelectorAll('.mbs3-bg'))
    const portraits = Array.from(document.querySelectorAll('.mbs3-portrait'))
    const texts    = Array.from(document.querySelectorAll('.mbs3-text'))
    let raf = null

    const tick = () => {
      raf = null
      const vh = window.innerHeight

      slides.forEach((slide, i) => {
        const rect = slide.getBoundingClientRect()

        // progress: 0 when card enters top, 1 when card exits top
        // rect.top goes from +vh (entering) to 0 (pinned) to -vh (exiting)
        // We want: 0 when rect.top = 0 (fully pinned), drive from there
        const raw = -rect.top / vh
        const progress = Math.max(0, Math.min(1, raw))

        // Background drifts up — largest travel = most dramatic parallax
        // 20% oversize each side means we have 40% total travel budget
        // Use 30% of that for a strong but not clipped effect
        if (bgs[i]) {
          const bgShift = progress * 30  // 0% → 30% upward drift
          bgs[i].style.transform = `translateZ(0) translateY(-${bgShift}%)`
        }

        // Portrait moves at half the rate of the bg — creates depth separation
        if (portraits[i]) {
          const portraitShift = progress * 12
          // Start centered (translateY(-5%) from CSS), drift up slowly
          portraits[i].style.transform = `translateZ(0) translateY(calc(-5% - ${portraitShift}px))`
        }

        // Text drifts up at one-third rate — feels grounded
        if (texts[i]) {
          const textShift = progress * 18
          texts[i].style.transform = `translateZ(0) translateY(-${textShift}px)`
        }
      })
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick) }
    window.addEventListener('scroll', onScroll, { passive: true })
    tick()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const total = SLIDES.length

  return (
    <div className="mbs3" aria-label="Featured collection">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.slug || i}
          className="mbs3-slide"
          style={{ zIndex: i + 1 }}
        >
          {/* Background — slowest layer */}
          <div
            className="mbs3-bg"
            style={{ backgroundImage: slide.background ? `url(${slide.background})` : 'none' }}
          />

          <div className="mbs3-ov-top" />
          <div className="mbs3-ov-bot" />

          {/* Portrait — mid layer */}
          <div className="mbs3-portrait-wrap">
            <img
              className="mbs3-portrait"
              src={slide.img || ''}
              alt={slide.altFallback || ''}
              loading="eager"
              decoding="sync"
            />
          </div>

          <div className="mbs3-badge">
            {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>

          {/* Text — fastest layer (closest to viewer) */}
          <div className="mbs3-text">
            <span className="mbs3-slug">{slide.slug || `chapter ${i + 1}`}</span>
            <div className="mbs3-rule" />
            <h2 className="mbs3-title">{slide.altFallback || `Slide ${i + 1}`}</h2>
            {slide.subKey && <p className="mbs3-sub">{slide.subKey}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}