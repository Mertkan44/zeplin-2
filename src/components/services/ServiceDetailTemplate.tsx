"use client";

import { motion } from "framer-motion";
import { FONT, revealVariants } from "@/lib/motion";
import type { ServiceData } from "@/data/services";
import { getRelatedServices } from "@/data/services";
import { ServiceHero } from "./ServiceHero";
import { RelatedServices } from "./RelatedServices";
import { CTABanner } from "./CTABanner";

/* ══════════════════════════════════════════════════════════════════════
   ORTAK HİZMET DETAY TEMPLATE — 7 BÖLÜM
   ══════════════════════════════════════════════════════════════════════ */

export function ServiceDetailTemplate({ service }: { service: ServiceData }) {
  const related = getRelatedServices(service.relatedSlugs);
  const portfolioItems = [
    { img: service.heroImage, label: `${service.title} / Ana konsept` },
    { img: "/images/generated/service-design-system.webp", label: "Görsel sistem" },
    { img: "/images/generated/service-content-studio.webp", label: "İçerik ritmi" },
    { img: "/images/generated/gallery-production-wall.webp", label: "Teslim paketi" },
  ];

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-[#0a0a0a] dark:text-zinc-100">
      {/* ── Bölüm 1: Hero ──────────────────────────────────────────── */}
      <ServiceHero
        title={service.title}
        description={service.longDesc}
        categoryLabel={service.categoryLabel}
        categorySlug={service.category}
        heroImage={service.heroImage}
      />

      {/* ── Bölüm 2: Ne Sunuyoruz — Özellikler Grid ───────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-24">
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
          custom={0}
          className="mb-10 md:mb-14"
        >
          <span
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-700"
            style={FONT}
          >
            ne sunuyoruz
          </span>
          <h2
            className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-900 dark:text-white md:text-[38px]"
            style={FONT}
          >
            Hizmet Detayları
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {service.features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
              custom={i * 0.08}
              className="group relative overflow-hidden rounded-[24px] border border-zinc-100 bg-zinc-50/80 p-7 transition-all duration-500 hover:border-[#F472B6]/20 hover:shadow-[0_8px_40px_rgba(219,39,119,0.06)] dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-[#9D174D]/30 dark:hover:shadow-[0_8px_40px_rgba(157,23,77,0.08)] md:p-9"
            >
              {/* Accent line */}
              <div className="absolute left-0 top-0 h-full w-[3px] bg-[linear-gradient(180deg,#DB2777_0%,#EC4899_50%,transparent_100%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Step number */}
              <span
                className="mb-4 block text-[13px] font-semibold tabular-nums tracking-[0.1em] text-[#DB2777] dark:text-[#F472B6]"
                style={FONT}
              >
                0{i + 1}
              </span>

              <h3
                className="text-[18px] font-semibold leading-[1.2] tracking-[-0.01em] text-zinc-900 dark:text-white md:text-[20px]"
                style={FONT}
              >
                {feature.title}
              </h3>
              <p
                className="mt-2.5 text-[14px] leading-[1.7] text-zinc-500 dark:text-zinc-400"
                style={FONT}
              >
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bölüm 3: Süreç Adımları — Dark Section ────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1a0e17_0%,#120a10_50%,#1a0e17_100%)]" />

        {/* Decorative blur orbs */}
        <div className="pointer-events-none absolute -left-32 top-1/4 h-[400px] w-[400px] rounded-full bg-[#DB2777]/6 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-1/4 h-[300px] w-[300px] rounded-full bg-[#EC4899]/4 blur-[100px]" />

        <div className="relative mx-auto max-w-[1200px] px-6 py-16 md:py-24">
          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            custom={0}
            className="mb-12 md:mb-16"
          >
            <span
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/30"
              style={FONT}
            >
              çalışma sürecimiz
            </span>
            <h2
              className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-white md:text-[38px]"
              style={FONT}
            >
              Nasıl Çalışıyoruz?
            </h2>
          </motion.div>

          {/* Process steps */}
          <div className="relative">
            {/* Connecting line — desktop */}
            <div className="pointer-events-none absolute left-0 right-0 top-[28px] hidden h-[1px] bg-gradient-to-r from-transparent via-[#DB2777]/20 to-transparent md:block" />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-6">
              {service.process.map((step, i) => (
                <motion.div
                  key={step.step}
                  variants={revealVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
                  custom={i * 0.1}
                  className="relative flex flex-col items-start md:items-center md:text-center"
                >
                  {/* Number circle */}
                  <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#DB2777]/30 bg-[#DB2777]/10 backdrop-blur-sm">
                    <span
                      className="text-[14px] font-bold tabular-nums text-[#F472B6]"
                      style={FONT}
                    >
                      {step.step}
                    </span>
                  </div>

                  <h3
                    className="text-[17px] font-semibold tracking-[-0.01em] text-white"
                    style={FONT}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="mt-2 max-w-[28ch] text-[13px] leading-[1.65] text-white/45"
                    style={FONT}
                  >
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bölüm 4: Portfolyo / Örnek İşler ──────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-24">
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
          custom={0}
          className="mb-10 md:mb-14"
        >
          <span
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-700"
            style={FONT}
          >
            uygulama alanları
          </span>
          <h2
            className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-900 dark:text-white md:text-[38px]"
            style={FONT}
          >
            Bu hizmet nerede görünür?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {portfolioItems.map((item, i) => (
            <motion.div
              key={item.label}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
              custom={i * 0.08}
              className="group relative aspect-[4/3] overflow-hidden rounded-[24px]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                style={{ backgroundImage: `url('${item.img}')` }}
              />
              <div className="absolute inset-0 bg-black/20 transition-all duration-500 group-hover:bg-black/40" />
              <div className="absolute inset-x-0 bottom-0 flex items-end p-6">
                <span
                  className="text-[14px] font-semibold text-white opacity-100 transition-all duration-400 md:opacity-0 md:group-hover:opacity-100"
                  style={FONT}
                >
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bölüm 5: CTA Mid-page ─────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 pb-6 pt-2 md:pb-8 md:pt-4">
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
          custom={0}
        >
          <div className="overflow-hidden rounded-[28px] border border-[#F9A8D4]/50 bg-[linear-gradient(180deg,#FBCFE8_0%,#F9A8D4_100%)] shadow-[0_24px_70px_rgba(219,39,119,0.14)] dark:border-[#9D174D]/30 dark:bg-[linear-gradient(180deg,#9D174D_0%,#831843_100%)] dark:shadow-[0_24px_70px_rgba(157,23,77,0.25)]">
            <div className="grid md:min-h-[380px] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              {/* Left panel */}
              <div className="bg-[linear-gradient(180deg,#2a1525_0%,#1f0c18_100%)] px-7 py-8 text-white dark:bg-[linear-gradient(180deg,#1a0e17_0%,#120a10_100%)] md:px-14 md:py-14">
                <span
                  className="text-[12px] font-medium uppercase tracking-[0.26em] text-white/35"
                  style={FONT}
                >
                  {service.categoryLabel}
                </span>
                <h2
                  className="mt-6 text-[2rem] font-semibold leading-[1] tracking-[-0.04em] text-white md:text-[3.2rem]"
                  style={FONT}
                >
                  Bu hizmetten
                  <br />
                  <span className="text-[#EC4899] dark:text-[#F472B6]">
                    faydalanın.
                  </span>
                </h2>
                <p
                  className="mt-6 max-w-[30ch] text-[15px] leading-[1.7] text-white/50 md:text-[16px]"
                  style={FONT}
                >
                  {service.shortDesc} — markanızı bir adım öne taşıyalım.
                </p>

                <a
                  href="https://wa.me/905459407690"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 inline-flex items-center gap-2 text-[14px] font-semibold text-[#F472B6] transition-all duration-300 hover:gap-3"
                  style={FONT}
                >
                  teklif al
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

              {/* Right visual */}
              <div className="relative min-h-[240px] overflow-hidden border-t border-white/8 md:min-h-full md:border-l md:border-t-0 md:border-white/8">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${service.heroImage}')` }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(31,12,24,0.72)_0%,rgba(31,12,24,0.12)_55%,rgba(31,12,24,0)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_34%)]" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Bölüm 6: İlgili Hizmetler ─────────────────────────────── */}
      <RelatedServices services={related} />

      {/* ── Bölüm 7: İletişim Banner ──────────────────────────────── */}
      <CTABanner />
    </main>
  );
}
