"use client";

/*
 * "Kendiniz deneyin" (öngösterim): ziyaretçi asistanı izlemez, kullanır.
 * Tasarım açılışın dilini sürdürür: açık zemin, dokulu disk üzerinde tek telefon; sonuçlar ayrı
 * bir panel yerine telefonun yanından "uçan bildirim kartı" olarak çıkar.
 * - Yazarak: hazır seçeneklerle dallanan sohbet (CHAT_FLOWS). Serbest metin / gerçek yapay zekâ yok.
 * - Arayarak: "Ara" → görüşme gerçekten sesli oynar, konuşulan satır eşzamanlı yazılır.
 * Zamanlayıcılar ve ses, sektör/kanal değişince temizlenir.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { CHAT_FLOWS, SECTORS, callAudio, type ChatRecord, type SectorId } from "@/data/assistants";

type Mode = "chat" | "call";
type Msg = { id: number; from: "customer" | "assistant"; text: string };
type Rec = ChatRecord & { id: number; channel: "WhatsApp" | "Telefon" };
type CallState = "idle" | "ringing" | "active" | "ended";

const TYPE_MS = 750;
const ICONS: Record<SectorId, string> = { restoran: "🍽️", klinik: "🦷", magaza: "🛍️" };

let nextId = 1;
const newId = () => nextId++;
const startMessages = (id: SectorId): Msg[] => CHAT_FLOWS[id].start.bot.map((t) => ({ id: newId(), from: "assistant", text: t }));

/* Masaüstünde bildirim kartlarının telefon çevresindeki yerleri (en yeni ilk sırada) */
const SLOTS = [
  "left-[calc(50%+92px)] top-[9%] xl:left-[calc(50%+128px)]",
  "right-[calc(50%+92px)] top-[24%] xl:right-[calc(50%+128px)]",
  "left-[calc(50%+104px)] top-[40%] xl:left-[calc(50%+140px)]",
  "right-[calc(50%+104px)] top-[56%] xl:right-[calc(50%+140px)]",
];

export default function TryAssistant() {
  const [sectorId, setSectorId] = useState<SectorId>("restoran");
  const [mode, setMode] = useState<Mode>("chat");
  const [records, setRecords] = useState<Rec[]>([]);
  const sector = SECTORS.find((s) => s.id === sectorId)!;
  const flow = CHAT_FLOWS[sectorId];

  /* ── Sohbet ─────────────────────────────────────────────── */
  const [msgs, setMsgs] = useState<Msg[]>(() => startMessages("restoran"));
  const [node, setNode] = useState("start");
  const [typing, setTyping] = useState(false);
  const timers = useRef<number[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const addRecord = useCallback((r: ChatRecord, channel: Rec["channel"]) => {
    setRecords((list) => [{ ...r, channel, id: newId() }, ...list].slice(0, 4));
  }, []);

  const choose = (label: string, next: string) => {
    if (typing) return;
    const target = flow[next];
    setMsgs((m) => [...m, { id: newId(), from: "customer", text: label }]);
    setTyping(true);
    setNode("");
    target.bot.forEach((text, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setMsgs((m) => [...m, { id: newId(), from: "assistant", text }]);
          if (i === target.bot.length - 1) {
            setTyping(false);
            setNode(next);
            if (target.record) addRecord(target.record, "WhatsApp");
          }
        }, TYPE_MS * (i + 1)),
      );
    });
  };

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  /* ── Görüşme ────────────────────────────────────────────── */
  const [call, setCall] = useState<CallState>("idle");
  const [line, setLine] = useState(-1);
  const [seconds, setSeconds] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopCall = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
  }, []);

  const startCall = () => {
    clearTimers();
    stopCall();
    const audio = new Audio();
    audioRef.current = audio;
    const sec = sector;

    // Satırları sırayla çalar; bir satır bitince kısa nefes payıyla sıradakine geçer.
    const playLine = (i: number) => {
      if (audioRef.current !== audio) return;
      if (i >= sec.call.length) {
        setCall("ended");
        setLine(sec.call.length - 1);
        const rec = sec.records.find((r) => r.channel === "Telefon");
        if (rec) addRecord(rec, "Telefon");
        return;
      }
      setLine(i);
      audio.src = callAudio(sec.id, i);
      audio.onended = () => timers.current.push(window.setTimeout(() => playLine(i + 1), 280));
      // Ses çalınamazsa (ör. tarayıcı engelledi) yazı yine ilerler
      audio.play().catch(() => timers.current.push(window.setTimeout(() => playLine(i + 1), 2600)));
    };

    setCall("ringing");
    setLine(-1);
    setSeconds(0);
    timers.current.push(
      window.setTimeout(() => {
        if (audioRef.current !== audio) return;
        setCall("active");
        playLine(0);
      }, 1400),
    );
  };

  const hangUp = () => {
    clearTimers();
    stopCall();
    setCall(line >= 0 ? "ended" : "idle");
  };

  useEffect(() => {
    if (call !== "active") return;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [call]);

  /* ── Sektör / kanal değişimi ────────────────────────────── */
  const reset = (id: SectorId) => {
    clearTimers();
    stopCall();
    setTyping(false);
    setMsgs(startMessages(id));
    setNode("start");
    setCall("idle");
    setLine(-1);
    setSeconds(0);
  };
  const pickSector = (id: SectorId) => {
    if (id === sectorId) return;
    setSectorId(id);
    reset(id);
  };
  const pickMode = (m: Mode) => {
    if (m === mode) return;
    setMode(m);
    reset(sectorId);
  };

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      audioRef.current?.pause();
    },
    [],
  );

  const options = node && !typing ? flow[node]?.options ?? [] : [];
  const current = line >= 0 ? sector.call[line] : null;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const ringing = mode === "call" && (call === "ringing" || call === "active");

  const step = "mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#62616B] dark:text-white/55";

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-6">
      {/* ── Sol: anlatım ve kontroller ─────────────────────── */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#DB2777] dark:text-[#F472B6]">Kendiniz deneyin</p>
          <span className="rounded-full border border-[#DB2777]/30 bg-[#FCE7F3] px-2.5 py-1 text-[12px] font-semibold text-[#BE185D] dark:border-[#F472B6]/30 dark:bg-[#DB2777]/15 dark:text-[#F9A8D4]">
            Öngösterim
          </span>
        </div>
        <h2 id="try-title" className="mt-4 text-[clamp(32px,4.2vw,54px)] font-semibold leading-[1.06] tracking-[-0.035em] text-[#171719] dark:text-white">
          Asistanla konuşun.
        </h2>

        <div className="mt-9">
          <p className={step}>1 · İşletmenizi seçin</p>
          <div role="group" aria-label="Örnek işletme" className="grid grid-cols-3 gap-2.5">
            {SECTORS.map((s) => {
              const selected = s.id === sectorId;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => pickSector(s.id)}
                  className={`flex min-h-[96px] flex-col items-start justify-between rounded-2xl border p-3.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DB2777] ${
                    selected
                      ? "border-[#171719] bg-[#171719] text-white dark:border-white dark:bg-white dark:text-[#171719]"
                      : "border-[#DAD8DF] bg-white text-[#171719] hover:border-[#171719] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:border-white/50"
                  }`}
                >
                  <span aria-hidden="true" className="text-[24px] leading-none">{ICONS[s.id]}</span>
                  <span>
                    <span className="block text-[15px] font-semibold">{s.tab}</span>
                    <span className={`block text-[12.5px] ${selected ? "opacity-70" : "text-[#62616B] dark:text-white/55"}`}>{s.business}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-7">
          <p className={step}>2 · Nasıl denemek istersiniz?</p>
          <div role="group" aria-label="Kanal" className="grid grid-cols-2 gap-2.5">
            {(
              [
                ["chat", "💬", "Yazın", "WhatsApp sohbeti"],
                ["call", "📞", "Arayın", "Sesli görüşme"],
              ] as const
            ).map(([m, icon, title, sub]) => {
              const selected = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => pickMode(m)}
                  className={`flex min-h-[64px] items-center gap-3 rounded-2xl border px-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DB2777] ${
                    selected
                      ? "border-[#DB2777] bg-[#DB2777] text-white"
                      : "border-[#DAD8DF] bg-white text-[#171719] hover:border-[#DB2777] dark:border-white/15 dark:bg-white/[0.04] dark:text-white"
                  }`}
                >
                  <span aria-hidden="true" className="text-[22px]">{icon}</span>
                  <span>
                    <span className="block text-[16px] font-semibold">{title}</span>
                    <span className={`block text-[13px] ${selected ? "text-white/80" : "text-[#62616B] dark:text-white/55"}`}>{sub}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-7 text-[17px] leading-relaxed text-[#3A3942] dark:text-white/75" aria-live="polite">
          {mode === "chat"
            ? "Telefondaki seçeneklerden birine dokunun; asistan yanıtlasın. Her sonuç bir bildirim kartı olarak belirir."
            : call === "idle"
              ? "Yeşil düğmeye basın, asistan açsın. Sesiniz açık olsun 🔊"
              : call === "ended"
                ? "Görüşme bitti; sonuç bir bildirim kartı olarak belirdi."
                : "Görüşme sürüyor; konuşulan cümle ekrana yazılıyor."}
        </p>

        <p className="mt-5 flex gap-2.5 border-t border-[#DAD8DF] pt-5 text-[14px] leading-relaxed text-[#62616B] dark:border-white/10 dark:text-white/55">
          <span aria-hidden="true">ⓘ</span>
          <span>
            Bu öngösterim hazır seçeneklerle ilerler ve kurmaca işletmeler kullanır. Gerçek asistanlarımız yazdığınız her şeyi anlar, sohbeti doğal biçimde
            sürdürür ve sesle konuşur.
          </span>
        </p>
      </div>

      {/* ── Sağ: sahne ─────────────────────────────────────── */}
      <div className="relative">
        <div className="relative mx-auto h-[640px] w-full max-w-[640px] lg:h-[700px]">
          {/* Dokulu disk + (görüşmede) yayılan halkalar */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {ringing && (
              <>
                <span style={{ animationDelay: "0s" }} className="hero-ring absolute left-1/2 top-1/2 h-[min(500px,92vw)] w-[min(500px,92vw)] rounded-full border-[1.5px] border-[#DB2777]/40" />
                <span style={{ animationDelay: "1.9s" }} className="hero-ring absolute left-1/2 top-1/2 h-[min(500px,92vw)] w-[min(500px,92vw)] rounded-full border-[1.5px] border-[#DB2777]/40" />
              </>
            )}
            <span className="hero-disc absolute left-1/2 top-1/2 h-[min(500px,92vw)] w-[min(500px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-full" />
          </div>

          {/* Telefon */}
          <div className="absolute left-1/2 top-1/2 z-[1] w-[300px] -translate-x-1/2 -translate-y-1/2 sm:w-[320px]">
            <div key={mode} className="try-flip rounded-[44px] bg-[#0B0B0F] p-[10px] shadow-[0_40px_90px_rgba(23,23,25,0.3),inset_0_0_0_1.5px_rgba(255,255,255,0.12)]">
              <div className="relative h-[580px] overflow-hidden rounded-[35px] lg:h-[600px]">
                <span aria-hidden="true" className="absolute left-1/2 top-2.5 z-10 h-[22px] w-[90px] -translate-x-1/2 rounded-full bg-black" />
                {mode === "chat" ? (
                  <div className="flex h-full flex-col bg-[#EFE9E1] text-[#171719]">
                    <div className="flex items-center gap-3 bg-[#1F5F4E] px-4 pb-3 pt-10 text-white">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-[13px] font-bold">{sector.business.charAt(0)}</span>
                      <div>
                        <p className="text-[15px] font-semibold leading-tight">{sector.business}</p>
                        <p className="text-[12px] text-white/75">{typing ? "yazıyor…" : "Yapay zekâ asistanı · çevrimiçi"}</p>
                      </div>
                    </div>
                    <div ref={listRef} className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-3" aria-live="polite">
                      {msgs.map((m) => (
                        <p
                          key={m.id}
                          className={`max-w-[84%] animate-[aiMsg_.3s_ease-out] rounded-2xl px-3 py-2 text-[14px] leading-snug shadow-[0_1px_1px_rgba(0,0,0,0.08)] ${
                            m.from === "customer" ? "self-end rounded-br-md bg-[#D7F5CF]" : "self-start rounded-bl-md bg-white"
                          }`}
                        >
                          {m.text}
                        </p>
                      ))}
                      {typing && (
                        <span className="inline-flex gap-1 self-start rounded-2xl bg-white px-3 py-2.5 text-[#62616B]" aria-label="Asistan yazıyor">
                          {[0, 1, 2].map((i) => (
                            <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-current opacity-60" style={{ animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </span>
                      )}
                    </div>
                    <div className="border-t border-black/5 bg-[#F7F4EF] px-3 pb-3 pt-2.5">
                      <div className="flex min-h-[40px] flex-wrap gap-1.5">
                        {options.map((o) => (
                          <button
                            key={o.label}
                            type="button"
                            onClick={() => choose(o.label, o.next)}
                            className="min-h-[36px] rounded-full border border-[#1F5F4E]/30 bg-white px-3 text-[13px] font-medium text-[#1F5F4E] transition-colors hover:bg-[#1F5F4E] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#DB2777]"
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                      <div className="mt-2 flex items-center gap-2" aria-hidden="true">
                        <span className="h-9 flex-1 truncate rounded-full bg-white px-4 text-[12.5px] leading-9 text-[#9A99A3]">Öngösterimde hazır seçenekler kullanılır</span>
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1F5F4E]/40 text-white">➤</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col bg-[radial-gradient(120%_70%_at_50%_0%,#3A1730_0%,#141218_55%,#0B0A0E_100%)] px-5 pb-7 pt-14 text-white">
                    <div className="text-center">
                      <span className={`mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/10 text-[30px] font-semibold ${call === "ringing" ? "animate-pulse" : ""}`}>
                        {sector.business.charAt(0)}
                      </span>
                      <p className="mt-4 text-[22px] font-semibold">{sector.business}</p>
                      <p className="mt-1 text-[14px] text-white/60" aria-live="polite">
                        {call === "idle" && "Yapay zekâ asistanı · Defne sesi"}
                        {call === "ringing" && "Aranıyor…"}
                        {call === "active" && `Görüşmede · ${mm}:${ss}`}
                        {call === "ended" && `Görüşme bitti · ${mm}:${ss}`}
                      </p>
                    </div>
                    <div aria-hidden="true" className="mt-6 flex h-12 items-center justify-center gap-[3px]">
                      {Array.from({ length: 26 }).map((_, i) => {
                        const talking = call === "active" && current?.from === "assistant";
                        return (
                          <span
                            key={i}
                            className={`w-[3px] rounded-full ${talking ? "animate-[aiWave_0.9s_ease-in-out_infinite] bg-[#F472B6]" : "bg-white/20"}`}
                            style={{ height: `${16 + ((i * 37) % 24)}px`, animationDelay: `${(i % 7) * 0.08}s`, transform: talking ? undefined : "scaleY(0.35)" }}
                          />
                        );
                      })}
                    </div>
                    <div className="mt-4 flex flex-1 flex-col justify-end gap-2.5 overflow-hidden">
                      {line >= 0 &&
                        sector.call.slice(Math.max(0, line - 3), line + 1).map((l, i, arr) => (
                          <p key={`${line}-${i}`} className={`text-[14.5px] leading-snug ${i === arr.length - 1 ? "" : "opacity-55"} ${l.from === "assistant" ? "text-[#F9A8D4]" : "text-white/90"}`}>
                            <span className="mr-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">{l.from === "assistant" ? "Asistan" : "Arayan"}</span>
                            {l.text}
                          </p>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-center">
                      {call === "idle" || call === "ended" ? (
                        <button
                          type="button"
                          onClick={startCall}
                          className="inline-flex min-h-[60px] items-center gap-3 rounded-full bg-[#22A55B] pl-2 pr-7 text-[16px] font-semibold text-white shadow-[0_10px_30px_rgba(34,165,91,0.35)] transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                          <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full bg-white/20 text-[20px]">✆</span>
                          {call === "ended" ? "Tekrar ara" : "Ara"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={hangUp}
                          className="inline-flex min-h-[60px] items-center gap-3 rounded-full bg-[#E5484D] pl-2 pr-7 text-[16px] font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                          <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full bg-white/20 text-[20px]">✆</span>
                          Kapat
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Masaüstü: sonuçlar telefonun yanından uçan kartlar */}
          <ul aria-live="polite" aria-label="Sonuçlar" className="hidden lg:block">
            {records.map((r, i) => (
              <li key={r.id} className={`absolute z-[2] w-[212px] xl:w-[236px] ${SLOTS[i]} ${i === 0 ? "try-pop" : ""}`}>
                <RecordCard r={r} faded={i > 1} />
              </li>
            ))}
          </ul>
        </div>

        {/* Mobil / tablet: sonuçlar telefonun altında */}
        <ul aria-live="polite" aria-label="Sonuçlar" className="-mt-6 space-y-2.5 lg:hidden">
          {records.map((r) => (
            <li key={r.id} className="animate-[aiMsg_.4s_ease-out]">
              <RecordCard r={r} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RecordCard({ r, faded }: { r: Rec; faded?: boolean }) {
  const tone =
    r.kind === "handoff"
      ? { dot: "bg-amber-500", icon: "↪", label: "Ekibe aktarıldı" }
      : r.kind === "info"
        ? { dot: "bg-sky-500", icon: "i", label: "Bilgi verildi" }
        : { dot: "bg-emerald-500", icon: "✓", label: "Tamamlandı" };
  return (
    <div className={`rounded-2xl bg-white px-4 py-3 shadow-[0_20px_45px_rgba(23,23,25,0.16)] transition-opacity dark:bg-[#24242E] ${faded ? "opacity-70" : ""}`}>
      <div className="flex items-center gap-2.5">
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-bold text-white ${tone.dot}`} aria-hidden="true">
          {tone.icon}
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold leading-snug text-[#171719] dark:text-white">{r.title}</p>
          <p className="text-[12.5px] leading-snug text-[#62616B] dark:text-white/60">
            {r.channel === "WhatsApp" ? "💬" : "📞"} {r.detail}
          </p>
        </div>
      </div>
      <span className="sr-only">{tone.label}</span>
    </div>
  );
}
