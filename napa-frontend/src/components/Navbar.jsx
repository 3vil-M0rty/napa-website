// src/components/Navbar.jsx
// NAPA Chapter One — Editorial Navbar
// Nav links use mix-blend-mode: difference at ALL times — same trick as the logo.
// This makes them self-inverting over any background, light or dark, no backdrop needed.

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

/* ─────────────────────────────────────────
   HAIRLINE DIVIDER
───────────────────────────────────────── */
function Hairline() {
  return (
    <span style={{
      display: 'inline-block',
      width: '1px',
      height: '14px',
      // White in difference mode appears as black over light, white over dark
      background: 'white',
      flexShrink: 0,
      opacity: 0.4,
    }} />
  )
}

/* ─────────────────────────────────────────
   DESKTOP NAV LINK
   mix-blend-mode: difference — self-inverting over ANY background
───────────────────────────────────────── */
function EditorialNavLink({ to, children, active }) {
  const underlineRef = useRef()

  const handleEnter = () => {
    if (!underlineRef.current) return
    gsap.fromTo(
      underlineRef.current,
      { scaleX: 0, transformOrigin: 'left' },
      { scaleX: 1, duration: 0.38, ease: 'power3.out' }
    )
  }
  const handleLeave = () => {
    if (!underlineRef.current) return
    gsap.to(underlineRef.current, {
      scaleX: 0, transformOrigin: 'right',
      duration: 0.28, ease: 'power3.inOut',
    })
  }

  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      style={{ textDecoration: 'none' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span style={{
        position: 'relative',
        display: 'inline-block',
        fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '3px',
        textTransform: 'uppercase',
        // White source + difference = auto-inverts: white over dark bg, black over light bg
        color: 'white',
        mixBlendMode: 'difference',
        WebkitMixBlendMode: 'difference',
        padding: '4px 0',
        cursor: 'pointer',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}>
        {children}
        {/* Active underline */}
        {active && (
          <span style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '1px', background: 'white',
          }} />
        )}
        {/* Hover underline */}
        <span
          ref={underlineRef}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '1px', background: 'white',
            transform: 'scaleX(0)', transformOrigin: 'left',
            display: active ? 'none' : 'block',
          }}
        />
      </span>
    </Link>
  )
}

/* ─────────────────────────────────────────
   MOBILE MENU LINK (inside drawer — normal colors)
───────────────────────────────────────── */
function MobileNavLink({ to, children, active, onClick }) {
  return (
    <Link to={to} onClick={onClick} style={{ textDecoration: 'none' }}>
      <span style={{
        display: 'block',
        fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: '11px', fontWeight: 500, letterSpacing: '3px',
        textTransform: 'uppercase',
        color: active ? '#A11C24' : '#1a1614',
        padding: '14px 0',
        borderBottom: '1px solid rgba(26,22,20,0.08)',
        cursor: 'pointer',
      }}>
        {children}
      </span>
    </Link>
  )
}

/* ─────────────────────────────────────────
   NAVBAR
───────────────────────────────────────── */
export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { user, logoutUser } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('napa_lang', code)
    document.dir = 'ltr'
  }

  const NAV_LINKS = [
    { to: '/estate',  label: t('nav.estate',  'Estate')        },
    { to: '/cellar',  label: t('nav.cellar',  'Cellar')        },
    { to: '/journal', label: t('nav.journal', 'Journal')       },
    { to: '/reserve', label: t('nav.reservations', 'Reservations') },
  ]

  /* Language switcher — also difference blend */
  const LangSwitch = () => (
    <div role="group" aria-label={t('nav.languageSelection', 'Language selection')}
      style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          aria-label={t('nav.switchLang', 'Switch language to {{lang}}', { lang: lang.label })}
          aria-pressed={i18n.language === lang.code}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '10px', fontWeight: 500, letterSpacing: '3px',
            textTransform: 'uppercase',
            // difference blend: white source self-inverts over any bg
            color: 'white',
            mixBlendMode: 'difference',
            WebkitMixBlendMode: 'difference',
            borderBottom: i18n.language === lang.code ? '1px solid white' : '1px solid transparent',
            paddingBottom: '2px',
            opacity: i18n.language === lang.code ? 1 : 0.55,
            transition: 'opacity 0.2s ease',
          }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )

  /* Login button — solid wine-red, always readable on any bg */
  const LoginBtn = () => user ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <span style={{
        fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
        color: 'white', mixBlendMode: 'difference', WebkitMixBlendMode: 'difference',
      }}>
        {user.name}
      </span>
      <button onClick={logoutUser}
        style={{
          fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase',
          padding: '10px 22px', background: '#A11C24', color: '#faf6ef',
          border: 'none', borderRadius: 0, cursor: 'pointer',
          transition: 'background 0.2s ease',
          // Solid background means difference blend not needed — always readable
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#7a1318' }}
        onMouseLeave={e => { e.currentTarget.style.background = '#A11C24' }}
      >
        {t('nav.logout', 'Logout')}
      </button>
    </div>
  ) : (
    <Link to="/login" style={{ textDecoration: 'none' }}>
      <button
        aria-label={t('nav.loginAriaLabel', 'Login to your NAPA Chapter One account')}
        style={{
          fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase',
          padding: '10px 22px', background: '#A11C24', color: '#faf6ef',
          border: 'none', borderRadius: 0, cursor: 'pointer',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#7a1318' }}
        onMouseLeave={e => { e.currentTarget.style.background = '#A11C24' }}
      >
        {t('nav.login', 'Login')}
      </button>
    </Link>
  )

  return (
    <>
      {/* LOGO — fixed top-left, out of nav flow */}
      <Link to="/" aria-label={t('nav.logoAriaLabel', 'NAPA Chapter One — Return to homepage')}
        style={{
          textDecoration: 'none', position: 'fixed',
          top: isMobile ? '0.6rem' : '0.75rem',
          left: isMobile ? '1rem' : '1.5rem',
          zIndex: 102,
        }}
      >
        <NapaCo aria-hidden="true" style={{
          width: isMobile ? 140 : 210, display: 'block',
          mixBlendMode: 'difference', WebkitMixBlendMode: 'difference',
          color: '#8b1d1f',
        }} />
      </Link>

      {/* NAV BAR — no background at all, ever. Links are self-inverting. */}
      <motion.nav
        aria-label={t('nav.primaryNav', 'Primary navigation')}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          padding: isMobile ? '1rem 1.25rem' : '1.25rem 2rem',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
          background: 'transparent',  // never changes
          pointerEvents: 'none',
        }}
      >
        {/* DESKTOP CLUSTER */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', pointerEvents: 'auto' }}>
            {NAV_LINKS.map(({ to, label }) => (
              <EditorialNavLink key={to} to={to} active={location.pathname === to}>
                {label}
              </EditorialNavLink>
            ))}
            {user?.role === 'admin' && (
              <EditorialNavLink to="/admin" active={location.pathname === '/admin'}>
                {t('nav.admin', 'Admin')}
              </EditorialNavLink>
            )}
            {user && (
              <EditorialNavLink to="/my-bookings" active={location.pathname === '/my-bookings'}>
                {t('nav.myBookings', 'My Bookings')}
              </EditorialNavLink>
            )}
            <Hairline />
            <LangSwitch />
            <Hairline />
            <LoginBtn />
          </div>
        )}

        {/* MOBILE HAMBURGER */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? t('nav.closeMenu', 'Close menu') : t('nav.openMenu', 'Open menu')}
            aria-expanded={menuOpen}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px', zIndex: 101, display: 'flex', flexDirection: 'column',
              gap: '5px', alignItems: 'center', pointerEvents: 'auto',
              mixBlendMode: 'difference', WebkitMixBlendMode: 'difference',
            }}
          >
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                animate={
                  menuOpen
                    ? i === 0 ? { rotate: 45,  y: 7,  scaleX: 1 }
                    : i === 1 ? { opacity: 0 }
                    :           { rotate: -45, y: -7, scaleX: 1 }
                    : { rotate: 0, y: 0, opacity: 1, scaleX: i === 1 ? 0.65 : 1 }
                }
                transition={{ duration: 0.28 }}
                style={{
                  display: 'block', width: '22px', height: '1px',
                  background: 'white', transformOrigin: 'center',
                }}
              />
            ))}
          </button>
        )}
      </motion.nav>

      {/* MOBILE DRAWER — inside here use normal colors, no blend */}
      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99,
              background: 'rgba(250, 246, 239, 0.97)',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              padding: '5rem 1.5rem 2.5rem',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {NAV_LINKS.map(({ to, label }) => (
              <MobileNavLink key={to} to={to} active={location.pathname === to}
                onClick={() => setMenuOpen(false)}>
                {label}
              </MobileNavLink>
            ))}
            {user?.role === 'admin' && (
              <MobileNavLink to="/admin" active={location.pathname === '/admin'}
                onClick={() => setMenuOpen(false)}>
                {t('nav.admin', 'Admin')}
              </MobileNavLink>
            )}
            {user && (
              <MobileNavLink to="/my-bookings" active={location.pathname === '/my-bookings'}
                onClick={() => setMenuOpen(false)}>
                {t('nav.myBookings', 'My Bookings')}
              </MobileNavLink>
            )}
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Inside drawer — normal lang buttons */}
              <div style={{ display: 'flex', gap: '14px' }}>
                {LANGUAGES.map(lang => (
                  <button key={lang.code} onClick={() => changeLanguage(lang.code)}
                    style={{
                      background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 500,
                      letterSpacing: '3px', textTransform: 'uppercase',
                      color: i18n.language === lang.code ? '#A11C24' : '#4a4340',
                      borderBottom: i18n.language === lang.code ? '1px solid #A11C24' : '1px solid transparent',
                      paddingBottom: '2px',
                    }}
                  >{lang.label}</button>
                ))}
              </div>
              <LoginBtn />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function NapaLogoMark({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="NAPA logomark" role="img">
      <circle cx="50" cy="50" r="50" fill="black" />
      <text x="50" y="62" textAnchor="middle" fontSize="32" fill="white" fontWeight="900">N</text>
    </svg>
  )
}