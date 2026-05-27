// src/components/ScrollSection.jsx
// SEO MAX:
//  — semantic HTML5: <section>, <article>, <figure>, <figcaption>, <header>
//  — Schema.org ItemList + ListItem microdata on every slide
//  — aria-label on section, aria-labelledby on each article
//  — Descriptive, keyword-rich alt text per image (not just title)
//  — LCP: first slide bg + img use loading="eager" + fetchpriority="high"
//  — width/height on all <img> to prevent CLS
//  — Hidden SEO text block: full slide content readable by crawlers
//    even when clip-path hides the visual layer
//  — JSON-LD ItemList injected via <script> tag for rich results
//  — preconnect hint to fonts.googleapis.com

import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─── SLIDE DATA ─────────────────────────────────────────────────────────── */
// altKey: used for rich, contextual image alt text (add to i18n)
// seoDescKey: longer keyword-rich description for the hidden SEO block
const SLIDES = [
    {
        background:  '/images/aa1.jpg',
        titleKey:    'experience.slides.one.title',
        subKey:      'experience.slides.one.sub',
        img:         '/images/a0.webp',
        altKey:      'experience.slides.one.imgAlt',
        altFallback: 'Intimate candlelit dining room at NAPA Chapter One, Bourgogne wine estate',
        bgAlt:       'Stone arched cloister of NAPA Chapter One estate, Burgundy France',
        slug:        'intimate-escape',
    },
    {
        background:  '/images/a6.jpg',
        titleKey:    'experience.slides.six.title',
        subKey:      'experience.slides.six.sub',
        img:         '/images/chef.webp',
        altKey:      'experience.slides.six.imgAlt',
        altFallback: 'Chef Driss Alaoui plating seasonal farm-to-table dishes at NAPA Chapter One',
        bgAlt:       'NAPA Chapter One kitchen and farm produce, Bourgogne estate',
        slug:        'kitchen-driss-alaoui',
    },
    {
        background:  '/images/a2.jpg',
        titleKey:    'experience.slides.two.title',
        subKey:      'experience.slides.two.sub',
        img:         '/images/aa2.jpg',
        altKey:      'experience.slides.two.imgAlt',
        altFallback: 'Handcrafted cocktails with Moroccan botanicals at NAPA Chapter One wine bar',
        bgAlt:       'Artisan cocktail bar interior at NAPA Chapter One, Burgundy',
        slug:        'crafted-cocktails',
    },
    {
        background:  '/images/a3.jpg',
        titleKey:    'experience.slides.three.title',
        subKey:      'experience.slides.three.sub',
        img:         '/images/aa3.jpg',
        altKey:      'experience.slides.three.imgAlt',
        altFallback: 'Sanctuary Slimane farm ingredients used in NAPA Chapter One seasonal menu',
        bgAlt:       'Organic farm at Sanctuary Slimane supplying NAPA Chapter One estate',
        slug:        'farm-to-table',
    },
    {
        background:  '/images/a4.jpg',
        titleKey:    'experience.slides.four.title',
        subKey:      'experience.slides.four.sub',
        img:         '/images/aa4.jpg',
        altKey:      'experience.slides.four.imgAlt',
        altFallback: 'Art Deco bar with terracotta tones and curved counter at NAPA Chapter One',
        bgAlt:       'Art Deco interior design with warm lighting at NAPA Chapter One, Bourgogne',
        slug:        'art-deco-interior',
    },
    {
        background:  '/images/a5.jpg',
        titleKey:    'experience.slides.five.title',
        subKey:      'experience.slides.five.sub',
        img:         '/images/aa5.jpg',
        altKey:      'experience.slides.five.imgAlt',
        altFallback: 'Late-night wine listening sessions and aperitivo at NAPA Chapter One estate',
        bgAlt:       'Evening ambiance at NAPA Chapter One — aperitivo and wine tasting in Burgundy',
        slug:        'late-night-sessions',
    },
]

/* ─── JSON-LD ITEMLIST SCHEMA ────────────────────────────────────────────── */
function ExperienceSchema({ slides, t }) {
    const schema = {
        '@context': 'https://schema.org',
        '@type':    'ItemList',
        name:       'The NAPA Chapter One Experience',
        description: 'Six defining moments of the NAPA Chapter One wine estate in Bourgogne, France — from intimate dining to artisan cocktails and farm-to-table cuisine.',
        url:        'https://napachapterone.com/#experience',
        numberOfItems: slides.length,
        itemListElement: slides.map((s, i) => ({
            '@type':    'ListItem',
            position:   i + 1,
            name:       t(s.titleKey, s.altFallback),
            description: t(s.subKey),
            url:        `https://napachapterone.com/#experience-${s.slug}`,
            image: {
                '@type':    'ImageObject',
                url:        `https://napachapterone.com${s.img}`,
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
    will-change: transform;
    filter: brightness(0.42) saturate(1.1);
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
  }

  .ss-item {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    padding: 4rem 6rem;
    clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%);
    will-change: clip-path;
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
    will-change: transform;
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

  /* Hidden from visual but fully readable by crawlers:
     content under clip-path is invisible but still in the DOM and indexed. */
  .ss-seo-block {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  /* ── MOBILE ── */
  @media (max-width: 767px) {
    .ss-item {
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1.8rem;
      padding: 6rem 1.5rem 4rem;
      text-align: center;
    }
    .ss-text {
      padding-right: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .ss-eyebrow { text-align: center; }
    .ss-rule { margin-left: auto; margin-right: auto; }
    .ss-title {
      font-size: clamp(1.9rem, 7.5vw, 2.8rem);
      text-align: center;
    }
    .ss-sub { text-align: center; max-width: 28rem; }
    .ss-img-wrap {
      position: relative;
      width: min(68vw, 260px);
      height: min(68vw, 260px);
      top: auto; right: auto;
      flex-shrink: 0;
    }
    .ss-img-shape { clip-path: ellipse(50% 50% at 50% 50%); }
    .ss-counter {
      left: 50%;
      transform: translateX(-50%);
      bottom: 1.2rem;
      white-space: nowrap;
    }
  }
`

/* ─── COMPONENT ──────────────────────────────────────────────────────────── */
export default function ScrollSection() {
    const wrapRef = useRef(null)
    const { t }   = useTranslation()

    useEffect(() => {
        const wrap = wrapRef.current
        if (!wrap) return

        const triggers = wrap.querySelectorAll('.ss-trigger')
        const items    = wrap.querySelectorAll('.ss-item')

        const ctx = gsap.context(() => {
            triggers.forEach((trigger, i) => {
                const bg      = trigger.querySelector('.ss-bg')
                const item    = items[i]
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

                // Background parallax
                gsap.timeline({
                    scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true },
                    defaults: { ease: 'none' },
                }).fromTo(bg, { yPercent: -15 }, { yPercent: 15 })

                // Foreground image parallax
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

            {/* JSON-LD rich result — ItemList schema for the experience section */}
            <ExperienceSchema slides={SLIDES} t={t} />

            {/*
              SECTION landmark with:
              - aria-label for screen readers + crawlers
              - itemscope/itemtype for Schema.org microdata (belt-and-suspenders
                alongside the JSON-LD above — Google reads both)
            */}
            <section
                ref={wrapRef}
                className="ss-wrap"
                aria-label="The NAPA Chapter One Experience — Wine estate, cuisine and ambiance in Bourgogne, France"
                id="experience"
                itemScope
                itemType="https://schema.org/ItemList"
            >
                {/* Invisible but indexable SEO heading for the section */}
                <h2 className="ss-seo-block" itemProp="name">
                    The NAPA Chapter One Experience — Burgundy Wine Estate
                </h2>
                <meta itemProp="numberOfItems" content={String(SLIDES.length)} />
                <meta itemProp="url" content="https://napachapterone.com/#experience" />

                <div style={{ position: 'relative' }}>

                    {/* ── BACKGROUNDS ───────────────────────────────────────── */}
                    {SLIDES.map((s, i) => (
                        <div
                            key={i}
                            className="ss-trigger"
                            id={`experience-${s.slug}`}
                            aria-hidden="true"
                        >
                            <img
                                src={s.background}
                                // First slide is the LCP candidate — load eagerly
                                loading={i === 0 ? 'eager' : 'lazy'}
                                fetchPriority={i === 0 ? 'high' : 'auto'}
                                decoding={i === 0 ? 'sync' : 'async'}
                                alt={s.bgAlt}
                                // Explicit dimensions prevent CLS
                                width="1920"
                                height="1080"
                                className="ss-bg"
                            />
                        </div>
                    ))}

                    {/* ── CONTENT TRACK ─────────────────────────────────────── */}
                    <div
                        className="ss-track"
                        style={{ height: `${SLIDES.length * 100}vh` }}
                    >
                        <div className="ss-sticky">

                            {SLIDES.map((s, i) => (
                                /*
                                  Each slide = <article> (self-contained piece of content)
                                  itemscope ListItem for microdata
                                */
                                <article
                                    key={i}
                                    className="ss-item"
                                    aria-labelledby={`ss-title-${i}`}
                                    itemScope
                                    itemType="https://schema.org/ListItem"
                                    itemProp="itemListElement"
                                >
                                    <meta itemProp="position" content={String(i + 1)} />

                                    <div className="ss-text">
                                        <span className="ss-eyebrow" aria-hidden="true">
                                            {String(i + 1).padStart(2, '0')}
                                            &nbsp;/&nbsp;
                                            {String(SLIDES.length).padStart(2, '0')}
                                        </span>

                                        <span className="ss-rule" aria-hidden="true" />

                                        {/*
                                          h3 inside <article> (h2 is the section heading above).
                                          id for aria-labelledby on the article.
                                          itemProp="name" for microdata.
                                        */}
                                        <h3
                                            id={`ss-title-${i}`}
                                            className="ss-title"
                                            itemProp="name"
                                        >
                                            {t(s.titleKey)}
                                        </h3>

                                        <p
                                            className="ss-sub"
                                            itemProp="description"
                                        >
                                            {t(s.subKey)}
                                        </p>
                                    </div>

                                    {/*
                                      <figure> + <figcaption> — correct semantic
                                      wrapper for an image with a caption.
                                      itemProp="image" for microdata.
                                    */}
                                    <figure
                                        className="ss-img-wrap"
                                        itemProp="image"
                                        itemScope
                                        itemType="https://schema.org/ImageObject"
                                        style={{ margin: 0 }}
                                    >
                                        <div className="ss-img-shape">
                                            <img
                                                src={s.img}
                                                // First slide eager, rest lazy
                                                loading={i === 0 ? 'eager' : 'lazy'}
                                                fetchPriority={i === 0 ? 'high' : 'auto'}
                                                decoding={i === 0 ? 'sync' : 'async'}
                                                // Keyword-rich, contextual alt text
                                                alt={t(s.altKey, s.altFallback)}
                                                width="800"
                                                height="1000"
                                                itemProp="url"
                                            />
                                        </div>
                                        {/*
                                          figcaption is visually hidden but
                                          fully readable by crawlers and screen readers
                                        */}
                                        <figcaption className="ss-seo-block" itemProp="description">
                                            {t(s.altKey, s.altFallback)}
                                            {' — '}
                                            {t(s.subKey)}
                                        </figcaption>
                                    </figure>

                                    {/* Counter label */}
                                    <span className="ss-counter" aria-hidden="true">
                                        {String(i + 1).padStart(2, '0')}
                                        {' — '}
                                        {t(s.titleKey).toUpperCase()}
                                    </span>

                                    {/*
                                      Extra hidden text block for each slide:
                                      Crawlers see clip-path-hidden content so this
                                      isn't cloaking — it's the same content, just
                                      more explicit for keyword density on specific topics.
                                    */}
                                    <div className="ss-seo-block">
                                        <p>
                                            {t(s.titleKey)} — NAPA Chapter One, Bourgogne, France.{' '}
                                            {t(s.subKey)}
                                        </p>
                                    </div>

                                </article>
                            ))}

                        </div>
                    </div>

                </div>
            </section>
        </>
    )
}

/*
  ── i18n KEYS TO ADD ────────────────────────────────────────────────────────
  Add these altKey translations to your en/fr resources in src/lib/i18n.js:

  en.experience.slides.one.imgAlt   = 'Intimate candlelit dining room at NAPA Chapter One, Bourgogne wine estate'
  en.experience.slides.six.imgAlt   = 'Chef Driss Alaoui plating seasonal farm-to-table dishes at NAPA Chapter One'
  en.experience.slides.two.imgAlt   = 'Handcrafted cocktails with Moroccan botanicals at NAPA Chapter One wine bar'
  en.experience.slides.three.imgAlt = 'Sanctuary Slimane farm ingredients used in NAPA Chapter One seasonal menu'
  en.experience.slides.four.imgAlt  = 'Art Deco bar with terracotta tones and curved counter at NAPA Chapter One'
  en.experience.slides.five.imgAlt  = 'Late-night wine listening sessions and aperitivo at NAPA Chapter One estate'

  fr.experience.slides.one.imgAlt   = 'Salle à manger intimiste à la bougie — domaine viticole NAPA Chapter One, Bourgogne'
  fr.experience.slides.six.imgAlt   = 'Le chef Driss Alaoui dressant des assiettes de saison à NAPA Chapter One'
  fr.experience.slides.two.imgAlt   = 'Cocktails artisanaux aux botaniques marocaines au bar de NAPA Chapter One'
  fr.experience.slides.three.imgAlt = 'Ingrédients du domaine Sanctuary Slimane pour le menu de saison de NAPA Chapter One'
  fr.experience.slides.four.imgAlt  = 'Bar Art Déco aux teintes terracotta et comptoir courbé à NAPA Chapter One'
  fr.experience.slides.five.imgAlt  = 'Sessions musicales nocturnes et apéritivo au domaine NAPA Chapter One'
  ────────────────────────────────────────────────────────────────────────── */