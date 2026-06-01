// src/components/ScrollSection.jsx
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const SLIDES = [
  {
    background:       '/images/a1.webp',
    mobileBackground: '/images/a1.webp',
    titleKey:         'experience.slides.one.title',
    subKey:           'experience.slides.one.sub',
    img:              '/images/a0.webp',
    mobileImg:        '/images/a0.webp',
    altKey:           'experience.slides.one.imgAlt',
    altFallback:      'Intimate candlelit dining room at NAPA Chapter One',
    bgAlt:            'NAPA Chapter One dining room',
    slug:             'intimate-escape',
    navId:            'experience-intimate-escape',
    slideKey:       'one',
  },
  {
    background:       '/images/food.webp',
    mobileBackground: '/images/food.webp',
    titleKey:         'experience.slides.six.title',
    subKey:           'experience.slides.six.sub',
    img:              '/images/chef.webp',
    mobileImg:        '/images/chef.webp',
    altKey:           'experience.slides.six.imgAlt',
    altFallback:      'Chef Driss Alaoui plating seasonal farm-to-table dishes at NAPA Chapter One',
    bgAlt:            'NAPA Chapter One kitchen',
    slug:             'kitchen-driss-alaoui',
    navId:            'experience-kitchen-driss-alaoui',
    externalLink: {
      href: 'https://www.instagram.com/driss__aloui/',
      en:   'Visit the Chef',
      fr:   'Visiter le Chef',
    },
    slideKey:       'six',
  },
  {
    background:       '/images/drinkb.webp',
    mobileBackground: '/images/drinkb.webp',
    titleKey:         'experience.slides.two.title',
    subKey:           'experience.slides.two.sub',
    img:              '/images/drinks.webp',
    mobileImg:        '/images/drinks.webp',
    altKey:           'experience.slides.two.imgAlt',
    altFallback:      'Handcrafted cocktails with Moroccan botanicals at NAPA Chapter One wine bar',
    bgAlt:            'NAPA Chapter One cocktail bar',
    slug:             'crafted-cocktails',
    navId:            'experience-crafted-cocktails',
    slideKey:       'two',
  },
  {
    background:       '/images/slimane.webp',
    mobileBackground: '/images/slimane.webp',
    titleKey:         'experience.slides.three.title',
    subKey:           'experience.slides.three.sub',
    img:              '/images/slima.webp',
    mobileImg:        '/images/slima.webp',
    altKey:           'experience.slides.three.imgAlt',
    altFallback:      'Sanctuary Slimane farm ingredients used in NAPA Chapter One seasonal menu',
    bgAlt:            'Sanctuary Slimane farm',
    slug:             'farm-to-table',
    navId:            'experience-farm-to-table',
    externalLink: {
      href: 'https://www.sanctuaryslimane.com/',
      en:   'Visit the Farm',
      fr:   'Visiter la Ferme',
    },
    slideKey:       'three',
  },
]

const IS_DESKTOP =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches

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

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500&display=swap');

  .ss-wrap {
    position: relative;
    background: #0a0a0a;
    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

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
    filter: brightness(0.3) blur(2px);
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
    color: #8b1d1f;
    margin-bottom: 1.1rem;
  }

  .ss-rule {
    display: block;
    width: 32px;
    height: 1px;
    background: #8b1d1f;
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

  .ss-link {
    display: inline-block;
    margin-top: 2rem;
    padding: 10px 26px;
    border: 1px solid rgba(250,246,239,0.25);
    color: rgba(250,246,239,0.6);
    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    text-decoration: none;
    pointer-events: auto;
    transition: border-color 0.3s ease, color 0.3s ease;
  }

  .ss-link:hover {
    border-color: rgba(250,246,239,0.7);
    color: #faf6ef;
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

  @media (pointer: coarse) {
    .ss-wrap { display: none !important; }
  }
`

export default function ScrollSection() {
  const wrapRef = useRef(null)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    if (!IS_DESKTOP) return

    const triggers = wrap.querySelectorAll('.ss-trigger')
    const items    = wrap.querySelectorAll('.ss-item')

    const ctx = gsap.context(() => {
      triggers.forEach((trigger, i) => {
        const bg       = trigger.querySelector('.ss-bg')
        const item     = items[i]
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

        <div style={{ position: 'relative' }} aria-hidden="true">
          {SLIDES.map((s, i) => (
            <div key={i} className="ss-trigger" id={`experience-${s.slug}`}>
              <img
                src={s.background}
                className="ss-bg"
                alt={s.bgAlt}
                width="1920"
                height="1080"
                loading="lazy"
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

                    {s.externalLink && (
                      <a
                        href={s.externalLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ss-link"
                      >
                        {i18n.language === 'fr' ? s.externalLink.fr : s.externalLink.en}
                      </a>
                    )}
                  </div>
                  <figure className="ss-img-wrap" style={{ margin: 0 }}>
                    <div className="ss-img-shape">
                      <img
                        src={s.img}
                        alt={t(s.altKey, s.altFallback)}
                        width="800"
                        height="1000"
                        loading="lazy"
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
      </section>
    </>
  )
}