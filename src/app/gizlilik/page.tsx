import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Gizlilik Politikası",
  description:
    "Zeplin Media gizlilik politikası: iletişim talepleri, teklif süreçleri ve dijital kanallarda paylaşılan bilgilerin nasıl işlendiğine dair bilgilendirme.",
  path: "/gizlilik",
  noIndex: true,
});

export default function GizlilikPage() {
  return (
    <main className="min-h-screen bg-white px-6 pb-24 pt-32 text-zinc-900 dark:bg-[#0a0a0a] dark:text-white md:px-12 md:pt-40">
      <article className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#DB2777]">Zeplin Media</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Gizlilik Politikası</h1>
        <p className="mt-5 text-base leading-8 text-zinc-600 dark:text-white/60">
          Zeplin Media ile paylaşılan ad, iletişim bilgisi, brief ve proje detayları yalnızca teklif hazırlama,
          müşteri iletişimi ve hizmet sunumu amacıyla kullanılır. Bilgiler üçüncü taraflara satılmaz.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-zinc-600 dark:text-white/60">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-zinc-950 dark:text-white">Toplanan bilgiler</h2>
            <p>
              WhatsApp, e-posta, telefon veya sosyal medya üzerinden paylaştığınız iletişim bilgileri, marka adı,
              proje ihtiyaçları ve brief notları işlenebilir.
            </p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-zinc-950 dark:text-white">Kullanım amacı</h2>
            <p>
              Bilgiler; tekliflendirme, toplantı planlama, proje yürütme, destek taleplerini yanıtlama ve hizmet
              kalitesini iyileştirme amaçlarıyla kullanılır.
            </p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-zinc-950 dark:text-white">İletişim</h2>
            <p>
              Gizlilikle ilgili sorularınız için{" "}
              <a className="text-[#DB2777] underline-offset-4 hover:underline" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>{" "}
              adresinden bize ulaşabilirsiniz.
            </p>
          </section>
        </div>

        <Link
          href="/"
          className="mt-12 inline-flex rounded-full bg-[#DB2777] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#BE185D]"
        >
          Ana sayfaya dön
        </Link>
      </article>
    </main>
  );
}
