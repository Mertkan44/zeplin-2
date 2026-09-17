"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { EASE, FONT, revealVariants, useReliableInView } from "@/lib/motion";
import { serviceTabs } from "@/data/services";
import FirstScrollSnap from "@/components/FirstScrollSnap";

/* ── Metrics ──────────────────────────────────────────────────────── */
const metrics = [
  { value: 38, suffix: "+", label: "Aktif Marka Operasyonu" },
  { value: 92, suffix: "%", label: "Zamanında Teslim" },
  { value: 4, suffix: ".7x", label: "Ortalama Etkileşim Artışı" },
  { value: 360, suffix: "°", label: "Üretim ve Operasyon" },
];

function CountUp({ value, suffix, delay }: { value: number; suffix: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useReliableInView(ref);
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 50, damping: 20, mass: 1 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => motionVal.set(value), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, value, delay, motionVal]);

  useEffect(() => {
    const unsub = spring.on("change", (v: number) => {
      setDisplay(Math.round(v).toString());
    });
    return unsub;
  }, [spring]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}{suffix}
    </span>
  );
}

/* ── Service tabs data — imported from @/data/services ─────────── */

/* ── Testimonials ─────────────────────────────────────────────────── */
const testimonials = [
  { name: "Milo Restaurant", role: "Fotoğraf ve Reels", text: "Menü çekimi, reels akışı ve sosyal medya görselleri aynı görsel dilde toplandı." },
  { name: "Foton Sağlık Çözümleri", role: "Kurumsal Web Sitesi", text: "Teknik ürün gamını sade, güven veren ve uluslararası kullanıma uygun bir web yapısına taşıdık." },
  { name: "Pam Akademi", role: "Kimlik ve Sosyal Medya", text: "Kimlik inşası, web sitesi, takvim ve sosyal medya tasarımlarını tek marka sistemi altında birleştirdik." },
];

/* ══════════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════════ */
export default function HizmetlerPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-[#0a0a0a] dark:text-zinc-100">
      <FirstScrollSnap targetId="services-first-section" />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-6 pb-12 pt-[46svh] md:pb-24 md:pt-56 bg-center bg-no-repeat bg-[length:auto_100%] md:bg-cover"
        style={{ backgroundImage: "url('/images/services-digital-premium-optimized.webp')" }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-white/30 via-white/70 to-white dark:from-[#0a0a0a]/20 dark:via-[#0a0a0a]/70 dark:to-[#0a0a0a]" />

        <div className="relative mx-auto flex max-w-[1200px] flex-col items-center text-center">
          <motion.h1
            variants={revealVariants}
            initial="hidden"
            animate="visible"
            custom={0}
            className="text-[40px] font-bold leading-[1.1] tracking-tight text-[#DB2777] dark:text-white sm:text-[56px] md:text-[68px]"
            style={FONT}
          >
            Hizmetlerimiz
          </motion.h1>
          <motion.p
            variants={revealVariants}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="mt-2 max-w-[600px] text-base font-light text-zinc-400 dark:text-zinc-500 sm:text-lg"
            style={FONT}
          >
            Markanızın görünümünü, içeriğini ve operasyon ritmini aynı masada kuran çözümler.
          </motion.p>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[50vw] w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EC4899]/10 blur-[120px] dark:bg-[#BE185D]/10" />
      </section>

      {/* ── Metrics ──────────────────────────────────────────────── */}
      <section
        id="services-first-section"
        className="mx-auto -mt-6 max-w-[1200px] px-6 py-4 scroll-mt-28 md:-mt-8 md:py-8 md:scroll-mt-36"
      >
        <motion.div
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          className="border-y border-zinc-200/80 py-2 dark:border-white/10 md:py-4"
        >
          <div className="grid grid-cols-2 gap-x-4 gap-y-0 md:grid-cols-4 md:gap-x-0">
            {metrics.map((m, i) => (
              <div
                key={m.label}
                className={`flex min-h-[84px] flex-col justify-center border-zinc-200/80 py-3 dark:border-white/10 md:min-h-[108px] md:border-b-0 md:px-6 md:py-2 md:first:pl-0 md:last:pr-0 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-zinc-200/80 md:dark:[&:not(:first-child)]:border-white/10 ${i < 2 ? "border-b" : ""}`}
              >
                <div>
                  <span className="block text-[28px] font-medium leading-none tracking-[-0.05em] text-zinc-950 dark:text-white md:text-[40px]" style={FONT}>
                    <CountUp value={m.value} suffix={m.suffix} delay={i * 0.14} />
                  </span>
                  <span className="mt-2 block max-w-[12ch] text-[11px] leading-[1.35] tracking-[0.08em] text-zinc-500 dark:text-zinc-500 md:max-w-[14ch] md:tracking-[0.14em]" style={FONT}>
                    {m.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Yapay Zeka Hizmetlerimiz — Hero Card ─────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 pb-4 pt-8 md:pb-6 md:pt-14">
        <motion.div
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          custom={0.08}
        >
          <div className="overflow-hidden rounded-[34px] border border-[#F9A8D4]/50 bg-[linear-gradient(180deg,#FBCFE8_0%,#F9A8D4_100%)] shadow-[0_24px_70px_rgba(219,39,119,0.14)] dark:border-[#9D174D]/30 dark:bg-[linear-gradient(180deg,#9D174D_0%,#831843_100%)] dark:shadow-[0_24px_70px_rgba(157,23,77,0.25)]">
            <div className="grid md:min-h-[460px] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              {/* Left — dark text panel */}
              <div className="bg-[linear-gradient(180deg,#2a1525_0%,#1f0c18_100%)] px-7 py-8 text-white dark:bg-[linear-gradient(180deg,#1a0e17_0%,#120a10_100%)] md:px-14 md:py-16">
                <span className="text-[12px] font-medium uppercase tracking-[0.26em] text-white/42">
                  gelişmiş hizmetler
                </span>
                <h2 className="mt-7 text-[2.4rem] font-semibold leading-[0.96] tracking-[-0.055em] text-white md:text-[5.1rem]">
                  Yapay Zeka
                  <br />
                  <span className="text-[#EC4899] dark:text-[#F472B6]">Hizmetlerimiz.</span>
                </h2>
                <p className="mt-8 max-w-[28ch] text-[15px] leading-[1.72] text-white/62 md:text-[17px]">
                  Chatbot, callbot ve otomasyon akışlarını; sosyal medya, web ve içerik operasyonunuzla aynı ritimde çalışacak şekilde kurguluyoruz.
                </p>
              </div>

              {/* Right — visual */}
              <div className="relative min-h-[260px] overflow-hidden border-t border-white/8 bg-[#160812] md:min-h-full md:border-l md:border-t-0 md:border-white/8">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/images/generated/service-ai-automation.webp')" }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(31,12,24,0.82)_0%,rgba(31,12,24,0.18)_52%,rgba(31,12,24,0)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_46%,rgba(236,72,153,0.32),transparent_38%)]" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Interactive Service Tabs ──────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-10 md:py-16">
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
          custom={0}
        >
          {/* Tab bar */}
          <div className="relative mb-10 flex gap-1 md:mb-14">
            {serviceTabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(i)}
                className={`relative z-10 rounded-full px-5 py-2.5 text-[14px] font-medium transition-all duration-300 md:px-7 md:py-3 md:text-[15px] ${
                  activeTab === i
                    ? "text-white"
                    : "text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200"
                }`}
                style={FONT}
              >
                {activeTab === i && (
                  <motion.span
                    layoutId="pill"
                    className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#DB2777_0%,#9D174D_100%)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{ zIndex: -1 }}
                  />
                )}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cards — tall visual layout */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.36, ease: EASE }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {serviceTabs[activeTab].cards.map((card, ci) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.46, ease: EASE, delay: ci * 0.08 }}
                >
                  <Link
                    href={`/hizmetler/${card.slug}`}
                    className="group relative block cursor-pointer overflow-hidden rounded-[24px] border border-transparent transition-[border-color,box-shadow] duration-500 hover:border-[#F472B6]/20 hover:shadow-[0_8px_40px_rgba(219,39,119,0.1)] dark:hover:border-[#9D174D]/30 dark:hover:shadow-[0_8px_40px_rgba(157,23,77,0.12)]"
                    style={{ minHeight: "340px" }}
                  >
                    {/* BG image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      style={{ backgroundImage: `url('${card.img}')` }}
                    />

                    {/* Overlay — monochrome dark, image speaks for itself */}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_5%,rgba(15,10,13,0.88)_62%)] transition-all duration-500 group-hover:bg-[linear-gradient(180deg,transparent_5%,rgba(15,10,13,0.80)_62%)]" />

                    {/* Content pinned to bottom */}
                    <div className="relative flex h-full min-h-[340px] flex-col justify-end p-7 md:p-8">
                      <span className="mb-3 inline-block w-fit rounded-full border border-white/20 px-3 py-1 text-[11px] font-medium tracking-[0.12em] text-white/70 backdrop-blur-sm">
                        {serviceTabs[activeTab].label}
                      </span>
                      <h4
                        className="text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] text-white md:text-[26px]"
                        style={FONT}
                      >
                        {card.title}
                      </h4>
                      <p className="mt-2 max-w-[32ch] text-[14px] leading-[1.6] text-white/60">
                        {card.desc}
                      </p>
                      <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-[#F472B6] opacity-0 transition-all duration-400 group-hover:opacity-100">
                        detaylar
                        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── Süreç & Bento ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-10 md:py-16">
        {/* Process strip */}
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
          custom={0}
          className="mb-10 md:mb-14"
        >
          <div className="grid grid-cols-2 gap-y-6 border-b border-zinc-200/60 pb-8 dark:border-white/[0.06] md:grid-cols-4 md:gap-y-0 md:pb-10">
            {[
              { step: "01", label: "Brief", desc: "İhtiyaçlarınızı dinliyoruz" },
              { step: "02", label: "Strateji", desc: "Yol haritası çiziyoruz" },
              { step: "03", label: "Üretim", desc: "İçerik & tasarım üretiyoruz" },
              { step: "04", label: "Teslimat", desc: "Sonuçları teslim ediyoruz" },
            ].map((item) => (
              <div
                key={item.step}
                className="md:border-l md:border-zinc-200/60 md:pl-6 md:first:border-l-0 md:first:pl-0 dark:md:border-white/[0.06]"
              >
                <span
                  className="block text-[12px] font-semibold tabular-nums tracking-[0.15em] text-[#DB2777] dark:text-[#F472B6]"
                  style={FONT}
                >
                  {item.step}
                </span>
                <span
                  className="mt-2 block text-[16px] font-semibold tracking-[-0.01em] text-zinc-900 dark:text-white"
                  style={FONT}
                >
                  {item.label}
                </span>
                <span className="mt-1 block text-[13px] leading-[1.6] text-zinc-400 dark:text-zinc-500">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bento duo */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.4fr_1fr]">
          {/* Operasyonlarımız card */}
          <motion.a
            href="/operasyonlar"
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            custom={0.05}
            className="group relative overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#2a1525_0%,#1f0c18_100%)] p-8 transition-shadow duration-500 hover:shadow-[0_16px_60px_rgba(219,39,119,0.12)] dark:bg-[linear-gradient(180deg,#1a0e17_0%,#120a10_100%)] dark:hover:shadow-[0_16px_60px_rgba(157,23,77,0.18)] md:min-h-[320px] md:p-12"
          >
            {/* Subtle radial glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-[#DB2777]/8 blur-[100px] opacity-50 transition-opacity duration-700 group-hover:opacity-80 dark:bg-[#9D174D]/12" />

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <span
                  className="text-[12px] font-medium uppercase tracking-[0.26em] text-white/35"
                  style={FONT}
                >
                  tüm hizmetler
                </span>
                <h3
                  className="mt-5 text-[28px] font-semibold leading-[1.05] tracking-[-0.03em] text-white md:text-[36px]"
                  style={FONT}
                >
                  Operasyonlarımız
                </h3>
                <p
                  className="mt-4 max-w-[30ch] text-[15px] leading-[1.7] text-white/50"
                  style={FONT}
                >
                  Marka operasyonlarınızı stratejiden teslimatına uçtan uca yönetiyoruz.
                </p>
              </div>
              <div
                className="mt-8 inline-flex items-center gap-2 text-[14px] font-semibold text-[#F472B6] transition-all duration-300 group-hover:gap-3"
                style={FONT}
              >
                keşfet
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M3 8h10M10 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </motion.a>

          {/* İletişim CTA card */}
          <motion.a
            href="https://wa.me/905459407690"
            target="_blank"
            rel="noopener noreferrer"
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            custom={0.12}
            className="group relative overflow-hidden rounded-[28px] border border-[#F9A8D4]/40 bg-[linear-gradient(180deg,#FBCFE8_0%,#F9A8D4_100%)] p-8 transition-shadow duration-500 hover:shadow-[0_16px_60px_rgba(219,39,119,0.14)] dark:border-[#9D174D]/30 dark:bg-[linear-gradient(180deg,#9D174D_0%,#831843_100%)] dark:hover:shadow-[0_16px_60px_rgba(157,23,77,0.2)] md:p-12"
          >
            {/* Subtle highlight */}
            <div className="pointer-events-none absolute right-0 top-0 h-[200px] w-[200px] rounded-full bg-white/20 blur-[80px] dark:bg-white/5" />

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <span
                  className="text-[12px] font-medium uppercase tracking-[0.26em] text-[#9D174D]/60 dark:text-white/35"
                  style={FONT}
                >
                  iletişim
                </span>
                <h3
                  className="mt-5 text-[28px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#831843] dark:text-white md:text-[32px]"
                  style={FONT}
                >
                  Projenizi
                  <br />
                  konuşalım.
                </h3>
              </div>
              <div
                className="mt-8 inline-flex items-center gap-2 text-[14px] font-semibold text-[#9D174D] transition-all duration-300 group-hover:gap-3 dark:text-[#F472B6]"
                style={FONT}
              >
                WhatsApp ile yazın
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M3 8h10M10 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </motion.a>
        </div>
      </section>

      {/* ── Müşterilerden Alıntı ─────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 pb-24 pt-10 md:pb-32 md:pt-16">
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
          custom={0}
          className="mb-10 md:mb-14"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-700" style={FONT}>
            Müşterilerimiz ne diyor
          </span>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.name}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
              custom={i * 0.1}
              className="relative flex flex-col justify-between"
            >
              {/* Large decorative quote mark */}
              <span
                className="absolute -left-1 -top-4 select-none text-[64px] font-bold leading-none text-zinc-100 dark:text-white/[0.04]"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <p className="relative text-[15px] leading-[1.8] text-zinc-600 dark:text-zinc-400" style={FONT}>
                {t.text}
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-zinc-100 pt-5 dark:border-white/[0.06]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#F472B6,#DB2777)] text-[13px] font-bold text-white dark:bg-[linear-gradient(135deg,#DB2777,#9D174D)]">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <span className="block text-[14px] font-semibold text-zinc-800 dark:text-zinc-200" style={FONT}>{t.name}</span>
                  <span className="text-[12px] text-zinc-400 dark:text-zinc-600">{t.role}</span>
                </div>
              </div>
            </motion.blockquote>
          ))}
        </div>
      </section>
    </main>
  );
}
