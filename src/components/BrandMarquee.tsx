"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";

/* ── Types ─────────────────────────────────────────────────────────── */

export interface Brand {
  name: string;
  logo?: string;
}

interface BrandMarqueeProps {
  brands: Brand[];
}

/* ── Brand Tile ───────────────────────────────────────────────────── */

function BrandTile({ brand, isDark }: { brand: Brand; isDark: boolean }) {
  return (
    <div
      className="brand-tile flex-shrink-0 flex items-center justify-center"
      style={{
        width: "clamp(72px, 9vw, 110px)",
        height: "clamp(72px, 9vw, 110px)",
        borderRadius: "clamp(14px, 2vw, 20px)",
        padding: "clamp(12px, 1.7vw, 18px)",
        boxShadow: isDark
          ? "0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.08)"
          : "0 0 0 1px rgba(15,23,42,0.14), inset 0 1px 0 rgba(255,255,255,0.08)",
        background: isDark
          ? "linear-gradient(145deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.055) 100%)"
          : "linear-gradient(145deg, #09090b 0%, #17151a 54%, #242027 100%)",
        willChange: "transform",
      }}
    >
      {brand.logo ? (
        <Image
          src={brand.logo}
          alt={brand.name}
          width={80}
          height={80}
          draggable={false}
          className="pointer-events-none select-none"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: isDark
              ? "drop-shadow(0 6px 14px rgba(0,0,0,0.32))"
              : "brightness(0) invert(1) contrast(1.06) drop-shadow(0 3px 7px rgba(0,0,0,0.22))",
            opacity: isDark ? 0.98 : 0.9,
          }}
        />
      ) : (
        <div className="flex flex-col items-center gap-[4px] select-none pointer-events-none">
          {/* Gradient initial — more premium than flat pink */}
          <span
            style={{
              fontFamily: "var(--font-jost), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.3rem, 2.4vw, 1.85rem)",
              lineHeight: 1,
              backgroundImage: isDark
                ? "linear-gradient(135deg, #F472B6 0%, #DB2777 100%)"
                : "linear-gradient(135deg, #FFFFFF 0%, #FBCFE8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {brand.name.charAt(0)}
          </span>
          <span
            style={{
              fontFamily: "var(--font-jost), sans-serif",
              fontWeight: 500,
              fontSize: "clamp(0.38rem, 0.7vw, 0.55rem)",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              textAlign: "center",
              lineHeight: 1.2,
              maxWidth: "85%",
              color: isDark ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.62)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {brand.name}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Marquee Row ──────────────────────────────────────────────────── */

function MarqueeRow({
  brands,
  direction,
  speed,
  isDark,
  active,
}: {
  brands: Brand[];
  direction: "left" | "right";
  speed: number;
  isDark: boolean;
  active: boolean;
}) {
  const animName = direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        padding: "8px 0",
        borderRadius: "22px",
        background: "transparent",
      }}
    >
      {/* Fade edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10"
        style={{
          display: isDark ? "block" : "none",
          width: "clamp(60px, 10vw, 140px)",
          background: "linear-gradient(to right, #0d0608, transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10"
        style={{
          display: isDark ? "block" : "none",
          width: "clamp(60px, 10vw, 140px)",
          background: "linear-gradient(to left, #0d0608, transparent)",
        }}
      />

      <div
        className="flex items-center brand-marquee-strip"
        style={{
          gap: "clamp(12px, 2vw, 20px)",
          width: "max-content",
          animation: active ? `${animName} ${speed}s linear infinite` : "none",
          willChange: active ? "transform" : "auto",
        }}
      >
        {[0, 1, 2].map((copy) => (
          <div
            key={copy}
            className="flex items-center"
            style={{ gap: "clamp(12px, 2vw, 20px)" }}
          >
            {brands.map((b, i) => (
              <BrandTile key={`${copy}-${i}`} brand={b} isDark={isDark} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────────────── */

export default function BrandMarquee({ brands }: BrandMarqueeProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const reveal = () => setVisible(true);
    const checkVisibility = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 64 && rect.bottom > -80) {
        reveal();
      }
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reveal();
      },
      { rootMargin: "15% 0px 15% 0px", threshold: 0 },
    );

    const frame = window.requestAnimationFrame(checkVisibility);
    const timeout = window.setTimeout(checkVisibility, 900);
    window.addEventListener("scroll", checkVisibility, { passive: true });
    obs.observe(el);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      window.removeEventListener("scroll", checkVisibility);
      obs.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        padding: "clamp(28px, 5vw, 60px) 0 clamp(8px, 2vw, 20px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition:
          "opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Background ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(190,24,93,0.07), transparent)"
            : "none",
        }}
      />

      {/* Section Header — staggered entrance */}
      <div
        className="text-center px-4"
        style={{
          marginBottom: "clamp(24px, 4vw, 42px)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition:
            "opacity 0.6s 0.08s cubic-bezier(0.22,1,0.36,1), transform 0.6s 0.08s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontWeight: 600,
            fontSize: "clamp(0.6rem, 1vw, 0.72rem)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: isDark ? "rgba(244,114,182,0.65)" : "rgba(157,23,77,0.78)",
            marginBottom: "0.5rem",
          }}
        >
          Güvenilir Markalar
        </p>
        {/* Headline */}
        <h2
          style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.025em",
            color: isDark ? "rgba(255,255,255,0.90)" : "rgba(15,23,42,0.9)",
            margin: 0,
          }}
        >
          Birlikte büyüdüğümüz markalar
        </h2>
      </div>

      {/* Marquee Rows */}
      <div className="flex flex-col" style={{ gap: "clamp(10px, 1.5vw, 16px)" }}>
        <MarqueeRow brands={brands} direction="left" speed={28} isDark={isDark} active={visible} />
        <MarqueeRow
          brands={[...brands].reverse()}
          direction="right"
          speed={36}
          isDark={isDark}
          active={visible}
        />
      </div>

      {/* Bottom separator */}
      <div
        className="mx-auto"
        style={{
          display: isDark ? "block" : "none",
          marginTop: "clamp(24px, 4vw, 44px)",
          width: "clamp(80px, 16vw, 200px)",
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(244,114,182,0.35), transparent)",
        }}
      />

      {/* Keyframes + interaction styles */}
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }

        /* Accessibility: respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .brand-marquee-strip { animation-play-state: paused !important; }
        }

        /* Pause row on hover for readability */
        .brand-marquee-strip:hover {
          animation-play-state: paused;
        }

        /* Tile hover — lift + pink glow (Jhey: @property for smooth glow) */
        @property --tile-glow {
          syntax: '<number>';
          initial-value: 0;
          inherits: false;
        }
        .brand-tile {
          transition:
            box-shadow 0.3s cubic-bezier(0.22,1,0.36,1),
            transform 0.35s cubic-bezier(0.22,1,0.36,1),
            --tile-glow 0.3s ease;
        }
        .brand-tile:hover {
          --tile-glow: 1;
          transform: translateY(-3px) scale(1.05);
          box-shadow:
            0 0 0 1.5px rgba(244,114,182,0.55),
            0 6px 24px rgba(219,39,119,calc(0.18 * var(--tile-glow))),
            0 2px 8px rgba(0,0,0,0.10) !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .brand-tile:hover { transform: none; }
        }
      `}</style>
    </section>
  );
}
