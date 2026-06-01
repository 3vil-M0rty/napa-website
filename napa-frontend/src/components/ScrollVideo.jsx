// src/components/ScrollVideo.jsx
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";

gsap.registerPlugin(ScrollTrigger);

const FONT_SERIF = "'Cormorant Garamond', 'Cormorant', Georgia, 'Times New Roman', serif";
const FONT_SANS  = "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const CREAM      = '#faf6ef';
const CREAM60    = 'rgba(250,246,239,0.6)';
const WINE_RED   = '#8b1d1f';

const TEXT_BLOCKS = [
  { key: 'scrollVideo.block1', progress: 0.15 },
  { key: 'scrollVideo.block2', progress: 0.5  },
  { key: 'scrollVideo.block3', progress: 0.82 },
];

const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export const ScrollVideo = ({ src, scrollDuration = 3000 }) => {
  const sectionRef  = useRef(null);
  const videoRef    = useRef(null);
  const progressRef = useRef(null);
  const [scrollP, setScrollP]   = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const video   = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    // ── Mobile unlock: muted autoplay trick forces browser to allow scrubbing ──
    const unlockVideo = () => {
      video.play().then(() => video.pause()).catch(() => {});
      document.removeEventListener("touchstart", unlockVideo);
      document.removeEventListener("click", unlockVideo);
    };
    document.addEventListener("touchstart", unlockVideo, { once: true });
    document.addEventListener("click", unlockVideo, { once: true });

    const init = () => {
      const duration = video.duration;
      if (!duration) return;

      const obj = { t: 0, p: 0 };

      const tween = gsap.to(obj, {
        t: duration,
        p: 1,
        ease: "none",
        onUpdate() {
          // ── Clamp to avoid out-of-range errors on mobile ──
          video.currentTime = Math.min(Math.max(obj.t, 0), duration - 0.01);
          if (progressRef.current) {
            progressRef.current.style.width = `${obj.p * 100}%`;
          }
          setScrollP(obj.p);
        },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollDuration}`,
          pin: true,
          scrub: isMobile() ? true : 0.5, // true = frame-perfect on mobile
          anticipatePin: 1,
          invalidateOnRefresh: true,       // recalculates on orientation change
        },
      });

      return () => tween.kill();
    };

    // ── Use loadedmetadata for desktop, loadeddata for mobile (more reliable) ──
    const event = isMobile() ? "loadeddata" : "loadedmetadata";

    if (video.readyState >= (isMobile() ? 2 : 1)) {
      init();
    } else {
      video.addEventListener(event, init, { once: true });
    }

    return () => video.removeEventListener(event, init);
  }, [scrollDuration]);

  const activeBlock = TEXT_BLOCKS.reduce((acc, block, i) => {
    if (scrollP >= block.progress - 0.04) return i;
    return acc;
  }, -1);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* ── Video ───────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"          // auto = load full video, needed for scrubbing
        webkit-playsinline="true" // legacy iOS Safari
        x5-playsinline="true"    // legacy Android WeChat
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />

      {/* ── Dark vignette ───────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* ── Text panel ──────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "clamp(24px, 5vw, 80px)",
        transform: "translateY(-50%)",
        width: "clamp(260px, 38vw, 480px)",
        zIndex: 5,
        pointerEvents: "none",
      }}>
        {TEXT_BLOCKS.map((block, i) => {
          const isActive = activeBlock === i;
          return (
            <div
              key={block.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateY(0)" : "translateY(18px)",
                transition: "opacity 0.7s ease, transform 0.7s ease",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <span style={{
                fontFamily: FONT_SANS,
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: WINE_RED,
              }}>
                {t(`${block.key}.eyebrow`)}
              </span>

              <span style={{
                display: "block",
                width: isActive ? "40px" : "0px",
                height: "1px",
                background: WINE_RED,
                transition: "width 0.6s ease 0.2s",
              }} />

              <h2 style={{
                fontFamily: FONT_SERIF,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(26px, 3.2vw, 44px)",
                lineHeight: 1.15,
                color: CREAM,
                margin: 0,
                letterSpacing: "0.01em",
              }}>
                {t(`${block.key}.title`)}
              </h2>

              <p style={{
                fontFamily: FONT_SANS,
                fontSize: "clamp(12px, 1vw, 14px)",
                fontWeight: 400,
                lineHeight: 1.8,
                color: CREAM60,
                margin: 0,
                letterSpacing: "0.02em",
              }}>
                {t(`${block.key}.body`)}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Progress bar ────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "1px",
        background: "rgba(255,255,255,0.12)",
        zIndex: 10,
      }}>
        <div
          ref={progressRef}
          style={{ height: "100%", width: "0%", background: WINE_RED }}
        />
      </div>

      {/* ── Block indicator dots ─────────────────────────────────── */}
      <div style={{
        position: "absolute",
        right: "clamp(16px, 3vw, 40px)",
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        zIndex: 10,
      }}>
        {TEXT_BLOCKS.map((_, i) => (
          <span
            key={i}
            style={{
              display: "block",
              width: "1px",
              height: activeBlock === i ? "32px" : "12px",
              background: activeBlock === i ? CREAM : "rgba(255,255,255,0.25)",
              transition: "height 0.4s ease, background 0.4s ease",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes scrollHintFade { to { opacity: 0; } }
        @keyframes scrollDot {
          0%   { transform: translateY(0);   opacity: 1; }
          100% { transform: translateY(6px); opacity: 0; }
        }
      `}</style>
    </section>
  );
};