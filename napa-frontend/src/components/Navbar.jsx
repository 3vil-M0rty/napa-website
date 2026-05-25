// src/components/Navbar.jsx

import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../lib/AuthContext'
import { motion } from 'framer-motion'
import gsap from 'gsap'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
]

/* =========================
   NAV BUTTON (GSAP FILL)
========================= */
function NavButton({ children, to, active }) {
  const btnRef = useRef()
  const fillRef = useRef()

  useEffect(() => {
    const el = btnRef.current
    const fill = fillRef.current

    const onEnter = (e) => {
      const rect = el.getBoundingClientRect()
      const fromLeft = e.clientX < rect.left + rect.width / 2

      gsap.set(fill, {
        scaleX: 0,
        transformOrigin: fromLeft ? 'left' : 'right',
      })

      gsap.to(fill, {
        scaleX: 1,
        duration: 0.45,
        ease: 'power3.out',
      })
    }

    const onLeave = (e) => {
      const rect = el.getBoundingClientRect()
      const toLeft = e.clientX < rect.left + rect.width / 2

      gsap.to(fill, {
        scaleX: 0,
        transformOrigin: toLeft ? 'left' : 'right',
        duration: 0.35,
        ease: 'power3.inOut',
      })
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div
        ref={btnRef}
        style={{
          position: 'relative',
          padding: '8px 12px',
          overflow: 'hidden',
          cursor: 'pointer',
          fontFamily: 'var(--font-label)',
          fontSize: '0.65rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: active ? '#000' : '#000',
          borderBottom: active ? '1px solid black' : '1px solid transparent',
        }}
      >
        {/* fill layer */}
        <div
          ref={fillRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.08)',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            zIndex: 0,
          }}
        />

        {/* text */}
        <span style={{ position: 'relative', zIndex: 2 }}>
          {children}
        </span>
      </div>
    </Link>
  )
}

/* =========================
   NAVBAR
========================= */
export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { user, logoutUser } = useAuth()
  const location = useLocation()

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('napa_lang', code)
    document.dir = code === 'ar' ? 'rtl' : 'ltr'
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,

        padding: '1rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',

        background: scrolled
          ? 'rgba(255,255,255,0.6)'
          : 'rgba(255,255,255,0.15)',

        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      {/* LOGO */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <NapaLogoMark size={36} />
          
        </div>
      </Link>

      {/* LINKS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <NavButton
          to="/reserve"
          active={location.pathname === '/reserve'}
        >
          {t('nav.reservations')}
        </NavButton>

        {user && (
          <NavButton
            to="/my-bookings"
            active={location.pathname === '/my-bookings'}
          >
            {t('nav.myBookings')}
          </NavButton>
        )}

        {user?.role === 'admin' && (
          <NavButton to="/admin" active={location.pathname === '/admin'}>
            {t('nav.admin')}
          </NavButton>
        )}

        {/* LANG */}
        <div style={{ display: 'flex', gap: 6 }}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              style={{
                fontSize: '0.6rem',
                padding: '4px 8px',
                border: '1px solid rgba(0,0,0,0.2)',
                background:
                  i18n.language === lang.code
                    ? 'rgba(0,0,0,0.08)'
                    : 'transparent',
                cursor: 'pointer',
                letterSpacing: '1px',
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* AUTH */}
        {user ? (
          <>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>
              {user.name}
            </span>
            <button
              onClick={logoutUser}
              style={{
                padding: '6px 14px',
                fontSize: '0.65rem',
                border: '1px solid black',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              {t('nav.logout')}
            </button>
          </>
        ) : (
          <Link to="/login">
            <button
              style={{
                padding: '6px 14px',
                fontSize: '0.65rem',
                border: '1px solid black',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              {t('nav.login')}
            </button>
          </Link>
        )}
      </div>
    </motion.nav>
  )
}

/* =========================
   LOGO
========================= */
export function NapaLogoMark({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="black" />
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fontSize="32"
        fill="white"
        fontWeight="900"
      >
        N
      </text>
    </svg>
  )
}