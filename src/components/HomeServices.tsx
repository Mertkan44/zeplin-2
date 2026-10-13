"use client";

/*
 * Ana sayfa hizmetleri: beş kartın hepsi aynı dilde — tam kaplayan gerçek medya, üstünde başlık ve
 * tek cümle. Alt hizmet listeleri tıklanan sayfada. Medya kaynağı:
 * - Yapay zekâ: asistan sayfasındaki restoran videosu (stok) + küçük örnek sohbet
 * - Fotoğraf & Video: Milo kokteyl reels'i, Marka: PAM post tasarımları, Sosyal: Babi çekimi (gerçek işler)
 * - Web & Yazılım: kendi Özel Yazılım sayfamızdaki örnek iş panelinin ekran görüntüsü
 * Videolar yalnızca ekrandayken oynar; hareket azaltıldığında poster kalır.
 */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { FONT, revealVariants, revealViewport } from "@/lib/motion";
import { serviceTabs } from "@/data/services";

/* Grup başına tek cümlelik sonuç odaklı açıklama */
const GROUP_COPY: Record<string, string> = {
  "foto-video": "Tanıtım filmi, reels ve ürün çekimiyle markanızı görünür kılan prodüksiyon.",
  "sosyal-icerik": "Planlamadan yayına ve reklama kadar sosyal medya hesaplarınızın yönetimi.",
  "marka-tasarim": "Logodan sosyal medya şablonlarına tutarlı bir görsel kimlik.",
  web: "Hizmetlerinizi net anlatan siteler ve işinize uyan yazılımlar.",
  "ai-otomasyon": "Yazan da arayan da cevapsız kalmasın: sesini ve üslubunu sizin seçtiğiniz asistanlar.",
};

type Media =
  | { kind: "video"; src: string; poster: string; position?: string }
  | { kind: "image"; src: string; position?: string }
  | { kind: "panel"; src: string };

const MEDIA: Record<string, Media> = {
  "ai-otomasyon": { kind: "video", src: "/videos/assistants/restoran.mp4", poster: "/videos/assistants/posters/restoran.jpg" },
  "foto-video": { kind: "video", src: "/videos/milo-kokteyl-web.mp4", poster: "/videos/posters/milo-kokteyl-kart.jpg", position: "50% 62%" },
  "marka-tasarim": { kind: "image", src: "/images/services/post-tasarimi.webp", position: "50% 40%" },
  "sosyal-icerik": { kind: "image", src: "/images/projects-babi-cover.webp", position: "50% 35%" },
  web: { kind: "panel", src: "/images/services/web-ornek-panel.webp" },
};

const REDUCED = "(prefers-reduced-motion: reduce)";
const useReducedMotion = () =>
  useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(REDUCED);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(REDUCED).matches,
    () => true,
  );

/** Ekrandayken oynayan, dışındayken duran sessiz döngü */
function CardVideo({ src, poster, position, onVisible }: { src: string; poster: string; position?: string; onVisible?: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    el.muted = true; // Safari: istemcide oluşan videoda muted geç uygulanırsa otomatik oynatma engellenir
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          onVisible?.();
          void el.play().catch(() => {});
        } else el.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, onVisible]);

  return (
    <video
      ref={ref}
      src={reduced ? undefined : src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[var(--dur-4)] group-hover:scale-[1.04]"
      style={{ objectPosition: position }}
    />
  );
}

/** Yapay zekâ kartındaki küçük örnek sohbet: kart görününce sırayla düşer */
function MiniChat({ show }: { show: boolean }) {
  const bubble = "max-w-[280px] rounded-2xl px-3.5 py-2 text-[13.5px] leading-snug shadow-[0_8px_24px_rgba(0,0,0,0.25)]";
  return (
    <div aria-hidden="true" className="absolute left-5 right-5 top-5 flex flex-col gap-2 md:left-7 md:top-7">
      <p className={`${bubble} self-end rounded-br-md bg-[#D7F5CF] text-[#171719] ${show ? "ai-in" : "opacity-0"}`}>Bu akşam 4 kişilik yer var mı?</p>
      <p
        className={`${bubble} self-start rounded-bl-md bg-white text-[#171719] ${show ? "ai-in" : "opacity-0"}`}
        style={{ animationDelay: "900ms" }}
      >
        19.30 ve 21.00 boş. Hangisini ayırayım?
      </p>
    </div>
  );
}

function CardMedia({ id, onVisible }: { id: string; onVisible?: () => void }) {
  const m = MEDIA[id];
  if (!m) return null;
  if (m.kind === "video") return <CardVideo src={m.src} poster={m.poster} position={m.position} onVisible={onVisible} />;
  if (m.kind === "image")
    return (
      // eslint-disable-next-line @next/next/no-img-element -- zaten optimize edilmiş webp; kart boyutu değişken
      <img
        src={m.src}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[var(--dur-4)] group-hover:scale-[1.04]"
        style={{ objectPosition: m.position }}
      />
    );
  /* Örnek iş paneli: kendi yaptığımız arayüzün gerçek ekran görüntüsü, kartın sağına taşarak */
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-[#22131D] bg-[radial-gradient(120%_90%_at_100%_0%,rgba(219,39,119,0.35)_0%,rgba(219,39,119,0)_60%)]">
      <div className="absolute left-[8%] top-[10%] w-[150%] overflow-hidden rounded-[14px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] ring-1 ring-white/10 transition-transform duration-[var(--dur-4)] group-hover:-translate-x-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- dekoratif ekran görüntüsü */}
        <img src={m.src} alt="" loading="lazy" className="block w-full" />
      </div>
    </div>
  );
}

function ServiceCard({ group, index }: { group: (typeof serviceTabs)[number]; index: number }) {
  const big = index === 0;
  const reduced = useReducedMotion();
  const [seen, setSeen] = useState(false);
  const markSeen = useCallback(() => setSeen(true), []);

  return (
    <Link
      href={`/hizmetler#${group.id}`}
      className={`group relative isolate flex h-full flex-col justify-end overflow-hidden rounded-[24px] bg-[#1B1A20] p-6 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DB2777] md:p-7 ${
        big ? "min-h-[440px] sm:min-h-[520px] lg:min-h-0" : "min-h-[300px] lg:min-h-0"
      }`}
    >
      <div className="absolute inset-0 -z-10">
        <CardMedia id={group.id} onVisible={big ? markSeen : undefined} />
        {big && <MiniChat show={seen || reduced} />}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,12,15,0)_35%,rgba(14,12,15,0.55)_62%,rgba(14,12,15,0.9)_100%)]" />
      </div>

      <div className="flex items-end justify-between gap-5">
        <div className="min-w-0">
          <h3 className={`font-semibold leading-tight tracking-[-0.02em] ${big ? "text-[28px] md:text-[34px]" : "text-[22px] md:text-[24px]"}`} style={FONT}>
            {group.label}
          </h3>
          <p className={`mt-2 max-w-[36ch] leading-[1.55] text-white/80 ${big ? "text-[16px] md:text-[17px]" : "text-[15px]"}`}>{GROUP_COPY[group.id]}</p>
        </div>
        <span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15 text-[18px] backdrop-blur-md transition-[background-color,color] duration-[var(--dur-2)] group-hover:bg-white group-hover:text-[#171719]"
        >
          <span className="inline-block transition-transform duration-[var(--dur-2)] group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </Link>
  );
}

export default function HomeServices() {
  return (
    <section aria-labelledby="home-services-title" className="px-5 py-[var(--home-space)] md:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          custom={0}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#DB2777] dark:text-[#F472B6]" style={FONT}>
              Hizmetler
            </p>
            <h2
              id="home-services-title"
              className="mt-3 max-w-[18ch] text-[32px] font-semibold leading-[1.08] tracking-[-0.02em] text-zinc-900 dark:text-white md:text-[44px]"
              style={FONT}
            >
              Neye ihtiyacınız varsa oradan başlayalım.
            </h2>
          </div>
          <Link
            href="/hizmetler"
            className="group w-fit text-[15px] font-semibold text-[#DB2777] dark:text-[#F472B6]"
            style={FONT}
          >
            Tüm hizmetler{" "}
            <span aria-hidden="true" className="inline-block transition-transform duration-[var(--dur-2)] group-hover:translate-x-1">
              →
            </span>
          </Link>
        </motion.div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-3 lg:grid-rows-[320px_320px]">
          {serviceTabs.map((group, i) => (
            <motion.li
              key={group.id}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              custom={i * 0.06}
              className={i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : undefined}
            >
              <ServiceCard group={group} index={i} />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
