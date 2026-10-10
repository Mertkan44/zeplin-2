"use client";

/*
 * Bölüm girişi: sitenin diğer sayfalarıyla aynı (revealVariants · DUR[4] · EASE).
 * `order` kardeşler arasındaki sırayı verir; gecikme STAGGER ritmiyle artar.
 * Başlangıç opaklığı 0.16 → ScrollRevealRescue takılı kalanı kurtarır.
 */

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { STAGGER, revealVariants, revealViewport } from "@/lib/motion";

export default function Reveal({ children, order = 0, className }: { children: ReactNode; order?: number; className?: string }) {
  return (
    <motion.div className={className} variants={revealVariants} initial="hidden" whileInView="visible" viewport={revealViewport} custom={order * STAGGER * 2}>
      {children}
    </motion.div>
  );
}
