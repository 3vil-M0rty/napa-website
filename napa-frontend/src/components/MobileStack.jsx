// MobileStack.jsx

import { useEffect, useRef } from 'react'
import { SLIDES } from './ScrollSection'
import { useTranslation } from 'react-i18next'

const ID = 'mbs3'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300;1,400&family=Montserrat:wght@200;300&display=swap');

.mbs3 {
  display: none;
}

@media (max-width: 767px) {

  .mbs3 {
    display: block;
    position: relative;
    width: 100%;
    overflow: visible;
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
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform: translateZ(0);
  }

  .mbs3-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-color: #0e0c09;
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

  .mbs3-link {
    display: inline-block;
    margin-top: 18px;
    padding: 9px 22px;
    border: 1px solid rgba(201,169,110,0.45);
    color: #c9a96e;
    font-family: 'Montserrat', sans-serif;
    font-size: 9px;
    font-weight: 300;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    text-decoration: none;
    transition: border-color 0.3s ease, color 0.3s ease;
  }

  .mbs3-link:hover {
    border-color: rgba(201,169,110,0.9);
    color: #e8c98a;
  }
}
`

export default function MobileStack() {
  const wrapRef = useRef(null)
  const { i18n, t } = useTranslation()

  useEffect(() => {
    if (document.getElementById(ID)) return
    const style = document.createElement('style')
    style.id = ID
    style.textContent = CSS
    document.head.appendChild(style)
    return () => { document.getElementById(ID)?.remove() }
  }, [])

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (!isTouch) return

    let ticking = false
    function onScroll() {
      if (ticking) return
      requestAnimationFrame(() => {
        if (window.scrollY < 0) window.scrollTo(0, 0)
        ticking = false
      })
      ticking = true
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll) }
  }, [])

  const total = SLIDES.length

  return (
    <div ref={wrapRef} className="mbs3" aria-label="Featured collection">
      {SLIDES.map((slide, i) => {
        const bgSrc = slide.mobileBackground || slide.background
        const imgSrc = slide.mobileImg || slide.img

        return (
          <section
            key={slide.slug || i}
            className="mbs3-slide"
            id={slide.navId || undefined}
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
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable="false"
              />
            </div>

            <div className="mbs3-badge">
              {String(i + 1).padStart(2, '0')}
              {' / '}
              {String(total).padStart(2, '0')}
            </div>

            <div className="mbs3-text">
              <span className="mbs3-slug">
                {t(`experience.slides.${['one', 'oneone', 'six', 'two', 'three', 'four', 'five'][i]}.slug`, slide.slug)}
              </span>

              <div className="mbs3-rule" />

              <h2 className="mbs3-title">
                {t(slide.titleKey, slide.altFallback)}
              </h2>

              {slide.subKey && (
                <p className="mbs3-sub">
                  {t(slide.subKey)}
                </p>
              )}

              {slide.externalLink && (
                <a
                  href={slide.externalLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mbs3-link"
                >
                  {i18n.language === 'fr' ? slide.externalLink.fr : slide.externalLink.en}
                </a>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}