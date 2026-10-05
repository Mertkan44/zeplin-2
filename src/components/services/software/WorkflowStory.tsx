"use client";

/*
 * İmza sahne: dağınık bilgiden ortak kayda (şartname 7.3).
 * - Tek sabitlenen bölüm (190svh); ilerleme = -top / (yükseklik - viewport).
 * - Yalnızca ≥1024px genişlik, ≥760px yükseklik ve hareket tercihi açıkken çalışır;
 *   aksi hâlde aynı içerik sabit kompozisyon olarak normal akışta gösterilir.
 * - Doğal kaydırma korunur (tekerlek/dokunma olayları ele geçirilmez); geri kaydırma
 *   sahneyi tersine oynatır. Demo ile durum paylaşmaz; yalnızca görseli çizer.
 * - Kartlar dekoratiftir (aria-hidden); anlam soldaki metinde normal HTML olarak durur.
 */

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

const QUERY = "(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)";

function subscribe(cb: () => void) {
  const m = window.matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}
const useAnimated = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false, // sunucuda sabit kompozisyon
  );

const STEPS = [
  "Bilgi farklı yerlerde kalmasın.",
  "Talep, sorumlu ve durum birbirine bağlansın.",
  "İşin tamamı aynı kayıtta görülsün.",
  "Şimdi örnek akışı kendiniz deneyin.",
];
const STEP_AT = [0, 0.2, 0.55, 0.8];

const PIECES = [
  { source: "WhatsApp mesajı", field: "Talep", text: "Atlas Atölye — 20 ürün için çekim ve teklif", icon: "chat" },
  { source: "Ekip tablosu", field: "Sorumlu", text: "Deniz · Prodüksiyon", icon: "grid" },
  { source: "E-posta", field: "Hedef", text: "Ay sonu teslim", icon: "mail" },
] as const;

/* Kart anahtar kareleri: [ilerleme, x, y (kap oranı), dönüş°, ölçek] */
const KEYS: [number, number, number, number, number][][] = [
  [[0.12, 0.31, 0.2, -7, 0.92], [0.5, 0.5, 0.25, 0, 1], [0.78, 0.5, 0.4, 0, 0.9]],
  [[0.12, 0.69, 0.47, 6, 0.92], [0.5, 0.5, 0.5, 0, 1], [0.78, 0.5, 0.565, 0, 0.9]],
  [[0.12, 0.35, 0.79, -4, 0.92], [0.5, 0.5, 0.75, 0, 1], [0.78, 0.5, 0.73, 0, 0.9]],
];

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (x: number) => {
  x = clamp(x);
  return x * x * (3 - 2 * x);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

function at(keys: [number, number, number, number, number][], p: number) {
  if (p <= keys[0][0]) return keys[0].slice(1);
  for (let i = 0; i < keys.length - 1; i++) {
    const [p0, ...a] = keys[i];
    const [p1, ...b] = keys[i + 1];
    if (p <= p1) {
      const t = smooth((p - p0) / (p1 - p0));
      return a.map((v, j) => mix(v, b[j], t));
    }
  }
  return keys[keys.length - 1].slice(1);
}

function Icon({ name }: { name: (typeof PIECES)[number]["icon"] }) {
  const common = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  if (name === "chat") return <svg {...common}><path d="M2 3.5h12v7H7l-3 2.5v-2.5H2z" /></svg>;
  if (name === "grid") return <svg {...common}><rect x="2" y="2.5" width="12" height="11" rx="1.5" /><path d="M2 6.5h12M2 10h12M6.5 2.5v11" /></svg>;
  return <svg {...common}><rect x="2" y="3.5" width="12" height="9" rx="1.5" /><path d="m2.5 4.5 5.5 4 5.5-4" /></svg>;
}

const SOURCE_TONE = ["text-emerald-600 dark:text-emerald-300", "text-sky-600 dark:text-sky-300", "text-amber-600 dark:text-amber-300"];

export default function WorkflowStory() {
  const animated = useAnimated();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  const update = useCallback(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const vh = window.innerHeight;
    const r = section.getBoundingClientRect();
    if (r.bottom < -vh || r.top > vh * 2) return; // yalnızca bölüm yakınken hesapla
    const p = clamp(-r.top / Math.max(1, r.height - vh));
    const W = stage.clientWidth;
    const H = stage.clientHeight;

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const [x, y, rot, scale] = at(KEYS[i], p);
      el.style.transform = `translate3d(${(x - 0.5) * W}px, ${(y - 0.5) * H}px, 0) translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`;
      const slotted = smooth((p - 0.6) / 0.18);
      el.style.setProperty("--source", String(1 - smooth((p - 0.55) / 0.15)));
      el.style.setProperty("--field", String(slotted));
      el.style.setProperty("--lift", String(1 - slotted));
    });

    const lineIn = smooth((p - 0.24) / 0.22);
    const lineOut = smooth((p - 0.6) / 0.14);
    if (lineRef.current) {
      lineRef.current.style.opacity = String(lineIn * (1 - lineOut));
      lineRef.current.style.transform = `translateX(-50%) scaleY(${lineIn})`;
    }
    const panel = smooth((p - 0.52) / 0.22);
    if (panelRef.current) {
      panelRef.current.style.opacity = String(panel);
      panelRef.current.style.transform = `translate(-50%, -50%) scale(${0.95 + 0.05 * panel})`;
    }
    if (finalRef.current) finalRef.current.style.opacity = String(smooth((p - 0.8) / 0.12));

    const active = STEP_AT.reduce((acc, t, i) => (p >= t ? i : acc), 0);
    stepRefs.current.forEach((li, i) => li?.setAttribute("data-active", String(i === active)));
  }, []);

  useEffect(() => {
    if (!animated) return;
    let queued = false;
    const schedule = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        update();
      });
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Yazı tipi yüklenince ölçüler değişebilir
    document.fonts?.ready.then(schedule).catch(() => {});
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [animated, update]);

  const copy = (
    <div>
      <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#DB2777] dark:text-[#F472B6]">Nasıl çalışır</p>
      <h2 id="story-title" className="mt-4 text-[clamp(32px,4.2vw,54px)] font-semibold leading-[1.06] tracking-[-0.035em] text-[#171719] dark:text-white">
        Dağınık bilgiden tek bir kayda.
      </h2>
      <ol className="mt-8 space-y-4">
        {STEPS.map((s, i) => (
          <li
            key={s}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            data-active={animated ? String(i === 0) : "true"}
            className="flex gap-4 text-[19px] leading-snug text-[#B0AFB8] transition-colors duration-300 data-[active=true]:text-[#171719] dark:text-white/35 dark:data-[active=true]:text-white"
          >
            <span className="w-6 shrink-0 pt-0.5 text-[14px] font-semibold tabular-nums text-[#DB2777]">0{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
      <a
        href="#demo"
        className="mt-9 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#171719] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#DB2777] dark:bg-white dark:text-[#171719]"
      >
        Örnek akışı dene <span aria-hidden="true">↓</span>
      </a>
    </div>
  );

  /* Ortak kayıt paneli içeriği (hem son sahne hem sabit kompozisyon) */
  const recordHeader = (
    <div className="flex items-center justify-between gap-3 border-b border-[#DAD8DF] px-5 py-4 dark:border-white/10">
      <p className="text-[15px] font-semibold text-[#171719] dark:text-white">Kayıt TLP-1024</p>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-300 bg-sky-50 px-2.5 py-1 text-[12px] font-medium text-sky-700 dark:border-sky-300/30 dark:bg-sky-300/10 dark:text-sky-200">
        <span aria-hidden="true" className="h-2 w-2 rounded-full border-2 border-current" />
        İnceleniyor
      </span>
    </div>
  );

  if (!animated) {
    /* Sabit kompozisyon: mobil, kısa ekran, hareket azaltıldı (ve sunucu çıktısı) */
    return (
      <section aria-labelledby="story-title" className="border-t border-[#DAD8DF] py-20 dark:border-white/10 md:py-28">
        <div className="mx-auto grid w-full max-w-[1240px] gap-12 px-5 md:px-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
          {copy}
          <div aria-hidden="true" className="overflow-hidden rounded-[20px] border border-[#DAD8DF] bg-white shadow-[0_24px_60px_rgba(23,23,25,0.08)] dark:border-white/10 dark:bg-[#1C1C24]">
            {recordHeader}
            <div className="divide-y divide-[#DAD8DF] dark:divide-white/10">
              {PIECES.map((x, i) => (
                <div key={x.field} className="flex items-center gap-4 px-5 py-4">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#F7F6F3] dark:bg-white/5 ${SOURCE_TONE[i]}`}>
                    <Icon name={x.icon} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#62616B] dark:text-white/50">
                      {x.field} <span className="font-normal normal-case tracking-normal">· {x.source} kaynaklı</span>
                    </p>
                    <p className="mt-0.5 text-[16px] font-medium text-[#171719] dark:text-white">{x.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} aria-labelledby="story-title" className="relative h-[190svh] border-t border-[#DAD8DF] dark:border-white/10">
      <div className="sticky top-0 flex h-[100svh] items-center pt-20">
        <div className="mx-auto grid w-full max-w-[1240px] grid-cols-[1fr_1.15fr] items-center gap-16 px-12">
          {copy}
          <div ref={stageRef} aria-hidden="true" className="relative h-[min(560px,62svh)]">
            {/* Ortak kayıt paneli */}
            <div
              ref={panelRef}
              className="absolute left-1/2 top-1/2 h-[78%] w-[76%] overflow-hidden rounded-[20px] border border-[#DAD8DF] bg-white opacity-0 shadow-[0_24px_60px_rgba(23,23,25,0.10)] will-change-transform dark:border-white/10 dark:bg-[#1C1C24]"
              style={{ transform: "translate(-50%, -50%) scale(0.95)" }}
            >
              {recordHeader}
              <div ref={finalRef} className="absolute inset-x-5 bottom-4 flex items-center justify-between text-[13px] text-[#62616B] opacity-0 dark:text-white/55">
                <span>Sonraki adım: sorumlu onayı</span>
                <span className="font-semibold text-[#DB2777]">Aşağıda deneyin ↓</span>
              </div>
            </div>

            {/* Kartları bağlayan hat */}
            <div
              ref={lineRef}
              className="absolute left-1/2 top-[25%] h-[50%] w-[2px] origin-top rounded-full bg-[#DB2777] opacity-0"
              style={{ transform: "translateX(-50%) scaleY(0)" }}
            />

            {/* Üç bilgi parçası */}
            {PIECES.map((x, i) => (
              <div
                key={x.field}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="absolute left-1/2 top-1/2 w-[64%] will-change-transform"
                style={{ transform: "translate(-50%, -50%)", ["--source" as string]: 1, ["--field" as string]: 0, ["--lift" as string]: 1 }}
              >
                <div
                  className="rounded-2xl border bg-white px-4 py-3.5 dark:bg-[#24242E]"
                  style={{
                    borderColor: "rgb(218 216 223 / calc(var(--lift) * 0.4 + 0.6))",
                    boxShadow: "0 18px 40px rgb(23 23 25 / calc(var(--lift) * 0.12))",
                  }}
                >
                  <div className="relative h-[16px] text-[12px] font-semibold uppercase tracking-[0.12em]">
                    <span className={`absolute inset-0 flex items-center gap-2 ${SOURCE_TONE[i]}`} style={{ opacity: "var(--source)" }}>
                      <Icon name={x.icon} />
                      {x.source}
                    </span>
                    <span className="absolute inset-0 flex items-center text-[#62616B] dark:text-white/55" style={{ opacity: "var(--field)" }}>
                      {x.field}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[16px] font-medium leading-snug text-[#171719] dark:text-white">{x.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
