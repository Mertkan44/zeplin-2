"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FONT, revealVariants, revealViewport } from "@/lib/motion";
import { getProjectBySlug } from "@/data/projects";

/**
 * Proje notları: ajansın kendi anlatımıyla gerçek projelerden kısa özetler.
 * Müşteri alıntısı değildir; onaylı bir müşteri görüşü geldiğinde ayrı gösterilmeli.
 */
const NOTES: Record<string, { brief: string; delivered: string }> = {
  "milo-restaurant": {
    brief: "Yeni menü ve mekân atmosferi dijitalde markanın kalitesini yansıtmıyordu.",
    delivered: "Menü fotoğrafları, Reels akışı ve sosyal medya görsellerini tek bir görsel dilde topladık.",
  },
  "ritim-jewellery": {
    brief: "Takı koleksiyonu için geleneksel prodüksiyon bütçesini aşmadan sinematik bir reklam filmi gerekiyordu.",
    delivered: "Yapay zekâ destekli üretimle senaryo, ses tasarımı ve renk düzenlemesi dahil üç dikey reklam filmi ürettik.",
  },
  "pam-akademi": {
    brief: "Yeni bir eğitim markası sıfırdan kimlik ve tutarlı bir dijital varlık istiyordu.",
    delivered: "Logo, renk paleti, web sitesi ve sosyal medya şablonlarını tek marka sistemi altında tasarladık.",
  },
  "foton-saglik-cozumleri": {
    brief: "Teknik ürün gamı olan bir sağlık firması güven veren, anlaşılır bir kurumsal site istiyordu.",
    delivered: "UI/UX tasarımından geliştirmeye ve SEO altyapısına kadar mobil uyumlu kurumsal siteyi hayata geçirdik.",
  },
};

export default function ProjectNotes({
  slugs,
  eyebrow = "Proje notları",
  heading,
}: {
  slugs: string[];
  eyebrow?: string;
  heading?: string;
}) {
  const items = slugs
    .map((slug) => ({ project: getProjectBySlug(slug), note: NOTES[slug] }))
    .filter((x) => x.project && x.note);

  return (
    <div>
      <span className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#DB2777] dark:text-[#F472B6]" style={FONT}>
        {eyebrow}
      </span>
      {heading && (
        <h2
          className="mt-3 text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-zinc-900 dark:text-white md:text-[32px]"
          style={FONT}
        >
          {heading}
        </h2>
      )}

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map(({ project, note }, i) => (
          <motion.article
            key={project!.slug}
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            custom={i * 0.1}
            className="flex flex-col rounded-[24px] border border-zinc-200 bg-white p-6 dark:border-white/[0.08] dark:bg-white/[0.02] md:p-8"
          >
            <p className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400" style={FONT}>
              {project!.shortDesc}
            </p>
            <h3 className="mt-1 text-[20px] font-semibold text-zinc-900 dark:text-white" style={FONT}>
              {project!.name}
            </h3>

            <dl className="mt-5 space-y-4 text-[15px] leading-[1.65]" style={FONT}>
              <div>
                <dt className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-500">İhtiyaç</dt>
                <dd className="mt-1 text-zinc-700 dark:text-zinc-300">{note!.brief}</dd>
              </div>
              <div>
                <dt className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-500">Yaptığımız</dt>
                <dd className="mt-1 text-zinc-700 dark:text-zinc-300">{note!.delivered}</dd>
              </div>
            </dl>

            <Link
              href={`/projeler/${project!.slug}`}
              className="mt-auto inline-flex items-center gap-2 pt-6 text-[14px] font-semibold text-[#DB2777] underline-offset-4 hover:underline dark:text-[#F472B6]"
              style={FONT}
            >
              Projeyi incele
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M10 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
