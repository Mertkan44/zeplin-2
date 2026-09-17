"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

const stars = [
  { left: "8%", top: "16%", size: 2, delay: 0 },
  { left: "18%", top: "34%", size: 3, delay: 0.4 },
  { left: "83%", top: "20%", size: 2, delay: 0.8 },
  { left: "92%", top: "42%", size: 3, delay: 1.2 },
  { left: "12%", top: "58%", size: 2, delay: 1.6 },
  { left: "88%", top: "60%", size: 2, delay: 0.2 },
  { left: "26%", top: "12%", size: 2, delay: 1.0 },
  { left: "74%", top: "10%", size: 3, delay: 0.6 },
  { left: "5%", top: "45%", size: 2, delay: 1.4 },
  { left: "95%", top: "72%", size: 2, delay: 0.9 },
];

const RIDGE_PATH =
  "M0,140 L80,92 L160,132 L240,64 L340,124 L420,44 L520,114 L620,72 L720,132 L820,52 L920,104 L1020,152 L1120,82 L1220,140 L1320,102 L1440,150";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[86vh] w-full flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-6 py-24 text-center">
      {/* ── Atmosfer: glow + yıldızlar ───────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-[14%] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[#DB2777]/20 blur-[130px]" />
        {stars.map((star, i) => (
          <span
            key={i}
            className="notfound-star absolute rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── Radar + zeplin ───────────────────────────────────────── */}
      <div className="relative z-10 mb-6 flex h-28 w-28 items-center justify-center">
        <span className="notfound-radar-ring" style={{ animationDelay: "0s" }} />
        <span className="notfound-radar-ring" style={{ animationDelay: "1s" }} />
        <span className="notfound-radar-ring" style={{ animationDelay: "2s" }} />
        <div className="notfound-airship relative z-10">
          <Image src="/zeplin-logo.png" alt="" width={68} height={68} priority />
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.span
          variants={item}
          className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-pink-300/80"
        >
          <span aria-hidden>↳</span> rota bulunamadı
        </motion.span>

        <motion.h1
          variants={item}
          className="bg-gradient-to-r from-pink-300 via-pink-400 to-[#DB2777] bg-clip-text text-[6rem] font-bold leading-none tracking-tight text-transparent sm:text-[8.5rem]"
        >
          404
        </motion.h1>

        <motion.h2 className="mt-4 max-w-xl text-2xl font-semibold leading-snug text-white sm:text-3xl" variants={item}>
          Zeplinimiz{" "}
          <em
            style={{
              fontFamily: "var(--font-instrument), serif",
              fontStyle: "italic",
              color: "#F472B6",
            }}
          >
            bu sayfayı
          </em>{" "}
          bulamadı
        </motion.h2>

        <motion.p variants={item} className="mt-4 max-w-md text-base text-white/60">
          Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir. Merak etmeyin, sizi güvenle ana rotaya geri götürelim.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-2xl bg-[#DB2777] px-8 py-3.5 text-base font-semibold text-white shadow-[0_8px_24px_rgba(219,39,119,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(219,39,119,0.45)]"
          >
            ana sayfaya dön →
          </Link>
          <Link
            href="/hizmetler"
            className="text-sm font-medium text-white/70 underline decoration-white/25 underline-offset-4 transition-colors hover:text-pink-300"
          >
            hizmetlerimize göz atın
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Dağ silueti + parlayan sırt çizgisi ──────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-0">
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="block h-40 w-full sm:h-52">
          <defs>
            <linearGradient id="notfoundRidgeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#DB2777" stopOpacity="0" />
              <stop offset="45%" stopColor="#F472B6" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#EC4899" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#9D174D" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${RIDGE_PATH} L1440,220 L0,220 Z`} fill="#141115" />
          <path
            d={RIDGE_PATH}
            fill="none"
            stroke="url(#notfoundRidgeGradient)"
            strokeWidth="2"
            className="notfound-ridge-glow"
          />
        </svg>
      </div>
    </main>
  );
}
