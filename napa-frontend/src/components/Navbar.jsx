// src/components/Navbar.jsx

import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../lib/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import NapaCo from '../assets/napaco.svg?react'
import gsap from 'gsap'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
]

function getIsMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 768
}

/* ─────────────────────────────────────────────────────────
   SCROLL HELPERS
───────────────────────────────────────────────────────── */
function scrollToSection(id) {
  const el = document.getElementById(id)

  if (!el) return

  const top =
    el.getBoundingClientRect().top + window.scrollY

  window.scrollTo({
    top,
    behavior: 'smooth',
  })
}

/* ─────────────────────────────────────────────────────────
   UI HELPERS
───────────────────────────────────────────────────────── */
function Hairline({ dark }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: '1px',
        height: '14px',
        background: dark ? '#1a1614' : 'white',
        flexShrink: 0,
        opacity: 0.4,
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────
   EDITORIAL LINK
───────────────────────────────────────────────────────── */
function EditorialNavLink({
  target,
  children,
  dark,
}) {
  const underlineRef = useRef(null)

  const resetUnderline = () => {
    if (!underlineRef.current) return

    gsap.set(underlineRef.current, {
      scaleX: 0,
      transformOrigin: 'left',
    })
  }

  const handleEnter = () => {
    if (!underlineRef.current) return

    gsap.killTweensOf(underlineRef.current)

    gsap.fromTo(
      underlineRef.current,
      {
        scaleX: 0,
        transformOrigin: 'left',
      },
      {
        scaleX: 1,
        duration: 0.38,
        ease: 'power3.out',
      }
    )
  }

  const handleLeave = () => {
    if (!underlineRef.current) return

    gsap.killTweensOf(underlineRef.current)

    gsap.to(underlineRef.current, {
      scaleX: 0,
      transformOrigin: 'right',
      duration: 0.28,
      ease: 'power3.inOut',
      onComplete: resetUnderline,
    })
  }

  useEffect(() => {
    resetUnderline()
  }, [])

  return (
    <button
      onClick={() => scrollToSection(target)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        all: 'unset',
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          position: 'relative',
          display: 'inline-block',

          fontSize: '10px',
          fontWeight: 600,

          letterSpacing: '3px',
          textTransform: 'uppercase',

          color: dark ? '#1a1614' : 'white',

          padding: '4px 0',

          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {children}

        <span
          ref={underlineRef}
          style={{
            position: 'absolute',

            bottom: 0,
            left: 0,
            right: 0,

            height: '1px',

            background: dark
              ? '#1a1614'
              : 'white',

            transform: 'scaleX(0)',
            transformOrigin: 'left',
          }}
        />
      </span>
    </button>
  )
}

/* ─────────────────────────────────────────────────────────
   MOBILE LINK
───────────────────────────────────────────────────────── */
function MobileNavLink({
  target,
  children,
  onClick,
}) {
  return (
    <button
      onClick={() => {
        scrollToSection(target)
        onClick?.()
      }}
      style={{
        all: 'unset',

        display: 'block',

        width: '100%',

        padding: '18px 0',

        borderBottom:
          '1px solid rgba(246,237,227,0.08)',

        textAlign: 'center',

        cursor: 'pointer',

        fontSize: '11px',
        letterSpacing: '3px',
        textTransform: 'uppercase',

        color: '#f6ede3',
      }}
    >
      {children}
    </button>
  )
}

/* ─────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────── */
export default function Navbar() {
  const { t, i18n } = useTranslation()

  const { user, logoutUser } = useAuth()

  const location = useLocation()

  const [menuOpen, setMenuOpen] =
    useState(false)

  const [isMobile, setIsMobile] =
    useState(getIsMobile)

  const [darkNav, setDarkNav] =
    useState(false)

  const logoRef = useRef(null)

  /* ─────────────────────────────────────────────
     RESPONSIVE LOGO WIDTH
  ───────────────────────────────────────────── */
  const logoWidth = isMobile
    ? 'clamp(120px, 34vw, 160px)'
    : 'clamp(180px, 14vw, 240px)'

  /* ─────────────────────────────────────────────
     MOBILE DETECTION
  ───────────────────────────────────────────── */
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', check)

    return () => {
      window.removeEventListener('resize', check)
    }
  }, [])

  /* ─────────────────────────────────────────────
     CLOSE MENU ON ROUTE CHANGE
  ───────────────────────────────────────────── */
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  /* ─────────────────────────────────────────────
     FOOTER DETECTION
  ───────────────────────────────────────────── */
  useEffect(() => {
    const handleScroll = () => {
      const footer =
        document.getElementById('image-gallery')

      if (!footer) return

      const rect =
        footer.getBoundingClientRect()

      const active =
        rect.top <= window.innerHeight * 0.055

      setDarkNav(active)
    }

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    handleScroll()

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      )
    }
  }, [])

  /* ─────────────────────────────────────────────
     LOGO → FOOTER ANIMATION
  ───────────────────────────────────────────── */
  useEffect(() => {
    if (!logoRef.current) return

    const logo = logoRef.current

    let currentState = 'top'

    gsap.set(logo, {
      x: 0,
      y: 0,
      scale: 1,
      force3D: true,
    })

    const handleScroll = () => {
      const footer =
        document.getElementById('image-gallery')

      if (!footer) return

      const rect =
        footer.getBoundingClientRect()

      const footerActive =
        rect.top <= window.innerHeight * 0.3

      /* FOOTER */
      if (
        footerActive &&
        currentState !== 'footer'
      ) {
        currentState = 'footer'

        gsap.to(logo, {
          y:
            window.innerHeight -
            (isMobile ? 88 : 120),

          duration: 0.7,
          ease: 'power3.out',

          overwrite: 'auto',
          force3D: true,
        })
      }

      /* TOP */
      else if (
        !footerActive &&
        currentState !== 'top'
      ) {
        currentState = 'top'

        gsap.to(logo, {
          y: 0,

          duration: 0.8,
          ease: 'power3.out',

          overwrite: 'auto',
          force3D: true,
        })
      }
    }

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    handleScroll()

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      )
    }
  }, [isMobile])

  /* ─────────────────────────────────────────────
     LANGUAGE SWITCH
  ───────────────────────────────────────────── */
  const changeLanguage = (code) => {
    i18n.changeLanguage(code)

    localStorage.setItem(
      'napa_lang',
      code
    )

    document.dir = 'ltr'
  }

  const LangSwitch = ({ dark }) => (
    <div
      style={{
        display: 'flex',
        gap: '14px',
      }}
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          style={{
            all: 'unset',

            cursor: 'pointer',

            fontSize: '10px',
            letterSpacing: '3px',

            textTransform: 'uppercase',

            color: dark
              ? '#1a1614'
              : 'white',

            opacity:
              i18n.language === lang.code
                ? 1
                : 0.55,
          }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )

  /* ─────────────────────────────────────────────
     NAV LINKS
  ───────────────────────────────────────────── */
  const NAV_LINKS = [
    {
      label: t('nav.estate', 'Estate'),
      target: 'experience-intimate-escape',
    },
    {
      label: t('nav.cellar', 'Cellar'),
      target: 'experience-crafted-cocktails',
    },
    {
      label: t('nav.journal', 'Journal'),
      target: 'experience-farm-to-table',
    },
    {
      label: t(
        'nav.reservations',
        'Reservations'
      ),
      target:
        'experience-kitchen-driss-alaoui',
    },
  ]

  return (
    <>
      {/* LOGO */}
      <Link
        to="/"
        style={{
          position: 'fixed',

          top: isMobile
            ? '0.6rem'
            : '1.5rem',

          left: isMobile
            ? '0.6rem'
            : '1.5rem',

          zIndex: 102,

          textDecoration: 'none',
        }}
      >
        <div
          ref={logoRef}
          style={{
            position: 'fixed',

            top: isMobile
              ? '0.6rem'
              : '1.5rem',

            left: isMobile
              ? '0.6rem'
              : '1.5rem',

            zIndex: 102,

            color: 'white',

            willChange: 'transform',

            transform:
              'translate3d(0,0,0)',

            backfaceVisibility: 'hidden',
          }}
        >
          <NapaCo
            style={{
              width: logoWidth,
              height: 'auto',
              display: 'block',
            }}
          />
        </div>
      </Link>

      {/* NAV */}
      <motion.nav
        initial={{
          y: -20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        style={{
          position: 'fixed',

          top: 0,
          width: '100%',

          zIndex: 100,

          display: 'flex',
          justifyContent: 'flex-end',

          padding: isMobile
            ? '1rem'
            : '1.25rem 2rem',

          pointerEvents: 'none',
        }}
      >
        {/* DESKTOP */}
        {!isMobile && (
          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'center',

              pointerEvents: 'auto',
            }}
          >
            {NAV_LINKS.map((link) => (
              <EditorialNavLink
                key={link.target}
                target={link.target}
                dark={darkNav}
              >
                {link.label}
              </EditorialNavLink>
            ))}

            <Hairline dark={darkNav} />

            <LangSwitch dark={darkNav} />
          </div>
        )}

        {/* MOBILE BURGER */}
        {isMobile && (
          <button
            onClick={() =>
              setMenuOpen((v) => !v)
            }
            style={{
              all: 'unset',

              width: '28px',
              height: '22px',

              position: 'relative',

              cursor: 'pointer',

              pointerEvents: 'auto',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* TOP BAR */}
            <span
              style={{
                position: 'absolute',

                width: '100%',
                height: '1.5px',

                background:
                  menuOpen
                    ? '#f6ede3'
                    : darkNav
                      ? '#1a1614'
                      : 'white',

                borderRadius: '999px',

                transform: menuOpen
                  ? 'rotate(45deg)'
                  : 'translateY(-6px)',

                transition:
                  'transform .45s cubic-bezier(.22,.61,.36,1), background .35s ease',
              }}
            />

            {/* BOTTOM BAR */}
            <span
              style={{
                position: 'absolute',

                width: '100%',
                height: '1.5px',

                background:
                  menuOpen
                    ? '#f6ede3'
                    : darkNav
                      ? '#1a1614'
                      : 'white',

                borderRadius: '999px',

                transform: menuOpen
                  ? 'rotate(-45deg)'
                  : 'translateY(6px)',

                transition:
                  'transform .45s cubic-bezier(.22,.61,.36,1), background .35s ease',
              }}
            />
          </button>
        )}
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              backdropFilter: 'blur(0px)',
            }}
            animate={{
              opacity: 1,
              backdropFilter: 'blur(10px)',
            }}
            exit={{
              opacity: 0,
              backdropFilter: 'blur(0px)',
            }}
            style={{
              position: 'fixed',
              inset: 0,

              background:
                'rgba(58,5,5,0.985)',

              zIndex: 99,

              display: 'flex',
              flexDirection: 'column',

              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {NAV_LINKS.map((link) => (
              <MobileNavLink
                key={link.target}
                target={link.target}
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                {link.label}
              </MobileNavLink>
            ))}

            {/* LANGUAGES */}
            <div
              style={{
                display: 'flex',
                gap: '18px',

                marginTop: '42px',

                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {LANGUAGES.map((lang, i) => (
                <div
                  key={lang.code}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '18px',
                  }}
                >
                  <button
                    onClick={() => {
                      changeLanguage(lang.code)
                      setMenuOpen(false)
                    }}
                    style={{
                      all: 'unset',

                      cursor: 'pointer',

                      fontSize: '10px',
                      fontWeight: 500,

                      letterSpacing: '4px',
                      textTransform: 'uppercase',

                      color:
                        i18n.language === lang.code
                          ? '#f6ede3'
                          : 'rgba(246,237,227,.45)',

                      transition:
                        'color .3s ease, opacity .3s ease',
                    }}
                  >
                    {lang.label}
                  </button>

                  {i !== LANGUAGES.length - 1 && (
                    <span
                      style={{
                        width: '1px',
                        height: '12px',

                        background:
                          'rgba(246,237,227,.18)',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}