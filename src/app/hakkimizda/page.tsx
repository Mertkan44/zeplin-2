"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useReliableInView } from "@/lib/motion";

/* ── Constants ────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FONT = { fontFamily: "var(--font-jost), sans-serif" } as const;

const revealVariants = {
  hidden: { opacity: 0.16, y: 24, scale: 0.99 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.54, ease: EASE, delay },
  }),
};

/* ── Word-by-word reveal ──────────────────────────────────────────── */
function WordReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "15% 0px 15% 0px" });
  const [shouldReveal, setShouldReveal] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    if (!isInView) return;
    const frame = window.requestAnimationFrame(() => setShouldReveal(true));
    return () => window.cancelAnimationFrame(frame);
  }, [isInView]);

  useEffect(() => {
    const fallback = window.setTimeout(() => setShouldReveal(true), 900);
    return () => window.clearTimeout(fallback);
  }, []);

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0.12, y: 22 }}
          animate={shouldReveal ? { opacity: 1, y: 0 } : { opacity: 0.12, y: 22 }}
          transition={{
            duration: 0.34,
            ease: EASE,
            delay: shouldReveal ? delay + i * 0.035 : 0,
          }}
          className="inline-block"
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </span>
  );
}

/* ── Animated Counter ─────────────────────────────────────────────── */
function CountUp({
  value,
  suffix,
  delay,
}: {
  value: number;
  suffix: string;
  delay: number;
}) {
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
      {display}
      {suffix}
    </span>
  );
}

/* ── Data ─────────────────────────────────────────────────────────── */
const metrics = [
  { value: 38, suffix: "+", label: "Aktif Marka Operasyonu" },
  { value: 4, suffix: "", label: "Üretim Disiplini" },
  { value: 92, suffix: "%", label: "Zamanında Teslim Ritmi" },
  { value: 360, suffix: "°", label: "Dijital Bakış" },
];

const processSteps = [
  {
    num: "01",
    title: "Dinleme",
    desc: "Markanın mevcut sesini, hedefini ve ekip içi ritmini anlamakla başlarız.",
  },
  {
    num: "02",
    title: "Yön Bulma",
    desc: "Tasarım, içerik ve operasyon tarafında tek bir ana yön belirleriz.",
  },
  {
    num: "03",
    title: "Strateji",
    desc: "Kanal, format, takvim ve ölçüm mantığını uygulanabilir bir plana çeviririz.",
  },
  {
    num: "04",
    title: "Üretim",
    desc: "Görsel, video, metin ve web parçalarını aynı marka diliyle üretiriz.",
  },
  {
    num: "05",
    title: "Yayın & Takip",
    desc: "İşi yayına alır, metrikleri okur ve sonraki hamleyi veriye göre netleştiririz.",
  },
];

const milestones = [
  {
    year: "01",
    label: "Strateji Masası",
    desc: "Her işte önce problemi sadeleştiririz. Hedef netleşmeden tasarım ya da içerik üretmeyiz.",
  },
  {
    year: "02",
    label: "Üretim Hattı",
    desc: "Fotoğraf, video, sosyal medya, web ve yapay zeka işlerini birbirinden koparmadan planlarız.",
  },
  {
    year: "03",
    label: "Operasyon Takibi",
    desc: "Takvim, revizyon, yayın ve rapor akışını görünür tutarız. İşin kaybolmasına izin vermeyiz.",
  },
  {
    year: "04",
    label: "Ölçülebilir Sonuç",
    desc: "Beğeni kadar teslim ritmine, erişim kadar iş akışına da bakarız. Büyüme ölçülebilir olmalı.",
  },
];

const quotes = [
  {
    name: "Kurucu Ortak",
    role: "Zeplin Media",
    text: "Bir markayı büyütmek sadece güzel görünen içerik üretmek değil; doğru ritmi, doğru kanalı ve doğru operasyon disiplinini kurmak.",
  },
  {
    name: "Kreatif Direktör",
    role: "Zeplin Media",
    text: "Tasarımda gösterişten çok karakter arıyoruz. Markanın sesini boğmayan, ama ona sahne açan işler üretmek önemli.",
  },
  {
    name: "Teknoloji Lideri",
    role: "Zeplin Media",
    text: "Yapay zeka bizim için vitrin efekti değil; tekrar eden işleri hafifleten, ekibin daha iyi karar almasını sağlayan bir katman.",
  },
];

/* ══════════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════════ */
export default function HakkimizdaPage() {
  /* Quote carousel */
  const [activeQuote, setActiveQuote] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-[#0a0a0a] dark:text-zinc-100 overflow-x-hidden">
      {/* ── Hero — hizmetler ile aynı stil ───────────────────────── */}
      <section
        className="relative overflow-hidden px-6 pb-12 pt-[46svh] md:pb-24 md:pt-56 bg-center bg-no-repeat bg-[length:auto_100%] md:bg-cover"
        style={{ backgroundImage: "url('/images/generated/about-agency-studio.webp')" }}
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
            Hakkımızda
          </motion.h1>
          <motion.p
            variants={revealVariants}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="mt-2 max-w-[600px] text-base font-light text-zinc-400 dark:text-zinc-500 sm:text-lg"
            style={FONT}
          >
            Strateji, üretim ve operasyonu aynı masada buluşturan yaratıcı ekip.
          </motion.p>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[40vw] w-[40vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EC4899]/10 blur-[80px] dark:bg-[#BE185D]/10" />
      </section>

      {/* ── Manifesto — Large Word-by-Word Reveal ──────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 md:py-32">
        <h2
          className="text-[22px] font-semibold leading-[1.35] tracking-[-0.02em] text-zinc-800 dark:text-zinc-200 sm:text-[26px] md:text-[34px] md:leading-[1.35]"
          style={FONT}
        >
          <WordReveal
            text="Markanızın dijitalde yalnızca görünmesini değil, düzenli ve ölçülebilir bir ritim yakalamasını sağlıyoruz."
            delay={0}
          />
          <br />
          <span className="text-[#DB2777] dark:text-[#F472B6]">
            <WordReveal
              text="Strateji, tasarım ve teknoloji — hepsi tek çatı altında."
              delay={0.5}
            />
          </span>
        </h2>
      </section>

      {/* ── Metrics — Marquee Strip ────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-zinc-200/60 py-6 dark:border-white/[0.06] md:py-10">
        <div className="flex animate-[marquee_20s_linear_infinite] gap-12 md:gap-20" style={{ willChange: "transform" }}>
          {[...metrics, ...metrics].map((m, i) => (
            <div
              key={`metric-${i}`}
              className="flex shrink-0 items-baseline gap-3"
            >
              <span
                className="text-[30px] font-bold leading-none tracking-[-0.04em] text-zinc-900 dark:text-white md:text-[42px]"
                style={FONT}
              >
                {i < metrics.length ? (
                  <CountUp value={m.value} suffix={m.suffix} delay={i * 0.2} />
                ) : (
                  `${m.value}${m.suffix}`
                )}
              </span>
              <span
                className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-600 md:text-[12px]"
                style={FONT}
              >
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Hikayemiz — Staggered Image + Text ────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-28">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
          {/* Left — Image with clip-path reveal */}
          <motion.div
            initial={{ opacity: 0.12, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            transition={{ duration: 0.56, ease: EASE }}
            className="relative hidden aspect-[4/5] overflow-hidden rounded-[28px] md:block"
          >
            <Image
              src="/images/generated/about-agency-studio.webp"
              alt="Zeplin Media Hikayemiz"
              fill
              className="object-cover"
            />
            {/* Pink tint overlay */}
            <div className="absolute inset-0 bg-[#DB2777]/10 mix-blend-multiply" />
          </motion.div>

          {/* Right — Text */}
          <div className="text-center md:text-left">
            <motion.span
              initial={{ opacity: 0.12, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
              transition={{ duration: 0.54, ease: EASE }}
              className="text-[12px] font-medium uppercase tracking-[0.26em] text-[#DB2777] dark:text-[#F472B6]"
              style={FONT}
            >
              Hikayemiz
            </motion.span>

            <motion.h2
              initial={{ opacity: 0.12, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
              transition={{ duration: 0.56, ease: EASE, delay: 0.1 }}
              className="mt-4 text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-900 dark:text-white md:text-[34px]"
              style={FONT}
            >
              Zeplin
              <span className="text-[#EC4899] dark:text-[#F472B6]">
                {" "}
                Media.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0.12, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
              transition={{ duration: 0.54, ease: EASE, delay: 0.2 }}
              className="mt-6 text-[16px] leading-[1.8] text-zinc-500 dark:text-zinc-400 md:text-[17px]"
              style={FONT}
            >
              Zeplin Media; markaların dijital dünyadaki görünürlüğünü,
              üretim temposunu ve operasyon akışını aynı çatı altında yöneten
              yaratıcı bir ekip. Bir işi sadece güzel göstermekle yetinmeyip,
              onun nasıl yayınlanacağını, nasıl ölçüleceğini ve nasıl
              sürdürüleceğini de düşünürüz.
            </motion.p>

            <motion.p
              initial={{ opacity: 0.12, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
              transition={{ duration: 0.54, ease: EASE, delay: 0.3 }}
              className="mt-4 text-[16px] leading-[1.8] text-zinc-500 dark:text-zinc-400 md:text-[17px]"
              style={FONT}
            >
              Fotoğraf ve video çekiminden sosyal medya tasarımına, kurumsal
              web sitelerinden yapay zeka destekli akışlara kadar her parçada
              aynı soruya bakarız: Bu marka daha net, daha tutarlı ve daha
              güçlü nasıl görünür?
            </motion.p>

            <motion.div
              initial={{ opacity: 0.12, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
              transition={{ duration: 0.54, ease: EASE, delay: 0.4 }}
              className="mt-8 flex justify-center gap-3 md:justify-start"
            >
              <a
                href="https://wa.me/905459407690"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#DB2777,#9D174D)] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_8px_24px_rgba(219,39,119,0.3)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(219,39,119,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                style={FONT}
              >
                İletişime Geç
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M3 8h10M10 5l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Sürecimiz — Animated Process Flow ──────────────────────── */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* Dark background */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1a0e17_0%,#140c12_100%)] dark:bg-[linear-gradient(180deg,#0f0a0d_0%,#0a0a0a_100%)]" />
        <div className="pointer-events-none absolute left-1/3 top-0 h-[280px] w-[280px] rounded-full bg-[#DB2777]/5 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-[220px] w-[220px] rounded-full bg-[#9D174D]/6 blur-[80px]" />

        <div className="relative mx-auto max-w-[1200px] px-6">
          <motion.span
            initial={{ opacity: 0.12, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            transition={{ duration: 0.54, ease: EASE }}
            className="text-[12px] font-medium uppercase tracking-[0.26em] text-white/30"
            style={FONT}
          >
            Sürecimiz
          </motion.span>
          <motion.h2
            initial={{ opacity: 0.12, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            transition={{ duration: 0.54, ease: EASE, delay: 0.08 }}
            className="mt-3 text-[24px] font-semibold leading-[1.1] tracking-[-0.02em] text-white md:text-[30px]"
            style={FONT}
          >
            Fikirden sonuca, adım adım.
          </motion.h2>

          {/* Process flow */}
          <div className="relative mt-12 md:mt-16">
            {/* Desktop connecting line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
              transition={{ duration: 1.5, ease: EASE, delay: 0.4 }}
              className="absolute left-[24px] right-[24px] top-[24px] hidden h-px origin-left md:block"
              style={{
                background:
                  "linear-gradient(90deg, rgba(244,114,182,0.5) 0%, rgba(219,39,119,0.25) 50%, rgba(244,114,182,0.5) 100%)",
              }}
            />

            {/* Mobile connecting line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
              className="absolute bottom-[24px] left-[23px] top-[48px] w-px origin-top md:hidden"
              style={{
                background:
                  "linear-gradient(180deg, rgba(244,114,182,0.5) 0%, rgba(219,39,119,0.25) 50%, rgba(244,114,182,0.5) 100%)",
              }}
            />

            <div className="grid grid-cols-1 gap-10 md:grid-cols-5 md:gap-5">
              {processSteps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0.12, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
                  transition={{ duration: 0.54, ease: EASE, delay: i * 0.1 }}
                  className="group relative flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center"
                >
                  {/* Step circle */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.3 + i * 0.1,
                    }}
                    className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06]"
                  >
                    <span
                      className="text-[13px] font-bold tabular-nums text-[#F472B6]"
                      style={FONT}
                    >
                      {step.num}
                    </span>
                    {/* Hover glow */}
                    <div className="pointer-events-none absolute inset-[-4px] rounded-full opacity-0 bg-[#DB2777]/20 blur-[10px] transition-opacity duration-500 group-hover:opacity-100" />
                  </motion.div>

                  <div className="md:mt-5">
                    <h3
                      className="text-[17px] font-semibold tracking-[-0.01em] text-white"
                      style={FONT}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="mt-1.5 text-[13px] leading-[1.65] text-white/40"
                      style={FONT}
                    >
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Yolculuğumuz — Vertical Timeline ──────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-24">
        <div className="mb-12 md:mb-16">
          <motion.span
            initial={{ opacity: 0.12, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            transition={{ duration: 0.54, ease: EASE }}
            className="text-[12px] font-medium uppercase tracking-[0.26em] text-[#DB2777] dark:text-[#F472B6]"
            style={FONT}
          >
            Yolculuğumuz
          </motion.span>
          <motion.h2
            initial={{ opacity: 0.12, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            transition={{ duration: 0.54, ease: EASE, delay: 0.08 }}
            className="mt-3 text-[24px] font-semibold leading-[1.1] tracking-[-0.02em] text-zinc-900 dark:text-white md:text-[30px]"
            style={FONT}
          >
            Nasıl buraya geldik?
          </motion.h2>
        </div>

        <div className="relative">
          {/* Animated vertical line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            transition={{ duration: 1.2, ease: EASE }}
            className="absolute left-[19px] top-0 h-full w-px origin-top bg-linear-to-b from-[#DB2777] via-[#EC4899] to-[#F9A8D4] dark:from-[#9D174D] dark:via-[#DB2777] dark:to-[#F472B6] md:left-1/2 md:-translate-x-px"
          />

          <div className="space-y-12 md:space-y-0">
            {milestones.map((m, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0.12, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
                  transition={{
                    duration: 0.56,
                    ease: EASE,
                    delay: 0.1,
                  }}
                  className={`relative flex gap-6 md:gap-0 ${
                    isEven
                      ? "md:flex-row"
                      : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="relative z-10 flex shrink-0 items-start pt-1 md:absolute md:left-1/2 md:-translate-x-1/2 md:pt-0">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                        delay: 0.2,
                      }}
                      className="h-10 w-10 rounded-full border-4 border-white bg-[linear-gradient(135deg,#F472B6,#DB2777)] shadow-[0_0_24px_rgba(219,39,119,0.35)] dark:border-[#0a0a0a] dark:bg-[linear-gradient(135deg,#DB2777,#9D174D)] dark:shadow-[0_0_24px_rgba(157,23,77,0.5)]"
                    />
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 rounded-[20px] border border-zinc-100 bg-white p-6 dark:border-white/[0.06] dark:bg-white/[0.03] md:w-[calc(50%-40px)] md:flex-initial ${
                      isEven
                        ? "md:mr-auto md:pr-12"
                        : "md:ml-auto md:pl-12"
                    }`}
                  >
                    <span
                      className="text-[13px] font-bold tabular-nums tracking-[0.1em] text-[#DB2777] dark:text-[#F472B6]"
                      style={FONT}
                    >
                      {m.year}
                    </span>
                    <h3
                      className="mt-1 text-[20px] font-semibold tracking-[-0.01em] text-zinc-900 dark:text-white md:text-[22px]"
                      style={FONT}
                    >
                      {m.label}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.7] text-zinc-500 dark:text-zinc-400">
                      {m.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Felsefemiz — Rotating Quote Carousel ──────────────────── */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Full-width dark background */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1a0e17_0%,#120a10_100%)] dark:bg-[linear-gradient(180deg,#0f0a0d_0%,#0a0a0a_100%)]" />
        <div className="pointer-events-none absolute -left-32 top-1/2 h-[280px] w-[280px] -translate-y-1/2 rounded-full bg-[#DB2777]/6 blur-[80px]" />

        <div className="relative mx-auto max-w-[1200px] px-6">
          <motion.span
            initial={{ opacity: 0.12, y: 22 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            transition={{ duration: 0.4, ease: EASE }}
            className="text-[12px] font-medium uppercase tracking-[0.26em] text-white/30"
            style={FONT}
          >
            Felsefemiz
          </motion.span>

          {/* Quote carousel */}
          <div className="relative mt-10 min-h-[200px] md:min-h-[240px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={activeQuote}
                initial={{ opacity: 0.12, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.54, ease: EASE }}
              >
                {/* Large decorative quote */}
                <span
                  className="absolute -top-6 left-0 select-none text-[80px] font-bold leading-none text-white/[0.04] md:text-[120px]"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                <p
                  className="relative max-w-[700px] text-[18px] leading-[1.6] text-white/80 sm:text-[22px] md:text-[26px] md:leading-[1.5]"
                  style={FONT}
                >
                  {quotes[activeQuote].text}
                </p>

                <div className="mt-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#F472B6,#DB2777)] text-[14px] font-bold text-white">
                    {quotes[activeQuote].name.charAt(0)}
                  </div>
                  <div>
                    <span
                      className="block text-[14px] font-semibold text-white"
                      style={FONT}
                    >
                      {quotes[activeQuote].name}
                    </span>
                    <span className="text-[12px] text-white/40">
                      {quotes[activeQuote].role}
                    </span>
                  </div>
                </div>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Dot indicators */}
          <div className="mt-8 flex gap-2">
            {quotes.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveQuote(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === activeQuote
                    ? "w-8 bg-[#F472B6]"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Alıntı ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — Full-width Banner ───────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0.12, y: 22, scale: 0.99 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
          transition={{ duration: 0.56, ease: EASE }}
          className="relative overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#DB2777_0%,#9D174D_50%,#831843_100%)] p-10 md:p-16"
        >
          {/* Decorative elements */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-[200px] w-[200px] rounded-full bg-white/10 blur-[60px]" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-[200px] w-[200px] rounded-full bg-[#F472B6]/20 blur-[80px]" />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <h2
                className="text-[26px] font-bold leading-[1.1] tracking-[-0.03em] text-white md:text-[34px]"
                style={FONT}
              >
                Projenizi
                <br />
                konuşalım.
              </h2>
              <p
                className="mt-4 max-w-[360px] text-[15px] leading-[1.7] text-white/60"
                style={FONT}
              >
                Bir kahve eşliğinde markanızın dijital geleceğini birlikte
                planlayalım.
              </p>
            </div>

            <a
              href="https://wa.me/905459407690"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-[#9D174D] shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] active:scale-[0.98]"
              style={FONT}
            >
              WhatsApp ile Yazın
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  d="M3 8h10M10 5l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
