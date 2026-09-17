"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FONT, revealVariants } from "@/lib/motion";
import { getRelatedServices } from "@/data/services";
import type { ServiceData } from "@/data/services";
import { ServiceHero } from "./ServiceHero";
import { RelatedServices } from "./RelatedServices";
import { CTABanner } from "./CTABanner";

/* ── Waveform bar data ────────────────────────────────────────────── */
const BARS = [
  { min: 8, max: 22, dur: 1.1, delay: 0.0 },
  { min: 14, max: 44, dur: 0.9, delay: 0.08 },
  { min: 10, max: 60, dur: 1.3, delay: 0.16 },
  { min: 18, max: 80, dur: 0.8, delay: 0.06 },
  { min: 12, max: 96, dur: 1.0, delay: 0.22 },
  { min: 20, max: 72, dur: 0.7, delay: 0.12 },
  { min: 16, max: 108, dur: 1.2, delay: 0.04 },
  { min: 24, max: 120, dur: 0.85, delay: 0.18 },
  { min: 20, max: 100, dur: 0.95, delay: 0.0 },
  { min: 16, max: 88, dur: 1.1, delay: 0.14 },
  { min: 12, max: 68, dur: 0.75, delay: 0.08 },
  { min: 18, max: 52, dur: 1.0, delay: 0.20 },
  { min: 10, max: 38, dur: 1.3, delay: 0.05 },
  { min: 8, max: 24, dur: 0.9, delay: 0.15 },
  { min: 6, max: 16, dur: 1.2, delay: 0.10 },
];

/* ── Use cases ────────────────────────────────────────────────────── */
const useCases = [
  {
    title: "Restoranlar",
    example: "\"Yarın akşam 7'ye 2 kişilik masa ayırtmak istiyorum.\"",
    outcome: "Rezervasyon alınır, SMS onayı gönderilir",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M3 11l9-9 9 9"/><path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    title: "Klinikler",
    example: "\"Pazartesi sabahı Dr. Yılmaz ile randevu alabilir miyim?\"",
    outcome: "Uygun slot bulunur, randevu onaylanır",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M12 14v4M10 16h4"/>
      </svg>
    ),
  },
  {
    title: "Oteller",
    example: "\"Kaçta check-in yapabilirim, otopark var mı?\"",
    outcome: "Bilgi verilir, gerekirse çağrı yönlendirilir",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M3 21h18M3 7l9-4 9 4M3 21V7M21 21V7"/><rect x="9" y="13" width="6" height="8"/>
      </svg>
    ),
  },
  {
    title: "Çağrı Merkezleri",
    example: "\"Faturama neden bu ay fazladan ücret yansıdı?\"",
    outcome: "Hesap sorgulanır, açıklama yapılır",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
  },
];

/* ── Voice metrics ────────────────────────────────────────────────── */
const voiceMetrics = [
  { value: "%97", label: "Ses Tanıma Doğruluğu" },
  { value: "< 1sn", label: "Yanıt Gecikmesi" },
  { value: "7/24", label: "Kesintisiz Hizmet" },
  { value: "%70", label: "Çağrı Yük Azalması" },
];

/* ── WaveformVisual ───────────────────────────────────────────────── */
function WaveformVisual({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex items-center justify-center gap-[3px]" style={{ height: 120 }}>
      {BARS.map((bar, i) => (
        <motion.div
          key={i}
          className="w-[5px] flex-shrink-0 rounded-full"
          style={{
            background: "linear-gradient(to top, #9D174D, #F472B6)",
            height: bar.max,
            transformOrigin: "center",
          }}
          animate={
            isActive
              ? { scaleY: [bar.min / bar.max, 1, bar.min / bar.max] }
              : { scaleY: bar.min / bar.max }
          }
          transition={{
            duration: bar.dur,
            repeat: Infinity,
            delay: bar.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── PhoneCallMockup ──────────────────────────────────────────────── */
function PhoneCallMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "15% 0px 15% 0px" });

  return (
    <div
      ref={ref}
      className="mx-auto max-w-[280px] overflow-hidden rounded-[36px] border border-white/10 bg-[#0f0a0d] shadow-[0_32px_96px_rgba(0,0,0,0.6)]"
      style={{ boxShadow: "0 32px 96px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)" }}
    >
      {/* Status bar */}
      <div className="flex items-center justify-between px-6 pt-4 pb-2">
        <span className="text-[11px] font-medium text-white/50">09:41</span>
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Call content */}
      <div className="flex flex-col items-center px-6 py-8">
        <motion.div
          animate={isInView ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-[#DB2777]/30 bg-[#DB2777]/10"
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
        </motion.div>

        <span className="mb-1 text-[13px] text-white/40" style={FONT}>Aktif Çağrı</span>
        <span className="text-[20px] font-semibold text-white" style={FONT}>Müşteri Araması</span>

        {/* Timer */}
        <motion.span
          className="mt-1 text-[13px] tabular-nums text-[#F472B6]/70"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={FONT}
        >
          00:43
        </motion.span>

        {/* Waveform */}
        <div className="my-6">
          <WaveformVisual isActive={isInView} />
        </div>

        {/* Status */}
        <span className="rounded-full border border-[#DB2777]/20 bg-[#DB2777]/8 px-4 py-1.5 text-[11px] font-medium tracking-[0.1em] text-[#F472B6]" style={FONT}>
          Dinliyorum…
        </span>
      </div>

      {/* Call controls */}
      <div className="flex justify-center gap-8 border-t border-white/[0.05] px-6 py-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.5">
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>
          </svg>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/80">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M23.71 16.67C20.66 13.78 16.54 12 12 12 7.46 12 3.34 13.78.29 16.67c-.18.18-.29.43-.29.67 0 .24.11.49.29.67l2.48 2.48c.18.18.43.29.67.29.25 0 .5-.11.68-.29.71-.71 1.48-1.35 2.32-1.9.49-.32.79-.86.79-1.44v-3.08c1.47-.52 3.06-.8 4.72-.8 1.66 0 3.25.28 4.72.8v3.08c0 .57.3 1.12.79 1.44.84.55 1.61 1.19 2.32 1.9.18.18.43.29.68.29.24 0 .49-.11.67-.29l2.48-2.48c.18-.18.29-.43.29-.67 0-.24-.11-.49-.29-.67z"/>
          </svg>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.5">
            <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */

export function VoiceServicePage({ service }: { service: ServiceData }) {
  const related = getRelatedServices(service.relatedSlugs);
  const waveRef = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-[#0a0a0a] dark:text-zinc-100">
      <ServiceHero
        title={service.title}
        description={service.longDesc}
        categoryLabel={service.categoryLabel}
        categorySlug={service.category}
        heroImage={service.heroImage}
      />

      {/* ── Waveform Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" ref={waveRef}>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0a0608_0%,#0d0810_50%,#0a0608_100%)]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9D174D]/8 blur-[140px]" />

        <div className="relative mx-auto max-w-[1200px] px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
            {/* Phone mockup */}
            <motion.div
              variants={revealVariants} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={0}
              className="order-2 md:order-1"
            >
              <PhoneCallMockup />
            </motion.div>

            {/* Stats + description */}
            <motion.div
              variants={revealVariants} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={0.1}
              className="order-1 md:order-2"
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/30" style={FONT}>
                sesli yapay zeka
              </span>
              <h2 className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-white md:text-[36px]" style={FONT}>
                Telefonu Açan<br />Yapay Zeka
              </h2>
              <p className="mt-4 max-w-[38ch] text-[14px] leading-[1.75] text-white/45" style={FONT}>
                Müşterileriniz her ne zaman arasalar, eğitilmiş bir sesli asistan karşılar, yönlendirir ve gerekirse ekibinize bağlar.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-4">
                {voiceMetrics.map((m, i) => (
                  <motion.div
                    key={m.label}
                    variants={revealVariants} initial="hidden" whileInView="visible"
                    viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={0.15 + i * 0.06}
                    className="rounded-[16px] border border-white/[0.08] bg-white/[0.03] p-5"
                  >
                    <span className="block text-[26px] font-semibold leading-none tracking-[-0.04em] text-white" style={FONT}>
                      {m.value}
                    </span>
                    <span className="mt-2 block text-[11px] leading-[1.4] tracking-[0.1em] text-white/35" style={FONT}>
                      {m.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Kullanım Alanları ─────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-14 md:py-20">
        <motion.div
          variants={revealVariants} initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={0}
          className="mb-10"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600" style={FONT}>
            sektörler
          </span>
          <h2 className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-900 dark:text-white md:text-[36px]" style={FONT}>
            Hangi Sektörde Çalışır?
          </h2>
          <p className="mt-3 max-w-[48ch] text-[14px] leading-[1.75] text-zinc-500 dark:text-zinc-400" style={FONT}>
            Sesli asistan, sektörünüzün ihtiyaçlarına özel eğitilir. Gerçek konuşma örnekleri:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {useCases.map((uc, i) => (
            <motion.div
              key={uc.title}
              variants={revealVariants} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={i * 0.08}
              className="relative overflow-hidden rounded-[22px] border border-zinc-100 bg-zinc-50 p-6 dark:border-white/[0.06] dark:bg-white/[0.02] md:p-7"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F472B6]/20 bg-[#DB2777]/6 text-[#DB2777] dark:border-[#9D174D]/30 dark:bg-[#9D174D]/10 dark:text-[#F472B6]">
                  {uc.icon}
                </span>
                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-zinc-900 dark:text-white" style={FONT}>{uc.title}</h3>
              </div>

              {/* Sample dialogue */}
              <div className="mb-4 rounded-[14px] border border-zinc-200 bg-white px-4 py-3 dark:border-white/[0.06] dark:bg-white/[0.03]">
                <span className="mb-1 block text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-600">Müşteri diyor ki:</span>
                <p className="text-[13px] italic leading-[1.6] text-zinc-600 dark:text-zinc-300" style={FONT}>{uc.example}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#10b981" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <p className="text-[12.5px] text-zinc-500 dark:text-zinc-400" style={FONT}>{uc.outcome}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Özellikler — list layout ──────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1a0e17_0%,#120a10_50%,#1a0e17_100%)]" />
        <div className="pointer-events-none absolute -right-32 top-1/3 h-[400px] w-[400px] rounded-full bg-[#9D174D]/6 blur-[120px]" />

        <div className="relative mx-auto max-w-[1200px] px-6 py-16 md:py-24">
          <motion.div
            variants={revealVariants} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={0}
            className="mb-12"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/30" style={FONT}>özellikler</span>
            <h2 className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-white md:text-[36px]" style={FONT}>
              Sistem Neler Yapabilir?
            </h2>
          </motion.div>

          <div className="flex flex-col gap-[1px] overflow-hidden rounded-[24px] border border-white/[0.06]">
            {service.features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={revealVariants} initial="hidden" whileInView="visible"
                viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={i * 0.08}
                className="flex items-start gap-5 bg-white/[0.025] px-6 py-5 transition-colors duration-300 hover:bg-white/[0.04] md:px-8 md:py-6"
              >
                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#9D174D]/30 bg-[#9D174D]/10">
                  <span className="text-[12px] font-bold tabular-nums text-[#F472B6]">0{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-white" style={FONT}>{f.title}</h3>
                  <p className="mt-1 text-[13px] leading-[1.7] text-white/40" style={FONT}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Süreç ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-14 md:py-20">
        <motion.div
          variants={revealVariants} initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={0}
          className="mb-12"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600" style={FONT}>çalışma süreci</span>
          <h2 className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-900 dark:text-white md:text-[36px]" style={FONT}>
            Nasıl Kurulur?
          </h2>
        </motion.div>

        <div className="relative">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-4">
            {service.process.map((step, i) => (
              <motion.div
                key={step.step}
                variants={revealVariants} initial="hidden" whileInView="visible"
                viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={i * 0.1}
                className="relative flex flex-col items-start"
              >
                {/* Connector line */}
                {i < service.process.length - 1 && (
                  <div className="pointer-events-none absolute right-0 top-7 hidden h-[1px] w-full translate-x-1/2 bg-gradient-to-r from-[#DB2777]/20 to-transparent md:block" />
                )}
                <div className="relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#DB2777]/20 bg-[#DB2777]/6">
                  <span className="text-[14px] font-bold tabular-nums text-[#F472B6]" style={FONT}>{step.step}</span>
                </div>
                <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-zinc-900 dark:text-white" style={FONT}>{step.title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-[1.65] text-zinc-500 dark:text-zinc-400" style={FONT}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <RelatedServices services={related} />
      <CTABanner />
    </main>
  );
}
