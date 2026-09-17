"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { EASE, revealVariants, revealViewport } from "@/lib/motion";

export default function ProjelerPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ── Hero başlık ─────────────────────────────────────────── */}
      <section className="px-5 pb-12 pt-24 md:px-12 md:pb-16 md:pt-32">
        <div className="mx-auto max-w-5xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-pink-400"
          >
            Portföy
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.06 }}
            className="text-[2.4rem] font-bold leading-tight text-foreground md:text-[3.6rem]"
          >
            projelerimiz
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.12 }}
            className="mt-4 max-w-lg text-base text-foreground/60 md:text-lg"
          >
            Markaların dijital dönüşüm hikayelerini birlikte yazıyoruz.
          </motion.p>
        </div>
      </section>

      {/* ── Proje grid ──────────────────────────────────────────── */}
      <section className="px-5 pb-24 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <motion.div
                key={project.slug}
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={revealViewport}
                custom={i * 0.06}
              >
                <Link
                  href={`/projeler/${project.slug}`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-2xl"
                >
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{ objectPosition: project.imagePosition ?? "center" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                  {/* Hover overlay ok */}
                  <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <line x1="4" y1="12" x2="12" y2="4" />
                      <polyline points="5 4 12 4 12 11" />
                    </svg>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    {project.tags.length > 0 && (
                      <div className="mb-2.5 flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/78 backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-lg font-bold text-white">{project.name}</p>
                    <p className="mt-0.5 text-sm text-white/65">{project.shortDesc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
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
          className="mx-auto max-w-xl"
        >
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-pink-400">
            Siz de listede yerinizi alın
          </p>
          <h2 className="mb-6 text-3xl font-bold leading-snug text-white md:text-4xl">
            Sizin için de bir hikaye yazalım.
          </h2>
          <a
            href="https://wa.me/905459407690"
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
