// src/components/Footer.jsx
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LiquidEther from './LiquidEther';

const C = {
  wineRed:   '#8b1d1f',
  wineHover: '#a8282b',
  cream:     '#faf6ef',
  cream60:   'rgba(250,246,239,0.6)',
  cream30:   'rgba(250,246,239,0.3)',
  cream15:   'rgba(250,246,239,0.15)',
  dark:      '#0e0c09',
};

const FONT_SERIF = "'Cormorant Garamond', 'Cormorant', Georgia, 'Times New Roman', serif";
const FONT_SANS  = "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif";

const Rule = ({ style = {} }) => (
  <span style={{ display: 'block', width: '100%', height: '1px', background: C.cream15, ...style }} />
);

const FootLink = ({ to, href, children }) => {
  const base = {
    fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 400,
    letterSpacing: '2.5px', textTransform: 'uppercase',
    color: C.cream60, textDecoration: 'none',
    transition: 'color 0.2s ease', cursor: 'pointer',
  };
  const on  = e => { e.currentTarget.style.color = C.cream; };
  const off = e => { e.currentTarget.style.color = C.cream60; };
  if (to) return <Link to={to} style={base} onMouseEnter={on} onMouseLeave={off}>{children}</Link>;
  return <a href={href} target="_blank" rel="noopener noreferrer" style={base} onMouseEnter={on} onMouseLeave={off}>{children}</a>;
};

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

export default function Footer() {
  const { t } = useTranslation();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const year = new Date().getFullYear();

  const logoWidth = isMobile
    ? 'clamp(120px, 34vw, 160px)'
    : 'clamp(180px, 14vw, 240px)';

  return (
    <footer
      id="footer"
      style={{
        width: '100%',
        height: '100vh',          // ← exact 100vh, nothing more
        overflow: 'hidden',       // ← clip anything that overflows
        position: 'relative',
        background: C.dark,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── LiquidEther background ───────────────────────────────── */}
      {!isMobile && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <LiquidEther
            colors={['#e4908a', '#c71919', '#970303']}
            mouseForce={20}
            cursorSize={80}
            isViscous
            viscous={10}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={true}
            autoDemo
            autoSpeed={5.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      {/* ── Dark overlay ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(14,12,9,0.55) 0%, rgba(14,12,9,0.75) 60%, rgba(14,12,9,0.92) 100%)',
      }} />

      {/* ── Content: flex column fills exactly 100vh ─────────────── */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        flex: 1,                  // ← fill the footer height
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>

        {/* ══ TOP: logo zone + map — takes remaining space ════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          flex: 1,                // ← grows to fill space above the bottom bar
          overflow: 'hidden',
        }}>

          {/* Left */}
          <div style={{
            padding: isMobile ? '40px 24px 24px' : '48px 64px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            {/* Logo landing placeholder */}
            <div aria-hidden="true" style={{ width: logoWidth, aspectRatio: '3 / 1', flexShrink: 0 }} />

            {/* Tagline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ display: 'block', width: '32px', height: '1px', background: C.wineRed }} />
              <p style={{
                fontFamily: FONT_SERIF, fontStyle: 'italic',
                fontSize: isMobile ? '14px' : '16px',
                color: C.cream60, margin: 0, lineHeight: 1.6, maxWidth: '300px',
              }}>
                {t('footer.tagline')}
              </p>
            </div>

            {/* Nav links */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 28px' }}>
              <FootLink to="/reserve">{t('nav.reservations')}</FootLink>
              <FootLink to="/cellar">{t('nav.cellar')}</FootLink>
              <FootLink to="/estate">{t('nav.estate')}</FootLink>
              <FootLink to="/journal">{t('nav.journal')}</FootLink>
            </div>
          </div>

          {/* Right — map image */}
          {!isMobile && (
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <img
                src="/images/map-napa.jpg"
                alt="NAPA Chapter One — Gueliz, Marrakech"
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center',
                  filter: 'sepia(0.25) brightness(0.65) contrast(1.05)',
                }}
              />
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'linear-gradient(to right, rgba(14,12,9,0.5) 0%, transparent 40%)',
              }} />
              <div style={{ position: 'absolute', bottom: '28px', left: '32px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: C.cream }}>
                  Gueliz, Marrakech
                </span>
                <span style={{ fontFamily: FONT_SANS, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: C.cream60 }}>
                  31.635°N · 8.015°W
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ══ MIDDLE: info columns ════════════════════════════════ */}
        <div style={{ padding: isMobile ? '0 24px' : '0 64px' }}><Rule /></div>

        <div style={{
          padding: isMobile ? '24px 24px' : '28px 64px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? '24px 16px' : '0',
          flexShrink: 0,
        }}>
          {/* Address */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontFamily: FONT_SANS, fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: C.wineRed }}>
              {t('footer.address')}
            </span>
            {['Gueliz', 'Marrakech, Morocco', '+212 524 423 022'].map(line => (
              <span key={line} style={{ fontFamily: FONT_SANS, fontSize: '11px', letterSpacing: '1.5px', color: C.cream60, lineHeight: 1.6 }}>
                {line}
              </span>
            ))}
          </div>

          {/* Hours */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontFamily: FONT_SANS, fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: C.wineRed }}>
              {t('footer.hours')}
            </span>
            {[t('footer.hoursTueSat'), t('footer.hoursTime'), t('footer.hoursClosed')].map((line, i) => (
              <span key={i} style={{ fontFamily: FONT_SANS, fontSize: '11px', letterSpacing: '1.5px', color: i === 2 ? C.cream30 : C.cream60, lineHeight: 1.6, fontStyle: i === 2 ? 'italic' : 'normal' }}>
                {line}
              </span>
            ))}
          </div>

          {/* Instagram */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontFamily: FONT_SANS, fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: C.wineRed }}>
              {t('footer.follow')}
            </span>
            <a
              href="https://www.instagram.com/napa_chapter1/"
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: FONT_SANS, fontSize: '11px', letterSpacing: '1.5px', color: C.cream60, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = C.cream; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.cream60; }}
            >
              <InstagramIcon />
              @napachapterone
            </a>
          </div>

          {/* Reserve CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: isMobile ? 'flex-start' : 'flex-end' }}>
            <span style={{ fontFamily: FONT_SANS, fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: C.wineRed }}>
              {t('footer.cta')}
            </span>
            <Link to="/reserve" style={{ textDecoration: 'none' }}>
              <button
                style={{ fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 500, letterSpacing: '3px', textTransform: 'uppercase', padding: '12px 24px', background: C.wineRed, color: C.cream, border: 'none', borderRadius: 0, cursor: 'pointer', transition: 'background 0.2s ease', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.background = C.wineHover; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.wineRed; }}
              >
                {t('nav.reservations')}
              </button>
            </Link>
          </div>
        </div>

        {/* ══ BOTTOM BAR ══════════════════════════════════════════ */}
        <div style={{ padding: isMobile ? '0 24px' : '0 64px' }}><Rule /></div>

        <div style={{
          padding: isMobile ? '16px 24px 20px' : '16px 64px 20px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: '10px',
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: FONT_SANS, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: C.cream30 }}>
            © {year} NAPA Chapter One. {t('footer.rights')}
          </span>
          <span style={{ fontFamily: FONT_SERIF, fontWeight: 600, fontSize: '13px', letterSpacing: '0.1em', color: C.cream30 }}>
            MMXXVI
          </span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <FootLink href="#">{t('footer.privacy')}</FootLink>
            <FootLink href="#">{t('footer.legal')}</FootLink>
          </div>
        </div>

      </div>
    </footer>
  );
}