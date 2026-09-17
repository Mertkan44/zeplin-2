import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Operasyonlar",
  description:
    "Zeplin Media operasyonları; içerik takvimi, sosyal medya yönetimi, prodüksiyon, raporlama ve yapay zeka destekli iş akışlarını ölçülebilir sistemlere dönüştürür.",
  path: "/operasyonlar",
  image: "/images/generated/operations-command-center.webp",
});

export default function OperasyonlarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
