"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";

const leftLinks = [
  { href: "/", label: "ana sayfa" },
  { href: "/hizmetler", label: "hizmetler" },
];

const rightLinks = [
  { href: "/projeler", label: "projeler" },
  { href: "/hakkimizda", label: "hakkımızda" },
];

const mobileLinks = [...leftLinks, ...rightLinks];

const NAVBAR_GRADIENT_LIGHT =
  "linear-gradient(135deg, #F472B6 0%, #EC4899 40%, #DB2777 100%)";
const NAVBAR_GRADIENT_DARK =
  "linear-gradient(135deg, #9D174D 0%, #BE185D 40%, #DB2777 100%)";
const NAVBAR_SHADOW_LIGHT =
  "0 8px 32px rgba(219, 39, 119, 0.3), 0 2px 8px rgba(0,0,0,0.1)";
const NAVBAR_SHADOW_DARK =
  "0 8px 32px rgba(190, 24, 93, 0.35), 0 2px 8px rgba(0,0,0,0.4)";

interface BlobState {
  left: number;
  width: number;
  opacity: number;
  scaleX: number;
  scaleY: number;
  velocityX: number;
}

const SPRING_STIFFNESS = 0.12;
const SPRING_DAMPING = 0.7;
/** Increased threshold so the loop settles faster */
const SETTLE_THRESHOLD = 1.2;

function useSpringBlob() {
  const targetRef = useRef({ left: 0, width: 0, opacity: 0 });
  const currentRef = useRef({ left: 0, width: 0, opacity: 0 });
  const velocityRef = useRef({ left: 0, width: 0, opacity: 0 });
  const blobElRef = useRef<HTMLDivElement | null>(null);
  const [blob, setBlob] = useState<BlobState>({
    left: 0, width: 0, opacity: 0, scaleX: 1, scaleY: 1, velocityX: 0,
  });
  const rafRef = useRef<number>(0);
  const isAnimatingRef = useRef(false);

  const animate = useCallback(function animateFrame() {
    const target = targetRef.current;
    const current = currentRef.current;
    const velocity = velocityRef.current;

    const keys = ["left", "width", "opacity"] as const;
    let settled = true;

    for (const key of keys) {
      const displacement = target[key] - current[key];
      const springForce = displacement * SPRING_STIFFNESS;
      velocity[key] = (velocity[key] + springForce) * SPRING_DAMPING;
      current[key] += velocity[key];

      if (Math.abs(displacement) > SETTLE_THRESHOLD || Math.abs(velocity[key]) > SETTLE_THRESHOLD) {
        settled = false;
      }
    }

    const speed = Math.abs(velocity.left);
    const squishAmount = Math.min(speed * 0.015, 0.18);
    const scaleX = 1 + squishAmount;
    const scaleY = 1 - squishAmount * 0.5;
    const skew = Math.max(-8, Math.min(8, velocity.left * -0.6));

    // Direct DOM update — avoids React re-render on every frame
    const el = blobElRef.current;
    if (el) {
      el.style.left = `${current.left}px`;
      el.style.width = `${current.width}px`;
      el.style.opacity = `${current.opacity}`;
      el.style.transform = `translateY(-50%) scaleX(${scaleX}) scaleY(${scaleY}) skewX(${skew}deg)`;
    }

    if (!settled) {
      rafRef.current = requestAnimationFrame(animateFrame);
    } else {
      // Snap to target
      current.left = target.left;
      current.width = target.width;
      current.opacity = target.opacity;
      velocityRef.current = { left: 0, width: 0, opacity: 0 };
      if (el) {
        el.style.left = `${target.left}px`;
        el.style.width = `${target.width}px`;
        el.style.opacity = `${target.opacity}`;
        el.style.transform = `translateY(-50%) scaleX(1) scaleY(1) skewX(0deg)`;
      }
      isAnimatingRef.current = false;
    }
  }, []);

  const setTarget = useCallback(
    (left: number, width: number, opacity: number) => {
      targetRef.current = { left, width, opacity };
      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    },
    [animate]
  );

  const setImmediate = useCallback((left: number, width: number, opacity: number) => {
    targetRef.current = { left, width, opacity };
    currentRef.current = { left, width, opacity };
    velocityRef.current = { left: 0, width: 0, opacity: 0 };
    const el = blobElRef.current;
    if (el) {
      el.style.left = `${left}px`;
      el.style.width = `${width}px`;
      el.style.opacity = `${opacity}`;
      el.style.transform = `translateY(-50%) scaleX(1) scaleY(1) skewX(0deg)`;
    }
    setBlob({ left, width, opacity, scaleX: 1, scaleY: 1, velocityX: 0 });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { blob, blobElRef, setTarget, setImmediate };
}

function useNavVisibility() {
  /* Menü açılışta tamamen gizli. Sabit bir piksel eşiğiyle değil, hero'nun
     BİTTİĞİ noktayla — page.tsx'teki #hero-nav-sentinel ile — tetikleniyor.
     Sentinel, hero'nun sticky pinlemesi bitip bir sonraki bölüm başladığı
     tam sınırda duruyor. IntersectionObserver ile: sentinel viewport'ta
     görünüyorsa tam sınırdayız → görünür; görünmüyorsa üstteyse (top < 0)
     geçmişiz → görünür kalır, alttaysa (henüz ulaşılmamış) → gizli.
     Hero'suz sayfalarda (sentinel yok) menü baştan görünür olur. */
  const [visible, setVisible] = useState(false);
  useLayoutEffect(() => {
    const sentinel = document.getElementById("hero-nav-sentinel");
    if (!sentinel) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting || entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);
  return visible;
}

export default function Navbar() {
  const pathname = usePathname();
  const navVisible = useNavVisibility();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const { blob, blobElRef, setTarget, setImmediate } = useSpringBlob();
  const initializedRef = useRef(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const getPosition = useCallback(
    (el: HTMLAnchorElement) => {
      if (!navRef.current) return null;
      const navRect = navRef.current.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      return { left: elRect.left - navRect.left, width: elRect.width };
    },
    []
  );

  useEffect(() => {
    const activeEl = linkRefs.current.get(pathname);
    if (activeEl && !initializedRef.current) {
      const pos = getPosition(activeEl);
      if (pos) {
        setImmediate(pos.left, pos.width, 1);
        initializedRef.current = true;
      }
    }
  }, [pathname, getPosition, setImmediate]);

  useEffect(() => {
    const timer = window.setTimeout(() => setMobileOpen(false), 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    if (mobileOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const toggleMenu = useCallback(() => {
    setHasInteracted(true);
    setMobileOpen((v) => !v);
  }, []);

  // Focus management for mobile overlay
  useEffect(() => {
    if (mobileOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const timer = setTimeout(() => {
        const firstLink = overlayRef.current?.querySelector("a");
        firstLink?.focus();
      }, 300);
      return () => clearTimeout(timer);
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [mobileOpen]);

  // Focus trap + Escape key
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (e.key === "Tab" && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const handleMouseEnter = (href: string) => {
    setHoveredHref(href);
    const el = linkRefs.current.get(href);
    if (!el) return;
    const pos = getPosition(el);
    if (pos) setTarget(pos.left, pos.width, 1);
  };

  const handleMouseLeave = () => {
    setHoveredHref(null);
    const activeEl = linkRefs.current.get(pathname);
    if (activeEl) {
      const pos = getPosition(activeEl);
      if (pos) setTarget(pos.left, pos.width, 1);
    } else {
      setTarget(blob.left, blob.width, 0);
    }
  };

  const setLinkRef = (href: string, el: HTMLAnchorElement | null) => {
    if (el) linkRefs.current.set(href, el);
  };

  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    const isHovered = hoveredHref === href;
    if (isActive || isHovered) {
      return isDark ? "text-white" : "text-[#A01550]";
    }
    return isDark ? "text-white/60" : "text-white/90";
  };

  return (
    <>
      {/* ── Mobil: Sabit üst bar (desktop gradient stili) ── */}
      <div className="fixed top-4 left-1/2 z-[70] w-[92%] -translate-x-1/2 md:hidden">
        <div
          className="relative flex items-center justify-between rounded-full px-3 py-2.5 transition-all duration-500"
          style={{
            background: mobileOpen
              ? "transparent"
              : isDark
                ? NAVBAR_GRADIENT_DARK
                : NAVBAR_GRADIENT_LIGHT,
            boxShadow: mobileOpen
              ? "none"
              : isDark
                ? NAVBAR_SHADOW_DARK
                : NAVBAR_SHADOW_LIGHT,
          }}
        >
          {/* Sol: Theme Toggle */}
          <div className="relative z-10">
            <ThemeToggle />
          </div>

          {/* Orta: Logo (bardan taşan — menü açıkken gizlenir) */}
          <div
            className="relative -my-5 z-10 transition-all duration-500"
            style={{
              opacity: mobileOpen ? 0 : 1,
              transform: mobileOpen ? "scale(0.85)" : "scale(1)",
              pointerEvents: mobileOpen ? "none" : "auto",
            }}
          >
            <Link href="/">
              <Image
                src="/zeplin-logo.png"
                alt="Zeplin Media"
                width={80}
                height={80}
                className="drop-shadow-lg hover:scale-110 transition-transform duration-300"
                priority
              />
            </Link>
          </div>

          {/* Sağ: Hamburger / Close butonu */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu-overlay"
            className="relative z-10 grid h-10 w-10 place-items-center rounded-full transition-all duration-300"
          >
            <div className="flex h-5 w-6 flex-col justify-between">
              <span
                className={`block h-[2.5px] rounded-full bg-white/90 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  mobileOpen
                    ? "translate-y-[8.75px] rotate-45 bg-white"
                    : "w-full"
                }`}
              />
              <span
                className={`block h-[2.5px] rounded-full bg-white/60 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  mobileOpen
                    ? "scale-x-0 opacity-0 bg-white"
                    : "w-4/5 ml-auto"
                }`}
              />
              <span
                className={`block h-[2.5px] rounded-full bg-white/90 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  mobileOpen
                    ? "-translate-y-[8.75px] -rotate-45 bg-white"
                    : "w-full"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* ── Mobil: Full-screen overlay menü ── */}
      <div
        ref={overlayRef}
        id="mobile-menu-overlay"
        className={`fixed inset-0 z-[60] md:hidden ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Ana menü"
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 flex min-h-dvh flex-col ${
            mobileOpen
              ? "menu-overlay-enter"
              : hasInteracted
                ? "menu-overlay-exit"
                : "opacity-0"
          }`}
          style={{
            background: isDark
              ? "linear-gradient(165deg, #831843 0%, #9D174D 30%, #BE185D 60%, #DB2777 100%)"
              : "linear-gradient(165deg, #DB2777 0%, #EC4899 40%, #F472B6 80%, #FBCFE8 100%)",
          }}
        >
          {/* Nokta desen texture */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden="true"
          />

          {/* ── TOP: Logo — navbar bar logosuyla birebir aynı konumda ── */}
          <div className="relative z-10 mt-4 mx-auto flex w-[92%] items-center justify-center rounded-full px-3 py-2.5">
            <Link href="/" onClick={() => setMobileOpen(false)} className="-my-5">
              <Image
                src="/zeplin-logo.png"
                alt="Zeplin Media"
                width={80}
                height={80}
                className="drop-shadow-lg brightness-0 invert"
              />
            </Link>
          </div>

          {/* ── MIDDLE: Navigasyon linkleri ── */}
          <nav className="relative z-10 flex flex-1 flex-col justify-center px-6" aria-label="Mobil navigasyon">
            <ul className="space-y-0">
              {mobileLinks.map((link, index) => {
                const active = pathname === link.href;
                const delay = 150 + index * 80;
                return (
                  <li key={`overlay-${link.href}`}>
                    {index > 0 && (
                      <div
                        className={`h-px bg-white/20 ${mobileOpen ? "menu-separator-enter" : "scale-x-0"}`}
                        style={{ "--stagger-delay": `${delay - 40}ms` } as React.CSSProperties}
                        aria-hidden="true"
                      />
                    )}
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`group flex items-center justify-between py-4 ${
                        mobileOpen ? "menu-link-enter" : "opacity-0"
                      }`}
                      style={{ "--stagger-delay": `${delay}ms` } as React.CSSProperties}
                      {...(active ? { "aria-current": "page" as const } : {})}
                    >
                      <span
                        className={`text-3xl font-bold lowercase tracking-tight transition-colors ${
                          active
                            ? "text-white"
                            : "text-white/70 group-hover:text-white"
                        }`}
                      >
                        {link.label}
                      </span>
                      <span className="flex items-center gap-3">
                        {active && (
                          <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                        )}
                        <svg
                          className={`h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 ${
                            active ? "text-white" : "text-white/40 group-hover:text-white/70"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ── BOTTOM: Dil seçici, CTA, Theme toggle ── */}
          <div
            className={`relative z-10 px-6 pb-8 ${
              mobileOpen ? "menu-bottom-enter" : "opacity-0"
            }`}
            style={{ "--stagger-delay": `${150 + mobileLinks.length * 80 + 100}ms` } as React.CSSProperties}
          >
            <div className="flex gap-2">
              {["TR", "EN", "DE", "RU"].map((lang, i) => (
                <button
                  key={lang}
                  type="button"
                  className={`rounded-xl px-4 py-2 text-sm font-semibold tracking-wide transition-colors ${
                    i === 0
                      ? "bg-white text-[#DB2777] shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                      : "border border-white/25 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-2xl bg-white py-4 text-lg font-semibold text-[#DB2777] shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-transform active:scale-[0.98]"
            >
              İletişime Geç
            </button>

          </div>
        </div>
      </div>

      <nav
        data-site-nav
        className={`fixed top-5 left-1/2 z-50 hidden w-auto -translate-x-1/2 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:block ${
          navVisible ? "opacity-100 translate-y-0" : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
      {/* SVG filters removed for performance */}

      <div
        ref={navRef}
        onMouseLeave={handleMouseLeave}
        className="relative flex items-center justify-between gap-1 rounded-full px-2 py-1.5 transition-all duration-500"
        style={{
          background: isDark
            ? NAVBAR_GRADIENT_DARK
            : NAVBAR_GRADIENT_LIGHT,
          boxShadow: isDark
            ? NAVBAR_SHADOW_DARK
            : NAVBAR_SHADOW_LIGHT,
        }}
      >
        {/* === LIQUID 3D BLOB === */}
        <div
          ref={blobElRef}
          className="absolute top-1/2 h-[calc(100%-10px)] rounded-full pointer-events-none will-change-transform"
          style={{
            left: `${blob.left}px`,
            width: `${blob.width}px`,
            opacity: blob.opacity,
            transform: `translateY(-50%) scaleX(${blob.scaleX}) scaleY(${blob.scaleY}) skewX(0deg)`,
          }}
        >
          {/* Katman 1: Dış gölge */}
          <div
            className="absolute -inset-[1px] rounded-full"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.12) 100%)",
              filter: "blur(1px)",
            }}
          />

          {/* Katman 2: Ana cam gövde — simplified, no SVG filter */}
          <div
            className="absolute inset-0 rounded-full border overflow-hidden"
            style={{
              borderColor: isDark ? "rgba(251,113,133,0.3)" : "rgba(255,255,255,0.5)",
              background: isDark
                ? "linear-gradient(145deg, rgba(251,113,133,0.2) 0%, rgba(244,63,94,0.12) 30%, rgba(190,24,93,0.08) 100%)"
                : "linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 30%, rgba(255,240,245,0.35) 70%, rgba(255,228,238,0.3) 100%)",
              backdropFilter: "blur(8px) saturate(1.3)",
              boxShadow: isDark
                ? "inset 0 1px 3px rgba(251,113,133,0.2), 0 4px 12px rgba(0,0,0,0.1)"
                : "inset 0 1px 3px rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.05)",
            }}
          />

          {/* Katman 3: Specular highlight */}
          <div
            className="absolute top-[2px] left-[8%] right-[8%] h-[45%] rounded-full"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.08) 100%)",
            }}
          />

          {/* Katman 4: Rim light */}
          <div
            className="absolute bottom-[2px] left-[12%] right-[12%] h-[18%] rounded-full"
            style={{
              background: "linear-gradient(0deg, rgba(255,255,255,0.15) 0%, transparent 100%)",
            }}
          />
        </div>

        {/* Sol menü */}
        <ul className="flex items-center gap-1 relative z-10">
          {leftLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                ref={(el) => setLinkRef(link.href, el)}
                onMouseEnter={() => handleMouseEnter(link.href)}
                className={`block rounded-full px-6 py-2.5 text-base font-medium lowercase transition-colors duration-300 ${getLinkClass(link.href)}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Ortadaki Zeplin Logo */}
        <div className="relative -my-5 z-10">
          <Link href="/">
            <Image
              src="/zeplin-logo.png"
              alt="Zeplin Media"
              width={80}
              height={80}
              className="drop-shadow-lg hover:scale-110 transition-transform duration-300"
              priority
            />
          </Link>
        </div>

        {/* Sağ menü */}
        <ul className="flex items-center gap-1 relative z-10">
          {rightLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                ref={(el) => setLinkRef(link.href, el)}
                onMouseEnter={() => handleMouseEnter(link.href)}
                className={`block rounded-full px-6 py-2.5 text-base font-medium lowercase transition-colors duration-300 ${getLinkClass(link.href)}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Toggle - navbar'ın sağ dışında */}
      <div className="absolute -right-12 top-1/2 -translate-y-1/2">
        <ThemeToggle />
      </div>
      </nav>
    </>
  );
}
