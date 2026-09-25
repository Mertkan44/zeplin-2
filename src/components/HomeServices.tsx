"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FONT, revealVariants, revealViewport } from "@/lib/motion";
import { serviceTabs } from "@/data/services";

/* Grup başına tek cümlelik sonuç odaklı açıklama; kartlar serviceTabs'ten gelir. */
const GROUP_COPY: Record<string, string> = {
  "foto-video": "Tanıtım filmi, reels ve ürün çekimiyle markanızı görünür kılan prodüksiyon.",
  "sosyal-icerik": "Planlamadan yayına ve reklama kadar sosyal medya hesaplarınızın yönetimi.",
  "marka-tasarim": "Logodan sosyal medya şablonlarına tutarlı bir görsel kimlik.",
  web: "Hizmetlerinizi net anlatan, mobilde rahat kullanılan kurumsal siteler.",
  "ai-otomasyon": "Müşteri sorularını ve tekrar eden işleri üstlenen chatbot, callbot ve akışlar.",
};

export default function HomeServices() {
  return (
    <section aria-labelledby="home-services-title" className="px-5 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          custom={0}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#DB2777] dark:text-[#F472B6]" style={FONT}>
              Hizmetler
            </p>
            <h2
              id="home-services-title"
              className="mt-3 max-w-[18ch] text-[32px] font-semibold leading-[1.08] tracking-[-0.02em] text-zinc-900 dark:text-white md:text-[44px]"
              style={FONT}
            >
              Neye ihtiyacınız varsa oradan başlayalım.
            </h2>
          </div>
          <Link
            href="/hizmetler"
            className="w-fit text-[15px] font-semibold text-[#DB2777] underline-offset-4 hover:underline dark:text-[#F472B6]"
            style={FONT}
          >
            Tüm hizmetler →
          </Link>
        </motion.div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-14">
          {serviceTabs.map((group, i) => (
            <motion.li
              key={group.id}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              custom={i * 0.06}
              className={i === 0 ? "lg:row-span-2" : undefined}
            >
              <Link
                href={`/hizmetler#${group.id}`}
                className="group relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-[24px] border border-zinc-200 bg-white p-6 transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(219,39,119,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DB2777] dark:border-white/[0.08] dark:bg-white/[0.03] md:p-7"
              >
                {i === 0 && (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
                    style={{ backgroundImage: `url('${group.cards[0]?.img}')` }}
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,10,13,0.15)_0%,rgba(15,10,13,0.88)_70%)]" />
                  </div>
                )}
                <div className={`relative mt-auto ${i === 0 ? "text-white" : ""}`}>
                  <h3
                    className={`text-[22px] font-semibold leading-tight tracking-[-0.01em] ${i === 0 ? "text-white" : "text-zinc-900 dark:text-white"}`}
                    style={FONT}
                  >
                    {group.label}
                  </h3>
                  <p className={`mt-2 text-[15px] leading-[1.6] ${i === 0 ? "text-white/85" : "text-zinc-600 dark:text-zinc-400"}`}>
                    {GROUP_COPY[group.id]}
                  </p>
                  <p className={`mt-4 text-[13px] leading-[1.6] ${i === 0 ? "text-white/70" : "text-zinc-500 dark:text-zinc-400"}`}>
                    {group.cards.map((c) => c.title).join(" · ")}
                  </p>
                  <span
                    className={`mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold ${i === 0 ? "text-[#F9A8D4]" : "text-[#DB2777] dark:text-[#F472B6]"}`}
                  >
                    İncele
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
