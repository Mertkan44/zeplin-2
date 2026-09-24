"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
import MediaLightbox, { isVideo, posterFor } from "./MediaLightbox";

/**
 * Galeri: proje verisindeki fotoğraf ve videolardan tekil bir ızgara.
 * Her iş bir kez görünür; proje bazında filtrelenir ve ortak lightbox ile açılır.
 */

type GalleryItem = {
  src: string;
  alt: string;
  poster?: string;
  projectSlug: string;
  projectName: string;
};

const ALL = "tumu";

function buildItems(): GalleryItem[] {
  const seen = new Set<string>();
  const items: GalleryItem[] = [];
  for (const p of projects) {
    const media = p.gallery.length > 0 ? p.gallery : [p.image];
    media.forEach((src, i) => {
      if (seen.has(src)) return;
      seen.add(src);
      items.push({
        src,
        alt: `${p.name} — ${isVideo(src) ? "film" : "görsel"} ${i + 1}`,
        poster: isVideo(src) ? posterFor(src) : undefined,
        projectSlug: p.slug,
        projectName: p.name,
      });
    });
  }
  return items;
}

const allItems = buildItems();

export default function GalleryGrid() {
  const [filter, setFilter] = useState(ALL);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = filter === ALL ? allItems : allItems.filter((it) => it.projectSlug === filter);
  const filters = [
    { id: ALL, label: "Tümü", count: allItems.length },
    ...projects.map((p) => ({
      id: p.slug,
      label: p.name,
      count: allItems.filter((it) => it.projectSlug === p.slug).length,
    })),
  ];

  const open = openIndex !== null ? items[openIndex] : null;

  return (
    <section aria-label="Galeri" className="mx-auto max-w-[1200px] px-5 pb-24 md:px-6">
      {/* Filtreler */}
      <div className="-mx-5 mb-8 overflow-x-auto px-5 md:mx-0 md:px-0">
        <div role="group" aria-label="Projeye göre filtrele" className="flex w-max gap-2 md:w-auto md:flex-wrap">
          {filters.map((f) => {
            const active = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.id)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DB2777] ${
                  active
                    ? "border-[#DB2777] bg-[#DB2777] text-white"
                    : "border-zinc-300 text-zinc-700 hover:border-[#DB2777] dark:border-white/20 dark:text-white/80"
                }`}
              >
                {f.label} <span className={active ? "text-white/80" : "text-zinc-500 dark:text-white/50"}>{f.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Masonry ızgara — orijinal kadraj korunur */}
      <ul className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
        {items.map((item, i) => (
          <li key={item.src} className="mb-3 break-inside-avoid md:mb-4">
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`${item.alt} — ${isVideo(item.src) ? "izle" : "büyüt"}`}
              className="group relative block w-full overflow-hidden rounded-2xl bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DB2777] dark:bg-white/5"
            >
              <Image
                src={item.poster ?? item.src}
                alt=""
                width={0}
                height={0}
                sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, 50vw"
                className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              {isVideo(item.src) && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/25">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#DB2777] shadow-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5.5v13l11-6.5z" />
                    </svg>
                  </span>
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8 text-left text-[13px] font-semibold text-white">
                {item.projectName}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <MediaLightbox
        items={items}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
        footer={
          open && (
            <Link
              href={`/projeler/${open.projectSlug}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#9D174D] hover:bg-white/90"
            >
              {open.projectName} projesini incele →
            </Link>
          )
        }
      />
    </section>
  );
}
