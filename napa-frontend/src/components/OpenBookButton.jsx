// src/components/OpenBookButton.jsx
import { useAtom } from "jotai";
import { bookOpenAtom } from "./bookAtom";
import {useTranslation} from "react-i18next";

const FONT_SANS  = "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const WINE_RED   = '#8b1d1f';
const WINE_HOVER = '#a8282b';
const CREAM      = '#faf6ef';

const MenuButton = ({ onClick, label, active }) => (
  <button
    onClick={onClick}
    style={{
      fontFamily: FONT_SANS,
      fontSize: '10px',
      fontWeight: 500,
      letterSpacing: '3px',
      textTransform: 'uppercase',
      padding: '12px 24px',
      background: active ? WINE_HOVER : WINE_RED,
      color: CREAM,
      border: 'none',
      borderRadius: 0,
      cursor: 'pointer',
      transition: 'background 0.2s ease',
      whiteSpace: 'nowrap',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = WINE_HOVER }}
    onMouseLeave={e => { e.currentTarget.style.background = active ? WINE_HOVER : WINE_RED }}
  >
    {label}
  </button>
);

export const OpenBookButton = () => {
  const [isOpen, setIsOpen] = useAtom(bookOpenAtom);
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <MenuButton
        onClick={() => setIsOpen(v => !v)}
        label={t('menu')}
        active={isOpen}
      />
    </div>
  );
};