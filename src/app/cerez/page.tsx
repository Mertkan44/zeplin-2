import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Çerez Politikası",
  description:
    "Zeplin Media çerez politikası: tema tercihi, site performansı ve üçüncü taraf font servisleri hakkında kısa bilgilendirme.",
  path: "/cerez",
  noIndex: true,
});

export default function CerezPage() {
  return (
    <main className="min-h-screen bg-white px-6 pb-24 pt-32 text-zinc-900 dark:bg-[#0a0a0a] dark:text-white md:px-12 md:pt-40">
      <article className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#DB2777]">Zeplin Media</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Çerez Politikası</h1>
        <p className="mt-5 text-base leading-8 text-zinc-600 dark:text-white/60">
          Bu site, deneyimi iyileştirmek için sınırlı teknik veriler kullanır. Tema tercihiniz tarayıcınızda
          saklanabilir; font ve medya servisleri sayfanın doğru görüntülenmesi için çalışabilir.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-zinc-600 dark:text-white/60">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-zinc-950 dark:text-white">Zorunlu kullanım</h2>
            <p>
              Site görünümü, güvenliği ve temel performansı için gerekli teknik kayıtlar ve tarayıcı tercihleri
              kullanılabilir.
            </p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-zinc-950 dark:text-white">Üçüncü taraf servisler</h2>
            <p>
              Tipografi ve medya deneyimi için kullanılan harici servisler kendi teknik kayıtlarını tutabilir.
              Tarayıcı ayarlarınızdan çerez tercihlerinizi yönetebilirsiniz.
            </p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-zinc-950 dark:text-white">İletişim</h2>
            <p>
              Sorularınız için{" "}
              <a className="text-[#DB2777] underline-offset-4 hover:underline" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>{" "}
              adresine yazabilirsiniz.
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
