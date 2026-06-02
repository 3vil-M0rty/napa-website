import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

import './Masonry.css';

const useMedia = (queries, values, defaultValue) => {
  const get = () => values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue;
  const [value, setValue] = useState(get);
  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach(q => matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler));
  }, [queries]);
  return value;
};

const useMeasure = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, size];
};

const preloadImages = async urls => {
  await Promise.all(
    urls.map(src => new Promise(resolve => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => resolve();
    }))
  );
};

const FONT_SERIF = "'Cormorant Garamond', 'Cormorant', Georgia, 'Times New Roman', serif";
const FONT_SANS = "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const WINE_RED = '#8b1d1f';
const CREAM = '#faf6ef';
const CREAM60 = 'rgba(250,246,239,0.6)';

const DrinkOverlay = ({ name, description, visible }) => (
  <div
    className="drink-overlay"
    style={{
      position: 'absolute',
      inset: 0,
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '20px 16px 18px',
      background: visible
        ? 'linear-gradient(to top, rgba(10,0,2,0.88) 0%, rgba(10,0,2,0.3) 55%, transparent 100%)'
        : 'linear-gradient(to top, rgba(10,0,2,0) 0%, transparent 100%)',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.35s ease, background 0.35s ease',
      pointerEvents: 'none',
    }}
  >
    <span style={{
      display: 'block',
      width: visible ? '32px' : '0px',
      height: '1px',
      background: WINE_RED,
      marginBottom: '10px',
      transition: 'width 0.4s ease 0.05s',
    }} />

    <span style={{
      fontFamily: FONT_SERIF,
      fontStyle: 'italic',
      fontWeight: 600,
      fontSize: 'clamp(15px, 1.4vw, 19px)',
      color: CREAM,
      lineHeight: 1.2,
      letterSpacing: '0.02em',
      marginBottom: '5px',
      transform: visible ? 'translateY(0)' : 'translateY(8px)',
      transition: 'transform 0.35s ease',
    }}>
      {name}
    </span>

    {description && (
      <span style={{
        fontFamily: FONT_SANS,
        fontSize: '10px',
        fontWeight: 400,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: CREAM60,
        lineHeight: 1.5,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transition: 'transform 0.4s ease 0.05s',
      }}>
        {description}
      </span>
    )}
  </div>
);

const Masonry = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
}) => {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [5, 4, 3, 2],
    1
  );

  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  const getInitialPosition = (item) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };
    let direction = animateFrom;
    if (animateFrom === 'random') {
      const dirs = ['top', 'bottom', 'left', 'right'];
      direction = dirs[Math.floor(Math.random() * dirs.length)];
    }
    switch (direction) {
      case 'top': return { x: item.x, y: -200 };
      case 'bottom': return { x: item.x, y: window.innerHeight + 200 };
      case 'left': return { x: -200, y: item.y };
      case 'right': return { x: window.innerWidth + 200, y: item.y };
      case 'center': return { x: containerRect.width / 2 - item.w / 2, y: containerRect.height / 2 - item.h / 2 };
      default: return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    preloadImages(items.map(i => i.img)).then(() => setImagesReady(true));
  }, [items]);

  const grid = useMemo(() => {
  if (!width) return [];
  const columnWidth = width / columns;
  const colHeights = new Array(columns).fill(0);

  const heightPatterns = [
    window.innerHeight * 0.30,
    window.innerHeight * 0.40,
    window.innerHeight * 0.30,
  ];

  // each column starts at a different index in the pattern
  const colOffsets = [0, 1, 2, 0]; // col0 starts at h1, col1 at h2, col2 at h3, col3 at h1

  return items.map((child, index) => {
    const col = index % columns;
    const itemIndexInCol = Math.floor(index / columns);
    const patternIndex = (colOffsets[col] + itemIndexInCol) % heightPatterns.length;
    const height = heightPatterns[patternIndex];

    const x = columnWidth * col;
    const y = colHeights[col];
    colHeights[col] += height;

    return { ...child, x, y, w: columnWidth, h: height };
  });
}, [columns, items, width]);

  const totalHeight = useMemo(() => {
    if (!grid.length) return 0;
    return Math.max(...grid.map(item => item.y + item.h));
  }, [grid]);

  const hasMounted = useRef(false);
  const hasAnimated = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady) return;

    const container = containerRef.current;
    if (!container) return;

    const runAnimation = () => {
      grid.forEach((item, index) => {
        const selector = `[data-key="${item.id}"]`;
        const animationProps = { x: item.x, y: item.y, width: item.w, height: item.h };

        if (!hasMounted.current) {
          const initialPos = getInitialPosition(item);
          gsap.fromTo(selector, {
            opacity: 0,
            x: initialPos.x,
            y: initialPos.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: 'blur(10px)' }),
          }, {
            opacity: 1,
            ...animationProps,
            ...(blurToFocus && { filter: 'blur(0px)' }),
            duration: 0.8,
            ease: 'power3.out',
            delay: index * stagger,
          });
        } else {
          gsap.to(selector, { ...animationProps, duration, ease, overwrite: 'auto' });
        }
      });
      hasMounted.current = true;
    };

    if (hasAnimated.current) {
      runAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasAnimated.current = true;
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();

  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

  const handleMouseEnter = (e, item) => {
    setHoveredId(item.id);
    if (scaleOnHover) {
      gsap.to(`[data-key="${item.id}"]`, { scale: hoverScale, duration: 0.3, ease: 'power2.out' });
    }
  };

  const handleMouseLeave = (e, item) => {
    setHoveredId(null);
    if (scaleOnHover) {
      gsap.to(`[data-key="${item.id}"]`, { scale: 1, duration: 0.3, ease: 'power2.out' });
    }
  };

  return (
    <div ref={containerRef} className="list" style={{ height: totalHeight || undefined }}>
      {grid.map(item => (
        <div
          key={item.id}
          data-key={item.id}
          className="item-wrapper"
          onClick={() => item.url && window.open(item.url, '_blank', 'noopener')}
          onMouseEnter={e => handleMouseEnter(e, item)}
          onMouseLeave={e => handleMouseLeave(e, item)}
        >
          <div
            className="item-img"
            style={{ backgroundImage: `url(${item.img})` }}
          >
            {(item.name || item.description) && (
              <DrinkOverlay
                name={item.name}
                description={item.description}
                visible={hoveredId === item.id}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Masonry;