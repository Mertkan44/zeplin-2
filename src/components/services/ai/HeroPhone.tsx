"use client";

/*
 * Açılıştaki 3B telefon: sağdan dönerek gelir, eğik açıyla oturur; önünde "gelen arama" ve
 * "rezervasyon oluşturuldu" kartları farklı derinliklerde belirir. Masaüstünde fareyle hafifçe
 * yön değiştirir. Saf CSS 3B (WebGL yok). Hareket azaltıldığında sabit ve düz durur.
 * Tamamen dekoratif: aynı içerik aşağıdaki demoda okunabilir metin olarak var. Mobilde gizli
 * (demo telefonu hemen altta; aynı sohbet art arda iki kez görünmesin).
 */

import { useEffect, useRef } from "react";

const CHAT = [
  { me: true, text: "Merhaba, bu akşam 4 kişilik yer var mı?" },
  { me: false, text: "Merhaba! 19.30 ve 21.00 için masamız var. Hangisini ayırayım?" },
  { me: true, text: "19.30 olsun, bahçe tarafı olursa çok iyi olur." },
  { me: false, text: "19.30, 4 kişi, bahçe tarafı. Rezervasyonunuz oluşturuldu." },
];

export default function HeroPhone() {
  const stageRef = useRef<HTMLDivElement>(null);

  // Fareyle hafif eğim (yalnızca ince imleçli cihazlarda ve hareket açıkken)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const fine = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!fine.matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        stage.style.setProperty("--tilt-y", `${x * 10}deg`);
        stage.style.setProperty("--tilt-x", `${-y * 8}deg`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={stageRef} aria-hidden="true" className="hero-phone-stage relative mx-auto hidden h-[660px] w-full max-w-[460px] md:block lg:mt-12 min-[1400px]:-ml-14">
      <div className="hero-phone absolute left-1/2 top-1/2 w-[270px] md:w-[300px]">
        {/* Telefon gövdesi */}
        <div className="hero-phone-body rounded-[46px] bg-[#0B0B0F] p-[10px] shadow-[0_50px_100px_rgba(23,23,25,0.35),inset_0_0_0_1.5px_rgba(255,255,255,0.12)]">
          <div className="relative h-[500px] overflow-hidden rounded-[37px] bg-[#EFE9E1] md:h-[600px]">
            <span className="absolute left-1/2 top-2.5 z-10 h-[22px] w-[90px] -translate-x-1/2 rounded-full bg-black" />
            <div className="flex items-center gap-3 bg-[#1F5F4E] px-4 pb-3 pt-10 text-white">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-[13px] font-bold">A</span>
              <div>
                <p className="text-[15px] font-semibold leading-tight">Atlas Restoran</p>
                <p className="text-[12px] text-white/75">Yapay zekâ asistanı · çevrimiçi</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 px-3 pt-4">
              {CHAT.map((m, i) => (
                <p
                  key={i}
                  className={`hero-msg max-w-[84%] rounded-2xl px-3 py-2 text-[13.5px] leading-snug text-[#171719] shadow-[0_1px_1px_rgba(0,0,0,0.08)] ${
                    m.me ? "self-end rounded-br-md bg-[#D7F5CF]" : "self-start rounded-bl-md bg-white"
                  }`}
                  style={{ animationDelay: `${0.9 + i * 0.35}s` }}
                >
                  {m.text}
                </p>
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-[#F7F4EF] px-3 py-3">
              <span className="h-9 flex-1 rounded-full bg-white px-4 text-[13px] leading-9 text-[#9A99A3]">Mesaj</span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1F5F4E] text-white">➤</span>
            </div>
          </div>
        </div>

        {/* Önde yüzen kartlar (farklı derinlik) */}
        <div className="hero-float hero-float-call absolute -left-[12%] top-[14%] w-[210px] md:-left-[20%] md:top-[17%] md:w-[230px] min-[1400px]:-left-[38%] rounded-2xl bg-[#111116] p-3.5 text-white shadow-[0_24px_50px_rgba(17,17,22,0.35)]">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#DB2777] text-[16px]">📞</span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold">Gelen arama</p>
              <p className="truncate text-[12px] text-white/60">Asistan yanıtlıyor · 00:24</p>
            </div>
          </div>
          <div className="mt-3 flex h-7 items-center gap-[3px]">
            {Array.from({ length: 22 }).map((_, i) => (
              <span key={i} className="hero-wave w-[3px] rounded-full bg-[#F472B6]" style={{ height: `${10 + ((i * 37) % 18)}px`, animationDelay: `${(i % 6) * 0.09}s` }} />
            ))}
          </div>
        </div>

        <div className="hero-float hero-float-done absolute -right-[4%] bottom-[14%] md:-right-[22%] md:bottom-[16%] rounded-2xl bg-white px-4 py-3 shadow-[0_24px_50px_rgba(23,23,25,0.18)]">
          <p className="flex items-center gap-2 text-[13.5px] font-semibold text-[#171719]">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-[12px] text-white">✓</span>
            Rezervasyon oluşturuldu
          </p>
          <p className="mt-0.5 pl-8 text-[12.5px] text-[#62616B]">Bu akşam 19.30 · 4 kişi</p>
        </div>
      </div>
    </div>
  );
}
