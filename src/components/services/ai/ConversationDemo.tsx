"use client";

/*
 * İki kanal, tek sistem: aynı anda bir WhatsApp konuşması ve bir telefon görüşmesi akar;
 * ikisi de bitince kayıtlar panele düşer. Konuşmalar kurmacadır ("örnek konuşma").
 * Bölüm görünür olunca bir kez kendiliğinden başlar; hareket azaltıldığında tamamı hemen görünür.
 */

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { SECTORS, type Line, type Sector, type SectorId } from "@/data/assistants";

const STEP_MS = 1350;

const REDUCED = "(prefers-reduced-motion: reduce)";
const useReducedMotion = () =>
  useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(REDUCED);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );

type Ev = { ch: "chat" | "call"; i: number };

function timeline(s: Sector): Ev[] {
  const out: Ev[] = [];
  for (let i = 0; i < Math.max(s.chat.length, s.call.length); i++) {
    if (s.chat[i]) out.push({ ch: "chat", i });
    if (s.call[i]) out.push({ ch: "call", i });
  }
  return out;
}

export default function ConversationDemo() {
  const reduced = useReducedMotion();
  const [sectorId, setSectorId] = useState<SectorId>("restoran");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [mobileChannel, setMobileChannel] = useState<"chat" | "call">("chat");
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const started = useRef(false);

  const sector = SECTORS.find((s) => s.id === sectorId)!;
  const events = useMemo(() => timeline(sector), [sector]);
  const total = events.length + 1; // son adım: kayıtlar panele düşer
  const shown = reduced ? total : step;

  // Görünür olunca bir kez başla
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          setPlaying(true);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Adım zamanlayıcısı (sektör değişince ya da durunca temizlenir)
  useEffect(() => {
    if (!playing || reduced) return;
    if (step >= total) {
      const t = window.setTimeout(() => setPlaying(false), 0);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setStep((n) => n + 1), step === 0 ? 500 : STEP_MS);
    return () => window.clearTimeout(t);
  }, [playing, reduced, step, total]);

  const choose = (id: SectorId) => {
    setSectorId(id);
    setStep(0);
    setPlaying(true);
  };
  const replay = () => {
    setStep(0);
    setPlaying(true);
  };
  const showAll = () => {
    setPlaying(false);
    setStep(total);
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = SECTORS.length - 1;
    const next =
      e.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    choose(SECTORS[next].id);
    tabRefs.current[next]?.focus();
  };

  // Her kanalda kaç satır görünür, sıradaki kimde (yazıyor göstergesi)
  const revealed = events.slice(0, Math.min(shown, events.length));
  const chatCount = revealed.filter((e) => e.ch === "chat").length;
  const callCount = revealed.filter((e) => e.ch === "call").length;
  const next = shown < events.length && playing ? events[shown] : null;
  const recordsIn = shown >= total;
  const done = shown >= total;
  const callSeconds = Math.round(callCount * 4.2);

  return (
    <div ref={rootRef} className="overflow-hidden rounded-[28px] bg-[#111116] text-white">
      {/* Üst çubuk: sektör sekmeleri + kontroller */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-4 py-4 md:px-6">
        <div role="tablist" aria-label="Örnek sektörler" className="flex gap-2 overflow-x-auto">
          {SECTORS.map((s, i) => {
            const selected = s.id === sectorId;
            return (
              <button
                key={s.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`ai-tab-${s.id}`}
                aria-selected={selected}
                aria-controls="ai-demo-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => choose(s.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`min-h-[44px] shrink-0 rounded-full px-4 text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F472B6] ${
                  selected ? "bg-white text-[#171719]" : "border border-white/15 text-white/75 hover:border-white/40"
                }`}
              >
                {s.tab}
              </button>
            );
          })}
        </div>
        <span className="rounded-full border border-[#F472B6]/40 bg-[#DB2777]/10 px-2.5 py-1 text-[12px] font-medium text-[#F9A8D4]">
          Örnek konuşma · kurmaca işletme
        </span>
        <div className="ml-auto flex gap-2">
          {!reduced && (
            <button type="button" onClick={replay} className="min-h-[40px] rounded-full border border-white/20 px-4 text-[13px] font-semibold hover:border-white/50">
              Baştan oynat
            </button>
          )}
          {!reduced && !done && (
            <button type="button" onClick={showAll} className="min-h-[40px] rounded-full px-3 text-[13px] font-semibold text-white/70 underline-offset-4 hover:underline">
              Tamamını göster
            </button>
          )}
        </div>
      </div>

      {/* Mobil: tek telefon, kanal seçimi */}
      <div className="flex gap-2 px-4 pt-4 md:hidden" role="group" aria-label="Kanal">
        {(["chat", "call"] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={mobileChannel === c}
            onClick={() => setMobileChannel(c)}
            className={`min-h-[44px] flex-1 rounded-full text-[14px] font-semibold ${mobileChannel === c ? "bg-[#DB2777] text-white" : "border border-white/15 text-white/75"}`}
          >
            {c === "chat" ? "💬 Chatbot" : "📞 Callbot"}
          </button>
        ))}
      </div>

      <div
        id="ai-demo-panel"
        role="tabpanel"
        aria-labelledby={`ai-tab-${sectorId}`}
        className="grid gap-8 px-4 py-6 md:grid-cols-2 md:px-8 md:py-10 xl:grid-cols-[1fr_1fr_0.95fr]"
      >
        <div className={`${mobileChannel === "chat" ? "" : "hidden"} md:block`}>
          <ChannelLabel icon="💬" name="Chatbot" where="WhatsApp" />
          <ChatPhone sector={sector} count={chatCount} typing={next?.ch === "chat" ? sector.chat[next.i].from : null} />
        </div>
        <div className={`${mobileChannel === "call" ? "" : "hidden"} md:block`}>
          <ChannelLabel icon="📞" name="Callbot" where="Telefon" />
          <CallPhone sector={sector} count={callCount} speaking={next?.ch === "call" ? sector.call[next.i].from : null} seconds={callSeconds} ended={callCount >= sector.call.length} reduced={reduced} />
        </div>
        <div className="md:col-span-2 xl:col-span-1">
          <ChannelLabel icon="▦" name="Panel" where="Tüm kanallar tek yerde" />
          <Panel sector={sector} visible={recordsIn} />
        </div>
      </div>
    </div>
  );
}

/* ── Parçalar ─────────────────────────────────────────────────────── */

function ChannelLabel({ icon, name, where }: { icon: string; name: string; where: string }) {
  return (
    <p className="mb-4 flex items-center gap-2 text-[14px]">
      <span aria-hidden="true">{icon}</span>
      <span className="font-semibold">{name}</span>
      <span className="text-white/50">· {where}</span>
    </p>
  );
}

function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div role="group" aria-label={label} className="mx-auto w-full max-w-[320px] rounded-[42px] border border-white/10 bg-[#050507] p-2.5 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
      <div className="relative h-[540px] overflow-hidden rounded-[34px]">{children}</div>
    </div>
  );
}

function Typing({ dark }: { dark?: boolean }) {
  return (
    <span className={`inline-flex gap-1 rounded-2xl px-3 py-2.5 ${dark ? "bg-white/10" : "bg-white"}`} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-current opacity-60" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </span>
  );
}

function ChatPhone({ sector, count, typing }: { sector: Sector; count: number; typing: Line["from"] | null }) {
  const lines = sector.chat.slice(0, count);
  return (
    <PhoneFrame label={`${sector.business} ile WhatsApp konuşması`}>
      <div className="flex h-full flex-col bg-[#EFE9E1] text-[#171719]">
        <div className="flex items-center gap-3 bg-[#1F5F4E] px-4 pb-3 pt-9 text-white">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-[13px] font-bold">{sector.business.charAt(0)}</span>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold leading-tight">{sector.business}</p>
            <p className="text-[12px] text-white/75">{typing === "assistant" ? "yazıyor…" : "Yapay zekâ asistanı · çevrimiçi"}</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-end gap-2 overflow-hidden px-3 py-3">
          {lines.map((l, i) => (
            <p
              key={i}
              className={`max-w-[84%] animate-[aiMsg_.35s_ease-out] rounded-2xl px-3 py-2 text-[14px] leading-snug shadow-[0_1px_1px_rgba(0,0,0,0.08)] ${
                l.from === "customer" ? "self-end rounded-br-md bg-[#D7F5CF]" : "self-start rounded-bl-md bg-white"
              }`}
            >
              {l.text}
            </p>
          ))}
          {typing && (
            <div className={typing === "customer" ? "self-end text-[#2F6B3B]" : "self-start text-[#62616B]"}>
              <Typing />
            </div>
          )}
        </div>
        <div aria-hidden="true" className="flex items-center gap-2 bg-[#F7F4EF] px-3 py-2.5">
          <span className="h-9 flex-1 rounded-full bg-white px-4 text-[13px] leading-9 text-[#9A99A3]">Mesaj</span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1F5F4E] text-white">➤</span>
        </div>
      </div>
    </PhoneFrame>
  );
}

function CallPhone({
  sector,
  count,
  speaking,
  seconds,
  ended,
  reduced,
}: {
  sector: Sector;
  count: number;
  speaking: Line["from"] | null;
  seconds: number;
  ended: boolean;
  reduced: boolean;
}) {
  const lines = sector.call.slice(0, count);
  const assistantTalking = speaking === "assistant";
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <PhoneFrame label={`${sector.business} ile telefon görüşmesi`}>
      <div className="flex h-full flex-col bg-[radial-gradient(120%_70%_at_50%_0%,#3A1730_0%,#141218_55%,#0B0A0E_100%)] px-5 pb-6 pt-12 text-white">
        <div className="text-center">
          <p className="text-[20px] font-semibold">{sector.business}</p>
          <p className="mt-1 text-[13px] text-white/60">
            {ended ? "Görüşme bitti" : count === 0 ? "Aranıyor…" : `Yapay zekâ asistanı · ${mm}:${ss}`}
          </p>
        </div>

        {/* Ses dalgası: asistan konuşurken hareketli */}
        <div aria-hidden="true" className="mt-6 flex h-14 items-center justify-center gap-[3px]">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className={`w-[3px] rounded-full ${assistantTalking && !reduced ? "animate-[aiWave_0.9s_ease-in-out_infinite]" : ""} ${
                assistantTalking ? "bg-[#F472B6]" : "bg-white/25"
              }`}
              style={{
                height: `${18 + ((i * 37) % 26)}px`,
                animationDelay: `${(i % 7) * 0.08}s`,
                transform: assistantTalking ? undefined : "scaleY(0.35)",
              }}
            />
          ))}
        </div>

        <div className="mt-4 flex flex-1 flex-col justify-end gap-2.5 overflow-hidden">
          {lines.map((l, i) => (
            <p key={i} className={`animate-[aiMsg_.35s_ease-out] text-[14px] leading-snug ${l.from === "assistant" ? "text-[#F9A8D4]" : "text-white/85"}`}>
              <span className="mr-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">{l.from === "assistant" ? "Asistan" : "Arayan"}</span>
              {l.text}
            </p>
          ))}
          {speaking === "customer" && <p className="text-[13px] text-white/40">Arayan konuşuyor…</p>}
        </div>

        <div aria-hidden="true" className="mt-5 flex items-center justify-center gap-6">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-[18px]">🔇</span>
          <span className={`grid h-14 w-14 place-items-center rounded-full text-[20px] ${ended ? "bg-white/10" : "bg-[#E5484D]"}`}>✆</span>
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-[18px]">⌨</span>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Panel({ sector, visible }: { sector: Sector; visible: boolean }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[#1C1C24] p-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <p className="text-[14px] font-semibold">Gelen konuşmalar</p>
        <span className="text-[12px] text-white/50">{sector.business}</span>
      </div>
      <ul className="mt-3 space-y-2.5" aria-live="polite">
        {visible ? (
          sector.records.map((r) => (
            <li key={r.title + r.channel} className="animate-[aiMsg_.45s_ease-out] rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] text-white/55">{r.channel === "WhatsApp" ? "💬 WhatsApp" : "📞 Telefon"}</span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[12px] font-medium ${
                    r.kind === "handoff" ? "border-amber-300/40 bg-amber-300/10 text-amber-200" : "border-emerald-300/35 bg-emerald-400/10 text-emerald-200"
                  }`}
                >
                  <span aria-hidden="true">{r.kind === "handoff" ? "↪" : "✓"}</span>
                  {r.kind === "handoff" ? "Ekibe aktarıldı" : "Tamamlandı"}
                </span>
              </div>
              <p className="mt-1.5 text-[15px] font-semibold">{r.title}</p>
              <p className="text-[13.5px] text-white/65">{r.detail}</p>
            </li>
          ))
        ) : (
          <li className="rounded-xl border border-dashed border-white/15 px-3.5 py-6 text-center text-[13.5px] text-white/45">
            Konuşmalar bitince kayıtlar burada görünür.
          </li>
        )}
      </ul>
      <p className="mt-4 text-[13px] leading-relaxed text-white/50">
        Her konuşma kim, ne istedi, ne yapıldı bilgisiyle tek panelde toplanır; ekibe aktarılanlar ayrıca işaretlenir.
      </p>
    </div>
  );
}
