import type { Metadata } from "next";
import BriefForm from "@/components/BriefForm";
import { BRIEF_NEEDS, whatsappUrl } from "@/lib/contact";
import { createPageMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Projeni Anlat",
  description:
    "Zeplin Media ile projenizi konuşun: fotoğraf ve video prodüksiyon, sosyal medya, marka tasarımı, web sitesi ve yapay zeka otomasyonu için kısa brief formu.",
  path: "/iletisim",
});

export default async function IletisimPage({
  searchParams,
}: {
  searchParams: Promise<{ ihtiyac?: string }>;
}) {
  const { ihtiyac } = await searchParams;
  const initialNeed = (BRIEF_NEEDS as readonly string[]).includes(ihtiyac ?? "") ? ihtiyac : undefined;

  return (
    <main className="min-h-screen bg-white px-5 pb-24 pt-28 text-zinc-900 dark:bg-[#0a0a0a] dark:text-white md:px-12 md:pt-40">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#DB2777]">İletişim</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Projeni anlat.</h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-zinc-700 dark:text-white/70">
            Birkaç soruyu yanıtlayın; ihtiyacınızı okuyup size uygun kapsam ve bir sonraki adımla dönelim.
          </p>

          <div className="mt-10 space-y-5 border-t border-zinc-200 pt-8 text-base dark:border-white/10">
            <div>
              <p className="text-sm text-zinc-600 dark:text-white/55">Hızlı soru mu var?</p>
              <a
                href={whatsappUrl("Merhaba Zeplin Media, projem hakkında konuşmak istiyorum.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-2 font-semibold text-[#DB2777] underline-offset-4 hover:underline"
              >
                WhatsApp&apos;tan yazın ↗
              </a>
            </div>
            <div>
              <p className="text-sm text-zinc-600 dark:text-white/55">E-posta</p>
              <a href={`mailto:${siteConfig.email}`} className="mt-1 inline-block font-semibold underline-offset-4 hover:underline">
                {siteConfig.email}
              </a>
            </div>
            <div>
              <p className="text-sm text-zinc-600 dark:text-white/55">Telefon</p>
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="mt-1 inline-block font-semibold underline-offset-4 hover:underline">
                {siteConfig.phone}
              </a>
            </div>
          </div>
        </header>

        <section aria-label="Proje formu">
          <BriefForm initialNeed={initialNeed} />
        </section>
      </div>
    </main>
  );
}
