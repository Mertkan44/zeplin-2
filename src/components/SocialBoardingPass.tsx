"use client";

import { motion, MotionConfig } from "framer-motion";
import { EASE, DUR, STAGGER } from "@/lib/motion";
import type { CSSProperties } from "react";

interface Social {
  name: string;
  url: string;
}

interface SocialBoardingPassProps {
  socials: Social[];
}

const monoStyle: CSSProperties = {
  fontFamily: "var(--font-jost), ui-monospace, monospace",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

/* Her kanalın bileti — uçuş bilgileri markanın kendi diliyle:
   rota kodu kanalın kısaltması, sefer sıklığı o kanalın gerçek ritmi. */
const TICKETS: Record<
  string,
  {
    code: string;
    gate: string;
    flight: string;
    frequency: string;
    subtitle: string;
    handle: string;
    barcode: string;
    stamp?: string;
  }
> = {
  Instagram: {
    code: "IG",
    gate: "Kapı 01",
    flight: "Uçuş ZPL-01",
    frequency: "Her gün",
    subtitle: "Görsel hikâyemiz",
    handle: "@zeplin.media",
    barcode:
      "repeating-linear-gradient(90deg, #1A1216 0 2px, transparent 2px 5px, #1A1216 5px 6px, transparent 6px 11px)",
  },
  LinkedIn: {
    code: "IN",
    gate: "Kapı 02",
    flight: "Uçuş ZPL-02",
    frequency: "Hafta içi",
    subtitle: "Profesyonel ağımız",
    handle: "Zeplin Media",
    barcode:
      "repeating-linear-gradient(90deg, #1A1216 0 3px, transparent 3px 6px, #1A1216 6px 7px, transparent 7px 12px)",
  },
  WhatsApp: {
    code: "WA",
    gate: "Kapı 03",
    flight: "Uçuş ZPL-03",
    frequency: "7/24",
    subtitle: "Doğrudan iletişim",
    handle: "+90 545 940 76 90",
    barcode:
      "repeating-linear-gradient(90deg, #1A1216 0 2px, transparent 2px 4px, #1A1216 4px 6px, transparent 6px 10px)",
    stamp: "< 2 dk",
  },
};

function ChannelIcon({ name }: { name: string }) {
  switch (name) {
    case "Instagram":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="#ffffff" stroke="none" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "WhatsApp":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      );
    default:
      return null;
  }
}

function Zeppelin({ tone }: { tone: "brand" | "muted" }) {
  const body = tone === "brand" ? "#EC4899" : "rgba(255,255,255,0.4)";
  const fin = tone === "brand" ? "#FBCFE8" : "rgba(255,255,255,0.25)";
  return (
    <svg viewBox="0 0 64 32" width="100%" height="100%" aria-hidden="true">
      <ellipse cx="26" cy="14" rx="23" ry="10.5" fill={body} />
      <path d="M45 7 L60 3 L53 14 L60 25 L45 21 Z" fill={body} />
      <rect x="19" y="24" width="13" height="5.5" rx="2.75" fill={fin} />
      {tone === "brand" && (
        <path d="M8 8 C14 5, 34 5, 44 9" stroke="rgba(255,255,255,0.35)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      )}
    </svg>
  );
}

const ticketVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DUR[4], ease: EASE, delay: 0.08 + i * STAGGER },
  }),
};

const headerVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: DUR[4], ease: EASE } },
};

export default function SocialBoardingPass({ socials }: SocialBoardingPassProps) {
  const channels = socials.slice(0, 3);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="bp-panel relative overflow-hidden rounded-[24px] px-5 pb-10 pt-8 text-white md:rounded-[40px] md:px-12 md:pb-12 md:pt-11"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15, margin: "10% 0px 10% 0px" }}
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, #1C0619 0%, #0D0A0C 65%)",
        }}
      >
        {/* başlık */}
        <motion.div variants={headerVariants} className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2.5 text-[12px] font-semibold text-white/55" style={monoStyle} >
              Bizi takip edin
            </div>
            <h2 className="m-0 text-white" style={{ fontFamily: "var(--font-instrument), serif", fontWeight: 400, fontSize: "clamp(1.9rem, 4.2vw, 2.65rem)", lineHeight: 1.08, letterSpacing: "-0.01em" }}>
              Üç rota,{" "}
              <em className="not-italic" style={{ color: "#EC4899", fontStyle: "italic" }}>
                tek zeplin
              </em>
              .
            </h2>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="block h-[14px] w-[26px] shrink-0">
              <Zeppelin tone="muted" />
            </span>
            <span lang="en" className="text-[12px] text-white/50" style={monoStyle}>
              ZPL Air · Boarding · 2026
            </span>
          </div>
        </motion.div>

        {/* uçuş rotası — biletlerin arkasında, zeplin yayı takip ediyor */}
        <div className="pointer-events-none absolute inset-x-0 top-[150px] hidden md:block" aria-hidden="true">
          <svg viewBox="0 0 1152 320" className="h-auto w-full" fill="none">
            <path id="bp-route" d="M -30 250 C 260 110, 880 110, 1190 240" stroke="rgba(255,255,255,0.13)" strokeWidth="2" strokeDasharray="1 10" strokeLinecap="round" />
            <g className="bp-zeppelin">
              <g transform="translate(-29, -15)">
                <ellipse cx="26" cy="14" rx="23" ry="10.5" fill="#EC4899" />
                <path d="M45 7 L60 3 L53 14 L60 25 L45 21 Z" fill="#EC4899" />
                <rect x="19" y="24" width="13" height="5.5" rx="2.75" fill="#FBCFE8" />
                <path d="M8 8 C14 5, 34 5, 44 9" stroke="rgba(255,255,255,0.35)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              </g>
            </g>
          </svg>
        </div>

        {/* biletler */}
        <div className="relative mt-12 flex flex-col gap-14 md:mt-10 md:flex-row md:items-center md:gap-7 lg:gap-8">
          {channels.map((social, i) => {
            const t = TICKETS[social.name];
            if (!t) return null;

            return (
              <motion.div key={social.name} variants={ticketVariants} custom={i} className="flex-1">
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`bp-ticket bp-ticket-${i} group relative block rounded-2xl pb-[18px] pl-11 pr-[22px] pt-8`}
                style={{ background: "#F8F4F6", color: "#1A1216" }}
                aria-label={`${social.name} — ${t.subtitle}`}
              >
                {/* biniş şeridi */}
                <span
                  className="absolute inset-y-0 left-0 flex w-6 items-center justify-center rounded-l-2xl"
                  style={{ background: "#EC4899" }}
                >
                  <span
                    lang="en"
                    className="text-[12px] font-semibold text-white"
                    style={{ ...monoStyle, letterSpacing: "0.3em", writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    Boarding
                  </span>
                </span>

                {/* kanal rozeti — biletin üstüne oturuyor */}
                <span
                  className="bp-badge absolute left-1/2 top-[-28px] flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full"
                  style={{ background: "#EC4899", border: "4px solid #F8F4F6", boxShadow: "0 10px 26px rgba(0,0,0,0.45)" }}
                >
                  <ChannelIcon name={social.name} />
                </span>

                {/* damga — yalnızca WhatsApp'ta */}
                {t.stamp && (
                  <span
                    className="absolute right-3 top-[52px] flex h-[78px] w-[78px] -rotate-[14deg] flex-col items-center justify-center gap-0.5 rounded-full opacity-85"
                    style={{ border: "2px solid #EC4899" }}
                    aria-hidden="true"
                  >
                    <span className="text-[12px] font-semibold" style={{ ...monoStyle, color: "#EC4899", letterSpacing: "0.12em" }}>Yanıt</span>
                    <span className="text-[12px] font-semibold" style={{ ...monoStyle, color: "#EC4899", letterSpacing: "0.08em" }}>{t.stamp}</span>
                    <span lang="en" className="text-[7px]" style={{ ...monoStyle, color: "#EC4899", letterSpacing: "0.2em" }}>ZPL Air</span>
                  </span>
                )}

                <span className="flex justify-between text-[12px] font-semibold" style={{ ...monoStyle, color: "rgba(26,18,22,0.55)", letterSpacing: "0.18em" }}>
                  <span lang="en">Zeplin Air</span>
                  <span>{t.gate}</span>
                </span>

                <span className="mt-3.5 block text-[30px] font-semibold leading-none tracking-[-0.01em]">
                  IST <span style={{ color: "#EC4899" }}>→</span> {t.code}
                </span>

                <span className="mt-2.5 block" style={{ fontFamily: "var(--font-instrument), serif", fontSize: "22px" }}>
                  {social.name}
                </span>
                <span className="mt-0.5 block text-[12px]" style={{ color: "rgba(26,18,22,0.6)" }}>
                  {t.subtitle}
                </span>

                <span className="mt-3 flex justify-between text-[12px]" style={{ ...monoStyle, color: "rgba(26,18,22,0.5)", letterSpacing: "0.14em" }}>
                  <span>{t.flight}</span>
                  <span>{t.frequency}</span>
                </span>

                {/* perforasyon */}
                <span className="relative mb-3.5 mt-3 block" style={{ marginLeft: "-44px", marginRight: "-22px", borderTop: "2px dashed rgba(26,18,22,0.2)" }}>
                  <span className="bp-notch absolute -left-2 -top-2 h-4 w-4 rounded-full" />
                  <span className="bp-notch absolute -right-2 -top-2 h-4 w-4 rounded-full" />
                </span>

                <span className="flex items-center gap-3.5">
                  <span className="flex-1">
                    <span className="block h-[30px]" style={{ background: t.barcode }} />
                    <span className="mt-1.5 block text-[12px]" style={{ ...monoStyle, color: "rgba(26,18,22,0.55)", letterSpacing: "0.16em" }}>
                      {t.handle}
                    </span>
                  </span>
                  <span
                    className="bp-arrow flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "#EC4899" }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 18 L18 6 M9 6 L18 6 L18 15" />
                    </svg>
                  </span>
                </span>
              </a>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          variants={headerVariants}
          className="relative mt-9 flex flex-wrap justify-between gap-2 text-[12px] text-white/60 md:mt-8"
          style={monoStyle}
        >
          <span>Son çağrı — takip için binişe geçin</span>
          <span>İstanbul · TR</span>
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
}
