"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE, FONT, revealVariants } from "@/lib/motion";
import type { ServiceData } from "@/data/services";
import { getRelatedServices } from "@/data/services";
import { ServiceHero } from "./ServiceHero";
import { RelatedServices } from "./RelatedServices";
import { CTABanner } from "./CTABanner";

/* ── Showreel Videos (vertical/portrait) ──────────────────────────── */
const showreelVideos = [
  { id: "reel1", title: "Mekan Hikayesi", client: "Babi Restaurant", img: "/images/projects-babi-cover.webp" },
  { id: "reel2", title: "Menü Ritmi", client: "Milo Restaurant", img: "/images/projects-milo-cover.webp" },
  { id: "reel3", title: "Set Akışı", client: "Prodüksiyon", img: "/images/generated/service-video-production.webp" },
  { id: "reel4", title: "Kampanya Filmi", client: "Ritim Jewellery", img: "/images/projects-ritim-jewellery-cover.webp" },
  { id: "reel5", title: "Kurumsal Kesit", client: "Zeplin Media", img: "/images/generated/gallery-production-wall.webp" },
];

/* ── Video Types ──────────────────────────────────────────────────── */
const videoTypes = [
  {
    id: "tanitim",
    title: "Tanıtım Filmi",
    desc: "Markanızın hikayesini güçlü bir anlatımla aktaran profesyonel prodüksiyon. Kurumsal kimliğinizi, değerlerinizi ve vizyonunuzu sinematik bir dille hedef kitlenize ulaştırıyoruz.",
    duration: "2-5 dk",
    img: "/images/generated/service-video-production.webp",
  },
  {
    id: "reels",
    title: "Reels & Shorts",
    desc: "Instagram Reels, YouTube Shorts ve TikTok için trend odaklı, viral potansiyelli kısa video içerikleri. Hızlı prodüksiyon, yüksek etki.",
    duration: "15-60 sn",
    img: "/images/projects-babi-cover.webp",
  },
  {
    id: "reklam",
    title: "Reklam Spotu",
    desc: "Dijital platformlar için dönüşüm odaklı reklam videoları. Facebook, Instagram, YouTube ve TikTok Ads formatlarına uygun profesyonel içerik.",
    duration: "15-30 sn",
    img: "/images/projects-ritim-jewellery-cover.webp",
  },
  {
    id: "motion",
    title: "Motion Graphics",
    desc: "2D/3D animasyon ve hareketli grafiklerle karmaşık konseptleri görsel olarak anlatıyoruz. Logo animasyonlarından explainer videolara kadar.",
    duration: "30sn - 3dk",
    img: "/images/generated/service-ai-automation.webp",
  },
];

/* ── Production equipment / capabilities ──────────────────────────── */
const equipmentFeatures = [
  { title: "4K & 6K Çekim", desc: "Sinema kalitesinde kamera sistemleri" },
  { title: "Drone Çekim", desc: "Havadan profesyonel görüntüler" },
  { title: "Profesyonel Işık", desc: "Stüdyo ve lokasyon aydınlatma setleri" },
  { title: "Ses Kayıt", desc: "Stüdyo kalitesinde ses ve seslendirme" },
  { title: "Renk Düzenleme", desc: "DaVinci Resolve ile sinematik renk" },
  { title: "VFX & Compositing", desc: "Görsel efekt ve kompozisyon" },
];

/* ══════════════════════════════════════════════════════════════════════
   VIDEO SERVICE PAGE
   ══════════════════════════════════════════════════════════════════════ */

export function VideoServicePage({ service }: { service: ServiceData }) {
  const related = getRelatedServices(service.relatedSlugs);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-[#0a0a0a] dark:text-zinc-100">
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <ServiceHero
        title={service.title}
        description={service.longDesc}
        categoryLabel={service.categoryLabel}
        categorySlug={service.category}
        heroImage={service.heroImage}
      />

      {/* ── Bölüm 2: Video Showcase ────────────────────────────────── */}
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
            showreel
          </span>
          <h2
            className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-900 dark:text-white md:text-[38px]"
            style={FONT}
          >
            İşlerimizden Örnekler
          </h2>
        </motion.div>

        {/* Vertical video reels grid */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:pb-0">
          {showreelVideos.map((vid, i) => (
            <motion.div
              key={vid.id}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
              custom={i * 0.07}
              className="group relative w-[200px] flex-shrink-0 cursor-pointer overflow-hidden rounded-[20px] md:w-auto"
              style={{ aspectRatio: "9/16" }}
            >
              {/* BG image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                style={{ backgroundImage: `url('${vid.img}')` }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(15,10,13,0.85)_75%)] transition-all duration-500 group-hover:bg-[linear-gradient(180deg,transparent_30%,rgba(15,10,13,0.75)_75%)]" />

              {/* Play icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur-sm transition-all duration-400 group-hover:opacity-100 group-hover:scale-110">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="ml-0.5">
                    <path d="M8 5.14v14l11-7-11-7z" />
                  </svg>
                </div>
              </div>

              {/* Bottom info */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span
                  className="block text-[14px] font-semibold leading-tight text-white"
                  style={FONT}
                >
                  {vid.title}
                </span>
                <span className="mt-1 block text-[11px] text-white/50" style={FONT}>
                  {vid.client}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bölüm 3: Video Türleri Kartları ────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-10 md:py-16">
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
            video türleri
          </span>
          <h2
            className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-900 dark:text-white md:text-[38px]"
            style={FONT}
          >
            Ne Üretiyoruz?
          </h2>
        </motion.div>

        {/* Video type cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {videoTypes.map((vt, i) => (
            <motion.div
              key={vt.id}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
              custom={i * 0.08}
              className="group relative cursor-pointer overflow-hidden rounded-[24px] border border-transparent transition-[border-color,box-shadow] duration-500 hover:border-[#F472B6]/20 hover:shadow-[0_8px_40px_rgba(219,39,119,0.1)] dark:hover:border-[#9D174D]/30 dark:hover:shadow-[0_8px_40px_rgba(157,23,77,0.12)]"
              style={{ minHeight: "340px" }}
              onClick={() => setActiveVideo(activeVideo === vt.id ? null : vt.id)}
            >
              {/* BG image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                style={{ backgroundImage: `url('${vt.img}')` }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_5%,rgba(15,10,13,0.9)_62%)] transition-all duration-500 group-hover:bg-[linear-gradient(180deg,transparent_5%,rgba(15,10,13,0.82)_62%)]" />

              {/* Content */}
              <div className="relative flex h-full min-h-[340px] flex-col justify-end p-7 md:p-8">
                {/* Duration badge */}
                <span className="mb-3 inline-block w-fit rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-medium tabular-nums tracking-[0.06em] text-white/70 backdrop-blur-sm">
                  {vt.duration}
                </span>

                <h4
                  className="text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] text-white md:text-[26px]"
                  style={FONT}
                >
                  {vt.title}
                </h4>

                {/* Expandable description */}
                <AnimatePresence>
                  {activeVideo === vt.id ? (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="mt-2 max-w-[40ch] overflow-hidden text-[14px] leading-[1.65] text-white/55"
                      style={FONT}
                    >
                      {vt.desc}
                    </motion.p>
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 max-w-[40ch] text-[14px] leading-[1.6] text-white/45 line-clamp-2"
                    >
                      {vt.desc}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bölüm 4: Prodüksiyon Süreci — Dark Section ─────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1a0e17_0%,#120a10_50%,#1a0e17_100%)]" />
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
              prodüksiyon süreci
            </span>
            <h2
              className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-white md:text-[38px]"
              style={FONT}
            >
              Fikirden Finale
            </h2>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            <div className="pointer-events-none absolute left-0 right-0 top-[28px] hidden h-[1px] bg-gradient-to-r from-transparent via-[#DB2777]/20 to-transparent md:block" />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-4">
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
                    className="mt-2 max-w-[24ch] text-[13px] leading-[1.65] text-white/45"
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

      {/* ── Bölüm 5: Ekipman & Yetenekler ─────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
          {/* Left — Image */}
          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            custom={0}
            className="relative aspect-[4/5] overflow-hidden rounded-[28px] md:aspect-auto md:min-h-[480px]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/dag-optimized.webp')" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(15,10,13,0.6)_100%)]" />
          </motion.div>

          {/* Right — Features */}
          <div className="flex flex-col justify-center">
            <motion.div
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
              custom={0}
              className="mb-8"
            >
              <span
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-700"
                style={FONT}
              >
                ekipman & yetenek
              </span>
              <h2
                className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-900 dark:text-white md:text-[34px]"
                style={FONT}
              >
                Profesyonel Altyapı
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {equipmentFeatures.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  variants={revealVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
                  custom={i * 0.06}
                  className="group rounded-[16px] border border-zinc-100 p-5 transition-all duration-400 hover:border-[#F472B6]/20 hover:shadow-[0_4px_20px_rgba(219,39,119,0.05)] dark:border-white/[0.06] dark:hover:border-[#9D174D]/25"
                >
                  <h4
                    className="text-[15px] font-semibold tracking-[-0.01em] text-zinc-900 dark:text-white"
                    style={FONT}
                  >
                    {feat.title}
                  </h4>
                  <p
                    className="mt-1.5 text-[13px] leading-[1.6] text-zinc-400 dark:text-zinc-500"
                    style={FONT}
                  >
                    {feat.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bölüm 6: İlgili Hizmetler ─────────────────────────────── */}
      <RelatedServices services={related} />

      {/* ── Bölüm 7: CTA Banner ───────────────────────────────────── */}
      <CTABanner />
    </main>
  );
}
