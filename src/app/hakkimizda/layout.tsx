import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Hakkımızda",
  description:
    "Zeplin Media, İstanbul merkezli profesyonel dijital ajans ekibiyle strateji, tasarım, içerik, web, video ve yapay zeka operasyonlarını tek çatı altında yönetir.",
  path: "/hakkimizda",
  image: "/images/generated/about-agency-studio.webp",
});

export default function HakkimizdaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
