"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    id: 0,
    title: (
      <>
        <span className="block md:whitespace-nowrap">
          <span className="bg-gradient-to-r from-pink-300 to-pink-400 bg-clip-text text-transparent">old school</span>{" "}
          kalitesini
        </span>
        <span className="block md:whitespace-nowrap">modern dünyaya</span>
        <span className="block">getiriyoruz</span>
      </>
    ),
    description: "Markanı dijitalde büyütmek için strateji, içerik ve operasyonu tek yerde topluyoruz.",
    cta: "Hizmetlerimiz →",
  },
  {
    id: 1,
    title: (
      <>
        <span className="block md:whitespace-nowrap">
          <span className="bg-gradient-to-r from-pink-300 to-pink-400 bg-clip-text text-transparent">markanızı</span>{" "}
          zirveye
        </span>
        <span className="block md:whitespace-nowrap">çıkarmaya hazır</span>
        <span className="block">mısınız?</span>
      </>
    ),
    description: "İhtiyacına uygun paketi dakikalar içinde oluştur ve ekibimizle hemen başla.",
    cta: "Paketi Oluştur →",
  },
];

export default function HeroBanner() {
  const [activeSlide, setActiveSlide] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 2);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full">
      <div className="relative h-[82svh] min-h-[560px] w-full overflow-hidden md:h-[72vh] md:min-h-[540px]">

        {/* ── Arka plan: Slayt 0 — Video ── */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${activeSlide === 0 ? "opacity-100" : "opacity-0"}`}>
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover object-center">
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* ── Arka plan: Slayt 1 — Fotoğraf ── */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${activeSlide === 1 ? "opacity-100" : "opacity-0"}`}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/images/hero-foto-optimized.webp')",
              backgroundSize: "cover",
              backgroundPosition: "left 40%",
              animation: "hero-pan 16s ease-in-out infinite alternate",
            }}
          />
        </div>

        {/* ── Ortak gradient overlay — okunabilirlik ── */}
        <div className="absolute inset-0 z-[5] bg-black/35" />
        <div
          className="absolute inset-0 z-[7]"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.08) 100%)",
          }}
        />

        {/* ── İçerik overlay — her slayt kendi bloğu ── */}
        {slides.map((slide) => (
          <div
            key={`content-${slide.id}`}
            className={`absolute inset-0 z-20 flex flex-col items-center justify-end px-5 pb-36 text-center transition-opacity duration-700 md:items-end md:justify-center md:px-16 md:pb-0 md:pt-20 md:text-right ${
              activeSlide === slide.id
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="hero-text-float flex flex-col items-center md:items-end">
              <h1 className="hero-headline text-center text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-[2.6rem] md:max-w-[18ch] md:text-right md:text-[3.1rem] lg:text-[3.35rem]">
                {slide.title}
              </h1>
              <p className="mt-5 max-w-[30ch] text-base leading-relaxed text-white/85 md:hidden">
                {slide.description}
              </p>
              <button
                type="button"
                className="mt-7 rounded-2xl bg-[#DB2777] px-7 py-3.5 text-lg font-semibold text-white shadow-[0_8px_24px_rgba(219,39,119,0.35)] transition-transform duration-300 active:scale-[0.97] md:hidden"
              >
                {slide.cta}
              </button>
            </div>
          </div>
        ))}

        {/* ── Alt gradient ── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-36 z-10"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)",
          }}
        />

        {/* ── Slide indicator'lar ── */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-24 z-30 flex gap-2 md:left-10 md:translate-x-0">
          {slides.map((slide) => (
            <button
              key={`dot-${slide.id}`}
              type="button"
              aria-label={`Slayt ${slide.id + 1}`}
              onClick={() => setActiveSlide(slide.id)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeSlide === slide.id
                  ? "w-8 bg-pink-300"
                  : "w-2.5 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* ── Alt dalga SVG ── */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
          <svg
            viewBox="0 0 1440 140"
            preserveAspectRatio="none"
            className="block h-14 w-full md:h-20"
            aria-hidden="true"
          >
            <path
              d="M0 38 C220 16 360 82 560 70 C740 58 870 108 1080 88 C1240 72 1320 42 1440 26 V140 H0 Z"
              fill="var(--background)"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
