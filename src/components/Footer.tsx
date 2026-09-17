"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

const SERIF = {
  fontFamily: "var(--font-instrument), 'Instrument Serif', Georgia, serif",
} as const;

const MONO = {
  fontFamily: "ui-monospace, 'JetBrains Mono', monospace",
} as const;

/* ── Zeplin Media star — clean CSS asterisk ──────────────────────────── */
function ZMStar({
  size,
  spin = 18,
  glow = 40,
}: {
  size: number;
  spin?: number;
  glow?: number;
}) {
  const w = Math.round(size * 0.15);
  const barStyle: CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: size,
    height: w,
    background: "#DB2777",
    borderRadius: 9999,
    transform: "translate(-50%, -50%)",
  };
  return (
    <div
      className="animate-spin"
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        position: "relative",
        animationDuration: `${spin}s`,
        filter: `drop-shadow(0 0 ${glow}px rgba(219,39,119,0.6))`,
      }}
      aria-hidden="true"
    >
      <span style={barStyle} />
      <span style={{ ...barStyle, transform: "translate(-50%, -50%) rotate(90deg)" }} />
      <span style={{ ...barStyle, transform: "translate(-50%, -50%) rotate(45deg)" }} />
      <span style={{ ...barStyle, transform: "translate(-50%, -50%) rotate(-45deg)" }} />
    </div>
  );
}

/* ── Nav data ───────────────────────────────────────────────────────── */
const siteLinks = [
  { href: "/",             label: "Ana sayfa" },
  { href: "/hizmetler",    label: "Hizmetler" },
  { href: "/projeler",     label: "Projeler" },
  { href: "/operasyonlar", label: "Operasyonlar" },
  { href: "/hakkimizda",   label: "Hakkımızda" },
  { href: "/galeri",       label: "Galeri" },
];

const socialLinks: { href: string; label: string; internal?: boolean }[] = [
  { href: "https://www.instagram.com/zeplin.media/",         label: "Instagram" },
  { href: "https://www.linkedin.com/company/zeplin-media/",  label: "LinkedIn" },
  { href: "https://wa.me/905459407690",                       label: "WhatsApp" },
];

/* ── Footer ─────────────────────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer className="px-3 pb-4 pt-12 md:px-4 md:pb-8 md:pt-16">
      <div className="mx-auto w-full max-w-[min(1280px,calc(100vw-24px))]">
        <section
          className="relative overflow-hidden rounded-[28px] px-5 pb-5 pt-10 md:rounded-[40px] md:px-16 md:pb-8 md:pt-16"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 30%, #1C0619 0%, #0D0A0C 65%)",
          }}
        >
          {/* ── Desktop atmospheric star (off-screen right) ── */}
          <div
            className="pointer-events-none absolute hidden md:block"
            style={{ right: -150, top: 48, opacity: 0.9 }}
          >
            <ZMStar size={420} spin={26} glow={100} />
          </div>

          {/* ── Mobile atmospheric star (top-right, like desktop) ── */}
          <div
            className="pointer-events-none absolute md:hidden"
            style={{ right: -78, top: 22, opacity: 0.9 }}
          >
            <ZMStar size={210} spin={22} glow={70} />
          </div>

          {/* ── Mobile: everything centered (wordmark → tagline → CTA) ── */}
          <div className="relative z-10 flex flex-col items-center gap-5 text-center md:hidden">

            <h2
              className="text-[clamp(52px,14vw,72px)] leading-[0.88] text-white"
              style={{ ...SERIF, fontWeight: 400, fontStyle: "italic" }}
            >
              Zeplin
              <br />
              <span className="text-white">Media</span>
              <span className="text-[#DB2777]">.</span>
            </h2>
            <p className="max-w-[34ch] text-[15px] leading-[1.5] text-white/55">
              Old school kaliteyi modern dijital sistemlerle buluşturuyoruz.
            </p>
            <a
              href="https://wa.me/905459407690"
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#DB2777] px-7 py-4 text-[15px] font-semibold text-[#0D0A0C] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#EC4899] active:translate-y-0"
              style={{ boxShadow: "0 14px 36px -10px rgba(219,39,119,0.6)" }}
            >
              Projeni anlat
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#0D0A0C]">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path
                    d="M2 9L9 2M9 2H3M9 2V8"
                    stroke="#DB2777"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </a>
            <Link
              href="/hizmetler"
              className="text-[14px] text-white/55 transition-colors hover:text-white"
            >
              hizmetlere göz at →
            </Link>
          </div>

          {/* ── Desktop content grid ── */}
          <div className="relative z-10 hidden md:grid md:max-w-[720px] md:grid-cols-[1.1fr_1fr] md:gap-16">
            {/* Brand block */}
            <div>
              <div
                className="text-[11px] uppercase tracking-[0.16em] text-white/40"
                style={MONO}
              >
                ZM · 2026
              </div>

              <h2
                className="mt-5 text-[96px] leading-[0.88] text-white"
                style={{ ...SERIF, fontWeight: 400, fontStyle: "italic" }}
              >
                Zeplin
                <br />
                Media
              </h2>

              <p className="mt-6 max-w-[360px] text-[16px] leading-[1.5] text-white/50">
                Old school kaliteyi modern dijital sistemlerle buluşturuyoruz.
              </p>

              <div className="mt-7 flex items-center gap-6">
                <a
                  href="https://wa.me/905459407690"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-full bg-[#DB2777] px-7 py-4 text-[15px] font-semibold text-[#0D0A0C] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#EC4899] active:translate-y-0"
                  style={{ boxShadow: "0 8px 32px -8px rgba(219,39,119,0.55)" }}
                >
                  Projeni anlat
                  <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#0D0A0C]">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path
                        d="M2 9L9 2M9 2H3M9 2V8"
                        stroke="#DB2777"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </a>
                <Link
                  href="/hizmetler"
                  className="text-[15px] text-white/55 transition-colors hover:text-white"
                >
                  hizmetlere göz at →
                </Link>
              </div>
            </div>

            {/* Contact block — desktop */}
            <div className="flex flex-col gap-8 pt-[18px]">
              <div>
                <div
                  className="mb-3 text-[11px] uppercase tracking-[0.14em] text-white/40"
                  style={MONO}
                >
                  Bize yazın
                </div>
                <a
                  href="mailto:info@zeplinmedia.com"
                  className="block text-[26px] leading-tight text-[#DB2777] transition-colors hover:text-[#EC4899]"
                  style={{ ...SERIF, fontStyle: "italic", letterSpacing: "-0.01em" }}
                >
                  info@zeplinmedia.com
                </a>
                <div className="mt-3.5 flex flex-col gap-1.5 text-[14px] text-white/50">
                  <a
                    href="tel:+905459407690"
                    className="w-fit text-white/75 transition-colors hover:text-white"
                  >
                    +90 545 940 76 90
                  </a>
                  <span>Levent, İstanbul · Türkiye</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 border-t border-white/[0.08] pt-6">
                <div>
                  <div
                    className="mb-3 text-[11px] uppercase tracking-[0.14em] text-white/40"
                    style={MONO}
                  >
                    Site
                  </div>
                  <div className="flex flex-col gap-2 text-[14px] text-white/70">
                    {siteLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="w-fit transition-colors hover:text-white"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <div
                    className="mb-3 text-[11px] uppercase tracking-[0.14em] text-white/40"
                    style={MONO}
                  >
                    Sosyal
                  </div>
                  <div className="flex flex-col gap-2 text-[14px] text-white/70">
                    {socialLinks.map((l) =>
                      l.internal ? (
                        <Link
                          key={l.href}
                          href={l.href}
                          className="w-fit transition-colors hover:text-white"
                        >
                          {l.label} ↗
                        </Link>
                      ) : (
                        <a
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className="w-fit transition-colors hover:text-white"
                        >
                          {l.label} ↗
                        </a>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Mobile contact block ── */}
          <div className="relative z-10 mt-8 border-t border-white/[0.08] pt-6 md:hidden">
            <div className="text-center">
              <div
                className="mb-3 text-[11px] uppercase tracking-[0.14em] text-white/40"
                style={MONO}
              >
                Bize yazın
              </div>
              <a
                href="mailto:info@zeplinmedia.com"
                className="block text-[22px] leading-tight text-[#DB2777] transition-colors hover:text-[#EC4899]"
                style={{ ...SERIF, fontStyle: "italic", letterSpacing: "-0.01em" }}
              >
                info@zeplinmedia.com
              </a>
              <div className="mt-3 flex flex-col items-center gap-1.5 text-[14px] text-white/50">
                <a
                  href="tel:+905459407690"
                  className="text-white/75 transition-colors hover:text-white"
                >
                  +90 545 940 76 90
                </a>
                <span>Levent, İstanbul · Türkiye</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-5 border-t border-white/[0.08] pt-5">
              <div>
                <div
                  className="mb-3 text-[11px] uppercase tracking-[0.14em] text-white/40"
                  style={MONO}
                >
                  Site
                </div>
                <div className="flex flex-col gap-2 text-[14px] text-white/70">
                  {siteLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="w-fit transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <div
                  className="mb-3 text-[11px] uppercase tracking-[0.14em] text-white/40"
                  style={MONO}
                >
                  Sosyal
                </div>
                <div className="flex flex-col gap-2 text-[14px] text-white/70">
                  {socialLinks.map((l) =>
                    l.internal ? (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="w-fit transition-colors hover:text-white"
                      >
                        {l.label} ↗
                      </Link>
                    ) : (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="w-fit transition-colors hover:text-white"
                      >
                        {l.label} ↗
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Legal bar (shared) ── */}
          <div
            className="relative z-10 mt-8 flex flex-col gap-3 border-t border-white/[0.08] pt-5 md:mt-12 md:flex-row md:items-center md:justify-between"
            style={{
              ...MONO,
              fontSize: 11,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.32)",
            }}
          >
            <div>© 2026 — Zeplin Media</div>
            <div className="flex gap-5">
              <a href="/cerez" className="transition-colors hover:text-white/60">
                Cookies
              </a>
              <a href="/gizlilik" className="transition-colors hover:text-white/60">
                Privacy
              </a>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
}
