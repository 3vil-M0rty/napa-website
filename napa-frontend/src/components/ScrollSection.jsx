// src/components/ScrollSection.jsx
// Desktop: original GSAP sticky-track clip-path animation (untouched)
// Mobile:  sticky card-stack — each card sticks at top while the next scrolls over it

import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─── SLIDE DATA ─────────────────────────────────────────────────────────── */
export const SLIDES = [
  {
    background: '/images/chef.webp',
    titleKey: 'experience.slides.one.title',
    subKey: 'experience.slides.one.sub',
    img: '/images/a0.webp',
    altKey: 'experience.slides.one.imgAlt',
    altFallback: 'Intimate candlelit dining room at NAPA Chapter One, Bourgogne wine estate',
    bgAlt: 'Stone arched cloister of NAPA Chapter One estate, Burgundy France',
    slug: 'intimate-escape',
  },
  {
    background: '/images/chef.webp',
    titleKey: 'experience.slides.six.title',
    subKey: 'experience.slides.six.sub',
    img: '/images/chef.webp',
    altKey: 'experience.slides.six.imgAlt',
    altFallback: 'Chef Driss Alaoui plating seasonal farm-to-table dishes at NAPA Chapter One',
    bgAlt: 'NAPA Chapter One kitchen and farm produce, Bourgogne estate',
    slug: 'kitchen-driss-alaoui',
  },
  {
    background: '/images/chef.webp',
    titleKey: 'experience.slides.two.title',
    subKey: 'experience.slides.two.sub',
    img: '/images/chef.webp',
    altKey: 'experience.slides.two.imgAlt',
    altFallback: 'Handcrafted cocktails with Moroccan botanicals at NAPA Chapter One wine bar',
    bgAlt: 'Artisan cocktail bar interior at NAPA Chapter One, Burgundy',
    slug: 'crafted-cocktails',
  },
  {
    background: '/images/chef.webp',
    titleKey: 'experience.slides.three.title',
    subKey: 'experience.slides.three.sub',
    img: '/images/chef.webp',
    altKey: 'experience.slides.three.imgAlt',
    altFallback: 'Sanctuary Slimane farm ingredients used in NAPA Chapter One seasonal menu',
    bgAlt: 'Organic farm at Sanctuary Slimane supplying NAPA Chapter One estate',
    slug: 'farm-to-table',
  },
  {
    background: '/images/chef.webp',
    titleKey: 'experience.slides.four.title',
    subKey: 'experience.slides.four.sub',
    img: '/images/chef.webp',
    altKey: 'experience.slides.four.imgAlt',
    altFallback: 'Art Deco bar with terracotta tones and curved counter at NAPA Chapter One',
    bgAlt: 'Art Deco interior design with warm lighting at NAPA Chapter One, Bourgogne',
    slug: 'art-deco-interior',
  },
  {
    background: '/images/chef.webp',
    titleKey: 'experience.slides.five.title',
    subKey: 'experience.slides.five.sub',
    img: '/images/chef.webp',
    altKey: 'experience.slides.five.imgAlt',
    altFallback: 'Late-night wine listening sessions and aperitivo at NAPA Chapter One estate',
    bgAlt: 'Evening ambiance at NAPA Chapter One — aperitivo and wine tasting in Burgundy',
    slug: 'late-night-sessions',
  },
]

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */
function ExperienceSchema({ slides, t }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'The NAPA Chapter One Experience',
    description: 'Six defining moments of the NAPA Chapter One wine estate in Bourgogne, France.',
    url: 'https://napachapterone.com/#experience',
    numberOfItems: slides.length,
    itemListElement: slides.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t(s.titleKey, s.altFallback),
      description: t(s.subKey),
      url: `https://napachapterone.com/#experience-${s.slug}`,
      image: {
        '@type': 'ImageObject',
        url: `https://napachapterone.com${s.img}`,
        description: s.altFallback,
      },
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/* ─── CSS ────────────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500&display=swap');

  .ss-wrap {
    position: relative;
    background: #0a0a0a;
    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  /* ════════════════════════════════════════
     DESKTOP — sticky-track (original)
  ════════════════════════════════════════ */
  .ss-trigger {
    height: 100vh;
    position: relative;
    overflow: hidden;
  }

  .ss-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 130%;
    top: -15%;
    object-fit: cover;
    filter: brightness(0.42) saturate(1.1);
    pointer-events: none;
  }

  .ss-trigger + .ss-trigger {
    border-top: 1px solid rgba(161,28,36,0.22);
  }

  .ss-track {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .ss-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    pointer-events: none;
  }

  .ss-item {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    padding: 4rem 6rem;
    clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%);
    pointer-events: none;
    overflow: hidden;
  }

  .ss-text {
    flex: 1;
    padding-right: 3rem;
    position: relative;
    z-index: 2;
  }

  .ss-eyebrow {
    display: block;
    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #A11C24;
    margin-bottom: 1.1rem;
  }

  .ss-rule {
    display: block;
    width: 32px;
    height: 1px;
    background: #A11C24;
    margin-bottom: 1.1rem;
  }

  .ss-title {
    font-family: 'Cormorant Garamond', 'Cormorant', Georgia, 'Times New Roman', serif;
    font-size: clamp(2.4rem, 4.2vw, 4rem);
    font-weight: 600;
    font-style: italic;
    line-height: 1.08;
    letter-spacing: -0.01em;
    color: #faf6ef;
    margin: 0 0 1.2rem;
  }

  .ss-sub {
    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 0.88rem;
    font-weight: 300;
    color: rgba(250,246,239,0.48);
    letter-spacing: 0.03em;
    line-height: 1.7;
    max-width: 32rem;
  }

  .ss-img-wrap {
    position: absolute;
    top: 0;
    right: 0;
    width: 58%;
    height: 100%;
    overflow: visible;
  }

  .ss-img-shape {
    position: absolute;
    inset: 0;
    overflow: hidden;
    clip-path: ellipse(90% 120% at 100% 110%);
  }

  .ss-img-shape img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 130%;
    top: -15%;
    object-fit: cover;
    display: block;
  }

  .ss-counter {
    position: absolute;
    bottom: 2.4rem;
    left: 6rem;
    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(250,246,239,0.2);
    font-variant-numeric: tabular-nums;
  }

  .ss-seo-block {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
    @media (max-width: 767px) {
  .ss-wrap { display: none !important; }
}
  }
`

/* ─── COMPONENT ──────────────────────────────────────────────────────────── */
export default function ScrollSection() {
  const wrapRef = useRef(null)
  const { t } = useTranslation()

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const isMobile = window.innerWidth < 768
    if (isMobile) return  // mobile is pure CSS sticky, zero JS needed

    /* DESKTOP — original GSAP sticky-track animation, untouched */
    const triggers = wrap.querySelectorAll('.ss-trigger')
    const items = wrap.querySelectorAll('.ss-item')

    const ctx = gsap.context(() => {
      triggers.forEach((trigger, i) => {
        const bg = trigger.querySelector('.ss-bg')
        const item = items[i]
        if (!item) return
        const shapeImg = item.querySelector('.ss-img-shape img')

        if (i === 0) {
          gsap.set(item, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' })
          gsap.timeline({
            scrollTrigger: { trigger, start: 'top top', end: 'bottom top', scrub: true },
            defaults: { ease: 'none' },
          }).to(item, { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' })

        } else if (i === SLIDES.length - 1) {
          gsap.timeline({
            scrollTrigger: { trigger, start: 'top bottom', end: 'bottom bottom', scrub: true },
            defaults: { ease: 'none' },
          }).fromTo(item,
            { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
            { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }
          )

        } else {
          gsap.timeline({
            scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true },
            defaults: { ease: 'none' },
          })
            .fromTo(item,
              { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
              { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }
            )
            .to(item, { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' })
        }

        gsap.timeline({
          scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true },
          defaults: { ease: 'none' },
        }).fromTo(bg, { yPercent: -15 }, { yPercent: 15 })

        if (shapeImg) {
          gsap.timeline({
            scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true },
            defaults: { ease: 'none' },
          }).fromTo(shapeImg, { yPercent: -15 }, { yPercent: 15 })
        }
      })
    }, wrap)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <style>{css}</style>
      <ExperienceSchema slides={SLIDES} t={t} />

      <section
        ref={wrapRef}
        className="ss-wrap"
        aria-label="The NAPA Chapter One Experience — Wine estate, cuisine and ambiance in Bourgogne, France"
        id="experience"
        itemScope
        itemType="https://schema.org/ItemList"
      >
        <h2 className="ss-seo-block" itemProp="name">
          The NAPA Chapter One Experience — Burgundy Wine Estate
        </h2>
        <meta itemProp="numberOfItems" content={String(SLIDES.length)} />
        <meta itemProp="url" content="https://napachapterone.com/#experience" />

        {/* ═══════════════════════════════════════
            DESKTOP — backgrounds + sticky track
        ═══════════════════════════════════════ */}
        <div style={{ position: 'relative' }} aria-hidden="true">
          {SLIDES.map((s, i) => (
            <div key={i} className="ss-trigger" id={`experience-${s.slug}`}>
              <img
                src={s.background}
                className="ss-bg"
                alt={s.bgAlt}
                width="1920"
                height="1080"
                loading="eager"
                decoding="async"
              />
            </div>
          ))}

          <div className="ss-track" style={{ height: `${SLIDES.length * 100}vh` }}>
            <div className="ss-sticky">
              {SLIDES.map((s, i) => (
                <article key={i} className="ss-item">
                  <div className="ss-text">
                    <span className="ss-eyebrow">
                      {String(i + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(SLIDES.length).padStart(2, '0')}
                    </span>
                    <span className="ss-rule" aria-hidden="true" />
                    <h3 className="ss-title" itemProp="name">{t(s.titleKey)}</h3>
                    <p className="ss-sub" itemProp="description">{t(s.subKey)}</p>
                  </div>
                  <figure className="ss-img-wrap" style={{ margin: 0 }}>
                    <div className="ss-img-shape">
                      <img
                        src={s.img}
                        alt={t(s.altKey, s.altFallback)}
                        width="800"
                        height="1000"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                    <figcaption className="ss-seo-block">
                      {t(s.altKey, s.altFallback)} — {t(s.subKey)}
                    </figcaption>
                  </figure>
                  <span className="ss-counter" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')} — {t(s.titleKey).toUpperCase()}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            MOBILE — sticky card stack
            Pure CSS: each card sticks at top:0,
            the next one scrolls up over it.
            z-index increments so cards layer correctly.
        ═══════════════════════════════════════ */}


      </section>
    </>
  )
}