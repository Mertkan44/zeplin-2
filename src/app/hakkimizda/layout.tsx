import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Hakkımızda",
  description:
    "Zeplin Media, fotoğraf, film, tasarım ve web projeleri üreten İstanbul merkezli bir yaratıcı stüdyo. Nasıl çalıştığımızı ve neye önem verdiğimizi anlatıyoruz.",
  path: "/hakkimizda",
  image: "/images/services/banner-afis.webp",
});

export default function HakkimizdaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
