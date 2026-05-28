import { useRef, useEffect, useState } from "react";
import { SLIDES } from "./ScrollSection";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@200;300;400&display=swap');

  :root {
    --ease-silk: cubic-bezier(0.23, 1, 0.32, 1);
    --gold:      #c9a96e;
    --cream:     #f5f0e8;
  }

  /* ── Wrapper: clip horizontal overflow here at the top level only ── */
  .ms-wrapper {
    position: relative;
    width: 100%;
    overflow-x: clip;   /* clip (not hidden) — doesn't create a scroll container,
                           so sticky children inside still work correctly */
    overflow-y: visible;
    max-width: 100%;
  contain: layout style; 
  }

  @media (min-width: 768px) {
    .ms-wrapper { display: none; }
  }

  /*
    Each slide is a tall scroll-container for its sticky child.
    Height = 200vh for all except last (100vh) so the card
    stays pinned long enough for the next to rise over it.

    CRITICAL: NO overflow on .ms-slide — any overflow value
    other than visible breaks position:sticky inside it.
  */
  .ms-slide {
    position: relative;
    /* height set via inline style */
  }

  /*
    The sticky panel pins at top:0 and is always 100vh tall.
    z-index increments per slide so each new card is visually
    above the previous one — the natural scroll rise does the
    "covering" effect without any JS or clip-path needed.
  */
  .ms-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    height: 100svh;
    width: 100%;
    overflow: hidden;       /* safe here — clips bg bleed inside the sticky panel */
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  /* Background: vertical oversize only — NO horizontal bleed */
  .ms-bg {
    position: absolute;
    inset: -8% 0;           /* top/bottom oversize for parallax; left/right flush */
    background-size: cover;
    background-position: center;
    will-change: transform;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  .ms-overlay-top {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(to bottom, rgba(10,10,9,.40) 0%, transparent 30%);
    pointer-events: none;
  }
  .ms-overlay-bottom {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(to top, rgba(10,10,9,.78) 0%, rgba(10,10,9,.12) 50%, transparent 72%);
    pointer-events: none;
  }

  .ms-img-wrap {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
  .ms-img {
    display: block;
    width: 66%;
    max-width: 300px;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    border-radius: 2px;
    transform: translateY(-6%);
    box-shadow: 0 36px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(201,169,110,.15);
  }

  .ms-text {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    z-index: 3;
    padding: 0 28px 54px;
    text-align: center;
    pointer-events: none;
    opacity: 0;
    transform: translateY(14px);
    transition: opacity .7s var(--ease-silk), transform .7s var(--ease-silk);
  }
  .ms-text.visible { opacity: 1; transform: translateY(0); }

  .ms-slide-num {
    display: block;
    font-family: 'Montserrat', sans-serif;
    font-weight: 200; font-size: 10px;
    letter-spacing: .32em; color: var(--gold);
    text-transform: uppercase; margin-bottom: 12px;
  }
  .ms-rule {
    display: block; width: 26px; height: 1px;
    background: var(--gold); opacity: .5; margin: 0 auto 12px;
  }
  .ms-title {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic; font-weight: 300;
    font-size: clamp(26px, 8.5vw, 38px);
    line-height: 1.08; color: var(--cream);
    letter-spacing: .01em; margin: 0 0 8px;
  }
  .ms-sub {
    font-family: 'Montserrat', sans-serif;
    font-weight: 200; font-size: 10px;
    letter-spacing: .24em; color: rgba(245,240,232,.6);
    text-transform: uppercase;
  }

  .ms-badge {
    position: absolute; top: 26px; right: 22px;
    z-index: 3;
    font-family: 'Montserrat', sans-serif;
    font-weight: 200; font-size: 10px;
    letter-spacing: .22em; color: rgba(201,169,110,.65);
    text-transform: uppercase;
  }
`;

function Slide({ slide, index, total }) {
  const stickyRef = useRef(null);
  const bgRef     = useRef(null);
  const textRef   = useRef(null);
  const rafRef    = useRef(null);
  const [textVisible, setTextVisible] = useState(index === 0);

  useEffect(() => {
    const sticky = stickyRef.current;
    const bg     = bgRef.current;
    if (!sticky || !bg) return;

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const rect = sticky.getBoundingClientRect();
        const vh   = window.innerHeight;

        // How far this panel has scrolled past the top (0→1)
        const progress = Math.max(0, Math.min(1, -rect.top / vh));

        // Parallax: bg drifts up slightly as we scroll through
        bg.style.transform = `translateZ(0) translateY(${progress * 8}%)`;

        // Show text when panel is on screen
        const onScreen = rect.top < vh * 0.88 && rect.bottom > 0;
        setTextVisible(onScreen);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const label = slide.altFallback || `Slide ${index + 1}`;
  const sub   = slide.subKey      || "";
  const alt   = slide.bgAlt       || label;

  /*
    Slot height:
    - Slides 0…N-2: 200svh — the card is visible for 100svh then
      the next card scrolls up over it during the second 100svh.
    - Last slide: 100svh — nothing needs to scroll over it.
  */
  const isLast    = index === total - 1;
  const slotHeight = isLast ? "100svh" : "200svh";

  return (
    <div
      className="ms-slide"
      style={{ height: slotHeight, zIndex: index + 1 }}
    >
      <div className="ms-sticky" ref={stickyRef}>

        {/* Background */}
        <div
          className="ms-bg"
          ref={bgRef}
          role="img"
          aria-label={alt}
          style={{
            backgroundImage:  slide.background ? `url(${slide.background})` : "none",
            backgroundColor: "#1a1510",
          }}
        />

        <div className="ms-overlay-top"    aria-hidden="true" />
        <div className="ms-overlay-bottom" aria-hidden="true" />

        {/* Foreground portrait */}
        <div className="ms-img-wrap">
          <img
            className="ms-img"
            src={slide.img || ""}
            alt={alt}
            loading="eager"
            decoding="sync"
          />
        </div>

        {/* Badge */}
        <div className="ms-badge" aria-hidden="true">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>

        {/* Text */}
        <div
          className={`ms-text${textVisible ? " visible" : ""}`}
          ref={textRef}
        >
          <span className="ms-slide-num">{slide.slug || `Chapter ${index + 1}`}</span>
          <div className="ms-rule" aria-hidden="true" />
          <h2 className="ms-title">{label}</h2>
          {sub && <p className="ms-sub">{sub}</p>}
        </div>

      </div>
    </div>
  );
}

export default function MobileStack() {
  useEffect(() => {
    const id = "ms-styles-v5";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.getElementById(id)?.remove();
  }, []);

  return (
    <section className="ms-wrapper" aria-label="Featured collection">
      {SLIDES.map((slide, i) => (
        <Slide
          key={slide.slug || i}
          slide={slide}
          index={i}
          total={SLIDES.length}
        />
      ))}
    </section>
  );
}