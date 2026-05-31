// src/components/BookOverlay.jsx
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useAtom } from "jotai";
import { Suspense, useEffect, useRef, useState } from "react";
import { Experience } from "./Experience";
import { UI } from "./UI";
import {bookOpenAtom} from "./bookAtom";
import { pageAtom } from "./UI";
import * as THREE from "three";

// Inside BookOverlay, add this atom:


export const BookOverlay = () => {
    const [isOpen, setIsOpen] = useAtom(bookOpenAtom);
    // Once mounted, keep the Canvas alive to preserve WebGL context
    const [hasMounted, setHasMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [, setPage] = useAtom(pageAtom);
    const overlayRef = useRef(null);

    // Mount Canvas on first open
    useEffect(() => {
        if (isOpen) setHasMounted(true);
    }, [isOpen]);

    // Drive CSS transition: wait a tick after mount so the browser
    // registers the initial state before animating to visible
    useEffect(() => {
        if (isOpen) {
            // Small rAF delay lets the DOM paint the hidden state first
            const id = requestAnimationFrame(() => setVisible(true));
            return () => cancelAnimationFrame(id);
        } else {
            setVisible(false);
        }
    }, [isOpen]);

    // Scroll lock — works on iOS Safari too (touch-action + overflow)
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = "0";
            document.body.style.right = "0";
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.position = "";
                document.body.style.top = "";
                document.body.style.left = "";
                document.body.style.right = "";
                document.body.style.overflow = "";
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [setIsOpen]);

    const close = () => {
        setIsOpen(false);
        setPage(0); // reset to cover so audio stops
    };

    if (!hasMounted) return null;

    return (
        <>
            {/* ── Backdrop ─────────────────────────────────────────────────── */}
            <div
                onClick={close}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 900,
                    background: "rgba(0,0,0,0.4)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.4s ease",
                    pointerEvents: visible ? "auto" : "none",
                }}
            />

            {/* ── Overlay panel ────────────────────────────────────────────── */}
            <div
                ref={overlayRef}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 901,
                    display: "flex",
                    flexDirection: "column",
                    // Slide up from slightly below on open
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(40px)",
                    transition: "opacity 0.45s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)",
                    pointerEvents: visible ? "auto" : "none",
                    overflow: "hidden",   // ← add this
                    height: "100vh",
                    visibility: visible ? "visible" : "hidden",
                }}
            >
                {/* Close button */}
                <button
                    onClick={close}
                    aria-label="Close book"
                    style={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        zIndex: 10,
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.25)",
                        background: "rgba(0,0,0,0.5)",
                        color: "#fff",
                        fontSize: 20,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(4px)",
                        WebkitBackdropFilter: "blur(4px)",
                        transition: "background 0.2s, transform 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                        e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(0,0,0,0.5)";
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                >
                    ✕
                </button>

                {/* The book's own UI (page navigation strip) */}

                {/* Loader shown while textures stream in */}
                <Loader />

                {/* 3D Canvas — stays mounted once created */}
                <Canvas
                    shadows
                    gl={{ shadowMapType: THREE.PCFShadowMap }} 
                    camera={{
                        position: [-0.5, 1, window.innerWidth > 800 ? 3.5 : 7],
                        fov: 45,
                    }}
                    style={{ flex: 1, width: "100%", height: "100vh" }}
                >
                    <group position-y={0}>
                        <Suspense fallback={null}>
                            <Experience />
                        </Suspense>
                    </group>
                </Canvas>
            </div>
        </>
    );
};