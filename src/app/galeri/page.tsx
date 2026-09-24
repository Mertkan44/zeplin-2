import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Galeri",
  description: "Zeplin Media üretim, tasarım, web, video ve sosyal medya çalışmalarından seçili görsel akış.",
  path: "/galeri",
  image: "/images/projects-milo-gallery-3.jpg",
});


export default function GaleriPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white pt-28 text-zinc-950 dark:bg-[#0a0a0a] dark:text-white md:pt-32">
      <section
        className="relative mx-5 mb-8 flex min-h-[420px] md:mx-auto max-w-[1200px] overflow-hidden rounded-[28px] bg-cover bg-center px-6 py-12 md:mb-12 md:min-h-[520px] md:px-12 md:py-16"
        style={{ backgroundImage: "url('/images/projects-milo-gallery-3.jpg')" }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.86)_0%,rgba(10,10,10,0.54)_46%,rgba(10,10,10,0.16)_100%)]" />
        <div className="relative mt-auto max-w-[620px]">
          <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.2em] text-[#F9A8D4]">
            seçili işler
          </p>
          <h1 className="text-[42px] font-bold leading-[0.98] tracking-[-0.04em] text-white md:text-[72px]">
            Galeri
          </h1>
          <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.75] text-white/85 md:text-[17px]">
            Fotoğraf, video, web, sosyal medya ve kimlik çalışmalarından seçili parçaları tek akışta topladık.
          </p>
        </div>
      </section>
      <GalleryGrid />
    </main>
  );
}
