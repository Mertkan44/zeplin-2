import Image from "next/image";
import Link from "next/link";
import { projectsInListOrder, type ProjectData } from "@/data/projects";

/*
 * Projeler — tasarım çalışması bölüm 12.
 * Kısa açılış → öne çıkan iş (tam genişlik) → iki sütunlu devam alanı → sade kapanış.
 * Metin görselin dışında, altta; kapaklar karartılmıyor.
 */

const CONTAINER = "mx-auto w-full max-w-[1240px] px-5 md:px-10";

function ProjectCard({ project, featured = false }: { project: ProjectData; featured?: boolean }) {
  return (
    <Link
      href={`/projeler/${project.slug}`}
      className="group block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#DB2777]"
    >
      <div
        className={`relative overflow-hidden rounded-xl bg-zinc-100 dark:bg-white/5 ${
          featured ? "aspect-[4/3] md:aspect-[16/9]" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={project.cover ?? project.image}
          alt=""
          fill
          priority={featured}
          sizes={featured ? "(min-width: 1280px) 1160px, 100vw" : "(min-width: 768px) 580px, 100vw"}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          style={{ objectPosition: project.cover ? "center" : project.imagePosition ?? "center" }}
        />
      </div>
      <div className={`flex items-start justify-between gap-6 ${featured ? "mt-5" : "mt-4"}`}>
        <div>
          <h2
            className={`font-semibold tracking-[-0.02em] text-zinc-900 dark:text-white ${
              featured ? "text-[26px] md:text-[32px]" : "text-[22px] md:text-[26px]"
            }`}
          >
            {project.name}
          </h2>
          <p className="mt-1 text-[16px] text-zinc-600 dark:text-zinc-400 md:text-[17px]">{project.cardSummary}</p>
          {project.coverIsPlaceholder && (
            <p className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">Kapak geçici; ekran görüntüleri hazırlanıyor.</p>
          )}
        </div>
        <span className="mt-2 shrink-0 text-[15px] font-semibold text-[#BE185D] dark:text-[#F472B6]">
          Projeyi incele <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

export default function ProjelerPage() {
  const [featured, ...rest] = projectsInListOrder;

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-[#0a0a0a] dark:text-zinc-100">
      {/* ── A: Kısa açılış ─────────────────────────────────────── */}
      <header className={`${CONTAINER} pb-10 pt-32 md:pb-14 md:pt-44`}>
        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#BE185D] dark:text-[#F472B6]">
          Projelerimiz
        </p>
        <div className="mt-4 grid gap-6 md:grid-cols-[1.1fr_1fr] md:items-end md:gap-16">
          <h1 className="text-[42px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[76px]">
            İşimiz{" "}
            <em className="font-normal" style={{ fontFamily: "var(--font-instrument), serif" }}>
              konuşsun.
            </em>
          </h1>
          <p className="max-w-[44ch] text-[17px] leading-[1.65] text-zinc-700 dark:text-zinc-300 md:text-[18px]">
            Fotoğraftan filme, marka kimliğinden web deneyimine seçili çalışmalarımız.
          </p>
        </div>
      </header>

      {/* ── B: Öne çıkan proje ─────────────────────────────────── */}
      <section aria-label="Öne çıkan proje" className={CONTAINER}>
        <ProjectCard project={featured} featured />
      </section>

      {/* ── C: İki sütunlu devam ───────────────────────────────── */}
      <section aria-label="Diğer projeler" className={`${CONTAINER} mt-16 md:mt-20`}>
        <ul className="grid gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-14">
          {rest.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </section>

      {/* ── D: Kısa kapanış (ana iletişim vurgusu footer'da) ──────── */}
      <section className={`${CONTAINER} py-20 md:py-24`}>
        <div className="flex flex-col gap-4 border-t border-zinc-200 pt-8 dark:border-white/10 md:flex-row md:items-center md:justify-between">
          <p className="text-[20px] font-medium text-zinc-800 dark:text-zinc-200 md:text-[22px]">
            Benzer bir üretim mi düşünüyorsunuz?
          </p>
          <Link
            href="/iletisim"
            className="w-fit text-[16px] font-semibold text-[#BE185D] underline underline-offset-4 dark:text-[#F472B6]"
          >
            Projeni anlat →
          </Link>
        </div>
      </section>
    </main>
  );
}
