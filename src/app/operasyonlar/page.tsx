"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import FirstScrollSnap from "@/components/FirstScrollSnap";
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

/* ── CountUp ──────────────────────────────────────────────────────── */
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

/* ── GradientBorderCard ───────────────────────────────────────────── */
function GradientBorderCard({
  children,
  color,
  className = "",
}: {
  children: React.ReactNode;
  color: string;
  className?: string;
}) {
  return (
    <div
      className={`group relative rounded-[28px] p-[1px] transition-shadow duration-500 hover:shadow-[0_8px_40px_rgba(219,39,119,0.1)] dark:hover:shadow-[0_8px_40px_rgba(157,23,77,0.15)] ${className}`}
    >
      {/* Static gradient border */}
      <div
        className="absolute inset-0 rounded-[28px] opacity-30 transition-opacity duration-500 group-hover:opacity-80"
        style={{
          background: `linear-gradient(135deg, ${color}, transparent 50%, ${color})`,
        }}
      />
      {/* Inner card */}
      <div className="relative h-full rounded-[27px] bg-white p-6 dark:bg-[#0a0a0a] md:p-8">
        {children}
      </div>
    </div>
  );
}

/* ── ExpandingCard ────────────────────────────────────────────────── */
function ExpandingCard({
  title,
  desc,
  stat,
  icon,
  isOpen,
  onClick,
}: {
  title: string;
  desc: string;
  stat: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className={`w-full overflow-hidden rounded-[24px] border text-left transition-colors duration-500 ${
        isOpen
          ? "border-[#F472B6]/20 bg-white/[0.06] shadow-[0_0_40px_rgba(244,114,182,0.06)]"
          : "border-white/[0.06] bg-white/[0.03] hover:border-white/[0.1]"
      }`}
    >
      <motion.div layout="position" className="flex items-center gap-4 p-6 md:p-8">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-500 ${
            isOpen
              ? "bg-[#DB2777]/15 text-[#F472B6]"
              : "bg-white/[0.05] text-white/40"
          }`}
        >
          {icon}
        </div>
        <h3
          className="flex-1 text-[18px] font-semibold text-white md:text-[20px]"
          style={FONT}
        >
          {title}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] text-white/40"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1v12M1 7h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0 md:px-8 md:pb-8">
              <div className="ml-14">
                <p
                  className="text-[14px] leading-[1.7] text-white/50"
                  style={FONT}
                >
                  {desc}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#F472B6]/20 bg-[#DB2777]/8 px-4 py-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#F472B6]" />
                  <span
                    className="text-[12px] font-medium text-[#F472B6]"
                    style={FONT}
                  >
                    {stat}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ── Data ─────────────────────────────────────────────────────────── */
const operationMetrics = [
  { value: 360, suffix: "°", label: "Dijital Operasyon" },
  { value: 7, suffix: "", label: "Operasyon Alanı" },
  { value: 24, suffix: "/7", label: "Kesintisiz İzleme" },
  { value: 38, suffix: "+", label: "Aktif Marka" },
];

const operations = [
  {
    title: "Sosyal Medya Yönetimi",
    subtitle: "Social Media Management",
    desc: "İçerik takvimi, marka tonu, yayın ritmi ve topluluk iletişimini tek plan üzerinden yönetiyoruz.",
    features: ["İçerik Takvimi", "Yayın Planı", "Topluluk Yönetimi", "Raporlama"],
    metric: { value: 1, suffix: ".8M+", label: "Aylık Erişim" },
    color: "#EC4899",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
  {
    title: "İçerik Üretimi",
    subtitle: "Content Production",
    desc: "Fotoğraf, video, grafik ve metni aynı kampanya fikrinin parçaları olarak üretiyoruz.",
    features: ["Video", "Fotoğraf", "Grafik Tasarım", "Copywriting"],
    metric: { value: 500, suffix: "+", label: "Aylık İçerik" },
    color: "#F472B6",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    title: "Dijital Reklam & Performans",
    subtitle: "Performance Marketing",
    desc: "Meta, Google, TikTok ve LinkedIn kampanyalarını kreatif üretimle birlikte optimize ediyoruz.",
    features: ["Google Ads", "Meta Ads", "TikTok Ads", "Programmatic"],
    metric: { value: 4, suffix: "x", label: "Ort. ROAS" },
    color: "#DB2777",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "SEO & Analitik",
    subtitle: "Search & Analytics",
    desc: "Organik görünürlük, teknik sağlık ve içerik performansını okunabilir raporlara çeviriyoruz.",
    features: ["Teknik SEO", "İçerik SEO", "Backlink", "GA4 & GTM"],
    metric: { value: 180, suffix: "%", label: "Ort. Trafik Artışı" },
    color: "#9D174D",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    title: "Yapay Zeka Entegrasyonu",
    subtitle: "AI Integration",
    desc: "Chatbot, callbot ve otomasyon akışlarını günlük operasyonun yükünü azaltacak şekilde kuruyoruz.",
    features: ["AI Chatbot", "AI Callbot", "Otomasyon", "AI İçerik"],
    metric: { value: 7, suffix: "/24", label: "Kesintisiz Hizmet" },
    color: "#BE185D",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    title: "Raporlama & Analiz",
    subtitle: "Reporting & Analytics",
    desc: "Haftalık ve aylık raporlarda sadece sayı değil, bir sonraki aksiyonu da görünür kılıyoruz.",
    features: ["Haftalık Rapor", "Dashboard", "Rakip Analizi", "Aksiyon"],
    metric: { value: 100, suffix: "%", label: "Şeffaf Veri" },
    color: "#FBCFE8",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
];

const workflowSteps = [
  { num: "01", title: "Analiz", desc: "Mevcut durumu ve hedefleri analiz ediyoruz." },
  { num: "02", title: "Planlama", desc: "Operasyon planını ve KPI'ları belirliyoruz." },
  { num: "03", title: "Uygulama", desc: "Tüm kanallarda eş zamanlı başlatıyoruz." },
  { num: "04", title: "İzleme", desc: "Gerçek zamanlı veri ile performansı izliyoruz." },
  { num: "05", title: "Optimize", desc: "Veri odaklı optimizasyonlarla artırıyoruz." },
  { num: "06", title: "Raporlama", desc: "Şeffaf raporlarla süreci görünür kılıyoruz." },
];

const advantages = [
  {
    title: "Entegre Ekip",
    desc: "Strateji, tasarım, içerik ve teknoloji ekipleri tek çatı altında. Ayrı ajanslarla koordinasyon derdi yok.",
    stat: "6 departman, 1 ekip",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    title: "Veri Odaklı Kararlar",
    desc: "Her karar gerçek zamanlı veriyle desteklenir. Tahmin değil, analiz yapıyoruz.",
    stat: "Gerçek zamanlı dashboard",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
  },
  {
    title: "Esnek Ölçekleme",
    desc: "İhtiyacınıza göre operasyonları büyütür veya küçültürüz. Aylık esnek modeller.",
    stat: "Aylık revizyon hakkı",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
];

const ticker = [
  "Sosyal medya takvimi güncellendi — Marka A",
  "Haftalık performans raporu hazırlandı",
  "AI chatbot %98.2 başarıyla yanıtladı",
  "Google Ads ROAS: 4.2x — Kampanya B",
  "Instagram erişim +42% — Bu hafta",
  "Yeni içerik paketi onaylandı — 24 parça",
  "SEO sıralaması yükseldi — Top 3",
  "Aylık analiz raporu tamamlandı",
];

const testimonials = [
  {
    name: "Mehmet Y.",
    role: "E-Ticaret Müdürü",
    text: "Sosyal medya ve reklam operasyonlarımızı tek çatı altında yönetmeleri inanılmaz verimli oldu.",
  },
  {
    name: "Elif D.",
    role: "Pazarlama Direktörü",
    text: "Haftalık raporlama ve şeffaf iletişim sayesinde her şey kontrol altında. Güvenle çalışıyoruz.",
  },
  {
    name: "Can B.",
    role: "Startup Kurucusu",
    text: "AI chatbot entegrasyonu müşteri memnuniyetimizi %40 artırdı. Operasyonel mükemmellik.",
  },
];

/* ══════════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════════ */
export default function OperasyonlarPage() {
  const [openCard, setOpenCard] = useState(0);

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-zinc-900 dark:bg-[#0a0a0a] dark:text-zinc-100">
      <FirstScrollSnap targetId="operations-first-section" />

      {/* ── SECTION 1: Hero ───────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-center bg-no-repeat bg-[length:auto_100%] px-6 pb-12 pt-[46svh] md:bg-cover md:pb-24 md:pt-56"
        style={{ backgroundImage: "url('/images/generated/operations-command-center.webp')" }}
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
            Operasyonlarımız
          </motion.h1>
          <motion.p
            variants={revealVariants}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="mt-2 max-w-[600px] text-base font-light text-zinc-400 dark:text-zinc-500 sm:text-lg"
            style={FONT}
          >
            Takvim, üretim, yayın ve raporlamayı tek merkezde topluyoruz
            <span className="ml-1 inline-block h-[1em] w-[2px] animate-[blink_1s_step-end_infinite] bg-[#DB2777] align-middle dark:bg-[#F472B6]" />
          </motion.p>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[40vw] w-[40vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EC4899]/10 blur-[80px] dark:bg-[#BE185D]/10" />
      </section>

      {/* ── SECTION 2: Metrics Strip ──────────────────────────────── */}
      <section
        id="operations-first-section"
        className="mx-auto -mt-6 max-w-[1200px] px-6 py-4 scroll-mt-28 md:-mt-8 md:py-8 md:scroll-mt-36"
      >
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
          custom={0}
        >
          {/* Animated gradient top border */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
            className="mb-4 h-px origin-left md:mb-6"
            style={{
              background:
                "linear-gradient(90deg, #DB2777, #EC4899, #F472B6, #FBCFE8)",
            }}
          />

          <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4 md:gap-x-0">
            {operationMetrics.map((m, i) => (
              <motion.div
                key={m.label}
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
                custom={i * 0.1}
                className={`text-center ${
                  i < operationMetrics.length - 1
                    ? "md:border-r md:border-zinc-200/80 md:dark:border-white/[0.06]"
                    : ""
                }`}
              >
                <span
                  className="block text-[28px] font-medium leading-none tracking-[-0.05em] text-zinc-900 dark:text-white md:text-[40px]"
                  style={FONT}
                >
                  <CountUp value={m.value} suffix={m.suffix} delay={i * 0.15} />
                </span>
                <span
                  className="mt-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-600"
                  style={FONT}
                >
                  {m.label}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 h-px bg-zinc-200/80 dark:bg-white/[0.06] md:mt-6" />
        </motion.div>
      </section>

      {/* ── SECTION 3: Bento Grid — Operations ────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-24">
        <div className="mb-10 md:mb-14">
          <motion.span
            initial={{ opacity: 0.12, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            transition={{ duration: 0.54, ease: EASE }}
            className="text-[12px] font-medium uppercase tracking-[0.26em] text-[#DB2777] dark:text-[#F472B6]"
            style={FONT}
          >
            Operasyon Alanları
          </motion.span>
          <motion.h2
            initial={{ opacity: 0.12, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            transition={{ duration: 0.54, ease: EASE, delay: 0.08 }}
            className="mt-3 text-[24px] font-semibold leading-[1.1] tracking-[-0.02em] text-zinc-900 dark:text-white md:text-[30px]"
            style={FONT}
          >
            Her kanalın ritmi ayrı, kontrol noktası tek.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {operations.map((op, i) => (
            <motion.div
              key={op.title}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
              custom={i * 0.08}
            >
              <GradientBorderCard color={op.color} className="h-full">
                {/* Icon */}
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl text-white"
                  style={{
                    background: `linear-gradient(135deg, ${op.color}, ${op.color}80)`,
                  }}
                >
                  {op.icon}
                </div>

                {/* Subtitle */}
                <span
                  className="block text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600"
                  style={FONT}
                >
                  {op.subtitle}
                </span>

                {/* Title */}
                <h3
                  className="mt-2 text-[20px] font-semibold leading-[1.15] tracking-[-0.02em] text-zinc-900 dark:text-white md:text-[22px]"
                  style={FONT}
                >
                  {op.title}
                </h3>

                {/* Description */}
                <p
                  className="mt-3 text-[14px] leading-[1.7] text-zinc-500 dark:text-zinc-400"
                  style={FONT}
                >
                  {op.desc}
                </p>

                {/* Feature pills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {op.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:border-white/[0.08] dark:text-zinc-500"
                      style={FONT}
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* Metric */}
                <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-white/[0.06]">
                  <span
                    className="text-[28px] font-bold leading-none tracking-[-0.04em] text-zinc-900 dark:text-white"
                    style={FONT}
                  >
                    <CountUp
                      value={op.metric.value}
                      suffix={op.metric.suffix}
                      delay={0.3 + i * 0.1}
                    />
                  </span>
                  <span
                    className="ml-2 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-600"
                    style={FONT}
                  >
                    {op.metric.label}
                  </span>
                </div>
              </GradientBorderCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: Workflow — Dark ────────────────────────────── */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1a0e17_0%,#140c12_100%)] dark:bg-[linear-gradient(180deg,#0f0a0d_0%,#0a0a0a_100%)]" />
        <div className="pointer-events-none absolute left-1/4 top-0 h-[280px] w-[280px] rounded-full bg-[#DB2777]/5 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/3 h-[220px] w-[220px] rounded-full bg-[#9D174D]/6 blur-[80px]" />

        <div className="relative mx-auto max-w-[1200px] px-6">
          <motion.span
            initial={{ opacity: 0.12, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            transition={{ duration: 0.54, ease: EASE }}
            className="text-[12px] font-medium uppercase tracking-[0.26em] text-white/30"
            style={FONT}
          >
            İş Akışımız
          </motion.span>
          <motion.h2
            initial={{ opacity: 0.12, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            transition={{ duration: 0.54, ease: EASE, delay: 0.08 }}
            className="mt-3 text-[24px] font-semibold leading-[1.1] tracking-[-0.02em] text-white md:text-[30px]"
            style={FONT}
          >
            Sürekli dönen bir operasyon çarkı.
          </motion.h2>

          {/* Workflow grid */}
          <div className="relative mt-12 md:mt-16">
            {/* SVG connecting lines — desktop only */}
            <svg
              className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
              preserveAspectRatio="none"
            >
              {/* Horizontal dashed lines between columns */}
              <motion.line
                x1="33%" y1="48px" x2="66%" y2="48px"
                stroke="rgba(244,114,182,0.2)"
                strokeWidth="1"
                strokeDasharray="6 4"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
                transition={{ duration: 1.5, ease: EASE, delay: 0.5 }}
              />
              <motion.line
                x1="66%" y1="48px" x2="100%" y2="48px"
                stroke="rgba(244,114,182,0.15)"
                strokeWidth="1"
                strokeDasharray="6 4"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
                transition={{ duration: 1.5, ease: EASE, delay: 0.8 }}
              />
            </svg>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 md:gap-y-12">
              {workflowSteps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0.12, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
                  transition={{ duration: 0.54, ease: EASE, delay: i * 0.08 }}
                  className="group flex gap-4"
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
                      delay: 0.3 + i * 0.08,
                    }}
                    className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06]"
                  >
                    <span
                      className="text-[13px] font-bold tabular-nums text-[#F472B6]"
                      style={FONT}
                    >
                      {step.num}
                    </span>
                    <div className="pointer-events-none absolute inset-[-4px] rounded-full opacity-0 bg-[#DB2777]/20 blur-[10px] transition-opacity duration-500 group-hover:opacity-100" />
                  </motion.div>

                  <div>
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

      {/* ── SECTION 5: Neden 360° — Expanding Cards — Dark ────────── */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#140c12_0%,#110a0f_100%)] dark:bg-[linear-gradient(180deg,#0a0a0a_0%,#0a0a0a_100%)]" />
        <div className="pointer-events-none absolute right-0 top-1/2 h-[280px] w-[280px] -translate-y-1/2 rounded-full bg-[#DB2777]/4 blur-[80px]" />

        <div className="relative mx-auto max-w-[1200px] px-6">
          <motion.span
            initial={{ opacity: 0.12, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            transition={{ duration: 0.54, ease: EASE }}
            className="text-[12px] font-medium uppercase tracking-[0.26em] text-white/30"
            style={FONT}
          >
            Neden 360°
          </motion.span>
          <motion.h2
            initial={{ opacity: 0.12, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            transition={{ duration: 0.54, ease: EASE, delay: 0.08 }}
            className="mt-3 text-[24px] font-semibold leading-[1.1] tracking-[-0.02em] text-white md:text-[30px]"
            style={FONT}
          >
            Tek çatı altında, tam kontrol.
          </motion.h2>

          <div className="mt-10 flex flex-col gap-3 md:mt-14">
            {advantages.map((adv, i) => (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0.12, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
                transition={{ duration: 0.54, ease: EASE, delay: i * 0.1 }}
              >
                <ExpandingCard
                  title={adv.title}
                  desc={adv.desc}
                  stat={adv.stat}
                  icon={adv.icon}
                  isOpen={openCard === i}
                  onClick={() => setOpenCard(openCard === i ? -1 : i)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: Live Ticker + Testimonials ─────────────────── */}
      <section className="py-16 md:py-24">
        {/* Live ticker */}
        <div className="relative mb-14 overflow-hidden border-y border-zinc-200/60 py-4 dark:border-white/[0.06] md:mb-20">
          <div className="flex animate-[marquee_30s_linear_infinite] gap-4" style={{ willChange: "transform" }}>
            {[...ticker, ...ticker].map((item, i) => (
              <div
                key={`ticker-${i}`}
                className="flex shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-white/[0.06] dark:bg-white/[0.03]"
              >
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                <span
                  className="whitespace-nowrap text-[13px] text-zinc-600 dark:text-zinc-400"
                  style={FONT}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mx-auto max-w-[1200px] px-6">
          <motion.span
            initial={{ opacity: 0.12, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            transition={{ duration: 0.54, ease: EASE }}
            className="text-[12px] font-medium uppercase tracking-[0.26em] text-[#DB2777] dark:text-[#F472B6]"
            style={FONT}
          >
            Müşteri Görüşleri
          </motion.span>
          <motion.h2
            initial={{ opacity: 0.12, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            transition={{ duration: 0.54, ease: EASE, delay: 0.08 }}
            className="mt-3 text-[24px] font-semibold leading-[1.1] tracking-[-0.02em] text-zinc-900 dark:text-white md:text-[30px]"
            style={FONT}
          >
            Markaların güvendiği operasyon.
          </motion.h2>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
                custom={i * 0.1}
                className="rounded-[24px] border border-zinc-100 bg-white p-6 dark:border-white/[0.06] dark:bg-white/[0.02] md:p-8"
              >
                {/* Quote mark */}
                <span
                  className="block select-none text-[40px] font-bold leading-none text-zinc-100 dark:text-white/[0.06]"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <p
                  className="mt-2 text-[15px] leading-[1.7] text-zinc-600 dark:text-zinc-400"
                  style={FONT}
                >
                  {t.text}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#F472B6,#DB2777)] text-[13px] font-bold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <span
                      className="block text-[14px] font-semibold text-zinc-900 dark:text-white"
                      style={FONT}
                    >
                      {t.name}
                    </span>
                    <span
                      className="text-[12px] text-zinc-400 dark:text-zinc-600"
                      style={FONT}
                    >
                      {t.role}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: CTA Banner ─────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0.12, y: 22, scale: 0.99 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
          transition={{ duration: 0.56, ease: EASE }}
          className="relative overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#DB2777_0%,#9D174D_50%,#831843_100%)] p-10 md:p-16"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-[200px] w-[200px] rounded-full bg-white/10 blur-[60px]" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-[200px] w-[200px] rounded-full bg-[#F472B6]/20 blur-[80px]" />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <h2
                className="text-[26px] font-bold leading-[1.1] tracking-[-0.03em] text-white md:text-[34px]"
                style={FONT}
              >
                Operasyonunuzu
                <br />
                kuralım.
              </h2>
              <p
                className="mt-4 max-w-[360px] text-[15px] leading-[1.7] text-white/60"
                style={FONT}
              >
                Dijital operasyonlarınız için bir görüşme ayarlayın.
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
