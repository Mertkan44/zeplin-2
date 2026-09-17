"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { useReliableInView } from "@/lib/motion";

/* ── Types ────────────────────────────────────────────────────────── */
interface VideoTestimonial {
  id: string;
  videoSrc: string;
  posterSrc: string;
  brandName: string;
  personName: string;
  personRole: string;
}

interface VideoTestimonialsProps {
  testimonials: VideoTestimonial[];
}

/* ── Constants ────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FONT = { fontFamily: "var(--font-jost), sans-serif" } as const;

const revealVariants = {
  hidden: { opacity: 0.16, y: 24, scale: 0.99 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.52, ease: EASE, delay },
  }),
};

const zeplinMetrics = [
  {
    to: 38,
    decimals: 0,
    suffix: "+",
    label: "aktif marka",
    desc: "tek ekip içinde strateji, içerik ve yayın akışı",
  },
  {
    to: 1.8,
    decimals: 1,
    suffix: "M+",
    label: "aylık erişim",
    desc: "organik ve reklamlı kampanyalarda birleşik görünürlük",
  },
  {
    to: 92,
    decimals: 0,
    suffix: "%",
    label: "teslim ritmi",
    desc: "revizyon, prodüksiyon ve yayın takvimlerinde disiplin",
  },
  {
    to: 4.7,
    decimals: 1,
    suffix: "x",
    label: "etkileşim artışı",
    desc: "markaya özel format testleri ve içerik ritmiyle",
  },
];

const [primaryMetric, ...supportingMetrics] = zeplinMetrics;

function restartVideo(video: HTMLVideoElement | null) {
  if (!video) return;

  try {
    video.currentTime = 0;
  } catch {
    video.load();
  }

  void video.play().catch(() => {
    // Browsers can block autoplay with sound; controls remain available.
  });
}

/* ── Impact card helpers ──────────────────────────────────────────── */
function CountUp({
  to,
  suffix = "",
  decimals = 0,
  inView,
  delay = 0,
}: {
  to: number;
  suffix?: string;
  decimals?: number;
  inView: boolean;
  delay?: number;
}) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => v.toFixed(decimals));
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      mv.set(to);
      return;
    }
    const controls = animate(mv, to, { duration: 1.6, delay, ease: EASE });
    return () => controls.stop();
  }, [inView, to, delay, reduceMotion, mv]);

  return (
    <>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </>
  );
}

function PulseDot() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      className="mr-2.5 inline-block h-1.5 w-1.5 rounded-full bg-[#F472B6] align-middle"
      animate={
        reduceMotion
          ? { scale: 1, opacity: 0.85 }
          : { scale: [1, 1.4, 1], opacity: [0.55, 1, 0.55] }
      }
      transition={
        reduceMotion
          ? undefined
          : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
      }
    />
  );
}

/* ── Play Icon ────────────────────────────────────────────────────── */
function PlayIcon({ size = 56 }: { size?: number }) {
  return (
    <div
      className="video-play-icon flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: "rgba(0,0,0,0.5)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      <svg
        width={size * 0.36}
        height={size * 0.36}
        viewBox="0 0 24 24"
        fill="white"
        style={{ marginLeft: size * 0.04 }}
      >
        <path d="M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86A1 1 0 008 5.14z" />
      </svg>
    </div>
  );
}

/* ── Video Card ───────────────────────────────────────────────────── */
function VideoCard({
  testimonial,
  index,
  onClick,
  setVideoRef,
}: {
  testimonial: VideoTestimonial;
  index: number;
  onClick: () => void;
  setVideoRef: (video: HTMLVideoElement | null) => void;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
      custom={index * 0.1}
      className={index === 1 ? "flex-shrink-0 md:mt-10" : "flex-shrink-0"}
    >
      <button
        type="button"
        onClick={onClick}
        className="video-card group relative block w-full overflow-hidden rounded-[24px] shadow-[0_22px_58px_rgba(15,10,13,0.18)] transition-transform duration-300 hover:-translate-y-1 md:rounded-[30px]"
        style={{ aspectRatio: "9 / 16" }}
      >
        <video
          ref={setVideoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={testimonial.posterSrc}
          aria-label={`${testimonial.brandName} video`}
        >
          <source src={testimonial.videoSrc} type="video/mp4" />
        </video>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 40%, transparent 60%)",
          }}
        />

        {/* Play icon — centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="md:opacity-80 md:transition-all md:duration-[380ms] md:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)] md:group-hover:opacity-100 md:group-hover:scale-110">
            <PlayIcon size={48} />
          </div>
        </div>

        {/* Brand info — bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p
            className="text-[15px] font-bold text-white"
            style={FONT}
          >
            {testimonial.brandName}
          </p>
          <p
            className="mt-0.5 text-[12px] text-white/60"
            style={FONT}
          >
            {testimonial.personName} &middot; {testimonial.personRole}
          </p>
        </div>

        {/* Card shadow — multi-layer, no borders */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl md:rounded-3xl"
          style={{
            boxShadow: isDark
              ? "inset 0 0 0 1px rgba(255,255,255,0.10), 0 18px 48px rgba(0,0,0,0.45)"
              : "inset 0 0 0 1px rgba(255,255,255,0.18), inset 0 -80px 90px rgba(0,0,0,0.22)",
          }}
        />
      </button>
    </motion.div>
  );
}

/* ── Fullscreen Video Overlay ─────────────────────────────────────── */
function VideoOverlay({
  testimonial,
  onClose,
}: {
  testimonial: VideoTestimonial;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  /* Body scroll lock + Escape key */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  /* Autoplay when overlay opens */
  useEffect(() => {
    restartVideo(videoRef.current);
  }, []);

  return (
    <>
      {/* Scrim — NO backdrop-blur */}
      <motion.button
        type="button"
        aria-label="Kapat"
        className="fixed inset-0 z-[72] bg-black/85"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        onClick={onClose}
      />

      {/* Centered panel */}
      <motion.div
        className="fixed inset-0 z-[73] flex items-center justify-center px-4 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative flex w-full flex-col items-center"
          style={{
            maxWidth:
              "min(420px, calc(56.25dvh - 4.5rem), calc(100vw - 2rem))",
          }}
          initial={{ scale: 0.88, y: 32, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 290, damping: 26 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${testimonial.brandName} video`}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="absolute right-3 top-3 z-10 grid h-9 w-9
                       place-items-center rounded-full border border-white/20
                       bg-black/45 text-white text-sm shadow-[0_8px_24px_rgba(0,0,0,0.35)]
                       hover:bg-black/60 transition-colors"
          >
            &#x2715;
          </button>

          <div className="w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "9 / 16" }}>
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              playsInline
              preload="auto"
              controls
            >
              <source src={testimonial.videoSrc} type="video/mp4" />
            </video>
          </div>

          {/* Brand info below */}
          <motion.div
            className="mt-3 text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: EASE, delay: 0.09 }}
          >
            <p
              className="text-base font-bold text-white"
              style={FONT}
            >
              {testimonial.brandName}
            </p>
            <p
              className="text-sm text-white/50"
              style={FONT}
            >
              {testimonial.personName} &middot; {testimonial.personRole}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}

/* ── Main Section ─────────────────────────────────────────────────── */
export default function VideoTestimonials({
  testimonials,
}: VideoTestimonialsProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selected, setSelected] = useState<VideoTestimonial | null>(null);
  const previewVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const visibleTestimonials = testimonials.slice(0, 2);

  const impactRef = useRef<HTMLDivElement>(null);
  const impactInView = useReliableInView(impactRef);

  const handleClose = useCallback(() => setSelected(null), []);

  const handleOpen = useCallback((testimonial: VideoTestimonial) => {
    restartVideo(previewVideoRefs.current[testimonial.id] ?? null);
    setSelected(testimonial);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <section
        className="relative overflow-hidden px-4 py-12 md:px-12 md:py-16"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 70% 55% at 72% 45%, rgba(157,23,77,0.08) 0%, transparent 68%)"
            : "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(253,242,248,0.58) 48%, rgba(255,255,255,0) 100%)",
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(420px,0.82fr)_minmax(420px,0.78fr)] lg:items-center lg:gap-20 xl:gap-24">
          <div className="lg:pt-3">
            <motion.div
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
              custom={0}
              className="mb-6 text-center md:mb-7 md:text-left"
            >
              <span
                className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#DB2777] dark:text-[#F472B6] md:text-[12px] md:tracking-[0.26em]"
                style={FONT}
              >
                Referanslar
              </span>
              <h2
                className="mt-2 text-[30px] font-semibold leading-[1.04] text-zinc-900 dark:text-white md:text-[44px]"
                style={FONT}
              >
                Markalar ne diyor?
              </h2>
            </motion.div>

            <div className="grid max-w-[620px] grid-cols-2 items-start gap-3 sm:gap-5">
              {visibleTestimonials.map((t, i) => (
                <VideoCard
                  key={t.id}
                  testimonial={t}
                  index={i}
                  onClick={() => handleOpen(t)}
                  setVideoRef={(video) => {
                    previewVideoRefs.current[t.id] = video;
                  }}
                />
              ))}
            </div>
          </div>

          <motion.div
            ref={impactRef}
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            custom={0.08}
            className="relative w-full max-w-[600px] lg:pl-6 xl:pl-10"
          >
            <div className="relative overflow-hidden rounded-[24px] shadow-[0_24px_60px_rgba(219,39,119,0.12)] md:rounded-[28px] dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
              {/* DARK HERO */}
              <div
                className="relative overflow-hidden px-5 pb-6 pt-6 sm:px-7 sm:pb-8 sm:pt-7 md:px-9 md:pb-9 md:pt-8"
                style={{
                  background:
                    "linear-gradient(135deg, #2A0D1E 0%, #1A0612 55%, #0A0205 100%)",
                }}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full opacity-60 blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(244,114,182,0.32), transparent 70%)",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 top-12 h-64 w-64 rounded-full opacity-30 blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(219,39,119,0.4), transparent 70%)",
                  }}
                />

                <motion.div
                  variants={revealVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
                  custom={0.12}
                  className="relative text-center md:text-left"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="flex items-center text-[10px] font-medium uppercase tracking-[0.26em] text-[#F9A8D4] sm:text-[11px]"
                      style={FONT}
                    >
                      <PulseDot />
                      Zeplin etkisi
                    </span>
                    <span
                      className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/45 sm:text-[11px]"
                      style={FONT}
                    >
                      2026
                      <span className="mx-1.5 text-white/25">/</span>
                      Q2
                    </span>
                  </div>

                  <div className="mt-5 flex items-end justify-center gap-4 sm:mt-7 sm:gap-5 md:justify-start">
                    <p
                      className="text-[58px] font-semibold leading-[0.88] tabular-nums sm:text-[84px] md:text-[104px]"
                      style={{
                        ...FONT,
                        background:
                          "linear-gradient(180deg, #EC4899 0%, #F9A8D4 60%, #FCE7F3 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        color: "transparent",
                      }}
                    >
                      <CountUp
                        to={primaryMetric.to}
                        decimals={primaryMetric.decimals}
                        suffix={primaryMetric.suffix}
                        inView={impactInView}
                        delay={0.2}
                      />
                    </p>
                    <div className="flex items-center gap-2.5 pb-2 sm:gap-3 sm:pb-3">
                      <div className="h-7 w-px bg-white/25" />
                      <span
                        className="text-[9px] font-semibold uppercase leading-tight tracking-[0.22em] text-white/70 sm:text-[10px]"
                        style={FONT}
                      >
                        aktif
                        <br />
                        marka
                      </span>
                    </div>
                  </div>

                  <h3
                    className="mx-auto mt-5 max-w-[18ch] text-[20px] font-semibold leading-[1.08] text-white sm:text-[24px] md:mx-0 md:text-[28px]"
                    style={FONT}
                  >
                    markayla{" "}
                    <em
                      style={{
                        fontFamily:
                          "'Instrument Serif', Georgia, 'Times New Roman', serif",
                        fontWeight: 400,
                        fontStyle: "italic",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      aynı anda
                    </em>{" "}
                    yürüyen ritim
                  </h3>
                </motion.div>
              </div>

              {/* LIGHT CONTENT */}
              <div className="relative bg-white px-5 py-6 text-center sm:px-7 sm:py-7 md:px-9 md:py-8 md:text-left dark:bg-[#160510]">
                <p
                  className="mx-auto max-w-[46ch] text-[12.5px] leading-relaxed text-zinc-600 sm:text-[13px] md:mx-0 dark:text-white/55"
                  style={FONT}
                >
                  Strateji, üretim, revizyon ve yayın akışını tek bir ekip içinde sakin bir düzende topluyoruz.
                </p>

                <div className="mt-5 grid gap-5 sm:grid-cols-3 sm:gap-4 md:mt-6 md:gap-5">
                  {supportingMetrics.map((metric, i) => (
                    <motion.div
                      key={metric.label}
                      variants={revealVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
                      custom={0.2 + i * 0.07}
                      className="min-w-0"
                    >
                      <span
                        className="text-[10px] font-semibold tabular-nums tracking-[0.18em] text-[#DB2777] dark:text-[#F472B6]"
                        style={FONT}
                      >
                        0{i + 1}
                      </span>
                      <p
                        className="mt-2 text-[22px] font-semibold leading-none tracking-[-0.04em] text-zinc-950 tabular-nums sm:text-[24px] md:text-[26px] dark:text-white"
                        style={FONT}
                      >
                        <CountUp
                          to={metric.to}
                          decimals={metric.decimals}
                          suffix={metric.suffix}
                          inView={impactInView}
                          delay={0.35 + i * 0.08}
                        />
                      </p>
                      <p
                        className="mt-2.5 text-[11.5px] font-semibold leading-tight text-zinc-900 dark:text-white/85"
                        style={FONT}
                      >
                        {metric.label}
                      </p>
                      <p
                        className="mt-1.5 text-[11.5px] leading-relaxed text-zinc-500 dark:text-white/45"
                        style={FONT}
                      >
                        {metric.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <VideoOverlay
            key={selected.id}
            testimonial={selected}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
