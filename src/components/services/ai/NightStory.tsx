"use client";

/*
 * "23.47" — bir restoranın örnek gecesi. İkon, kutu, şema yok: tipografi, hareket, gren.
 * 1 Sessizlik (saat) → 2 Kaos (ARIYOR…, mesaj yağmuru, cevapsız sayacı) → 3 Kırılma (pembe flaş,
 * "Asistan devrede.") → 4 Düzen (mesajlar sütuna dizilir, damgalar basılır) → 5 Sabah (09.00, özet).
 * Masaüstü: kaydırmaya sabitlenmiş sahne, ilerleme = kaydırma. Mobil / kısa ekran: görünür olunca
 * kendi kendine oynar (bir kez), sonunda "Tekrar oynat". Hareket azaltıldığında son kare.
 * Rakamlar kurmacadır ve "örnek gece" olarak etiketlenir; aşağıdaki mesajlardan türetilir.
 */

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

type Item = { kind: "msg" | "call"; text: string; time: string; stamp: string; tag: "rez" | "soru" | "ekip" };

const NIGHT: Item[] = [
  { kind: "msg", text: "Yarın akşam 4 kişi yer var mı?", time: "23.49", stamp: "REZERVE · 20.00", tag: "rez" },
  { kind: "call", text: "Cevapsız arama", time: "23.52", stamp: "KARŞILANDI · REZERVE", tag: "rez" },
  { kind: "msg", text: "Adresiniz tam olarak nerede?", time: "23.55", stamp: "KONUM GÖNDERİLDİ", tag: "soru" },
  { kind: "msg", text: "Vegan seçeneğiniz var mı?", time: "23.58", stamp: "MENÜ GÖNDERİLDİ", tag: "soru" },
  { kind: "call", text: "Cevapsız arama", time: "00.04", stamp: "KARŞILANDI · 2 KİŞİ", tag: "rez" },
  { kind: "msg", text: "Pazar günü açık mısınız?", time: "00.07", stamp: "YANITLANDI", tag: "soru" },
  { kind: "msg", text: "Doğum günü için pasta getirebilir miyiz?", time: "00.11", stamp: "EKİBE AKTARILDI", tag: "ekip" },
  { kind: "call", text: "Cevapsız arama", time: "00.16", stamp: "KARŞILANDI · REZERVE", tag: "rez" },
  { kind: "msg", text: "Cumartesi 6 kişiyiz, bahçe olur mu?", time: "00.22", stamp: "REZERVE · BAHÇE", tag: "rez" },
  { kind: "msg", text: "Rezervasyonumu bir saat ileri alabilir miyim?", time: "00.25", stamp: "GÜNCELLENDİ", tag: "soru" },
  { kind: "call", text: "Cevapsız arama", time: "00.29", stamp: "KARŞILANDI · YANITLANDI", tag: "soru" },
  { kind: "msg", text: "Ödemede sorun yaşadım, kiminle görüşebilirim?", time: "00.31", stamp: "EKİBE AKTARILDI", tag: "ekip" },
];
const COUNT = { rez: NIGHT.filter((n) => n.tag === "rez").length, soru: NIGHT.filter((n) => n.tag === "soru").length, ekip: NIGHT.filter((n) => n.tag === "ekip").length };

/* Kaos: dağınık konumlar (merkez, %), düzen: iki sütun */
const SCATTER = [
  [22, 24, -7], [66, 16, 5], [38, 60, -3], [76, 48, 8], [18, 74, 5], [52, 34, -9],
  [70, 78, -4], [28, 44, 10], [82, 28, -6], [46, 84, 3], [60, 60, -5], [14, 52, 7],
] as const;
const ORDER = NIGHT.map((_, i) => [i < 6 ? 30 : 70, 22 + (i % 6) * 11.5]);
/* Mobil: kenara taşmasın diye dağınıklık daraltılır, sütunlar kenara yaklaşır */
const ORDER_M = NIGHT.map((_, i) => [i < 6 ? 26 : 74, 17 + (i % 6) * 12.6]);

const WORDS = ["REZERVASYON", "RANDEVU", "SIK SORULANLAR", "SİPARİŞ TAKİBİ", "GECE YARISI", "EKİBE DEVİR", "KAYIT VE ÖZET"];

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const media = (q: string) =>
  function useMedia(fallback: boolean) {
    return useSyncExternalStore(
      (cb) => {
        const m = window.matchMedia(q);
        m.addEventListener("change", cb);
        return () => m.removeEventListener("change", cb);
      },
      () => window.matchMedia(q).matches,
      () => fallback,
    );
  };
const useReduced = media("(prefers-reduced-motion: reduce)");
const usePinned = media("(min-width: 1024px) and (min-height: 700px)");

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")";

export default function NightStory() {
  const reduced = useReduced(true);
  const pinned = usePinned(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollP, setScrollP] = useState(0);
  const [playP, setPlayP] = useState(0);
  const played = useRef(false);

  /* Masaüstü: kaydırma ilerlemesi */
  useEffect(() => {
    if (!pinned || reduced) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setScrollP(clamp(-r.top / Math.max(1, r.height - window.innerHeight)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinned, reduced]);

  /* Mobil: görünür olunca kendiliğinden oynat (16 sn) */
  const play = useCallback(() => {
    const start = performance.now();
    const step = (now: number) => {
      const t = clamp((now - start) / 16000);
      setPlayP(t);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);
  useEffect(() => {
    if (pinned || reduced) return;
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !played.current) {
          played.current = true;
          play();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pinned, reduced, play]);

  const p = reduced ? 1 : pinned ? scrollP : playP;

  /* Evreler */
  const silence = 1 - seg(p, 0.08, 0.14);
  const chaosIn = seg(p, 0.12, 0.18);
  const shown = Math.floor(seg(p, 0.15, 0.4) * NIGHT.length + 0.0001);
  const flash = p < 0.455 ? seg(p, 0.41, 0.455) : 1 - seg(p, 0.455, 0.52);
  const devrede = seg(p, 0.43, 0.47) * (1 - seg(p, 0.6, 0.66));
  const order = ease(seg(p, 0.5, 0.64));
  const morning = seg(p, 0.72, 0.8);
  const chaos = chaosIn * (1 - seg(p, 0.42, 0.48));
  const unanswered = Math.round(shown * (1 - order));
  const clock =
    morning > 0.5 ? "09.00" : shown > 0 ? NIGHT[Math.min(shown, NIGHT.length) - 1].time : "23.47";
  const dark = 1 - morning;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="night-title"
      className={pinned && !reduced ? "relative h-[560svh]" : "relative"}
    >
      <div
        className={`${pinned && !reduced ? "sticky top-0 h-[100svh]" : "h-[800px]"} relative overflow-hidden`}
        style={{ background: `rgb(${mix(247, 11, dark)} ${mix(246, 10, dark)} ${mix(243, 13, dark)})` }}
      >
        {/* Gren */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] mix-blend-overlay" style={{ backgroundImage: GRAIN, opacity: 0.35 }} />

        {/* Erişilebilir anlatım (görsel sahne dekoratif) */}
        <div className="sr-only">
          <h2 id="night-title">Bir gece, bir asistan.</h2>
          <p>
            Saat 23.47, restoran kapandı. Gece boyunca {NIGHT.length} mesaj ve arama geldi. Asistan hepsini karşıladı: {COUNT.rez} rezervasyon,
            {" "}{COUNT.soru} soru yanıtlandı, {COUNT.ekip} konuşma ekibe devredildi. Örnek gece; işletme kurmacadır.
          </p>
        </div>

        <div aria-hidden="true" className="absolute inset-0">
          {/* Üst satır: etiketler + saat */}
          <div className={`absolute inset-x-5 z-[4] flex items-start justify-between text-[12px] font-semibold uppercase tracking-[0.18em] md:inset-x-12 ${pinned ? "top-28" : "top-5"}`} style={{ opacity: 1 - morning }}>
            <span style={{ color: dark > 0.5 ? "rgba(255,255,255,0.55)" : "#62616B", opacity: 1 - silence }}>Atlas Restoran · örnek gece</span>
            <span className="tabular-nums" style={{ color: dark > 0.5 ? "#F472B6" : "#DB2777", opacity: 1 - silence, fontSize: 15 }}>
              {clock}
            </span>
          </div>

          {/* 1 · Sessizlik */}
          <div className="absolute inset-0 z-[3] grid place-items-center text-center" style={{ opacity: silence }}>
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[#F472B6]">Nasıl çalışır</p>
              <p className="mt-6 font-semibold leading-none tracking-[-0.06em] text-white tabular-nums" style={{ fontSize: "clamp(110px, 22vw, 300px)" }}>
                23.47
              </p>
              <p className="mt-6 text-[clamp(17px,1.6vw,22px)] text-white/60">Atlas Restoran kapandı. Telefon susmuyor.</p>
              <p className="mt-10 text-[12px] uppercase tracking-[0.2em] text-white/35">{pinned ? "Kaydırın" : ""}</p>
            </div>
          </div>

          {/* 2 · Kaos: ARIYOR */}
          <p
            className={`absolute left-1/2 top-1/2 z-[1] whitespace-nowrap font-semibold leading-none tracking-[-0.07em] ${chaos > 0.05 && !reduced ? "night-shake" : ""}`}
            style={{ translate: "-50% -50%", fontSize: "clamp(90px, 17vw, 260px)", color: "rgba(255,255,255,0.08)", opacity: chaos, WebkitTextStroke: "1.5px rgba(244,114,182,0.45)" }}
          >
            ARIYOR…
          </p>

          {/* Mesajlar */}
          {NIGHT.map((m, i) => {
            const visible = i < shown || order > 0;
            if (!visible || morning >= 1) return null;
            const [sx0, sy, sr] = SCATTER[i];
            const sx = pinned ? sx0 : 50 + (sx0 - 50) * 0.55;
            const [ox, oy] = (pinned ? ORDER : ORDER_M)[i];
            const x = mix(sx, ox, order);
            const y = mix(sy, oy, order);
            const rot = mix(sr, 0, order);
            const fresh = i === shown - 1 && order === 0;
            const stamped = order > 0 && seg(p, 0.6 + i * 0.008, 0.62 + i * 0.008) > 0;
            const isCall = m.kind === "call";
            return (
              <div
                key={i}
                className={`absolute z-[2] ${pinned ? "w-[min(300px,24vw)]" : "w-[44vw]"} ${fresh && !reduced ? "night-pop" : ""}`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `translate(-50%, -50%) rotate(${rot}deg)`,
                  opacity: 1 - morning,
                }}
              >
                <div
                  className={pinned ? "rounded-2xl px-4 py-3" : "rounded-xl px-3 py-2"}
                  style={{
                    background: isCall ? (order > 0.5 ? "#1C1C24" : "#2A0F17") : "#F4F1EC",
                    color: isCall ? "#fff" : "#171719",
                    boxShadow: order > 0.5 ? "0 10px 30px rgba(0,0,0,0.35)" : "0 18px 40px rgba(0,0,0,0.5)",
                  }}
                >
                  <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${isCall ? "text-[#FB7185]" : "text-[#62616B]"}`}>
                    {isCall ? "Telefon" : "WhatsApp"} · {m.time}
                  </p>
                  <p className={`mt-1 leading-snug ${pinned ? "text-[15px]" : "text-[12.5px]"} ${isCall ? "font-semibold" : ""}`}>{m.text}</p>
                </div>
                {stamped && (
                  <span
                    className={`absolute rotate-[-6deg] whitespace-nowrap rounded-md border-2 border-[#DB2777] bg-[#0B0A0D] font-bold text-[#F472B6] ${pinned ? "-right-3 -top-3 px-2 py-1 text-[11px] tracking-[0.12em]" : "-right-1 -top-4 px-1.5 py-0.5 text-[8.5px] tracking-[0.08em]"} ${reduced ? "" : "night-stamp"}`}
                  >
                    {m.stamp}
                  </span>
                )}
              </div>
            );
          })}

          {/* Cevapsız sayacı */}
          <div className="absolute bottom-10 right-6 z-[4] text-right md:bottom-14 md:right-12" style={{ opacity: Math.max(chaosIn * (1 - morning), 0) }}>
            <p
              className="font-semibold leading-none tracking-[-0.06em] tabular-nums"
              style={{ fontSize: "clamp(56px, 8vw, 120px)", color: unanswered > 0 ? "#FB7185" : "#F472B6" }}
            >
              {unanswered}
            </p>
            <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/55">cevapsız</p>
          </div>

          {/* 3 · Kırılma */}
          <div className="pointer-events-none absolute inset-0 z-[6] bg-[#DB2777]" style={{ opacity: flash * 0.92 }} />
          <p
            className="absolute inset-x-0 z-[7] text-center font-semibold leading-none tracking-[-0.06em] text-white"
            style={{
              top: `${mix(50, pinned ? 9 : 6, order)}%`,
              transform: `translateY(-50%) scale(${mix(1, pinned ? 0.32 : 0.42, order)})`,
              fontSize: "clamp(64px, 11vw, 170px)",
              opacity: devrede,
            }}
          >
            Asistan devrede.
          </p>

          {/* 5 · Sabah */}
          <div className={`absolute inset-0 z-[3] flex flex-col px-5 md:px-12 ${pinned ? "justify-center pt-16" : "justify-start pt-24"}`} style={{ opacity: morning, pointerEvents: morning > 0.5 ? "auto" : "none" }}>
            <div className="mx-auto w-full max-w-[1300px]">
              <p className="font-semibold leading-none tracking-[-0.06em] text-[#171719] tabular-nums" style={{ fontSize: "clamp(80px, 13vw, 200px)" }}>
                09.00
              </p>
              <p className="mt-4 max-w-[30ch] text-[clamp(20px,2vw,28px)] leading-snug text-[#3A3942]">
                Restoran açılmadan gece kapanmış:{" "}
                <span className="text-[#62616B]">yazanlar WhatsApp&apos;tan, arayanlar telefondan; hepsini aynı asistan karşıladı.</span>
              </p>
              <dl className="mt-10 grid grid-cols-2 gap-x-10 gap-y-6 md:grid-cols-4">
                {[
                  [COUNT.rez, "rezervasyon"],
                  [COUNT.soru, "soru yanıtlandı"],
                  [COUNT.ekip, "konuşma ekibe devredildi"],
                  [0, "cevapsız"],
                ].map(([n, l], i) => (
                  <div key={l} className="border-t-2 border-[#171719] pt-3">
                    <dt className="sr-only">{l}</dt>
                    <dd>
                      <span className={`block font-semibold leading-none tracking-[-0.05em] tabular-nums ${i === 3 ? "text-[#DB2777]" : "text-[#171719]"}`} style={{ fontSize: "clamp(48px, 6vw, 88px)" }}>
                        {n}
                      </span>
                      <span className="mt-2 block text-[15px] text-[#62616B]">{l}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            {/* Akan yetenekler */}
            <div className="mt-12 overflow-hidden whitespace-nowrap border-y border-[#171719]/15 py-4">
              <div className={`inline-flex gap-10 ${reduced ? "" : "night-marquee"}`}>
                {[...WORDS, ...WORDS].map((w, i) => (
                  <span key={i} className="font-semibold tracking-[-0.04em] text-transparent" style={{ fontSize: "clamp(36px, 4.5vw, 64px)", WebkitTextStroke: "1.5px #171719" }}>
                    {w} <span className="text-[#DB2777]" style={{ WebkitTextStroke: 0 }}>·</span>
                  </span>
                ))}
              </div>
            </div>
            <p className="mx-auto mt-4 w-full max-w-[1300px] text-[12.5px] text-[#8E8D99]">Örnek gece: işletme ve rakamlar kurmacadır.</p>
          </div>
        </div>

        {/* Mobil: tekrar oynat */}
        {!pinned && !reduced && playP >= 1 && (
          <button
            type="button"
            onClick={play}
            className="absolute bottom-4 left-1/2 z-[8] -translate-x-1/2 rounded-full border border-[#171719]/20 bg-white/80 px-4 py-2 text-[13px] font-semibold text-[#171719] backdrop-blur"
          >
            Geceyi tekrar oynat
          </button>
        )}
      </div>
    </section>
  );
}
