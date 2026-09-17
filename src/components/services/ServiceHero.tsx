"use client";

import { motion } from "framer-motion";
import { EASE, FONT, revealVariants } from "@/lib/motion";
import { Breadcrumb } from "./Breadcrumb";

export function ServiceHero({
  title,
  description,
  categoryLabel,
  categorySlug,
  heroImage,
}: {
  title: string;
  description: string;
  categoryLabel: string;
  categorySlug: string;
  heroImage: string;
}) {
  return (
    <section
      className="relative overflow-hidden px-6 pb-16 pt-[42svh] md:pb-28 md:pt-56 bg-center bg-no-repeat bg-[length:auto_100%] md:bg-cover"
      style={{ backgroundImage: `url('${heroImage}')` }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,10,13,0.3)_0%,rgba(15,10,13,0.7)_40%,rgba(15,10,13,0.95)_70%,#0a0a0a_100%)] dark:bg-[linear-gradient(180deg,rgba(10,10,10,0.2)_0%,rgba(10,10,10,0.7)_40%,rgba(10,10,10,0.95)_70%,#0a0a0a_100%)]" />

      <div className="relative mx-auto flex max-w-[1200px] flex-col items-start">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0 }}
          className="mb-6"
        >
          <Breadcrumb
            category={categoryLabel}
            categorySlug={categorySlug}
            current={title}
          />
        </motion.div>

        {/* Category badge */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.44, ease: EASE, delay: 0.06 }}
          className="mb-4 inline-block rounded-full bg-[linear-gradient(135deg,#DB2777_0%,#9D174D_100%)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white"
          style={FONT}
        >
          {categoryLabel}
        </motion.span>

        {/* Title */}
        <motion.h1
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="max-w-[14ch] text-[38px] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[52px] md:text-[64px]"
          style={FONT}
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          custom={0.18}
          className="mt-5 max-w-[52ch] text-[15px] leading-[1.75] text-white/55 md:text-[17px]"
          style={FONT}
        >
          {description}
        </motion.p>
      </div>

      {/* Decorative glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[50vw] w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DB2777]/8 blur-[120px]" />
    </section>
  );
}
