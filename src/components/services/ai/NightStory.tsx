"use client";

/*
 * "23.47" — bir restoranın örnek gecesi. İkon, kutu, şema yok: tipografi, hareket, gren.
 * 1 Sessizlik (saat) → 2 Kaos (ARIYOR…, mesaj yağmuru, cevapsız sayacı) → 3 Kırılma ("Asistan devrede.") → 4 Düzen (mesajlar sütuna dizilir, damgalar basılır) → 5 Sabah (09.00, özet).
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

const DISPLAY = { fontFamily: "var(--font-night-display), var(--font-jost), sans-serif" } as const;
const MONO = { fontFamily: "var(--font-night-mono), ui-monospace, monospace" } as const;

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
  const shown = Math.floor(seg(p, 0.15, 0.34) * NIGHT.length + 0.0001);
  const devrede = seg(p, 0.36, 0.39) * (1 - seg(p, 0.7, 0.75)); // ~0.39–0.58 tam ekran kalır
  const order = ease(seg(p, 0.58, 0.7));
  const morning = seg(p, 0.8, 0.87);
  const chaos = chaosIn * (1 - seg(p, 0.35, 0.4));
  const unanswered = Math.round(shown * (1 - order));
  const clock =
    morning > 0.5 ? "09.00" : shown > 0 ? NIGHT[Math.min(shown, NIGHT.length) - 1].time : "23.47";
  const dark = 1 - morning;
  // "Asistan devrede." beklerken mesajlar geri çekilir, düzene geçerken geri gelir
  const hush = seg(p, 0.37, 0.42) * (1 - seg(p, 0.56, 0.62));

  return (
    <section
      ref={sectionRef}
      aria-labelledby="night-title"
      className={pinned && !reduced ? "relative h-[680svh]" : "relative"}
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
          <div className={`absolute inset-x-5 z-[4] flex items-start justify-between text-[11.5px] uppercase tracking-[0.16em] md:inset-x-12 ${pinned ? "top-28" : "top-5"}`} style={{ ...MONO, opacity: 1 - morning }}>
            <span style={{ color: dark > 0.5 ? "rgba(255,255,255,0.55)" : "#62616B", opacity: 1 - silence }}>Atlas Restoran · örnek gece</span>
            <span className="tabular-nums" style={{ color: dark > 0.5 ? "#F472B6" : "#DB2777", opacity: 1 - silence, fontSize: 16, fontWeight: 500 }}>
              {clock}
            </span>
          </div>

          {/* 1 · Sessizlik */}
          <div className="absolute inset-0 z-[3] grid place-items-center text-center" style={{ opacity: silence }}>
            <div>
              <p className="text-[12px] uppercase tracking-[0.24em] text-[#F472B6]" style={MONO}>Nasıl çalışır</p>
              <p className="mt-4 font-extrabold leading-[0.85] tracking-[-0.06em] text-white tabular-nums" style={{ ...DISPLAY, fontSize: "clamp(120px, 24vw, 340px)" }}>
                23.47
              </p>
              <p className="mt-6 text-[clamp(18px,1.8vw,26px)] text-white/65" style={DISPLAY}>
                Atlas Restoran kapandı. Telefon susmuyor.
              </p>
              <p className="mt-10 text-[11px] uppercase tracking-[0.24em] text-white/35" style={MONO}>{pinned ? "↓ kaydırın" : ""}</p>
            </div>
          </div>

          {/* 2 · Kaos: çalan, ahizeli masa telefonu */}
          <div className="absolute inset-0 z-[1] grid place-items-center" style={{ opacity: chaos }}>
            <RingingPhone ringing={chaos > 0.05 && !reduced} />
          </div>

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
            const stamped = order > 0 && seg(p, 0.66 + i * 0.006, 0.67 + i * 0.006) > 0;
            const isCall = m.kind === "call";
            return (
              <div
                key={i}
                className={`absolute z-[2] ${pinned ? "w-[min(300px,24vw)]" : "w-[44vw]"} ${fresh && !reduced ? "night-pop" : ""}`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${1 - hush * 0.06})`,
                  opacity: (1 - morning) * (1 - hush * 0.86),
                  filter: hush > 0.01 ? `blur(${hush * 4}px)` : undefined,
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
                  <p className={`text-[10.5px] uppercase tracking-[0.12em] ${isCall ? "text-[#FB7185]" : "text-[#62616B]"}`} style={MONO}>
                    {isCall ? "Telefon" : "WhatsApp"} · {m.time}
                  </p>
                  <p className={`mt-1 leading-snug ${pinned ? "text-[15px]" : "text-[12.5px]"} ${isCall ? "font-semibold" : ""}`}>{m.text}</p>
                </div>
                {stamped && (
                  <span
                    style={MONO}
                    className={`absolute rotate-[-6deg] whitespace-nowrap rounded-[3px] border-2 border-[#DB2777] bg-[#0B0A0D] font-bold uppercase text-[#F472B6] ${pinned ? "-right-3 -top-3 px-2 py-1 text-[11px] tracking-[0.12em]" : "-right-1 -top-4 px-1.5 py-0.5 text-[8.5px] tracking-[0.08em]"} ${reduced ? "" : "night-stamp"}`}
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
              className="font-extrabold leading-[0.85] tracking-[-0.05em] tabular-nums"
              style={{ ...DISPLAY, fontSize: "clamp(72px, 10vw, 150px)", color: unanswered > 0 ? "#FB7185" : "#F472B6" }}
            >
              {unanswered}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/55" style={MONO}>cevapsız</p>
          </div>

          {/* 3 · Kırılma */}
          <p
            className="absolute inset-x-0 z-[7] text-center font-extrabold leading-none tracking-[-0.055em] text-white"
            style={{
              top: `${mix(50, pinned ? 9 : 6, order)}%`,
              transform: `translateY(-50%) scale(${mix(1, pinned ? 0.32 : 0.42, order)})`,
              ...DISPLAY,
              fontSize: "clamp(64px, 11vw, 180px)",
              opacity: devrede,
            }}
          >
            Asistan devrede.
          </p>

          {/* 5 · Sabah: tek cümle + gece raporu (adisyon fişi) + akan yetenekler */}
          <div
            className={`absolute inset-0 z-[3] flex flex-col px-5 md:px-12 ${pinned ? "justify-center pt-16" : "justify-start pt-20"}`}
            style={{ opacity: morning, pointerEvents: morning > 0.5 ? "auto" : "none" }}
          >
            <div className="mx-auto grid w-full max-w-[1300px] items-center gap-8 md:grid-cols-[1.25fr_0.75fr] md:gap-16">
              <div style={{ transform: `translateY(${(1 - morning) * 24}px)` }}>
                <p className="text-[11.5px] uppercase tracking-[0.2em] text-[#DB2777]" style={MONO}>
                  09.00 · Atlas Restoran açılıyor
                </p>
                <p className="mt-5 font-bold leading-[1] tracking-[-0.045em] text-[#171719]" style={{ ...DISPLAY, fontSize: "clamp(38px, 5vw, 84px)" }}>
                  Siz uyurken <span className="text-[#DB2777]">{NIGHT.length} kişi</span> yazdı ya da aradı. Hiçbiri cevapsız kalmadı.
                </p>
                <p className="mt-5 max-w-[46ch] text-[clamp(15px,1.25vw,18px)] leading-relaxed text-[#62616B]">
                  Yazanlar WhatsApp&apos;tan, arayanlar telefondan; hepsini aynı asistan karşıladı. Ekibe kalan iki konuşma sabah masada bekliyor.
                </p>
              </div>

              {/* Gece raporu: restoran adisyonu */}
              <div
                className="night-receipt relative mx-auto w-full max-w-[340px] bg-white px-6 pb-8 pt-6 text-[#171719] shadow-[0_30px_60px_rgba(23,23,25,0.14)]"
                style={{ ...MONO, transform: `rotate(${mix(-1, 2.5, morning)}deg) translateY(${(1 - morning) * 40}px)` }}
              >
                <p className="text-center text-[13px] font-bold tracking-[0.2em]">GECE RAPORU</p>
                <p className="mt-1 text-center text-[11px] text-[#62616B]">ATLAS RESTORAN · 23.47–09.00</p>
                <div className="my-4 border-t border-dashed border-[#171719]/40" />
                {[
                  ["Gelen mesaj", NIGHT.filter((n) => n.kind === "msg").length],
                  ["Gelen arama", NIGHT.filter((n) => n.kind === "call").length],
                  ["Rezervasyon", COUNT.rez],
                  ["Yanıtlanan soru", COUNT.soru],
                  ["Ekibe devredilen", COUNT.ekip],
                ].map(([k, v]) => (
                  <p key={k} className="flex items-baseline gap-2 py-[3px] text-[13px]">
                    <span>{k}</span>
                    <span aria-hidden="true" className="flex-1 translate-y-[-3px] border-b border-dotted border-[#171719]/35" />
                    <span className="tabular-nums">{String(v).padStart(2, "0")}</span>
                  </p>
                ))}
                <div className="my-4 border-t border-dashed border-[#171719]/40" />
                <p className="flex items-baseline justify-between text-[16px] font-bold">
                  <span>CEVAPSIZ</span>
                  <span className="text-[#DB2777] tabular-nums">00</span>
                </p>
                <p className="mt-5 text-center text-[10.5px] uppercase tracking-[0.16em] text-[#8E8D99]">örnek gece · işletme kurmaca</p>
              </div>
            </div>
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

/* Kodla çizilmiş retro masa telefonu: çalarken ahize zıplar, yanlardan titreşim çizgileri yayılır. */
function RingingPhone({ ringing }: { ringing: boolean }) {
  return (
    <svg viewBox="0 0 420 340" className="w-[min(560px,78vw)] overflow-visible" aria-hidden="true">
      {/* Titreşim çizgileri */}
      <g className={ringing ? "phone-waves" : ""} fill="none" stroke="#F472B6" strokeWidth="6" strokeLinecap="round" opacity={ringing ? 1 : 0}>
        <path d="M18 70 Q4 100 18 130" />
        <path d="M-8 52 Q-30 100 -8 148" opacity="0.6" />
        <path d="M402 70 Q416 100 402 130" />
        <path d="M428 52 Q450 100 428 148" opacity="0.6" />
      </g>
      {/* Kordon */}
      <path d="M88 250 C40 250 50 290 20 292 C0 293 6 312 -10 318" fill="none" stroke="#9D174D" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 9" />
      {/* Gövde */}
      <path d="M78 318 L342 318 Q366 318 359 294 L318 160 Q312 142 292 142 L128 142 Q108 142 102 160 L61 294 Q54 318 78 318 Z" fill="#DB2777" />
      <path d="M108 168 L312 168" stroke="#F9A8D4" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      {/* Kadran */}
      <circle cx="210" cy="238" r="66" fill="#9D174D" />
      <circle cx="210" cy="238" r="62" fill="none" stroke="#F9A8D4" strokeWidth="2" opacity="0.4" />
      {Array.from({ length: 10 }).map((_, k) => {
        const a = ((k * 30 - 200) * Math.PI) / 180;
        return <circle key={k} cx={210 + 44 * Math.cos(a)} cy={238 + 44 * Math.sin(a)} r="10" fill="#0B0A0D" />;
      })}
      <circle cx="210" cy="238" r="20" fill="#F472B6" />
      {/* Çatal */}
      <rect x="112" y="122" width="34" height="26" rx="8" fill="#BE185D" />
      <rect x="274" y="122" width="34" height="26" rx="8" fill="#BE185D" />
      {/* Ahize */}
      <g className={ringing ? "phone-handset" : ""} style={{ transformOrigin: "210px 120px", transformBox: "view-box" }}>
        <path
          d="M74 128 Q48 128 48 104 L50 82 Q52 58 82 58 L134 60 Q158 62 158 86 L158 94 Q210 78 262 94 L262 86 Q262 62 286 60 L338 58 Q368 58 370 82 L372 104 Q372 128 346 128 L290 128 Q266 128 262 112 Q210 98 158 112 Q154 128 130 128 Z"
          fill="#F472B6"
        />
        <path d="M88 76 L128 77" stroke="#FCE7F3" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      </g>
    </svg>
  );
}
