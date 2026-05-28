// src/components/Navbar.jsx — FIXED + SCROLL TO FOOTER LOGO ANIMATION

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

  const top = el.getBoundingClientRect().top + window.scrollY

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
function EditorialNavLink({ target, children, dark }) {
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
      { scaleX: 0, transformOrigin: 'left' },
      { scaleX: 1, duration: 0.38, ease: 'power3.out' }
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
      style={{ all: 'unset', cursor: 'pointer' }}
    >
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: dark ? '#1a1614' : 'white',   // 👈 ONLY CHANGE
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
            background: dark ? '#1a1614' : 'white', // 👈 ONLY CHANGE
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
function MobileNavLink({ target, children, onClick }) {
  return (
    <button
      onClick={() => {
        scrollToSection(target)
        onClick?.()
      }}
      style={{
        all: 'unset',
        display: 'block',
        fontSize: '11px',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: '#1a1614',
        padding: '18px 0',
        width: '100%',
        borderBottom: '1px solid rgba(26,22,20,0.08)',
        cursor: 'pointer',
        textAlign: 'center',
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

  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(getIsMobile)

  const [darkNav, setDarkNav] = useState(false) // 👈 NEW

  const logoRef = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  /* ─────────────────────────────────────────────
     FOOTER DETECTION (COLOR ONLY)
  ───────────────────────────────────────────── */
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById('image-gallery')
      if (!footer) return

      const rect = footer.getBoundingClientRect()
      const isFooterActive = rect.top <= window.innerHeight * 0.055

      setDarkNav(isFooterActive) // 👈 ONLY ADDITION
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ─────────────────────────────────────────────
     LOGO → FOOTER ANIMATION
  ───────────────────────────────────────────── */
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById('image-gallery')
      if (!footer || !logoRef.current) return

      const rect = footer.getBoundingClientRect()
      const isFooterActive = rect.top <= window.innerHeight * 0.3

      if (isFooterActive) {
        gsap.to(logoRef.current, {
          position: 'fixed',
          bottom: '1rem',
          top: 'auto',
          scale: 1,
          duration: 0.7,
          transformOrigin: 'bottom left',
          ease: "power3.out",
          color: '#3a0505',
        })
      } else {
        gsap.to(logoRef.current, {
          position: 'fixed',
          top: isMobile ? '0.6rem' : '0.75rem',
          left: isMobile ? '1rem' : '1.5rem',
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          color: 'white',
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('napa_lang', code)
    document.dir = 'ltr'
  }

  const LangSwitch = ({ dark }) => (
    <div style={{ display: 'flex', gap: '14px' }}>
      {LANGUAGES.map(lang => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          style={{
            all: 'unset',
            cursor: 'pointer',
            fontSize: '10px',
            letterSpacing: '3px',
            color: dark ? '#1a1614' : 'white',   // 👈 ONLY CHANGE
            textTransform: 'uppercase',
            opacity: i18n.language === lang.code ? 1 : 0.55,
          }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )

  const NAV_LINKS = [
    { label: t('nav.estate', 'Estate'), target: 'experience-intimate-escape' },
    { label: t('nav.cellar', 'Cellar'), target: 'experience-crafted-cocktails' },
    { label: t('nav.journal', 'Journal'), target: 'experience-farm-to-table' },
    { label: t('nav.reservations', 'Reservations'), target: 'experience-kitchen-driss-alaoui' },
  ]

  return (
    <>
      {/* LOGO */}
      <Link
        to="/"
        style={{
          position: 'fixed',
          top: isMobile ? '0.6rem' : '0.75rem',
          left: isMobile ? '1rem' : '1.5rem',
          zIndex: 102,
          textDecoration: 'none',
        }}
      >
        <div ref={logoRef} style={{
          position: 'fixed',
          top: isMobile ? '0.6rem' : '0.75rem',
          left: isMobile ? '1rem' : '1.5rem',
          scale: 1,
          color: 'white',
        }}>
          <NapaCo style={{ width: isMobile ? 140 : 210 }} />
        </div>
      </Link>

      {/* NAV */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'flex-end',

          padding: isMobile ? '1rem' : '1.25rem 2rem',
          pointerEvents: 'none',
        }}
      >
        {!isMobile && (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', pointerEvents: 'auto' }}>
            {NAV_LINKS.map((link) => (
              <EditorialNavLink
                key={link.target}
                target={link.target}
                dark={darkNav}   // 👈 ONLY CHANGE
              >
                {link.label}
              </EditorialNavLink>
            ))}
            <Hairline dark={darkNav}/>
            <LangSwitch dark={darkNav} />  {/* 👈 ONLY CHANGE */}
          </div>
        )}

        {isMobile && (
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{ all: 'unset', cursor: 'pointer', pointerEvents: 'auto' }}
          >
            ☰
          </button>
        )}
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(250,246,239,0.97)',
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
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </MobileNavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}