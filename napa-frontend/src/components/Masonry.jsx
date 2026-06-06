import { useState } from 'react';
import './Masonry.css';

const FONT_SERIF = "'Cormorant Garamond', 'Cormorant', Georgia, 'Times New Roman', serif";
const FONT_SANS = "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const WINE_RED = '#8b1d1f';
const CREAM = '#faf6ef';
const CREAM60 = 'rgba(250,246,239,0.6)';

const DrinkOverlay = ({ name, description, visible }) => (
  <div className={`drink-overlay ${visible ? 'visible' : ''}`}>
    <span className="overlay-line" />
    <span className="overlay-name">{name}</span>
    {description && <span className="overlay-desc">{description}</span>}
  </div>
);

const Masonry = ({ items }) => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="masonry-grid">
      {items.map((item, i) => (
        <div
          key={item.id}
          className={`masonry-item ${i % 3 === 1 ? 'tall' : ''}`}
          onClick={() => item.url && window.open(item.url, '_blank', 'noopener')}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div
            className="masonry-img"
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