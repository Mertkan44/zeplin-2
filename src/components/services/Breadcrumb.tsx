"use client";

import Link from "next/link";
import { FONT } from "@/lib/motion";

export function Breadcrumb({
  category,
  categorySlug,
  current,
}: {
  category: string;
  categorySlug: string;
  current: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.18em] md:text-[12px]"
      style={FONT}
    >
      <Link
        href="/hizmetler"
        className="text-white/70 transition-colors duration-200 hover:text-white/70"
      >
        Hizmetler
      </Link>
      <span className="text-white/55">/</span>
      <Link
        href={`/hizmetler#${categorySlug}`}
        className="text-white/70 transition-colors duration-200 hover:text-white/70"
      >
        {category}
      </Link>
      <span className="text-white/55">/</span>
      <span className="text-white/70">{current}</span>
    </nav>
  );
}
