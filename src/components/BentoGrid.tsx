"use client";

import { type CSSProperties } from "react";
import { motion, MotionConfig } from "framer-motion";
import ProjectCoverflow from "@/components/ProjectCoverflow";

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

export default function BentoGrid({ blocks, sectionId }: BentoGridProps) {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id={sectionId}
        className="px-5 pt-10 pb-12 scroll-mt-28 md:px-12 md:pt-16 md:pb-12 md:scroll-mt-36"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 md:gap-9" style={{ overflow: "visible" }}>
            {blocks[0]?.projects && (
              <motion.div
                variants={revealVariants}
                initial="visible"
                whileInView="visible"
                viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
                custom={0}
              >
                <ProjectCoverflow projects={blocks[0].projects} />
              </motion.div>
            )}

            <motion.div
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
              custom={0.1}
            >
              <SocialRowCards block={blocks[1]} />
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
