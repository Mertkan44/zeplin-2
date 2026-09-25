"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FONT, revealVariants, revealViewport } from "@/lib/motion";
import { getProjectBySlug } from "@/data/projects";
import { briefHref, type ServiceData } from "@/data/services";

/**
 * Hizmet → onu gerçekten içeren proje. Yalnızca projenin kendi hizmet
 * listesiyle doğrulanan eşleşmeler; karşılığı olmayan hizmette kart çıkmaz.
 */
const SERVICE_PROJECT: Record<string, string> = {
  "fotograf-cekimi": "milo-restaurant",
  "sosyal-medya-yonetimi": "milo-restaurant",
  "video-produksiyon": "ritim-jewellery",
  "senaryo-script": "ritim-jewellery",
  "logo-tasarimi": "pam-akademi",
  "post-tasarimi": "pam-akademi",
  "banner-afis": "pam-akademi",
  "kurumsal-web-sitesi": "foton-saglik-cozumleri",
};

const START_CHECKLIST = [
  { title: "Kısa bir brief", desc: "Ne yapmak istediğiniz, kime hitap ettiğiniz ve beklediğiniz sonuç." },
  { title: "Marka dosyaları", desc: "Varsa logo, kurumsal renkler, yazı tipleri ve beğendiğiniz örnekler." },
  { title: "Takvim ve bütçe aralığı", desc: "Hedef tarih ve biliyorsanız bütçe; kapsamı buna göre öneririz." },
];

export function ServiceProof({ service }: { service: ServiceData }) {
  const project = SERVICE_PROJECT[service.slug] ? getProjectBySlug(SERVICE_PROJECT[service.slug]) : undefined;

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-24">
      <div className={`grid gap-6 ${project ? "lg:grid-cols-[1.1fr_1fr]" : ""}`}>
        {project && (
          <motion.div variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport} custom={0}>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#DB2777] dark:text-[#F472B6]" style={FONT}>
              Bu hizmetle yaptığımız bir iş
            </p>
            <Link
              href={`/projeler/${project.slug}`}
              className="group relative mt-4 block aspect-[4/3] overflow-hidden rounded-[24px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DB2777]"
            >
              <Image
                src={project.image}
                alt={project.name}
                fill
                sizes="(min-width: 1024px) 600px, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ objectPosition: project.imagePosition ?? "center" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-[14px] text-white/80">{project.shortDesc}</p>
                <p className="mt-1 text-[24px] font-semibold text-white" style={FONT}>
                  {project.name}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#F9A8D4]">
                  Projeyi incele <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          </motion.div>
        )}

        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          custom={0.08}
          className="flex flex-col rounded-[24px] bg-zinc-50 p-7 dark:bg-white/[0.03] md:p-10"
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#DB2777] dark:text-[#F472B6]" style={FONT}>
            Başlamak için
          </p>
          <h2 className="mt-3 text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-zinc-900 dark:text-white md:text-[32px]" style={FONT}>
            Bizden istenenler az.
          </h2>
          <ul className="mt-6 space-y-5">
            {START_CHECKLIST.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#DB2777]" />
                <div>
                  <p className="text-[16px] font-semibold text-zinc-900 dark:text-white">{item.title}</p>
                  <p className="mt-1 text-[15px] leading-[1.6] text-zinc-600 dark:text-zinc-400">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href={briefHref(service)}
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#DB2777] px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#BE185D]"
            style={FONT}
          >
            Projeni Anlat <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
