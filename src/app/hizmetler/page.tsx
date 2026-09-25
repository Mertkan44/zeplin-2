import Image from "next/image";
import Link from "next/link";
import { SERVICE_GROUPS, serviceTabs } from "@/data/services";
import { getProjectBySlug } from "@/data/projects";
import { siteConfig } from "@/lib/seo";
import LegacyTabRedirect from "@/components/services/LegacyTabRedirect";

/*
 * Hizmetler — "editoryal stüdyo" yönü (tasarım çalışması, bölüm 10).
 * Kısa açılış → hizmet indeksi → beş hizmet bölümü → çalışma biçimi → sade kapanış.
 * Sayaç şeridi, büyük AI bandı ve sekmeler kaldırıldı; beş hizmetin tamamı
 * sayfada görünür ve her biri /hizmetler#<id> ile paylaşılabilir.
 */

const STEPS = [
  { title: "İhtiyacı netleştirme", you: "Hedefinizi, mevcut durumu ve beklentinizi paylaşırsınız.", output: "Kısa ihtiyaç özeti" },
  { title: "Kapsam ve plan", you: "Üretilecek işleri ve takvimi birlikte değerlendiririz.", output: "Onaylanan kapsam ve çalışma planı" },
  { title: "Üretim ve değerlendirme", you: "Kararlaştırılan noktalarda geri bildirim verirsiniz.", output: "İncelemeye hazır tasarım ya da üretim" },
  { title: "Teslim ve devam", you: "Çıktıları teslim alır, sonraki ihtiyacı konuşuruz.", output: "Anlaşılan formatlarda teslim" },
];

const CONTAINER = "mx-auto w-full max-w-[1240px] px-5 md:px-10";

export default function HizmetlerPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-[#0a0a0a] dark:text-zinc-100">
      <LegacyTabRedirect />

      {/* ── A: Kısa açılış ─────────────────────────────────────── */}
      <header className={`${CONTAINER} pb-10 pt-32 md:pb-14 md:pt-44`}>
        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#BE185D] dark:text-[#F472B6]">
          Hizmetlerimiz
        </p>
        <div className="mt-4 grid gap-6 md:grid-cols-[1.1fr_1fr] md:items-end md:gap-16">
          <h1 className="text-[42px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[76px]">
            Fikirden{" "}
            <em className="font-normal" style={{ fontFamily: "var(--font-instrument), serif" }}>
              yayına.
            </em>
          </h1>
          <p className="max-w-[46ch] text-[17px] leading-[1.65] text-zinc-700 dark:text-zinc-300 md:text-[18px]">
            Fotoğraf, film, tasarım ve dijital deneyimler üretiyoruz. Markanızın ihtiyacına göre doğru kapsamı
            birlikte belirliyoruz.
          </p>
        </div>

        {/* ── B: Hizmet indeksi ─────────────────────────────────── */}
        <nav aria-label="Hizmet grupları" className="mt-10 border-t border-zinc-200 pt-6 dark:border-white/10 md:mt-14">
          <ol className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:flex lg:flex-wrap lg:gap-x-10">
            {SERVICE_GROUPS.map((group, i) => (
              <li key={group.id}>
                <a
                  href={`#${group.id}`}
                  className="group inline-flex items-baseline gap-2 text-[16px] font-medium text-zinc-800 underline-offset-[6px] hover:text-[#BE185D] hover:underline dark:text-zinc-200 dark:hover:text-[#F472B6] md:text-[17px]"
                >
                  <span className="text-[13px] tabular-nums text-zinc-500 dark:text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
                  {group.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </header>

      {/* ── C: Beş ana hizmet ──────────────────────────────────── */}
      <div className={`${CONTAINER} space-y-20 pb-20 md:space-y-28 md:pb-28`}>
        {SERVICE_GROUPS.map((group, i) => {
          const subServices = serviceTabs.find((t) => t.id === group.id)?.cards ?? [];
          const related = group.relatedProjects.map(getProjectBySlug).filter(Boolean);
          const reversed = i % 2 === 1;

          return (
            <section
              key={group.id}
              id={group.id}
              aria-labelledby={`${group.id}-title`}
              className="grid scroll-mt-28 items-center gap-8 border-t border-zinc-200 pt-10 dark:border-white/10 md:grid-cols-2 md:gap-14 md:pt-14"
            >
              {/* Mobilde önce ad ve açıklama, sonra görsel (bölüm 16.2) */}
              <div className={reversed ? "md:order-2" : undefined}>
                <p className="text-[13px] font-semibold tabular-nums text-zinc-500 dark:text-zinc-400">
                  {String(i + 1).padStart(2, "0")} / {String(SERVICE_GROUPS.length).padStart(2, "0")}
                </p>
                <h2
                  id={`${group.id}-title`}
                  className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[42px]"
                >
                  {group.label}
                </h2>
                <p className="mt-4 max-w-[52ch] text-[17px] leading-[1.65] text-zinc-700 dark:text-zinc-300">
                  {group.summary}
                </p>

                <h3 className="mt-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                  Kapsam
                </h3>
                <ul className="mt-3 divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-white/10 dark:border-white/10">
                  {subServices.map((sub) => (
                    <li key={sub.title}>
                      <Link
                        href={`/hizmetler/${sub.slug}`}
                        className="group flex items-center justify-between gap-4 py-3.5 text-[16px] text-zinc-800 hover:text-[#BE185D] dark:text-zinc-200 dark:hover:text-[#F472B6]"
                      >
                        <span>
                          <span className="font-medium">{sub.title}</span>
                          <span className="ml-2 hidden text-[14px] text-zinc-500 dark:text-zinc-400 sm:inline">— {sub.desc}</span>
                        </span>
                        <span aria-hidden="true" className="shrink-0 transition-transform group-hover:translate-x-1">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className="mt-5 text-[15px] text-zinc-600 dark:text-zinc-400">
                  {related.length > 0 ? (
                    <>
                      İlgili işler:{" "}
                      {related.map((p, j) => (
                        <span key={p!.slug}>
                          {j > 0 && ", "}
                          <Link
                            href={`/projeler/${p!.slug}`}
                            className="font-semibold text-[#BE185D] underline-offset-4 hover:underline dark:text-[#F472B6]"
                          >
                            {p!.name}
                          </Link>
                        </span>
                      ))}
                    </>
                  ) : (
                    <>
                      Yayınlanmış bir proje örneği henüz yok;{" "}
                      <Link
                        href="/hizmetler/yapay-zeka"
                        className="font-semibold text-[#BE185D] underline-offset-4 hover:underline dark:text-[#F472B6]"
                      >
                        örnek senaryolara bakın
                      </Link>
                      .
                    </>
                  )}
                </p>
              </div>

              <figure className={reversed ? "md:order-1" : undefined}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100 dark:bg-white/5">
                  <Image
                    src={group.image}
                    alt={group.imageAlt}
                    fill
                    sizes="(min-width: 768px) 600px, 100vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
                {group.imageIsIllustrative && (
                  <figcaption className="mt-2 text-[13px] text-zinc-500 dark:text-zinc-400">
                    Temsili görsel
                  </figcaption>
                )}
              </figure>
            </section>
          );
        })}
      </div>

      {/* ── D: Çalışma biçimi ──────────────────────────────────── */}
      <section aria-labelledby="process-title" className="bg-zinc-50 py-20 dark:bg-white/[0.03] md:py-28">
        <div className={CONTAINER}>
          <h2 id="process-title" className="text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[42px]">
            Nasıl çalışıyoruz?
          </h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="border-t border-zinc-300 pt-5 dark:border-white/15">
                <span className="text-[14px] font-semibold tabular-nums text-[#BE185D] dark:text-[#F472B6]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-[19px] font-semibold">{step.title}</h3>
                <p className="mt-2 text-[16px] leading-[1.6] text-zinc-700 dark:text-zinc-300">{step.you}</p>
                <p className="mt-3 text-[14px] text-zinc-600 dark:text-zinc-400">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">Çıktı:</span> {step.output}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-[15px] text-zinc-600 dark:text-zinc-400">
            Aylık ve düzenli yürüyen işlerde nasıl çalıştığımızı{" "}
            <Link href="/operasyonlar" className="font-semibold text-[#BE185D] underline-offset-4 hover:underline dark:text-[#F472B6]">
              Operasyonlar
            </Link>{" "}
            sayfasında anlattık.
          </p>
        </div>
      </section>

      {/* ── F: Sade kapanış (ana iletişim vurgusu footer'da) ──────── */}
      <section aria-labelledby="close-title" className={`${CONTAINER} py-20 md:py-24`}>
        <div className="flex flex-col gap-6 border-t border-zinc-200 pt-10 dark:border-white/10 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="close-title" className="text-[28px] font-semibold tracking-[-0.02em] md:text-[36px]">
              Ne üretmek istiyorsunuz?
            </h2>
            <p className="mt-3 max-w-[48ch] text-[17px] leading-[1.6] text-zinc-700 dark:text-zinc-300">
              Markanızı, ihtiyacınızı ve düşündüğünüz zamanı paylaşın. İlk adımı birlikte netleştirelim.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 rounded-full bg-[#DB2777] px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#BE185D]"
            >
              Projeni anlat <span aria-hidden="true">→</span>
            </Link>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-[15px] font-semibold text-zinc-800 underline underline-offset-4 hover:text-[#BE185D] dark:text-zinc-200"
            >
              E-posta gönder
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
