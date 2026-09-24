"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FONT, revealVariants } from "@/lib/motion";
import { briefHref, type ServiceData } from "@/data/services";
import { whatsappUrl } from "@/lib/contact";
import { useT } from "@/i18n/LocaleProvider";

export function CTABanner({ service }: { service: ServiceData }) {
  const t = useT();
  return (
    <section className="px-6 pb-24 pt-6 md:pb-32 md:pt-10">
      <motion.div
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
        custom={0}
        className="mx-auto max-w-[1200px]"
      >
        <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#2a1525_0%,#1f0c18_60%,#1a0e17_100%)] px-8 py-14 dark:bg-[linear-gradient(135deg,#1a0e17_0%,#120a10_60%,#0d070b_100%)] md:px-16 md:py-20">
          {/* Decorative elements */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-[320px] w-[320px] rounded-full bg-[#DB2777]/10 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-[240px] w-[240px] rounded-full bg-[#EC4899]/6 blur-[80px]" />

          <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <span
                className="text-[12px] font-medium uppercase tracking-[0.26em] text-white/60"
                style={FONT}
              >
                {t.cta.eyebrow}
              </span>
              <h2
                className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-white md:text-[38px]"
                style={FONT}
              >
                {t.cta.title}
              </h2>
              <p
                className="mt-3 max-w-[38ch] text-[15px] leading-[1.7] text-white/70"
                style={FONT}
              >
                {t.cta.lead}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={briefHref(service)}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[linear-gradient(135deg,#DB2777_0%,#9D174D_100%)] px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-300 hover:gap-3.5 hover:shadow-[0_8px_32px_rgba(219,39,119,0.3)]"
                style={FONT}
              >
                {t.cta.brief}
                <span aria-hidden="true">→</span>
              </Link>
              <a
                href={whatsappUrl(t.whatsapp.service(service.title))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
                style={FONT}
              >
                {t.cta.whatsapp} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
