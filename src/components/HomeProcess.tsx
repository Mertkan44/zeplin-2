"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FONT, revealVariants, revealViewport } from "@/lib/motion";

const STEPS = [
  { title: "Tanışma & brief", desc: "İhtiyacınızı, hedefinizi ve elinizdeki malzemeyi dinliyoruz." },
  { title: "Plan & teklif", desc: "Kapsamı, teslim edilecekleri ve takvimi netleştirip yazılı olarak paylaşıyoruz." },
  { title: "Üretim", desc: "Çekim, tasarım, metin ya da geliştirme; ara onaylarla ilerliyoruz." },
  { title: "Teslim & değerlendirme", desc: "Dosyaları kullanıma hazır teslim ediyor, sonucu birlikte değerlendiriyoruz." },
];

export default function HomeProcess() {
  return (
    <section aria-labelledby="home-process-title" className="px-5 pb-16 md:px-12 md:pb-24">
      <div className="mx-auto max-w-6xl rounded-[28px] bg-zinc-50 px-6 py-10 dark:bg-white/[0.03] md:px-12 md:py-14">
        <motion.div variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport} custom={0}>
          <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#DB2777] dark:text-[#F472B6]" style={FONT}>
            Nasıl çalışıyoruz
          </p>
          <h2
            id="home-process-title"
            className="mt-3 text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-zinc-900 dark:text-white md:text-[36px]"
            style={FONT}
          >
            Başlayınca ne olacağını bilin.
          </h2>
        </motion.div>

        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              custom={i * 0.06}
              className="border-t border-zinc-300 pt-5 dark:border-white/15"
            >
              <span className="text-[14px] font-semibold tabular-nums text-[#DB2777] dark:text-[#F472B6]" style={FONT}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-[18px] font-semibold text-zinc-900 dark:text-white" style={FONT}>
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-zinc-600 dark:text-zinc-400">{step.desc}</p>
            </motion.li>
          ))}
        </ol>

        <Link
          href="/iletisim"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#DB2777] px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#BE185D]"
          style={FONT}
        >
          Projeni Anlat <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
