"use client";

/*
 * "İki kanal, tek asistan" + "Neleri üstlenir" tek bölümde, kodla çizilmiş akış:
 * kanallardan (Chatbot / Callbot) gelen istekler ışıklı noktalar olarak asistana akar, oradan
 * sırayla ilgili sonuca gider ve o satır vurgulanır. 12 sn'lik döngü, 6 olay (her biri 2 sn).
 * SVG + SMIL (Safari ve Chrome'da çalışır); hareket azaltıldığında noktalar çizilmez.
 * Geniş ekran (≥1280px) diyagram; daha dar ekranlarda aynı içerik sade, hareketsiz liste.
 */

import { useSyncExternalStore } from "react";
import { CAPABILITIES, CHANNELS } from "@/data/assistants";
import { IconBox, IconCalendar, IconChat, IconHandoff, IconMoon, IconPanel, IconPhone, IconQuestion } from "./icons";

const CAP_ICONS = [IconCalendar, IconQuestion, IconBox, IconMoon, IconHandoff, IconPanel];

/* Diyagram koordinatları (viewBox 1200×600) */
const W = 1200;
const H = 600;
const CARD = { x: 0, w: 340, chat: { y: 60, h: 220 }, call: { y: 320, h: 220 } };
const HUB = { x: 600, y: 300, r: 74 };
const OUT_X = 862;
const ROW_H = 92;
const ROWS = CAPABILITIES.map((_, i) => 24 + i * ROW_H + ROW_H / 2); // satır merkezleri

const inPath = (y: number) => `M${CARD.w},${y} C${CARD.w + 140},${y} ${HUB.x - HUB.r - 80},${HUB.y} ${HUB.x - HUB.r},${HUB.y}`;
const outPath = (y: number) => `M${HUB.x + HUB.r},${HUB.y} C${HUB.x + HUB.r + 90},${HUB.y} ${OUT_X - 110},${y} ${OUT_X - 8},${y}`;
const CHAT_IN = inPath(CARD.chat.y + CARD.chat.h / 2);
const CALL_IN = inPath(CARD.call.y + CARD.call.h / 2);

/* Hangi sonuç hangi kanaldan gelir (sıra = CAPABILITIES sırası) */
const SOURCE: ("chat" | "call")[] = ["chat", "call", "chat", "call", "call", "chat"];
const T = 12; // döngü (sn)
const SLOT = 2;

/** 0..1 arası anahtar zamanlar (yinelenenleri ayıklar, SMIL artan dizi ister) */
function keys(start: number, end: number) {
  const s = start / T;
  const e = end / T;
  const times = [0, s, e, Math.min(1, e + 0.0001), 1];
  const pts = [0, 0, 1, 1, 1];
  const op = [0, 1, 1, 0, 0];
  const out: { t: number; p: number; o: number }[] = [];
  times.forEach((t, i) => {
    if (out.length && t <= out[out.length - 1].t) {
      out[out.length - 1] = { t, p: pts[i], o: op[i] };
    } else out.push({ t, p: pts[i], o: op[i] });
  });
  if (out[0].t !== 0) out.unshift({ t: 0, p: 0, o: 0 });
  out[out.length - 1].t = 1;
  return {
    keyTimes: out.map((k) => +k.t.toFixed(4)).join(";"),
    keyPoints: out.map((k) => k.p).join(";"),
    opacity: out.map((k) => k.o).join(";"),
  };
}

function Dot({ path, start, end, tone }: { path: string; start: number; end: number; tone: "chat" | "call" }) {
  const k = keys(start, end);
  const fill = tone === "chat" ? "#DB2777" : "#7C3AED";
  return (
    <g>
      <circle r={9} fill={fill} opacity={0.18}>
        <animateMotion dur={`${T}s`} repeatCount="indefinite" path={path} keyPoints={k.keyPoints} keyTimes={k.keyTimes} calcMode="linear" />
        <animate attributeName="opacity" dur={`${T}s`} repeatCount="indefinite" values={k.opacity.replace(/1/g, "0.22")} keyTimes={k.keyTimes} calcMode="discrete" />
      </circle>
      <circle r={4.5} fill={fill}>
        <animateMotion dur={`${T}s`} repeatCount="indefinite" path={path} keyPoints={k.keyPoints} keyTimes={k.keyTimes} calcMode="linear" />
        <animate attributeName="opacity" dur={`${T}s`} repeatCount="indefinite" values={k.opacity} keyTimes={k.keyTimes} calcMode="discrete" />
      </circle>
    </g>
  );
}

const REDUCED = "(prefers-reduced-motion: reduce)";
const useReducedMotion = () =>
  useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(REDUCED);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(REDUCED).matches,
    () => true, // sunucuda hareketsiz çiz
  );

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export default function AssistantFlow() {
  const reduced = useReducedMotion();
  const [chat, call] = CHANNELS;

  return (
    <div>
      {/* Eski /akilli-chatbot ve /sesli-asistan adresleri buraya yönlenir */}
      <span id="chatbot" className="block scroll-mt-28" aria-hidden="true" />
      <span id="callbot" className="block scroll-mt-28" aria-hidden="true" />
      {/* ── Masaüstü: akış diyagramı ─────────────────────────── */}
      <div className="relative hidden xl:block" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <radialGradient id="hubGlow">
              <stop offset="0%" stopColor="#DB2777" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#DB2777" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Hatlar */}
          {[CHAT_IN, CALL_IN].map((d) => (
            <path key={d} d={d} fill="none" className="stroke-[#DAD8DF] dark:stroke-white/15" strokeWidth={1.5} strokeDasharray="3 6" />
          ))}
          {ROWS.map((y) => (
            <path key={y} d={outPath(y)} fill="none" className="stroke-[#DAD8DF] dark:stroke-white/15" strokeWidth={1.5} strokeDasharray="3 6" />
          ))}
          {/* Asistan düğümü */}
          <circle cx={HUB.x} cy={HUB.y} r={HUB.r * 1.9} fill="url(#hubGlow)" />
          {!reduced &&
            [0, 1].map((i) => (
              <circle key={i} cx={HUB.x} cy={HUB.y} r={HUB.r} fill="none" stroke="#DB2777" strokeOpacity={0.35} strokeWidth={1.5}>
                <animate attributeName="r" values={`${HUB.r};${HUB.r * 1.45}`} dur="2s" begin={`${i}s`} repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.35;0" dur="2s" begin={`${i}s`} repeatCount="indefinite" />
              </circle>
            ))}
          {/* Akan istekler */}
          {!reduced &&
            SOURCE.map((src, i) => (
              <g key={i}>
                <Dot path={src === "chat" ? CHAT_IN : CALL_IN} start={i * SLOT} end={i * SLOT + 0.75} tone={src} />
                <Dot path={outPath(ROWS[i])} start={i * SLOT + 0.95} end={i * SLOT + 1.55} tone={src} />
              </g>
            ))}
        </svg>

        {/* Kanal kartları */}
        {[
          { c: chat, box: CARD.chat, Icon: IconChat, dark: false },
          { c: call, box: CARD.call, Icon: IconPhone, dark: true },
        ].map(({ c, box, Icon, dark }) => (
          <article
            key={c.id}
            className={`absolute flex flex-col justify-center rounded-[22px] border px-6 py-5 ${
              dark ? "border-transparent bg-[#111116] text-white" : "border-[#DAD8DF] bg-white dark:border-white/10 dark:bg-white/[0.04]"
            }`}
            style={{ left: pct(CARD.x, W), top: pct(box.y, H), width: pct(CARD.w, W), height: pct(box.h, H) }}
          >
            <div className="flex items-center gap-3">
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${dark ? "bg-[#7C3AED]/25 text-[#C4B5FD]" : "bg-[#FCE7F3] text-[#BE185D] dark:bg-[#DB2777]/20 dark:text-[#F9A8D4]"}`}>
                <Icon size={20} />
              </span>
              <div>
                <h3 className="text-[22px] font-semibold leading-none tracking-[-0.02em]">{c.name}</h3>
                <p className={`mt-1 text-[13px] ${dark ? "text-white/55" : "text-[#62616B] dark:text-white/55"}`}>{c.where}</p>
              </div>
            </div>
            <p className={`mt-3 text-[15px] leading-snug ${dark ? "text-white/85" : "text-[#3A3942] dark:text-white/80"}`}>{c.lead}</p>
            <ul className={`mt-2.5 space-y-1 text-[13.5px] ${dark ? "text-white/65" : "text-[#62616B] dark:text-white/60"}`}>
              {c.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span aria-hidden="true" className={dark ? "text-[#C4B5FD]" : "text-[#DB2777]"}>—</span>
                  {p}
                </li>
              ))}
            </ul>
          </article>
        ))}

        {/* Asistan */}
        <div
          className="absolute grid place-items-center rounded-full bg-[#171719] text-center text-white shadow-[0_20px_50px_rgba(219,39,119,0.25)] dark:bg-white dark:text-[#171719]"
          style={{ left: pct(HUB.x - HUB.r, W), top: pct(HUB.y - HUB.r, H), width: pct(HUB.r * 2, W), height: pct(HUB.r * 2, H) }}
        >
          <div>
            <p className="text-[17px] font-semibold leading-tight">Asistan</p>
            <p className="mt-0.5 text-[11.5px] opacity-60">tek bilgi · tek üslup</p>
          </div>
        </div>

        {/* Sonuçlar */}
        <ul aria-label="Neleri üstlenir">
          {CAPABILITIES.map((c, i) => {
            const Icon = CAP_ICONS[i];
            return (
              <li
                key={c.title}
                className={`flow-row absolute flex items-center gap-4 rounded-2xl px-4 ${reduced ? "" : "flow-row-anim"}`}
                style={{ left: pct(OUT_X, W), top: pct(ROWS[i] - ROW_H / 2 + 6, H), width: pct(W - OUT_X, W), height: pct(ROW_H - 12, H), animationDelay: `${i * SLOT}s` }}
              >
                <span className="flow-icon grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#BE185D] shadow-[0_6px_18px_rgba(23,23,25,0.06)] dark:bg-white/10 dark:text-[#F9A8D4]">
                  <Icon size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-[16.5px] font-semibold leading-tight tracking-[-0.01em]">{c.title}</p>
                  <p className="mt-0.5 text-[13.5px] leading-snug text-[#62616B] dark:text-white/60">{c.desc}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Mobil / tablet: sade liste ───────────────────────── */}
      <div className="xl:hidden">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { c: chat, Icon: IconChat, dark: false },
            { c: call, Icon: IconPhone, dark: true },
          ].map(({ c, Icon, dark }) => (
            <article
              key={c.id}
              className={`rounded-[22px] border p-6 ${dark ? "border-transparent bg-[#111116] text-white" : "border-[#DAD8DF] bg-white dark:border-white/10 dark:bg-white/[0.04]"}`}
            >
              <div className="flex items-center gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-xl ${dark ? "bg-[#7C3AED]/25 text-[#C4B5FD]" : "bg-[#FCE7F3] text-[#BE185D] dark:bg-[#DB2777]/20 dark:text-[#F9A8D4]"}`}>
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="text-[22px] font-semibold leading-none">{c.name}</h3>
                  <p className={`mt-1 text-[13px] ${dark ? "text-white/55" : "text-[#62616B] dark:text-white/55"}`}>{c.where}</p>
                </div>
              </div>
              <p className={`mt-3 text-[16px] leading-snug ${dark ? "text-white/85" : "text-[#3A3942] dark:text-white/80"}`}>{c.lead}</p>
            </article>
          ))}
        </div>
        <p className="my-6 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-[#DB2777]">↓ Tek asistan ↓</p>
        <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {CAPABILITIES.map((c, i) => {
            const Icon = CAP_ICONS[i];
            return (
              <li key={c.title} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#BE185D] shadow-[0_6px_18px_rgba(23,23,25,0.06)] dark:bg-white/10 dark:text-[#F9A8D4]">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="text-[17px] font-semibold">{c.title}</p>
                  <p className="mt-0.5 text-[15px] leading-snug text-[#62616B] dark:text-white/60">{c.desc}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Kanal notları */}
      <div className="mt-10 grid gap-3 border-t border-[#DAD8DF] pt-5 text-[13.5px] leading-relaxed text-[#62616B] dark:border-white/10 dark:text-white/55 md:grid-cols-2 md:gap-10">
        {CHANNELS.map((c) => (
          <p key={c.id}>
            <span className="font-semibold text-[#3A3942] dark:text-white/80">{c.name}:</span> {c.note}
          </p>
        ))}
      </div>
    </div>
  );
}
