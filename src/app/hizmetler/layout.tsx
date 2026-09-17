import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Hizmetler",
  description:
    "Zeplin Media; sosyal medya yönetimi, içerik üretimi, tasarım, video prodüksiyon, web geliştirme ve yapay zeka otomasyonu hizmetleri sunar.",
  path: "/hizmetler",
  image: "/images/services-digital-premium-optimized.webp",
});

export default function HizmetlerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
