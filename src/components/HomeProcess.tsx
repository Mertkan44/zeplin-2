"use client";

/*
 * "Nasıl çalışıyoruz": kaydırmayla ilerleyen zaman çizgisi.
 * Bölüm ekranda ilerledikçe adımların üstündeki çizgi pembe dolar (mobilde soldaki dikey çizgi);
 * dolum bir adıma ulaşınca o adım yanar: büyük numara pembeleşir, metin sönükten tam parlaklığa geçer.
 * Sabitleme yok, sayfa akışı bozulmaz. Hareket azaltıldığında her şey baştan dolu.
 */

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { FONT, revealVariants, revealViewport } from "@/lib/motion";

const STEPS = [
  { title: "Tanışma & brief", desc: "İhtiyacınızı, hedefinizi ve elinizdeki malzemeyi dinliyoruz." },
  { title: "Plan & teklif", desc: "Kapsamı, teslim edilecekleri ve takvimi netleştirip yazılı olarak paylaşıyoruz." },
  { title: "Üretim", desc: "Çekim, tasarım, metin ya da geliştirme; ara onaylarla ilerliyoruz." },
  { title: "Teslim & değerlendirme", desc: "Dosyaları kullanıma hazır teslim ediyor, sonucu birlikte değerlendiriyoruz." },
];

const REDUCED = "(prefers-reduced-motion: reduce)";
const useReducedMotion = () =>
  useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(REDUCED);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );

const clamp = (v: number) => Math.max(0, Math.min(1, v));

export default function HomeProcess() {
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const [scrollP, setScrollP] = useState(0);

  /* İlerleme: liste ekranın %85'ine girince başlar, %30'una çıkınca dolar */
  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = listRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const start = vh * 0.85;
        const end = vh * 0.3;
        // Masaüstünde liste kısa: üst kenarına bakılır. Mobilde uzun: ortasına bakılır.
        const anchor = r.height > vh * 0.5 ? r.top + r.height * 0.5 : r.top;
        setScrollP(clamp((start - anchor) / (start - end)));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [reduced]);

  const p = reduced ? 1 : scrollP;
  const reached = (i: number) => p >= i / STEPS.length + 0.02 || p >= 0.999;

  return (
    <section aria-labelledby="home-process-title" className="px-3 py-[var(--home-space)] md:px-5">
      {/* Koyu yüzey ekran boyunca bant gibi uzanır; içerik sayfanın diğer bölümleriyle aynı hizada kalır */}
      <div className="rounded-[28px] bg-[#111116] px-3 py-14 text-white dark:bg-[#17171C] dark:ring-1 dark:ring-white/10 md:rounded-[36px] md:px-7 md:py-20">
        <div className="mx-auto max-w-6xl px-3 md:px-0">
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          custom={0}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#F472B6]" style={FONT}>
              Nasıl çalışıyoruz
            </p>
            <h2 id="home-process-title" className="mt-3 text-[30px] font-semibold leading-[1.08] tracking-[-0.02em] md:text-[44px]" style={FONT}>
              Başlayınca ne olacağını bilin.
            </h2>
          </div>
          <Link
            href="/iletisim"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#DB2777] px-6 py-3.5 text-[15px] font-semibold text-white transition-[background-color,scale] duration-[var(--dur-2)] hover:bg-[#BE185D] active:scale-[0.98]"
            style={FONT}
          >
            Projeni Anlat
            <span aria-hidden="true" className="inline-block transition-transform duration-[var(--dur-2)] group-hover:translate-x-1">
              →
            </span>
          </Link>
        </motion.div>

        <ol ref={listRef} className="relative mt-12 grid gap-10 pl-8 md:mt-16 lg:grid-cols-4 lg:gap-8 lg:pl-0 lg:pt-10">
          {/* Çizgi: mobilde solda dikey, masaüstünde üstte yatay */}
          <span aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-[2px] rounded-full bg-white/10 lg:inset-x-0 lg:bottom-auto lg:top-0 lg:h-[2px] lg:w-auto" />
          {/* Dolum ve nokta konumu --p ile (globals.css: .process-fill / .process-dot) */}
          <span
            aria-hidden="true"
            className="process-fill absolute left-[5px] top-2 bottom-2 w-[2px] rounded-full bg-[#DB2777] lg:inset-x-0 lg:bottom-auto lg:top-0 lg:h-[2px] lg:w-auto"
            style={{ ["--p" as string]: p }}
          />
          <span
            aria-hidden="true"
            className="process-dot absolute h-3 w-3 rounded-full bg-[#F472B6] shadow-[0_0_0_6px_rgba(244,114,182,0.18),0_0_24px_rgba(244,114,182,0.7)]"
            style={{ ["--p" as string]: p, opacity: p > 0.01 && p < 0.999 ? 1 : 0 }}
          />

          {STEPS.map((step, i) => {
            const on = reached(i);
            return (
              <li key={step.title} className="relative">
                {/* Mobil: çizgi üzerindeki adım noktası */}
                <span
                  aria-hidden="true"
                  className={`absolute -left-8 top-[18px] h-3 w-3 rounded-full border-2 transition-colors duration-[var(--dur-3)] lg:hidden ${on ? "border-[#DB2777] bg-[#DB2777]" : "border-white/25 bg-[#111116] dark:bg-[#17171C]"}`}
                />
                <span
                  className={`block text-[56px] font-semibold leading-none tracking-[-0.04em] tabular-nums transition-colors duration-[var(--dur-4)] md:text-[72px] ${on ? "text-[#F472B6]" : "text-white/[0.12]"}`}
                  style={FONT}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={`mt-4 text-[19px] font-semibold transition-colors duration-[var(--dur-4)] ${on ? "text-white" : "text-white/40"}`} style={FONT}>
                  {step.title}
                </h3>
                <p className={`mt-2 max-w-[30ch] text-[15px] leading-[1.6] transition-colors duration-[var(--dur-4)] ${on ? "text-white/70" : "text-white/30"}`}>
                  {step.desc}
                </p>
              </li>
            );
          })}
        </ol>
        </div>
      </div>
    </section>
  );
}
