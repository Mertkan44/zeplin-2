"use client";

import { notFound } from "next/navigation";
import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { projectsInListOrder, getProjectBySlug } from "@/data/projects";
import { EASE, revealVariants, revealViewport } from "@/lib/motion";
import MediaLightbox, { isVideo, posterFor } from "@/components/MediaLightbox";
import { whatsappUrl } from "@/lib/contact";


export default function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  /* Hero görseli galeride tekrar etmesin (P11). */
  const lightboxItems = project.gallery
    .filter((src) => src !== project.image)
    .map((src, i) => ({
      src,
      alt: `${project.name} ${isVideo(src) ? "film" : "görsel"} ${i + 1}`,
      poster: isVideo(src) ? posterFor(src) : undefined,
    }));
  const films = lightboxItems.map((item, index) => ({ item, index })).filter(({ item }) => isVideo(item.src));
  const photos = lightboxItems.map((item, index) => ({ item, index })).filter(({ item }) => !isVideo(item.src));
  const websiteHost = project.websiteUrl ? new URL(project.websiteUrl).hostname : null;
  const hasWork = films.length > 0 || photos.length > 0 || (project.variant === "website" && !!websiteHost);

  /* Sonraki iş, listedeki editoryal sıraya göre (P12). */
  const currentIndex = projectsInListOrder.findIndex((p) => p.slug === slug);
  const nextProject = projectsInListOrder[(currentIndex + 1) % projectsInListOrder.length];

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
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm"
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
            <p className="mb-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-foreground/65">
              Müşteri
            </p>
            <p className="text-base font-semibold text-foreground">{project.client}</p>
          </div>
          <div>
            <p className="mb-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-foreground/65">
              Yıl
            </p>
            <p className="text-base font-semibold text-foreground">{project.year}</p>
          </div>
          <div>
            <p className="mb-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-foreground/65">
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
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-pink-400">
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
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-pink-400">
              Çözüm
            </p>
            <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
              Ne Yaptık
            </h2>
            <p className="leading-relaxed text-foreground/65">{project.solution}</p>
          </motion.div>
        </div>
      </section>

      {/* ── Çalışmalar: medya türüne göre (film / fotoğraf / web) ── */}
      {hasWork && (
      <section className="bg-foreground/[0.02] px-5 py-14 md:px-12 md:py-20">
        <div className="mx-auto max-w-5xl space-y-14 md:space-y-20">
          {project.variant === "website" && project.websiteUrl && websiteHost && (
            <div>
              <h2 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">Canlı site</h2>
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-600"
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-foreground/5">
                  <Image
                    src={project.cover ?? project.image}
                    alt={`${project.name} web sitesi`}
                    fill
                    sizes="(min-width: 1024px) 1024px, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-foreground/65">{project.name} için tasarlayıp geliştirdiğimiz kurumsal web sitesi.</p>
                    <p className="mt-1 text-xl font-semibold text-foreground md:text-2xl">{websiteHost}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-pink-700 dark:text-pink-300">
                    Canlı siteyi aç <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </a>
            </div>
          )}

          {films.length > 0 && (
            <div>
              <h2 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">Filmler</h2>
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
                {films.map(({ item, index }, i) => (
                  <li key={item.src}>
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      aria-label={`${item.alt} — izle`}
                      className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-600"
                    >
                      <span className="relative block aspect-[9/16] overflow-hidden rounded-xl bg-black">
                        <Image
                          src={item.poster!}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 320px, 50vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                        />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-pink-600 shadow-lg transition-transform group-hover:scale-110">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M8 5.5v13l11-6.5z" />
                            </svg>
                          </span>
                        </span>
                      </span>
                      <span className="mt-3 block text-[15px] font-semibold text-foreground">
                        Film {i + 1} <span className="font-normal text-foreground/65">· Filmi izle</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {photos.length > 0 && (
            <div>
              <h2 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">Fotoğraflar</h2>
              {/* Her fotoğraf kendi oranında; ortak kırpma ve ortak odak yok (P08, P09) */}
              <ul className="columns-2 gap-4 md:columns-3 md:gap-6">
                {photos.map(({ item, index }) => (
                  <li key={item.src} className="mb-4 break-inside-avoid md:mb-6">
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      aria-label={`${item.alt} — büyüt`}
                      className="group block w-full overflow-hidden rounded-xl bg-foreground/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-600"
                    >
                      <Image
                        src={item.src}
                        alt=""
                        width={0}
                        height={0}
                        sizes="(min-width: 768px) 320px, 50vw"
                        className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
      )}

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
              <p className="mb-1 text-[12px] font-semibold uppercase tracking-[0.2em] text-foreground/65">
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
        data-footer-under="dark"
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
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-pink-300">
            {project.name} gibi
          </p>
          <h2 className="text-3xl font-bold leading-snug text-white md:text-4xl">
            Benzer bir proje mi düşünüyorsun?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-white/75">
            Ne yapmak istediğini birkaç cümleyle anlat; kapsamı ve bir sonraki adımı birlikte netleştirelim.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={`/iletisim?ihtiyac=${encodeURIComponent(project.briefNeed)}`}
              className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_0_40px_rgba(219,39,119,0.35)] transition-all duration-200 hover:bg-pink-700 active:scale-95"
            >
              Projeni Anlat <span aria-hidden="true">→</span>
            </Link>
            <a
              href={whatsappUrl(`Merhaba Zeplin Media, sitenizde ${project.name} projesini gördüm. Benzer bir iş için konuşmak istiyorum.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              WhatsApp <span aria-hidden="true">↗</span>
            </a>
          </div>
        </motion.div>
      </section>
      <MediaLightbox
        items={lightboxItems}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </main>
  );
}
