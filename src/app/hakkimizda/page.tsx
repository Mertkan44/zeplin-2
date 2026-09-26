import Image from "next/image";
import Link from "next/link";
import { ABOUT, ABOUT_RELATED_WORK, APPROACH_FALLBACK, PRINCIPLES } from "@/data/about";
import { getProjectBySlug } from "@/data/projects";
import { whatsappUrl } from "@/lib/contact";
import { siteConfig } from "@/lib/seo";

/*
 * Hakkımızda — "insan ve üretim odaklı stüdyo" yönü (tasarım çalışması, bölüm 9-10).
 * Kimlik → hikâye/model → insanlar → üretimin içinden → ilkeler → ilgili işler → tanışma.
 * Hikâye, kişi ve üretim bölümleri src/data/about.ts dolunca görünür; boşken hiç çıkmaz.
 * Kaldırılanlar: kayan sayaçlar, kelime kelime manifesto, tarihsiz zaman çizgisi,
 * isimsiz unvan alıntıları ve otomatik dönen karusel, tekrarlanan temsili stüdyo görseli.
 */

const CONTAINER = "mx-auto w-full max-w-[1240px] px-5 md:px-10";
const EYEBROW = "text-[13px] font-semibold uppercase tracking-[0.18em] text-[#BE185D] dark:text-[#F472B6]";
const H2 = "text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[40px]";
const BODY = "text-[17px] leading-[1.7] text-zinc-700 dark:text-zinc-300";

export default function HakkimizdaPage() {
  const hasStory = ABOUT.story.length > 0;
  const founder = ABOUT.people[0];
  const related = ABOUT_RELATED_WORK.map((r) => ({ ...r, project: getProjectBySlug(r.slug) })).filter((r) => r.project);

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-[#0a0a0a] dark:text-zinc-100">
      {/* ── 1. Kimlik açılışı ─────────────────────────────────── */}
      <header className={`${CONTAINER} pb-16 pt-32 md:pb-24 md:pt-44`}>
        <div className={`grid gap-10 ${ABOUT.heroPhoto ? "md:grid-cols-[5fr_7fr] md:items-end md:gap-14" : ""}`}>
          <div>
            <p className={EYEBROW}>Hakkımızda</p>
            <h1 className="mt-4 text-[42px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[72px]">
              Zeplin&apos;in{" "}
              <em className="font-normal" style={{ fontFamily: "var(--font-instrument), serif" }}>
                arkasında.
              </em>
            </h1>
            <p className={`mt-6 max-w-[52ch] ${BODY} md:text-[18px]`}>
              Fotoğraf, film, tasarım ve web projeleri üreten bir yaratıcı stüdyoyuz. Burada{" "}
              {hasStory ? "nasıl başladığımızı, " : ""}
              {ABOUT.people.length > 0 ? "üretimi kimlerin üstlendiğini " : "nasıl çalıştığımızı "}
              ve birlikte çalışırken neye önem verdiğimizi anlatıyoruz.
            </p>
            <Link
              href="/projeler"
              className="mt-8 inline-flex text-[16px] font-semibold text-[#BE185D] underline underline-offset-4 dark:text-[#F472B6]"
            >
              Seçili işlerimizi gör →
            </Link>
          </div>
          {ABOUT.heroPhoto && (
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100 dark:bg-white/5">
                <Image src={ABOUT.heroPhoto.src} alt={ABOUT.heroPhoto.alt} fill priority sizes="(min-width: 768px) 700px, 100vw" className="object-cover" />
              </div>
              <figcaption className="mt-2 text-[14px] text-zinc-600 dark:text-zinc-400">{ABOUT.heroPhoto.caption}</figcaption>
            </figure>
          )}
        </div>
      </header>

      {/* ── 2. Hikâye / yaklaşım ve çalışma modeli ────────────── */}
      <section aria-labelledby="story-title" className="border-t border-zinc-200 dark:border-white/10">
        <div className={`${CONTAINER} grid gap-8 py-16 md:grid-cols-[5fr_7fr] md:gap-14 md:py-24`}>
          <h2 id="story-title" className={H2}>
            {hasStory ? "Hikâyemiz" : "Neye bakıyoruz?"}
          </h2>
          <div className="max-w-[62ch] space-y-5">
            {(hasStory ? ABOUT.story : APPROACH_FALLBACK).map((p) => (
              <p key={p.slice(0, 24)} className={BODY}>
                {p}
              </p>
            ))}
            {ABOUT.workModel && <p className={`${BODY} border-l-2 border-[#DB2777] pl-5`}>{ABOUT.workModel}</p>}
            {ABOUT.founderNote && founder && (
              <figure className="mt-10 rounded-xl bg-zinc-50 p-7 dark:bg-white/[0.04]">
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">Kurucudan</p>
                <blockquote className={`mt-3 ${BODY}`}>{ABOUT.founderNote}</blockquote>
                <figcaption className="mt-4 text-[15px] font-semibold">
                  {founder.name} <span className="font-normal text-zinc-600 dark:text-zinc-400">· {founder.role}</span>
                </figcaption>
              </figure>
            )}
          </div>
        </div>
      </section>

      {/* ── 3. İnsanlar (yalnızca gerçek kişiler girildiğinde) ─── */}
      {ABOUT.people.length > 0 && (
        <section aria-labelledby="people-title" className="border-t border-zinc-200 dark:border-white/10">
          <div className={`${CONTAINER} py-16 md:py-24`}>
            <h2 id="people-title" className={H2}>
              İşi kim yapıyor?
            </h2>
            <ul className={`mt-10 grid gap-10 ${ABOUT.people.length > 1 ? "sm:grid-cols-2 lg:grid-cols-3" : "md:max-w-[720px]"}`}>
              {ABOUT.people.map((person) => (
                <li key={person.name} className={ABOUT.people.length === 1 ? "grid gap-6 sm:grid-cols-[220px_1fr]" : undefined}>
                  {person.photo && (
                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-zinc-100 dark:bg-white/5">
                      <Image src={person.photo} alt={person.name} fill sizes="(min-width: 640px) 360px, 100vw" className="object-cover" />
                    </div>
                  )}
                  <div className={person.photo && ABOUT.people.length > 1 ? "mt-4" : undefined}>
                    <h3 className="text-[20px] font-semibold">{person.name}</h3>
                    <p className="text-[15px] text-[#BE185D] dark:text-[#F472B6]">{person.role}</p>
                    <p className="mt-3 text-[16px] leading-[1.65] text-zinc-700 dark:text-zinc-300">{person.responsibility}</p>
                    {person.profileUrl && (
                      <a href={person.profileUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[15px] font-semibold underline underline-offset-4">
                        Profil ↗
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── 4. Üretimin içinden (yalnızca gerçek kareler girildiğinde) ── */}
      {ABOUT.productionPhotos.length > 0 && (
        <section aria-labelledby="inside-title" className="border-t border-zinc-200 dark:border-white/10">
          <div className={`${CONTAINER} py-16 md:py-24`}>
            <h2 id="inside-title" className={H2}>
              Üretimin içinden
            </h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {ABOUT.productionPhotos.map((photo, i) => (
                <li key={photo.src} className={i === 0 ? "md:col-span-2 md:row-span-2" : undefined}>
                  <figure>
                    <div className={`relative overflow-hidden rounded-xl bg-zinc-100 dark:bg-white/5 ${i === 0 ? "aspect-[4/3]" : "aspect-[3/2]"}`}>
                      <Image src={photo.src} alt={photo.alt} fill sizes={i === 0 ? "(min-width: 768px) 800px, 100vw" : "(min-width: 768px) 400px, 100vw"} className="object-cover" />
                    </div>
                    <figcaption className="mt-2 text-[14px] text-zinc-600 dark:text-zinc-400">{photo.caption}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── 5. Çalışma ilkeleri ──────────────────────────────────── */}
      <section aria-labelledby="principles-title" className="bg-zinc-50 dark:bg-white/[0.03]">
        <div className={`${CONTAINER} py-16 md:py-24`}>
          <h2 id="principles-title" className={H2}>
            Birlikte çalışırken
          </h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
            {PRINCIPLES.map((p, i) => {
              const proof = p.projectSlug ? getProjectBySlug(p.projectSlug) : undefined;
              return (
                <li key={p.title} className="border-t border-zinc-300 pt-5 dark:border-white/15">
                  <span className="text-[14px] font-semibold tabular-nums text-[#BE185D] dark:text-[#F472B6]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-[20px] font-semibold leading-snug">{p.title}</h3>
                  <p className="mt-3 text-[16px] leading-[1.65] text-zinc-700 dark:text-zinc-300">{p.body}</p>
                  {proof && (
                    <Link href={`/projeler/${proof.slug}`} className="mt-3 inline-block text-[15px] font-semibold text-[#BE185D] underline-offset-4 hover:underline dark:text-[#F472B6]">
                      Örnek: {proof.name} →
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── 6. İlgili işler ──────────────────────────────────────── */}
      <section aria-labelledby="work-title">
        <div className={`${CONTAINER} py-16 md:py-24`}>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="work-title" className={H2}>
                Bu yaklaşım işlere nasıl yansıyor?
              </h2>
              <p className={`mt-3 ${BODY}`}>Üretim biçimimizi seçili çalışmalarımız üzerinden inceleyin.</p>
            </div>
            <Link href="/projeler" className="w-fit text-[15px] font-semibold text-[#BE185D] underline underline-offset-4 dark:text-[#F472B6]">
              Tüm projeler →
            </Link>
          </div>
          <ul className="mt-10 grid gap-10 md:grid-cols-2 md:gap-8">
            {related.map(({ project, why }) => (
              <li key={project!.slug}>
                <Link href={`/projeler/${project!.slug}`} className="group block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#DB2777]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100 dark:bg-white/5">
                    <Image
                      src={project!.cover ?? project!.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 580px, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
                    />
                  </div>
                  <h3 className="mt-4 text-[22px] font-semibold">{project!.name}</h3>
                  <p className="mt-1 text-[16px] text-zinc-600 dark:text-zinc-400">{why}</p>
                  <span className="mt-2 inline-block text-[15px] font-semibold text-[#BE185D] dark:text-[#F472B6]">Projeyi incele →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 7. Tanışma (sade; ana vurgu footer'da) ─────────────── */}
      <section aria-labelledby="meet-title" className={`${CONTAINER} pb-20 md:pb-24`}>
        <div className="flex flex-col gap-6 border-t border-zinc-200 pt-10 dark:border-white/10 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="meet-title" className="text-[28px] font-semibold tracking-[-0.02em] md:text-[36px]">
              Tanışalım, projenizi konuşalım.
            </h2>
            <p className={`mt-3 max-w-[52ch] ${BODY}`}>
              Markanızı, düşündüğünüz işi ve zaman planınızı kısaca paylaşın. İlk görüşmede ihtiyacı ve uygun çalışma
              kapsamını birlikte netleştirelim.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href={whatsappUrl("Merhaba Zeplin Media, Hakkımızda sayfanızı okudum; tanışıp projemi konuşmak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#DB2777] px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#BE185D]"
            >
              WhatsApp ile yazın <span aria-hidden="true">↗</span>
            </a>
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
