import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const assets = [
  {
    heading: 'The Bar',
    para: "My paragraph is long but it's not that long really just look at the buildings then the sky then back to the buildings.",
    bg: '#ffffff',
    origin: [-0.5, -0.5],
    scale: 1.05,
  },
  {
    heading: 'The Terrace',
    para: "My paragraph is long but it's not that long really just look at the buildings then the sky then back to the buildings.",
    bg: '#ffffff',
    origin: [0.7, 0.3],
    scale: 1.8,
  },
  {
    heading: 'Private Dining',
    para: "My paragraph is long but it's not that long really just look at the buildings then the sky then back to the buildings.",
    bg: '#ffffff',
    origin: [1,1],
    scale: 3.2,
  },
]

const isStacked = () => window.innerWidth < 768

export default function ImageZoomSection() {
  const container = useRef(null)
  const imageRef = useRef(null)
  const killersRef = useRef([])

  const setupScrollTriggers = () => {
    // Kill any existing ScrollTriggers we created
    killersRef.current.forEach(k => k.kill())
    killersRef.current = []

    if (!imageRef.current) return

    // Reset the image transform for the new layout
    gsap.set(imageRef.current, {
      scale: 1,
      xPercent: 0,
      yPercent: 0,
      transformOrigin: '0px 0px',
    })

    // Register the zoomImage effect once
    if (!gsap.effects.zoomImage) {
      gsap.registerEffect({
        name: 'zoomImage',
        effect: (targets, config) => {
          const { scale, origin, duration, ease } = config
          const clamp = gsap.utils.clamp(-100 * (scale - 1), 0)

          return gsap.to(targets, {
            scale,
            xPercent: clamp((0.5 - origin[0] * scale) * 100),
            yPercent: clamp((0.5 - origin[1] * scale) * 100),
            transformOrigin: '0px 0px',
            overwrite: 'auto',
            duration,
            ease,
          })
        },
        extendTimeline: true,
        defaults: { origin: [0.5, 0.5], scale: 2, duration: 0.8, ease: 'power2.inOut' },
      })
    }

    const sections = container.current.querySelectorAll('.sectionSc')

    // On mobile the image sits at the top as a sticky banner, so sections
    // scroll up from below — use a lower threshold to fire the zoom in time.
    const triggerStart = isStacked() ? 'top 80%' : 'top 40%'
    const triggerEnd   = isStacked() ? 'bottom 80%' : 'bottom 40%'

    sections.forEach((section, index) => {
      const { origin, scale } = assets[index]

      const st = ScrollTrigger.create({
        trigger: section,
        start: triggerStart,
        end: triggerEnd,
        onEnter: () => {
          gsap.effects.zoomImage(imageRef.current, { origin, scale })
        },
        onEnterBack: () => {
          gsap.effects.zoomImage(imageRef.current, { origin, scale })
        },
      })

      killersRef.current.push(st)
    })

    // Reset zoom when scrolled back above the first section
    const resetSt = ScrollTrigger.create({
      trigger: sections[0],
      start: 'top 60%',
      onLeaveBack: () => {
        gsap.to(imageRef.current, {
          scale: 1,
          xPercent: 0,
          yPercent: 0,
          transformOrigin: '0px 0px',
          overwrite: 'auto',
          duration: 0.8,
          ease: 'power2.inOut',
        })
      },
    })

    killersRef.current.push(resetSt)
  }

  useGSAP(
    () => {
      setupScrollTriggers()
    },
    { scope: container }
  )

  useEffect(() => {
    let timer

    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        // Recalculate scroll positions for the new viewport size,
        // then rebuild all triggers with the correct thresholds.
        ScrollTrigger.refresh()
        setupScrollTriggers()
      }, 150)
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(timer)
      killersRef.current.forEach(k => k.kill())
    }
  }, [])

  return (
    <div ref={container} className="contentZoom">
      {/* ── Left / bottom on mobile: scrolling text sections ── */}
      <div className="leftSection">
        {assets.map((item, index) => (
          <section key={index} className="sectionSc" style={{ backgroundColor: item.bg }}>
            <div className="section-content">
              <h1>{item.heading}</h1>
              <p>{item.para}</p>
            </div>
          </section>
        ))}
      </div>

      {/* ── Right / top on mobile: sticky image that zooms ── */}
      <div className="rightSection">
        <div className="zoom-wrapper">
          <img
            ref={imageRef}
            className="zoom-target"
            src="/images/background.png"
            alt="Restaurant interior"
          />
        </div>
      </div>
    </div>
  )
}