"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useTheme } from "./ThemeProvider";

const MONO = {
  fontFamily: "ui-monospace, 'JetBrains Mono', monospace",
} as const;

const LIGHT_BRIDGE =
  "linear-gradient(180deg, #ffffff 0%, #ffffff 14%, #fdf2f8 38%, #f3c3dc 72%, #e45b9a 100%)";

const DARK_BRIDGE =
  "linear-gradient(180deg, #0a0a0a 0%, #0a0a0a 16%, #180a12 42%, #4d102c 74%, #8f174b 100%)";

const LIGHT_FOOTER_GRADIENT =
  "radial-gradient(circle at 9% 8%, rgba(255,205,233,0.34), transparent 30%), radial-gradient(circle at 78% 10%, rgba(248,169,213,0.22), transparent 32%), radial-gradient(circle at 48% 94%, rgba(91,5,35,0.28), transparent 42%), linear-gradient(135deg, #e45b9a 0%, #dc2f78 47%, #bd175b 72%, #8f103d 100%)";

const DARK_FOOTER_GRADIENT =
  "radial-gradient(circle at 12% 7%, rgba(232,82,148,0.22), transparent 31%), radial-gradient(circle at 76% 10%, rgba(205,43,108,0.18), transparent 32%), radial-gradient(circle at 50% 96%, rgba(44,2,18,0.46), transparent 44%), linear-gradient(135deg, #8f174b 0%, #a91652 46%, #85103f 73%, #570822 100%)";

const footerLinks = [
  { href: "/", label: "Ana sayfa" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/projeler", label: "Projeler" },
  { href: "/operasyonlar", label: "Operasyonlar" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/galeri", label: "Galeri" },
];

const socialLinks = [
  {
    href: "https://www.instagram.com/zeplin.media/",
    label: "Instagram",
    shortLabel: "IG",
  },
  {
    href: "https://www.linkedin.com/company/zeplin-media/",
    label: "LinkedIn",
    shortLabel: "IN",
  },
  {
    href: "https://wa.me/905459407690",
    label: "WhatsApp",
    shortLabel: "WA",
  },
];

function Label({ children }: { children: ReactNode }) {
  return (
    <div
      className="mb-4 text-[10px] uppercase tracking-[0.18em] text-white/55"
      style={MONO}
    >
      {children}
    </div>
  );
}

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer>
      <div
        className="footer-bridge pointer-events-none"
        style={{ background: theme === "dark" ? DARK_BRIDGE : LIGHT_BRIDGE }}
        aria-hidden="true"
      />
      <section
        id="iletisim"
        className="zeplin-footer relative isolate min-h-[540px] scroll-mt-28 overflow-hidden text-white md:min-h-[470px]"
      >
        <div
          className="footer-gradient pointer-events-none absolute inset-0"
          style={{
            background:
              theme === "dark" ? DARK_FOOTER_GRADIENT : LIGHT_FOOTER_GRADIENT,
          }}
          aria-hidden="true"
        />
        <div className="footer-highlight pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative z-10 flex min-h-[540px] flex-col px-6 pb-5 pt-9 md:min-h-[470px] md:px-12 md:pb-6 md:pt-10 lg:px-[7vw]">
          <div className="grid gap-9 md:grid-cols-[1.3fr_0.8fr_0.65fr] md:gap-8">
            <div className="max-w-[380px]">
              <h2 className="text-[clamp(38px,4.3vw,56px)] font-medium leading-[0.92] tracking-[-0.055em] text-[#fffaf7]">
                Burası daha başlangıç.
              </h2>
              <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-white/80">
                Bizi takip et veya yeni projen için doğrudan yaz.
              </p>
              <div className="mt-2 flex flex-wrap gap-x-2 text-[14px] text-white/95">
                <a
                  href="mailto:info@zeplinmedia.com"
                  className="underline decoration-white/45 underline-offset-4 transition-colors hover:text-[#260712]"
                >
                  info@zeplinmedia.com
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href="tel:+905459407690"
                  className="underline decoration-white/45 underline-offset-4 transition-colors hover:text-[#260712]"
                >
                  +90 545 940 76 90
                </a>
              </div>
            </div>

            <nav aria-label="Alt menü">
              <Label>Zeplin</Label>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[15px] text-white/90 md:grid-cols-1 md:gap-y-1.5">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="w-fit transition-colors hover:text-[#260712]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div>
              <Label>Sosyal</Label>
              <div className="flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fffaf7] text-[10px] font-bold tracking-[0.08em] text-[#1b0910] shadow-[0_10px_30px_rgba(82,7,37,0.18)] transition-colors hover:bg-[#ffd8eb]"
                    style={MONO}
                  >
                    {link.shortLabel}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col-reverse gap-6 pt-10 sm:flex-row sm:items-end sm:justify-between md:pt-8">
            <div
              className="flex shrink-0 flex-col gap-2 text-[9px] uppercase tracking-[0.12em] text-white/70 md:text-[10px]"
              style={MONO}
            >
              <span>© 2026 Zeplin Media</span>
              <div className="flex gap-4">
                <Link href="/cerez" className="transition-colors hover:text-white">
                  Çerezler
                </Link>
                <Link href="/gizlilik" className="transition-colors hover:text-white">
                  Gizlilik
                </Link>
              </div>
            </div>

            <div className="min-w-0 sm:w-[64%]">
              <div
                className="mb-2 text-right text-[9px] uppercase tracking-[0.16em] text-white/60 md:text-[10px]"
                style={MONO}
              >
                İstanbul · 2026
              </div>
              <div
                className="footer-wordmark whitespace-nowrap text-right text-[clamp(78px,13vw,180px)] font-semibold leading-[0.72] tracking-[-0.085em] text-[#fffaf7]"
                aria-label="Zeplin"
              >
                Zeplin
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .zeplin-footer {
          background: #d92372;
        }

        .footer-gradient {
          background: #d92372;
        }

        .footer-highlight {
          background:
            linear-gradient(112deg, rgba(255, 255, 255, 0.07), transparent 31%),
            linear-gradient(180deg, transparent 64%, rgba(50, 2, 20, 0.13));
        }

        .footer-bridge {
          height: 68px;
        }

        .footer-wordmark {
          text-shadow: 0 16px 60px rgba(91, 7, 38, 0.25);
        }

        @media (max-width: 767px) {
          .footer-bridge {
            height: 50px;
          }
        }
      `}</style>
    </footer>
  );
}
