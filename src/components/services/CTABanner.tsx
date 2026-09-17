"use client";

import { motion } from "framer-motion";
import { FONT, revealVariants } from "@/lib/motion";

export function CTABanner() {
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
                className="text-[12px] font-medium uppercase tracking-[0.26em] text-white/30"
                style={FONT}
              >
                iletişim
              </span>
              <h2
                className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-white md:text-[38px]"
                style={FONT}
              >
                Projenizi konuşalım.
              </h2>
              <p
                className="mt-3 max-w-[38ch] text-[15px] leading-[1.7] text-white/45"
                style={FONT}
              >
                İhtiyaçlarınıza özel çözüm önerisi için bizimle iletişime geçin.
              </p>
            </div>

            <a
              href="https://wa.me/905459407690"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[linear-gradient(135deg,#DB2777_0%,#9D174D_100%)] px-7 py-3.5 text-[14px] font-semibold text-white transition-all duration-300 hover:gap-3.5 hover:shadow-[0_8px_32px_rgba(219,39,119,0.3)]"
              style={FONT}
            >
              WhatsApp ile yazın
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
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
        </div>
      </motion.div>
    </section>
  );
}
