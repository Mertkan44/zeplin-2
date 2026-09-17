"use client";

import { notFound } from "next/navigation";
import { use, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { projects, getProjectBySlug } from "@/data/projects";
import { EASE, revealVariants, revealViewport, useReliableInView } from "@/lib/motion";

const WHATSAPP_URL = "https://wa.me/905459407690";

/** Only starts loading/playing once scrolled into view, so heavy gallery videos never block page load. */
function LazyGalleryVideo({
  src,
  style,
}: {
  src: string;
  style: React.CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useReliableInView(ref);

  return (
    <video
      ref={ref}
      src={inView ? src : undefined}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      style={style}
      autoPlay={inView}
      loop
      muted
      playsInline
      preload="none"
    />
  );
}

export default function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative h-[60vh] min-h-[380px] w-full overflow-hidden md:h-[72vh] md:min-h-[500px]">
        <div
          className="absolute inset-0 scale-105 transition-transform duration-700"
          style={{
            backgroundImage: `url(${project.image})`,
            backgroundSize: "cover",
            backgroundPosition: project.imagePosition ?? "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

        {/* Geri butonu */}
        <div className="absolute left-0 right-0 top-0 px-5 pt-6 md:px-12 md:pt-8">
          <Link
            href="/projeler"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md transition-all duration-200 hover:bg-white/18 hover:text-white"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 12L6 8L10 4" />
            </svg>
            Tüm Projeler
          </Link>
        </div>

        {/* Hero içerik */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 md:px-12 md:pb-12">
          {project.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mb-4 flex flex-wrap gap-2"
            >
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.06 }}
            className="text-[2.2rem] font-bold leading-tight text-white md:text-[3.2rem] lg:text-[3.8rem]"
          >
            {project.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.12 }}
            className="mt-2 text-base font-medium text-white/70 md:text-lg"
          >
            {project.shortDesc}
          </motion.p>
        </div>
      </section>

      {/* ── Overview bar ───────────────────────────────────────── */}
      <motion.section
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        custom={0}
        className="border-b border-foreground/8 px-5 py-6 md:px-12 md:py-8"
      >
        <div className="mx-auto flex max-w-5xl flex-wrap gap-8 md:gap-16">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
              Müşteri
            </p>
            <p className="text-base font-semibold text-foreground">{project.client}</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
              Yıl
            </p>
            <p className="text-base font-semibold text-foreground">{project.year}</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
              Hizmetler
            </p>
            <div className="flex flex-wrap gap-1.5">
              {project.services.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-pink-500/10 px-3 py-1 text-[12px] font-medium text-pink-400"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {project.variant === "website" && project.websiteUrl && (
            <div className="flex items-end md:ml-auto">
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-pink-700 active:scale-95"
              >
                Siteyi Ziyaret Et
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="12" x2="12" y2="4" />
                  <polyline points="5 4 12 4 12 11" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </motion.section>

      {/* ── Brief & Çözüm ──────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-14 md:px-12 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            custom={0}
          >
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-pink-400">
              Brief
            </p>
            <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
              Zorluk
            </h2>
            <p className="leading-relaxed text-foreground/65">{project.challenge}</p>
          </motion.div>

          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            custom={0.08}
          >
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-pink-400">
              Çözüm
            </p>
            <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
              Ne Yaptık
            </h2>
            <p className="leading-relaxed text-foreground/65">{project.solution}</p>
          </motion.div>
        </div>
      </section>

      {/* ── Galeri / Site Vitrini ──────────────────────────────── */}
      <section className="bg-foreground/[0.02] px-5 py-14 md:px-12 md:py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            custom={0}
            className="mb-8 md:mb-12"
          >
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-pink-400">
              Çalışmalar
            </p>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              {project.variant === "website" ? "Canlı Site" : "Galeri"}
            </h2>
          </motion.div>

          {project.variant === "website" && project.websiteUrl ? (
            <motion.a
              href={project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              custom={0}
              className="group relative flex min-h-[420px] w-full items-end overflow-hidden rounded-[28px] md:min-h-[560px]"
            >
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ objectPosition: project.imagePosition ?? "center" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />

              <div className="relative z-10 flex w-full flex-col items-start gap-5 p-6 md:flex-row md:items-end md:justify-between md:p-12">
                <div>
                  <p className="text-sm font-medium text-white/60">{project.name} için tasarlayıp geliştirdiğimiz kurumsal web sitesi.</p>
                  <p className="mt-1 text-2xl font-bold text-white md:text-3xl">www.fotonsc.com</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-pink-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(219,39,119,0.4)] transition-all duration-200 group-hover:bg-pink-700 group-hover:shadow-[0_12px_32px_rgba(219,39,119,0.5)] active:scale-95">
                  Siteyi Gör
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="12" x2="12" y2="4" />
                    <polyline points="5 4 12 4 12 11" />
                  </svg>
                </span>
              </div>
            </motion.a>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-5">
              {project.gallery.length > 0
                ? project.gallery.map((src, i) => (
                    <motion.div
                      key={i}
                      variants={revealVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={revealViewport}
                      custom={i * 0.06}
                      className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
                    >
                      {src.endsWith(".mp4") ? (
                        <LazyGalleryVideo
                          src={src}
                          style={{ objectPosition: project.imagePosition ?? "center" }}
                        />
                      ) : (
                        <Image
                          src={src}
                          alt={`${project.name} görsel ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          style={{ objectPosition: project.imagePosition ?? "center" }}
                        />
                      )}
                    </motion.div>
                  ))
                : null}
            </div>
          )}
        </div>
      </section>

      {/* ── Sonraki Proje ──────────────────────────────────────── */}
      <section className="border-t border-foreground/8 px-5 py-12 md:px-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            custom={0}
            className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/40">
                Sonraki Proje
              </p>
              <p className="text-xl font-bold text-foreground md:text-2xl">{nextProject.name}</p>
            </div>
            <Link
              href={`/projeler/${nextProject.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-pink-700 active:scale-95"
            >
              İncele
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 4L10 8L6 12" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-5 py-16 text-center md:px-12 md:py-24"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 30%, #1C0619 0%, #0D0A0C 65%)",
        }}
      >
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          custom={0}
          className="relative z-10 mx-auto max-w-xl"
        >
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-pink-400">
            Sizin için de çalışalım
          </p>
          <h2 className="mb-6 text-3xl font-bold leading-snug text-white md:text-4xl">
            Markanız için bir sonraki adımı birlikte atalım.
          </h2>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_rgba(219,39,119,0.35)] transition-all duration-200 hover:bg-pink-700 hover:shadow-[0_0_56px_rgba(219,39,119,0.5)] active:scale-95"
          >
            Teklif Al
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 4L10 8L6 12" />
            </svg>
          </a>
        </motion.div>
      </section>
    </main>
  );
}
