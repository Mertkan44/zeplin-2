import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Projeler",
  description:
    "Zeplin Media portföyü: restoran, sağlık, eğitim, takı ve kurumsal markalar için web, sosyal medya, içerik, video ve yapay zeka üretimleri.",
  path: "/projeler",
  image: "/images/projects-milo-cover.webp",
});

export default function ProjelerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
