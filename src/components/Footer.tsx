"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useTheme } from "./ThemeProvider";
import { whatsappUrl } from "@/lib/contact";
import { siteConfig } from "@/lib/seo";

const MONO = {
  fontFamily: "ui-monospace, 'JetBrains Mono', monospace",
} as const;

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
  { href: "/iletisim", label: "İletişim" },
];

const socialLinks = [
  { href: siteConfig.social.instagram, label: "Instagram", shortLabel: "IG" },
  { href: siteConfig.social.linkedin, label: "LinkedIn", shortLabel: "IN" },
  {
    href: whatsappUrl("Merhaba Zeplin Media, web sitenizden ulaşıyorum. Projem hakkında konuşmak istiyorum."),
    label: "WhatsApp",
    shortLabel: "WA",
  },
];

function Label({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 text-[12px] uppercase tracking-[0.18em] text-white/70" style={MONO}>
      {children}
    </div>
  );
}

export default function Footer() {
  const { theme } = useTheme();

  return (
    /* Üst köşeleri yuvarlak panel, önceki bölümün altına hafifçe biniyor
       (-mt). Böylece açık ya da koyu hangi bölümden sonra gelirse gelsin
       ayrı bir renk köprüsüne gerek kalmadan temiz bir geçiş oluşuyor. */
    <footer className="relative z-10 -mt-8 md:-mt-10">
      <section
        id="iletisim"
        className="relative isolate scroll-mt-28 overflow-hidden rounded-t-[28px] text-white shadow-[0_-18px_50px_rgba(157,23,77,0.18)] md:rounded-t-[40px]"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: theme === "dark" ? DARK_FOOTER_GRADIENT : LIGHT_FOOTER_GRADIENT }}
          aria-hidden="true"
        />
        <div className="footer-highlight pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-[1320px] px-6 pt-16 md:px-12 md:pt-24">
          {/* Üst ızgara */}
          <div className="grid gap-12 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-6 lg:col-span-5">
              <h2 className="text-[clamp(40px,5vw,64px)] font-medium leading-[0.95] tracking-[-0.045em] text-[#fffaf7]">
                Burası daha başlangıç.
              </h2>
              <p className="mt-5 max-w-[36ch] text-[16px] leading-[1.6] text-white/85">
                Yeni projen için bize yaz; ihtiyacını okuyup bir iş günü içinde dönelim.
              </p>
              <Link
                href="/iletisim"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#fffaf7] px-6 py-3.5 text-[15px] font-semibold text-[#9D174D] shadow-[0_10px_30px_rgba(82,7,37,0.2)] transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Projeni Anlat
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <nav aria-label="Alt menü" className="md:col-span-3 lg:col-start-7">
              <Label>Sayfalar</Label>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-[16px] text-white/90 md:grid-cols-1">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-[#260712]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="md:col-span-3 lg:col-span-3 lg:col-start-10">
              <Label>İletişim</Label>
              <div className="flex flex-col gap-2 text-[16px] text-white/95">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="w-fit underline decoration-white/45 underline-offset-4 transition-colors hover:text-[#260712]"
                >
                  {siteConfig.email}
                </a>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="w-fit underline decoration-white/45 underline-offset-4 transition-colors hover:text-[#260712]"
                >
                  {siteConfig.phone}
                </a>
              </div>

              <div className="mt-8 flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fffaf7] text-[11px] font-bold tracking-[0.08em] text-[#1b0910] shadow-[0_10px_30px_rgba(82,7,37,0.18)] transition-colors hover:bg-[#ffd8eb]"
                    style={MONO}
                  >
                    {link.shortLabel}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Alt bilgi satırı */}
          <div
            className="mt-14 flex flex-col gap-3 border-t border-white/20 pt-6 text-[12px] uppercase tracking-[0.14em] text-white/75 sm:flex-row sm:items-center sm:justify-between md:mt-20"
            style={MONO}
          >
            <span lang="en">© 2026 Zeplin Media</span>
            <div className="flex gap-6">
              <Link href="/cerez" className="transition-colors hover:text-white">
                Çerez Politikası
              </Link>
              <Link href="/gizlilik" className="transition-colors hover:text-white">
                Gizlilik
              </Link>
            </div>
            <span className="hidden sm:inline">İstanbul</span>
          </div>
        </div>

        {/* Kelime markası — alt kenardan bilinçli olarak taşıyor */}
        <div className="relative z-10 mx-auto max-w-[1320px] overflow-hidden px-4 md:px-10" aria-hidden="true">
          <div className="footer-wordmark translate-y-[18%] select-none text-center text-[clamp(96px,22vw,320px)] font-semibold leading-[0.8] tracking-[-0.085em] text-[#fffaf7]">
            Zeplin
          </div>
        </div>
      </section>

      <style jsx>{`
        .footer-highlight {
          background:
            linear-gradient(112deg, rgba(255, 255, 255, 0.07), transparent 31%),
            linear-gradient(180deg, transparent 64%, rgba(50, 2, 20, 0.13));
        }

        .footer-wordmark {
          text-shadow: 0 16px 60px rgba(91, 7, 38, 0.25);
        }
      `}</style>
    </footer>
  );
}
