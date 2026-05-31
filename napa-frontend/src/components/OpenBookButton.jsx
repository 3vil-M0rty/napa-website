// src/pages/HeroPage.jsx  (or wherever you use it)
//
// Usage: just drop <OpenBookButton /> anywhere in your JSX.
// Make sure <BookOverlay /> is rendered once at the app root (see below).

import { useAtom } from "jotai";
import { bookOpenAtom } from "../components/bookAtom";

export const OpenBookButton = () => {
  const [isOpen, setIsOpen] = useAtom(bookOpenAtom);

  return (
    <button
      onClick={() => setIsOpen((v) => !v)}
      aria-label={isOpen ? "Close book" : "Open book"}
      style={{
        // Positioning: adjust to fit your hero layout
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 28px",
        borderRadius: 999,
        border: "1.5px solid rgba(255,255,255,0.3)",
        background: isOpen
          ? "rgba(255,255,255,0.12)"
          : "rgba(255,255,255,0.07)",
        color: "#fff",
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        cursor: "pointer",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        transition: "background 0.25s, border-color 0.25s, transform 0.2s",
        userSelect: "none",
        // Touch-friendly tap target
        minWidth: 44,
        minHeight: 44,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.18)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isOpen
          ? "rgba(255,255,255,0.12)"
          : "rgba(255,255,255,0.07)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Animated book icon */}
      <BookIcon open={isOpen} />
      {isOpen ? "Close Book" : "Open Book"}
    </button>
  );
};

// Lightweight SVG book icon that morphs between open/closed
const BookIcon = ({ open }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transition: "transform 0.3s ease", transform: open ? "rotate(10deg)" : "rotate(0deg)" }}
  >
    {open ? (
      // Open book
      <>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </>
    ) : (
      // Closed book
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </>
    )}
  </svg>
);