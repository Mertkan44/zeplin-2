"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useTheme } from "./ThemeProvider";
import { whatsappUrl } from "@/lib/contact";
import { siteConfig } from "@/lib/seo";

const LIGHT_FOOTER_GRADIENT =
  "radial-gradient(circle at 9% 8%, rgba(255,205,233,0.34), transparent 30%), radial-gradient(circle at 78% 10%, rgba(248,169,213,0.22), transparent 32%), radial-gradient(circle at 48% 94%, rgba(91,5,35,0.28), transparent 42%), linear-gradient(135deg, #e45b9a 0%, #dc2f78 47%, #bd175b 72%, #8f103d 100%)";

const DARK_FOOTER_GRADIENT =
  "radial-gradient(circle at 12% 7%, rgba(232,82,148,0.22), transparent 31%), radial-gradient(circle at 76% 10%, rgba(205,43,108,0.18), transparent 32%), radial-gradient(circle at 50% 96%, rgba(44,2,18,0.46), transparent 44%), linear-gradient(135deg, #8f174b 0%, #a91652 46%, #85103f 73%, #570822 100%)";

const WHATSAPP = whatsappUrl("Merhaba Zeplin Media, web sitenizden ulaşıyorum. Projem hakkında konuşmak istiyorum.");

const pageLinks = [
  { href: "/", label: "Ana sayfa" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/projeler", label: "Projeler" },
  { href: "/galeri", label: "Galeri" },
  { href: "/operasyonlar", label: "Operasyonlar" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

const socialLinks = [
  { href: siteConfig.social.instagram, label: "Instagram" },
  { href: siteConfig.social.linkedin, label: "LinkedIn" },
  { href: WHATSAPP, label: "WhatsApp" },
];

const linkCls =
  "rounded-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-[13px] font-medium uppercase tracking-[0.14em] text-white/65">{title}</h3>
      {children}
    </div>
  );
}

export default function Footer() {
  const { theme } = useTheme();

  return (
    /* Yuvarlak üst köşelerin arkasında sayfanın bittiği renk görünmeli.
       Varsayılan sayfa zemini; koyu bir bölümle biten sayfalar o bölüme
       data-footer-under="dark" verir (globals.css). İçerik üstüne binme yok. */
    <footer className="site-footer relative">
      <div className="relative isolate overflow-hidden rounded-t-[28px] text-white md:rounded-t-[40px]">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: theme === "dark" ? DARK_FOOTER_GRADIENT : LIGHT_FOOTER_GRADIENT }}
          aria-hidden="true"
        />

        <div className="mx-auto max-w-[1320px] px-6 pt-14 md:px-12 md:pt-20">
          {/* ── CTA bandı ─────────────────────────────────────── */}
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-16">
            <h2
              className="max-w-[12ch] text-[clamp(40px,4.4vw,64px)] leading-[0.95] tracking-[-0.02em] text-[#fffaf7]"
              style={{ fontFamily: "var(--font-instrument), serif" }}
            >
              Burası daha <em>başlangıç.</em>
            </h2>

            <div className="md:max-w-[400px] md:pb-1">
              <p className="text-[16px] leading-[1.6] text-white/85">
                Yeni projen için bize yaz; ihtiyacını okuyup bir iş günü içinde dönelim.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/iletisim"
                  className="inline-flex items-center gap-2 rounded-full bg-[#fffaf7] px-6 py-3.5 text-[15px] font-semibold text-[#9D174D] transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Projeni Anlat <span aria-hidden="true">→</span>
                </Link>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/50 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  WhatsApp <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* ── Bilgi ızgarası ────────────────────────────────── */}
          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/20 pt-10 text-[15px] text-white/90 md:mt-14 md:grid-cols-12">
            <nav aria-label="Alt menü" className="col-span-2 md:col-span-5">
              <Column title="Sayfalar">
                <ul className="grid grid-flow-col grid-cols-2 grid-rows-4 gap-x-8 gap-y-2.5">
                  {pageLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={linkCls}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Column>
            </nav>

            <div className="col-span-2 sm:col-span-1 md:col-span-3">
              <Column title="İletişim">
                <ul className="space-y-2.5">
                  <li>
                    <a href={`mailto:${siteConfig.email}`} className={linkCls}>
                      {siteConfig.email}
                    </a>
                  </li>
                  <li>
                    <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className={linkCls}>
                      {siteConfig.phone}
                    </a>
                  </li>
                  <li className="text-white/70">İstanbul, Türkiye</li>
                </ul>
              </Column>
            </div>

            <div className="col-span-2 sm:col-span-1 md:col-span-2 md:col-start-11">
              <Column title="Sosyal">
                <ul className="space-y-2.5">
                  {socialLinks.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                        {link.label} <span aria-hidden="true" className="text-white/60">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </Column>
            </div>
          </div>

          {/* ── Yasal satır ───────────────────────────────────── */}
          <div className="mt-12 flex flex-col gap-3 border-t border-white/20 py-6 md:mt-16 text-[14px] text-white/75 sm:flex-row sm:items-center sm:justify-between">
            <span>
              © 2026 <span lang="en">Zeplin Media</span>
            </span>
            <div className="flex gap-6">
              <Link href="/cerez" className={linkCls}>
                Çerez Politikası
              </Link>
              <Link href="/gizlilik" className={linkCls}>
                Gizlilik Politikası
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
