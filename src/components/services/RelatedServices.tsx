"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FONT, revealVariants } from "@/lib/motion";
import type { ServiceData } from "@/data/services";

export function RelatedServices({ services }: { services: ServiceData[] }) {
  if (services.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-10 md:py-16">
      <motion.div
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
        custom={0}
        className="mb-8 md:mb-12"
      >
        <span
          className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-700"
          style={FONT}
        >
          İlgili hizmetler
        </span>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((svc, i) => (
          <motion.div
            key={svc.slug}
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            custom={i * 0.08}
          >
            <Link
              href={`/hizmetler/${svc.slug}`}
              className="group relative block overflow-hidden rounded-[24px] border border-transparent transition-[border-color,box-shadow] duration-500 hover:border-[#F472B6]/20 hover:shadow-[0_8px_40px_rgba(219,39,119,0.1)] dark:hover:border-[#9D174D]/30 dark:hover:shadow-[0_8px_40px_rgba(157,23,77,0.12)]"
              style={{ minHeight: "280px" }}
            >
              {/* BG image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                style={{ backgroundImage: `url('${svc.heroImage}')` }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_5%,rgba(15,10,13,0.88)_62%)] transition-all duration-500 group-hover:bg-[linear-gradient(180deg,transparent_5%,rgba(15,10,13,0.80)_62%)]" />

              {/* Content */}
              <div className="relative flex h-full min-h-[280px] flex-col justify-end p-7 md:p-8">
                <span className="mb-3 inline-block w-fit rounded-full border border-white/20 px-3 py-1 text-[11px] font-medium tracking-[0.12em] text-white/70 backdrop-blur-sm">
                  {svc.categoryLabel}
                </span>
                <h4
                  className="text-[20px] font-semibold leading-[1.15] tracking-[-0.02em] text-white md:text-[22px]"
                  style={FONT}
                >
                  {svc.title}
                </h4>
                <p className="mt-2 max-w-[32ch] text-[13px] leading-[1.6] text-white/55">
                  {svc.shortDesc}
                </p>
                <span
                  className="mt-4 inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-[#F472B6] opacity-0 transition-all duration-400 group-hover:opacity-100"
                  style={FONT}
                >
                  incele
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path
                      d="M2 6h8M7 3l3 3-3 3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
