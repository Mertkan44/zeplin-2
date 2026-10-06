"use client";

/*
 * Açılıştaki 3B telefon: sağdan dönerek gelir, eğik açıyla oturur; önünde "gelen arama" ve
 * "rezervasyon oluşturuldu" kartları farklı derinliklerde belirir. Saf CSS 3B (WebGL yok).
 * - Masaüstü: fareyle hafifçe yön değiştirir.
 * - Mobil: cihaz sağa sola eğildikçe döner (jiroskop). iOS izin ister → küçük "Telefonunu eğ"
 *   düğmesi. Sensör yoksa ya da izin verilmezse sayfa kaydırıldıkça hafifçe döner.
 * - Hareket azaltıldığında sabit. Dekoratif: aynı içerik aşağıdaki demoda metin olarak var.
 */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const CHAT = [
  { me: true, text: "Merhaba, bu akşam 4 kişilik yer var mı?" },
  { me: false, text: "Merhaba! 19.30 ve 21.00 için masamız var. Hangisini ayırayım?" },
  { me: true, text: "19.30 olsun, bahçe tarafı olursa çok iyi olur." },
  { me: false, text: "19.30, 4 kişi, bahçe tarafı. Rezervasyonunuz oluşturuldu." },
];

type OrientationCtor = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };
const TOUCH = "(pointer: coarse) and (prefers-reduced-motion: no-preference)";
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** iOS'ta jiroskop izni gerekiyorsa true (yalnızca dokunmatik + hareket açık) */
const useNeedsMotionPermission = () =>
  useSyncExternalStore(
    () => () => {},
    () =>
      window.matchMedia(TOUCH).matches &&
      typeof window.DeviceOrientationEvent !== "undefined" &&
      typeof (window.DeviceOrientationEvent as OrientationCtor).requestPermission === "function",
    () => false,
  );

function setTilt(stage: HTMLElement | null, x: number, y: number) {
  if (!stage) return;
  stage.style.setProperty("--tilt-y", `${x}deg`);
  stage.style.setProperty("--tilt-x", `${y}deg`);
}

export default function HeroPhone() {
  const stageRef = useRef<HTMLDivElement>(null);
  const gyroActive = useRef(false);
  const needsPermission = useNeedsMotionPermission();
  const [permission, setPermission] = useState<"idle" | "granted" | "denied">("idle");

  // Jiroskop: sağa-sola (gamma) ve öne-arkaya (beta; elde tutuş ≈ 50°)
  const onOrientation = useRef((e: DeviceOrientationEvent) => {
    if (e.gamma === null) return;
    gyroActive.current = true;
    const lr = clamp(e.gamma ?? 0, -35, 35) / 35;
    const fb = clamp((e.beta ?? 50) - 50, -30, 30) / 30;
    setTilt(stageRef.current, lr * 22, -fb * 10);
  });

  useEffect(() => {
    let frame = 0;
    const fine = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const touch = window.matchMedia(TOUCH);
    const handler = onOrientation.current;

    // Masaüstü: fare
    const onPointer = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        setTilt(stageRef.current, (e.clientX / window.innerWidth - 0.5) * 10, -(e.clientY / window.innerHeight - 0.5) * 8),
      );
    };
    // Mobil yedek: kaydırdıkça hafif dönüş (jiroskop çalışınca devre dışı)
    const onScroll = () => {
      if (gyroActive.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const p = clamp(window.scrollY / (window.innerHeight * 0.9), 0, 1);
        setTilt(stageRef.current, -14 + p * 30, 4 - p * 8);
      });
    };

    if (fine.matches) window.addEventListener("pointermove", onPointer, { passive: true });
    if (touch.matches) {
      window.addEventListener("scroll", onScroll, { passive: true });
      // İzin gerektirmeyen cihazlarda (Android) jiroskop doğrudan dinlenir
      const ctor = window.DeviceOrientationEvent as OrientationCtor | undefined;
      if (ctor && typeof ctor.requestPermission !== "function") window.addEventListener("deviceorientation", handler);
    }
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("deviceorientation", handler);
    };
  }, []);

  const askPermission = async () => {
    try {
      const result = await (window.DeviceOrientationEvent as OrientationCtor).requestPermission!();
      setPermission(result);
      if (result === "granted") window.addEventListener("deviceorientation", onOrientation.current);
    } catch {
      setPermission("denied");
    }
  };

  return (
    <div className="relative w-full lg:-mt-16 lg:ml-auto lg:max-w-[520px] lg:translate-x-4">
      <div ref={stageRef} aria-hidden="true" className="hero-phone-stage relative mx-auto h-[540px] w-full max-w-[460px] md:h-[660px]">
        <div className="hero-phone absolute left-1/2 top-1/2 w-[250px] md:w-[300px]">
          {/* Telefon gövdesi */}
          <div className="rounded-[44px] bg-[#0B0B0F] p-[10px] shadow-[0_50px_100px_rgba(23,23,25,0.35),inset_0_0_0_1.5px_rgba(255,255,255,0.12)]">
            <div className="relative h-[480px] overflow-hidden rounded-[35px] bg-[#EFE9E1] md:h-[600px]">
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
                    className={`hero-msg max-w-[84%] rounded-2xl px-3 py-2 text-[13px] leading-snug text-[#171719] shadow-[0_1px_1px_rgba(0,0,0,0.08)] md:text-[13.5px] ${
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
          <div className="hero-float hero-float-call absolute -left-[16%] top-[12%] w-[200px] rounded-2xl bg-[#111116] p-3.5 text-white shadow-[0_24px_50px_rgba(17,17,22,0.35)] md:-left-[34%] md:top-[17%] md:w-[230px]">
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

          <div className="hero-float hero-float-done absolute -right-[8%] bottom-[14%] rounded-2xl bg-white px-4 py-3 shadow-[0_24px_50px_rgba(23,23,25,0.18)] md:-right-[22%] md:bottom-[16%]">
            <p className="flex items-center gap-2 text-[13.5px] font-semibold text-[#171719]">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-[12px] text-white">✓</span>
              Rezervasyon oluşturuldu
            </p>
            <p className="mt-0.5 pl-8 text-[12.5px] text-[#62616B]">Bu akşam 19.30 · 4 kişi</p>
          </div>
        </div>
      </div>

      {/* iOS: jiroskop izni yalnızca dokunuşla istenebilir */}
      {needsPermission && permission === "idle" && (
        <button
          type="button"
          onClick={askPermission}
          className="absolute bottom-1 left-1/2 min-h-[44px] -translate-x-1/2 whitespace-nowrap rounded-full border border-[#DAD8DF] bg-white/90 px-4 text-[13px] font-semibold text-[#171719] shadow-[0_8px_24px_rgba(23,23,25,0.12)] backdrop-blur"
        >
          📱 Telefonunu sağa sola eğ
        </button>
      )}
    </div>
  );
}
