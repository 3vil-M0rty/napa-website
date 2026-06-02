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

const LOGO_FOOTER_COLOR = 'rgba(250,246,239,0.6)'
const LOGO_TOP_COLOR = 'white'
const FOOTER_THRESHOLD = 0.055

function getIsMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 768
}

function scrollToSection(id) {
  const desktopId = 'desktop-' + id.replace('experience-', '')
  const el = document.getElementById(desktopId)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function Hairline({ hidden }) {
  return (
    <span style={{
      display: 'inline-block', width: '1px', height: '14px',
      background: 'white', flexShrink: 0,
      opacity: hidden ? 0 : 0.4, transition: 'opacity 0.4s ease',
    }} />
  )
}

function EditorialNavLink({ target, children, hidden }) {
  const underlineRef = useRef(null)
  const resetUnderline = () => {
    if (!underlineRef.current) return
    gsap.set(underlineRef.current, { scaleX: 0, transformOrigin: 'left' })
  }
  const handleEnter = () => {
    if (!underlineRef.current) return
    gsap.killTweensOf(underlineRef.current)
    gsap.fromTo(underlineRef.current,
      { scaleX: 0, transformOrigin: 'left' },
      { scaleX: 1, duration: 0.38, ease: 'power3.out' }
    )
  }
  const handleLeave = () => {
    if (!underlineRef.current) return
    gsap.killTweensOf(underlineRef.current)
    gsap.to(underlineRef.current, {
      scaleX: 0, transformOrigin: 'right',
      duration: 0.28, ease: 'power3.inOut', onComplete: resetUnderline,
    })
  }
  useEffect(() => { resetUnderline() }, [])
  return (
    <button
      onClick={() => scrollToSection(target)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        all: 'unset', cursor: 'pointer',
        opacity: hidden ? 0 : 1,
        transform: hidden ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        pointerEvents: hidden ? 'none' : 'auto',
      }}
    >
      <span style={{
        position: 'relative', display: 'inline-block',
        fontSize: '10px', fontWeight: 600, letterSpacing: '3px',
        textTransform: 'uppercase', color: 'white',
        padding: '4px 0', userSelect: 'none', whiteSpace: 'nowrap',
      }}>
        {children}
        <span ref={underlineRef} style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '1px', background: 'white',
          transform: 'scaleX(0)', transformOrigin: 'left',
        }} />
      </span>
    </button>
  )
}

function MobileNavLink({ target, children, onNavigate, onClose }) {
  const handleClick = () => {
    onNavigate(target)
    onClose()
  }
  return (
    <button
      onClick={handleClick}
      style={{
        all: 'unset', display: 'block', width: '100%',
        padding: '18px 0', borderBottom: '1px solid rgba(246,237,227,0.08)',
        textAlign: 'center', cursor: 'pointer',
        fontSize: '11px', letterSpacing: '3px',
        textTransform: 'uppercase', color: '#f6ede3',
      }}
    >
      {children}
    </button>
  )
}

function LangSwitch({ hidden, i18n, changeLanguage }) {
  return (
    <div style={{
      display: 'flex', gap: '14px',
      opacity: hidden ? 0 : 1, transition: 'opacity 0.4s ease',
      pointerEvents: hidden ? 'none' : 'auto',
    }}>
      {LANGUAGES.map(lang => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          style={{
            all: 'unset', cursor: 'pointer',
            fontSize: '10px', letterSpacing: '3px',
            textTransform: 'uppercase', color: 'white',
            opacity: i18n.language === lang.code ? 1 : 0.55,
          }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { user, logoutUser } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(getIsMobile)
  const [atFooter, setAtFooter] = useState(false)
  const logoRef = useRef(null)

  const pendingScrollTarget = useRef(null)
  const savedScrollY = useRef(0)  // ← captures scroll before fixed is applied

  const logoWidth = isMobile
    ? 'clamp(120px, 34vw, 160px)'
    : 'clamp(180px, 14vw, 240px)'

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    if (!isMobile) return
    const body = document.body
    const html = document.documentElement

    if (menuOpen) {
      savedScrollY.current = window.scrollY
      const scrollY = savedScrollY.current

      body.style.position = 'fixed'
      body.style.top = `-${scrollY}px`
      body.style.left = '0'
      body.style.right = '0'
      body.style.width = '100%'
      body.style.overflow = 'hidden'
      html.style.overflow = 'hidden'
      html.style.touchAction = 'none'

    } else {
      const scrollY = savedScrollY.current

      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.width = ''
      body.style.overflow = ''
      html.style.overflow = ''
      html.style.touchAction = ''

      const target = pendingScrollTarget.current
      pendingScrollTarget.current = null


      if (target) {
        window.scrollTo(0, scrollY)
        setTimeout(() => {
          const el = document.getElementById(target)
          if (!el) return

          let stickySlide = el
          while (stickySlide && !stickySlide.classList.contains('mbs3-slide')) {
            stickySlide = stickySlide.parentElement
          }

          let top = 0
          let node = stickySlide || el
          while (node) {
            top += node.offsetTop || 0
            node = node.offsetParent
          }

          window.scrollTo({ top, behavior: 'smooth' })
        }, 350) // just longer than the exit animation duration
      }
    }

    return () => {
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.width = ''
      body.style.overflow = ''
      html.style.overflow = ''
      html.style.touchAction = ''
    }
  }, [menuOpen, isMobile])
  useEffect(() => {
    const logo = logoRef.current
    const handleScroll = () => {
      const footer = document.getElementById('footer')
      if (!footer) return
      const rect = footer.getBoundingClientRect()
      const isAtFooter = rect.top <= window.innerHeight * FOOTER_THRESHOLD
      setAtFooter(isAtFooter)
      if (logo) logo.style.color = isAtFooter ? LOGO_FOOTER_COLOR : LOGO_TOP_COLOR
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('napa_lang', code)
    document.dir = 'ltr'
  }

  const NAV_LINKS = [
    { label: t('theRoom'), target: 'experience-intimate-escape' },
    { label: t('kitchen'), target: 'experience-kitchen-driss-alaoui' },
    { label: t('bar'), target: 'experience-crafted-cocktails' },
    { label: t('farm'), target: 'experience-farm-to-table' },
  ]

  return (
    <>
      <Link
        to="/"
        style={{
          position: 'fixed',
          top: isMobile ? '0.6rem' : '1.5rem',
          left: isMobile ? '0.6rem' : '1.5rem',
          zIndex: 102, textDecoration: 'none',
        }}
      >
        <div ref={logoRef} style={{ color: LOGO_TOP_COLOR, transition: 'color 0.4s ease', willChange: 'color' }}>
          <NapaCo style={{ width: logoWidth, height: 'auto', display: 'block' }} />
        </div>
      </Link>

      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          position: 'fixed', top: 0, width: '100%', zIndex: 100,
          display: 'flex', justifyContent: 'flex-end',
          padding: isMobile ? '1rem' : '1.25rem 2rem',
          pointerEvents: 'none',
        }}
      >
        {!isMobile && (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', pointerEvents: 'auto' }}>
            {NAV_LINKS.map(link => (
              <EditorialNavLink key={link.target} target={link.target} hidden={atFooter}>
                {link.label}
              </EditorialNavLink>
            ))}
            <Hairline hidden={atFooter} />
            <LangSwitch hidden={atFooter} i18n={i18n} changeLanguage={changeLanguage} />
          </div>
        )}

        {isMobile && (
          <button
            onClick={() => setMenuOpen(v => !v)}
            style={{
              all: 'unset', width: '28px', height: '22px',
              position: 'relative', cursor: 'pointer',
              pointerEvents: atFooter && !menuOpen ? 'none' : 'auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: atFooter && !menuOpen ? 0 : 1, transition: 'opacity 0.4s ease',
            }}
          >
            <span style={{
              position: 'absolute', width: '100%', height: '1.5px',
              background: menuOpen ? '#f6ede3' : 'white', borderRadius: '999px',
              transform: menuOpen ? 'rotate(45deg)' : 'translateY(-6px)',
              transition: 'transform .45s cubic-bezier(.22,.61,.36,1), background .35s ease',
            }} />
            <span style={{
              position: 'absolute', width: '100%', height: '1.5px',
              background: menuOpen ? '#f6ede3' : 'white', borderRadius: '999px',
              transform: menuOpen ? 'rotate(-45deg)' : 'translateY(6px)',
              transition: 'transform .45s cubic-bezier(.22,.61,.36,1), background .35s ease',
            }} />
          </button>
        )}
      </motion.nav>

      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(58,5,5,0.985)',
              zIndex: 99, display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center',
            }}
          >
            {NAV_LINKS.map(link => (
              <MobileNavLink
                key={link.target}
                target={link.target}
                onNavigate={(id) => { pendingScrollTarget.current = id }}
                onClose={() => setMenuOpen(false)}
              >
                {link.label}
              </MobileNavLink>
            ))}
            <div style={{ display: 'flex', gap: '18px', marginTop: '42px', alignItems: 'center', justifyContent: 'center' }}>
              {LANGUAGES.map((lang, i) => (
                <div key={lang.code} style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <button
                    onClick={() => { changeLanguage(lang.code); setMenuOpen(false) }}
                    style={{
                      all: 'unset', cursor: 'pointer',
                      fontSize: '10px', fontWeight: 500,
                      letterSpacing: '4px', textTransform: 'uppercase',
                      color: i18n.language === lang.code ? '#f6ede3' : 'rgba(246,237,227,.45)',
                      transition: 'color .3s ease',
                    }}
                  >
                    {lang.label}
                  </button>
                  {i !== LANGUAGES.length - 1 && (
                    <span style={{ width: '1px', height: '12px', background: 'rgba(246,237,227,.18)' }} />
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