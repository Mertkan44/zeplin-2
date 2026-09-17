"use client";

import { useState, useCallback, type CSSProperties } from "react";
import Link from "next/link";
import { motion, MotionConfig, AnimatePresence } from "framer-motion";
import BentoCard from "@/components/BentoCard";

interface Project {
  name: string;
  image: string;
  description?: string;
  imagePosition?: string;
  tags?: string[];
  variant?: "image" | "website";
  slug?: string;
  year?: string;
  client?: string;
}

interface Social {
  name: string;
  url: string;
}

interface Block {
  title: string;
  description: string;
  items: string[];
  backgroundImage?: string;
  href?: string;
  projects?: Project[];
  socials?: Social[];
}

interface BentoGridProps {
  blocks: Block[];
  sectionId?: string;
}

/* ── Framer-motion reveal variants ── */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const revealVariants = {
  hidden: {
    opacity: 0.16,
    y: 24,
    scale: 0.99,
  },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.52,
      ease: EASE,
      delay,
    },
  }),
};

/* ── Sosyal medya ikonları ── */
function SocialIcon({ name }: { name: string }) {
  const cls = "w-7 h-7 text-white";
  switch (name) {
    case "Instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "WhatsApp":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ── Oval asterisk yıldız (uçları yuvarlak pill bar) ── */
function ZMStar({ size, spin = 22, glow = 80 }: { size: number; spin?: number; glow?: number }) {
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

/* ── V6 · Editöryel sosyal medya kartları ── */
function SocialRowCards({ block }: { block: Block }) {
  const socials = (block.socials ?? []).slice(0, 3);

  const meta: Record<string, { sub: string; meta: string }> = {
    Instagram: { sub: "Görsel hikâyemiz", meta: "@zeplin.media" },
    LinkedIn: { sub: "Profesyonel ağımız", meta: "Zeplin Media" },
    WhatsApp: { sub: "Doğrudan iletişim", meta: "Yanıt < 2 dk" },
  };

  return (
    <div
      className="relative overflow-hidden rounded-[24px] px-5 py-6 text-white sm:px-6 sm:py-7 md:rounded-[40px] md:px-12 md:py-12"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 30%, #1C0619 0%, #0D0A0C 65%)",
      }}
    >
      {/* Asterisk star — sağ üstten yarım sarkık, çeyreği görünür */}
      <div
        className="pointer-events-none absolute hidden md:block"
        style={{ right: -110, top: -110, opacity: 0.95 }}
      >
        <ZMStar size={220} spin={26} glow={60} />
      </div>
      <div
        className="pointer-events-none absolute md:hidden"
        style={{ right: -60, top: -60, opacity: 0.95 }}
      >
        <ZMStar size={130} spin={22} glow={36} />
      </div>

      {/* Header */}
      <div className="relative mb-5 flex items-end justify-between gap-4 md:mb-9">
        <div>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 md:text-[11px] md:tracking-[0.2em]">
            Bizi takip edin
          </div>
          <h2 className="m-0 text-[24px] font-light leading-[1.04] text-white md:text-[38px]">
            Üç kanal,{" "}
            <em className="font-normal not-italic" style={{ color: "#F472B6", fontStyle: "italic" }}>
              tek hikâye
            </em>
            .
          </h2>
        </div>
        <div className="hidden font-mono text-[11px] text-white/60 md:block">
          ZEPLIN/MEDYA · 2026
        </div>
      </div>

      {/* Mobil: 2 sütun (Instagram+LinkedIn yan yana, WhatsApp altta tam genişlik) | Desktop: 3 sütun */}
      <div className="relative grid grid-cols-2 border-t border-white/10 md:grid-cols-3">
        {socials.map((social, i) => {
          const m = meta[social.name] ?? { sub: "", meta: "" };
          const itemClass =
            i === 0
              ? "border-r border-white/10"
              : i === 1
              ? "md:border-r md:border-white/10"
              : "col-span-2 border-t border-white/10 md:col-span-1 md:border-t-0";
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex flex-col gap-3 px-4 py-5 transition-colors duration-300 hover:bg-pink-500/[0.08] md:gap-4 md:px-6 md:py-7 ${itemClass}`}
            >
              <div className="flex items-center justify-between">
                <div
                  className="grid h-11 w-11 place-items-center rounded-full md:h-[52px] md:w-[52px]"
                  style={{
                    background: "#E91E8C",
                    boxShadow: "0 0 30px rgba(233,30,140,0.45)",
                  }}
                >
                  <SocialIcon name={social.name} />
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-full border border-white/25 text-white/80 transition-all duration-300 group-hover:border-white/60 group-hover:text-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </span>
              </div>
              <div>
                <div className="text-[19px] font-medium md:text-[22px]">
                  {social.name}
                </div>
                <div className="mt-0.5 text-[13px] text-white/70">{m.sub}</div>
              </div>
              <div className="mt-auto font-mono text-[10px] uppercase tracking-[0.05em] text-white/50">
                {m.meta}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function ProjectSlider({
  projects,
}: {
  title: string;
  projects: Project[];
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = projects[activeIdx];
  const n = projects.length;
  const isItalic = activeIdx % 2 === 1;

  const goPrev = useCallback(() => setActiveIdx((i) => (i - 1 + n) % n), [n]);
  const goNext = useCallback(() => setActiveIdx((i) => (i + 1) % n), [n]);

  const monoStyle: CSSProperties = {
    fontFamily: "var(--font-jost), ui-monospace, monospace",
    letterSpacing: "0.16em",
    textTransform: "uppercase" as const,
  };

  return (
    <div>
      {/* ── Başlık bölümü ── */}
      <div className="mb-5 md:mb-6">
        {/* Üst bar: etiket sol · sayaç + oklar sağ */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] text-foreground/40" style={monoStyle}>
            ↳ seçili işler
          </p>
          <div className="flex items-center gap-2.5">
            <span
              style={{
                fontFamily: "var(--font-instrument), serif",
                fontSize: "1.3rem",
                letterSpacing: "-0.01em",
                color: "var(--foreground)",
              }}
            >
              <span style={{ color: "#EC4899" }}>{String(activeIdx + 1).padStart(2, "0")}</span>
              <span style={{ opacity: 0.3, margin: "0 3px" }}>/</span>
              <span style={{ opacity: 0.45 }}>{String(n).padStart(2, "0")}</span>
            </span>
            <button
              type="button"
              aria-label="Önceki proje"
              onClick={goPrev}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/12 bg-foreground/[0.04] text-foreground/50 transition-all duration-200 hover:border-foreground/22 hover:bg-foreground/[0.08] hover:text-foreground active:scale-95"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12L6 8L10 4" /></svg>
            </button>
            <button
              type="button"
              aria-label="Sonraki proje"
              onClick={goNext}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/12 bg-foreground/[0.04] text-foreground/50 transition-all duration-200 hover:border-foreground/22 hover:bg-foreground/[0.08] hover:text-foreground active:scale-95"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4L10 8L6 12" /></svg>
            </button>
          </div>
        </div>

        {/* Tam genişlik serif başlık */}
        <h3
          className="leading-[0.93] text-foreground"
          style={{
            fontFamily: "var(--font-instrument), serif",
            fontWeight: 400,
            fontSize: "clamp(2.4rem, 6.5vw, 4.4rem)",
            letterSpacing: "-0.028em",
          }}
        >
          <em style={{ fontStyle: "italic" }}>Sahne</em> arkası, tek tek.
        </h3>
      </div>

      {/* ── Numaralı proje listesi — card'ın üstünde ── */}
      <div className="mb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <div className="flex min-w-max border-b border-foreground/8 md:min-w-0 md:justify-center">
          {projects.map((p, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIdx(i)}
                aria-label={p.name}
                className="group relative flex shrink-0 items-baseline gap-2 border-r border-foreground/8 px-4 py-3 text-left transition-colors duration-200 last:border-r-0 focus-visible:outline-none md:shrink md:px-5"
              >
                {/* aktif göstergesi — alt çizgi (card'a doğru) */}
                <span
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] transition-all duration-300"
                  style={{ background: isActive ? "#EC4899" : "transparent" }}
                />
                <span
                  className="text-[9px] transition-colors duration-200"
                  style={{ ...monoStyle, color: isActive ? "#EC4899" : "rgba(255,255,255,0.22)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="whitespace-nowrap text-[12.5px] font-medium transition-colors duration-200 md:text-[13px]"
                  style={{
                    color: isActive
                      ? "var(--foreground)"
                      : "color-mix(in srgb, var(--foreground) 40%, transparent)",
                  }}
                >
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Featured card ── */}
      <div
        className="overflow-hidden rounded-[20px] border border-foreground/8 md:rounded-[28px]"
        style={{ background: "color-mix(in srgb, var(--background) 93%, white 7%)" }}
      >
        {/* Mobile: görsel üstte, metin altta | Desktop: grid 1fr 1.35fr */}
        <div className="flex flex-col md:grid md:min-h-[520px]" style={{ gridTemplateColumns: "1fr 1.35fr" }}>

          {/* Sol — metin paneli */}
          <div
            className="order-last flex flex-col justify-between border-t border-foreground/8 p-6 md:order-first md:border-r md:border-t-0 md:p-10"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full flex-col justify-between"
              >
                {/* Üst blok */}
                <div>
                  {/* Tags — mono */}
                  {active.tags && active.tags.length > 0 && (
                    <div className="mb-5 flex flex-wrap gap-1.5">
                      {active.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full px-2.5 py-1 text-[9px] text-pink-400"
                          style={{
                            ...monoStyle,
                            background: "rgba(236,72,153,0.10)",
                            letterSpacing: "0.13em",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta — №01 · yıl · müşteri */}
                  <p className="mb-3 text-[10px] text-foreground/35" style={monoStyle}>
                    №{String(activeIdx + 1).padStart(2, "0")}
                    {active.year ? ` · ${active.year}` : ""}
                    {active.client ? ` · ${active.client.toUpperCase()}` : ""}
                  </p>

                  {/* Proje adı — büyük Instrument Serif, değişen italic */}
                  <h4
                    className="text-foreground"
                    style={{
                      fontFamily: "var(--font-instrument), serif",
                      fontWeight: 400,
                      fontSize: "clamp(2rem, 4vw, 3.6rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      fontStyle: isItalic ? "italic" : "normal",
                    }}
                  >
                    {active.name}
                  </h4>

                  {/* Kısa açıklama */}
                  {active.description && (
                    <p className="mt-4 max-w-[38ch] text-[13.5px] leading-relaxed text-foreground/55 md:text-[14.5px]">
                      {active.description}
                    </p>
                  )}
                </div>

                {/* Alt blok — butonlar */}
                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                  {active.slug ? (
                    <Link
                      href={`/projeler/${active.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-[#EC4899] px-5 py-2.5 text-[12.5px] font-medium text-white transition-all duration-200 hover:bg-[#DB2777] active:scale-95"
                      style={{ boxShadow: "0 0 22px rgba(236,72,153,0.30)" }}
                    >
                      Projeyi incele
                      <svg width="12" height="12" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 22 L22 6 M14 6 L22 6 L22 14" />
                      </svg>
                    </Link>
                  ) : null}
                  <Link
                    href="/projeler"
                    className="inline-flex items-center rounded-full border border-foreground/12 px-5 py-2.5 text-[12.5px] font-medium text-foreground/60 transition-all duration-200 hover:border-foreground/22 hover:text-foreground/80"
                  >
                    Tüm işler
                  </Link>
                  {/* Mobil sayaç */}
                  <span className="ml-auto text-[10px] text-foreground/30 md:hidden" style={monoStyle}>
                    {String(activeIdx + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(n).padStart(2, "0")}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sağ — görsel */}
          <div className="relative order-first h-[220px] md:order-last md:h-auto">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${active.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: active.imagePosition ?? "center",
                }}
              />
            </AnimatePresence>
            {/* Köşe rozeti */}
            <div
              className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] text-foreground/80"
              style={{
                ...monoStyle,
                background: "rgba(0,0,0,0.50)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#EC4899]" style={{ boxShadow: "0 0 6px #EC4899" }} />
              canlı
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function MobileCard({
  block,
  idx,
  heightClass,
}: {
  block: Block;
  idx: number;
  heightClass: string;
}) {
  const inner = (
    <motion.div
      variants={revealVariants}
      initial={idx === 0 ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
      custom={idx * 0.08}
      className={heightClass}
    >
      <BentoCard {...block} mobile />
    </motion.div>
  );

  return block.href ? (
    <Link href={block.href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}

export default function BentoGrid({ blocks, sectionId }: BentoGridProps) {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id={sectionId}
        className="px-5 pt-10 pb-12 scroll-mt-28 md:px-12 md:pt-16 md:pb-12 md:scroll-mt-36"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 md:gap-9" style={{ overflow: "visible" }}>
            <MobileCard
              block={blocks[0]}
              idx={0}
              heightClass="h-[290px] md:h-[420px]"
            />

            {blocks[1]?.projects && (
              <motion.div
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
                custom={0.1}
              >
                <ProjectSlider
                  title={blocks[1].title}
                  projects={blocks[1].projects}
                />
              </motion.div>
            )}

            <motion.div
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
              custom={0.18}
            >
              <SocialRowCards block={blocks[2]} />
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
