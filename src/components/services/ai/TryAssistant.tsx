"use client";

/*
 * "Kendiniz deneyin" (öngösterim). Açılıştaki 3B telefonu tekrar etmemek için burada telefon yok:
 * seçilen işletmenin gerçek videosu (stok, Magnific) sahne olur; sohbet penceresi ya da görüşme
 * şeridi videonun üstünde yüzer, sonuçlar sahnenin köşesine bildirim olarak düşer.
 * - Yazarak: hazır seçeneklerle dallanan sohbet (CHAT_FLOWS). Serbest metin / gerçek yapay zekâ yok.
 * - Arayarak: "Ara" → görüşme gerçekten sesli oynar, konuşulan satır eşzamanlı yazılır.
 * Zamanlayıcılar ve ses, sektör/kanal değişince temizlenir. Hareket azaltıldığında video durur (poster).
 */

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CHAT_FLOWS, SECTORS, callAudio, type ChatRecord, type SectorId } from "@/data/assistants";
import { IconChat, IconCheck, IconHandoff, IconInfo, IconPhone } from "./icons";

type Mode = "chat" | "call";
type Msg = { id: number; from: "customer" | "assistant"; text: string };
type Rec = ChatRecord & { id: number; channel: "WhatsApp" | "Telefon" };
type CallState = "idle" | "ringing" | "active" | "ended";

const TYPE_MS = 750;
const scene = (id: SectorId) => ({ video: `/videos/assistants/${id}.mp4`, poster: `/videos/assistants/posters/${id}.jpg` });
/** Sohbet penceresi solda durduğu için öznesi solda kalan videolar yatayda yansıtılır. */
const MIRROR: Partial<Record<SectorId, boolean>> = { magaza: true };

let nextId = 1;
const newId = () => nextId++;
const startMessages = (id: SectorId): Msg[] => CHAT_FLOWS[id].start.bot.map((t) => ({ id: newId(), from: "assistant", text: t }));

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

export default function TryAssistant() {
  const reduced = useReducedMotion();
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
    setRecords((list) => [{ ...r, channel, id: newId() }, ...list].slice(0, 3));
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
  const step = "mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#62616B] dark:text-white/55";
  const media = scene(sectorId);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.22fr)_minmax(0,0.78fr)] lg:items-center lg:gap-14">
      {/* ── Anlatım ve kontroller (masaüstünde sağda; mobilde sahneden önce) ── */}
      <div className="lg:order-2">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#DB2777] dark:text-[#F472B6]">Kendiniz deneyin</p>
          <span className="rounded-full border border-[#DB2777]/30 px-2.5 py-1 text-[12px] font-semibold text-[#BE185D] dark:border-[#F472B6]/30 dark:text-[#F9A8D4]">
            Öngösterim
          </span>
        </div>
        <h2 id="try-title" className="mt-4 text-[clamp(32px,4.2vw,54px)] font-semibold leading-[1.06] tracking-[-0.035em] text-[#171719] dark:text-white">
          Asistanla konuşun.
        </h2>

        <div className="mt-9">
          <p className={step}>1 · İşletme</p>
          <div role="group" aria-label="Örnek işletme" className="grid grid-cols-3 gap-2.5">
            {SECTORS.map((s) => {
              const selected = s.id === sectorId;
              return (
                <button key={s.id} type="button" aria-pressed={selected} onClick={() => pickSector(s.id)} className="group text-left focus-visible:outline-none">
                  <span
                    className={`relative block aspect-[4/3] overflow-hidden rounded-xl ring-offset-2 ring-offset-[#F7F6F3] transition-shadow group-focus-visible:ring-2 group-focus-visible:ring-[#DB2777] dark:ring-offset-[#0F0F12] ${
                      selected ? "ring-2 ring-[#171719] dark:ring-white" : ""
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- küçük, zaten sıkıştırılmış poster */}
                    <img
                      src={scene(s.id).poster}
                      alt=""
                      className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${MIRROR[s.id] ? "-scale-x-100 group-hover:-scale-x-105" : ""} ${selected ? "" : "opacity-75 grayscale-[35%]"}`}
                    />
                  </span>
                  <span className={`mt-2 block text-[15px] font-semibold ${selected ? "text-[#171719] dark:text-white" : "text-[#62616B] dark:text-white/60"}`}>{s.tab}</span>
                  <span className="block text-[12.5px] text-[#8E8D99]">{s.business}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-7">
          <p className={step}>2 · Kanal</p>
          <div role="group" aria-label="Kanal" className="inline-flex w-full rounded-full border border-[#DAD8DF] bg-white p-1 dark:border-white/15 dark:bg-white/[0.04] sm:w-auto">
            {(
              [
                ["chat", "Yazarak", IconChat],
                ["call", "Arayarak", IconPhone],
              ] as const
            ).map(([m, label, Icon]) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => pickMode(m)}
                className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DB2777] sm:flex-none ${
                  mode === m ? "bg-[#171719] text-white dark:bg-white dark:text-[#171719]" : "text-[#3A3942] hover:text-[#171719] dark:text-white/70"
                }`}
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-7 max-w-[44ch] text-[17px] leading-relaxed text-[#3A3942] dark:text-white/75" aria-live="polite">
          {mode === "chat"
            ? "Sohbetteki seçeneklerden birine dokunun; asistan yanıtlasın, sonuç sahnenin köşesine düşsün."
            : call === "idle"
              ? "“Ara”ya basın, asistan açsın. Sesiniz açık olsun."
              : call === "ended"
                ? "Görüşme bitti; sonuç sahnenin köşesinde."
                : "Görüşme sürüyor; konuşulan cümle ekrana yazılıyor."}
        </p>

        <p className="mt-6 border-t border-[#DAD8DF] pt-5 text-[14px] leading-relaxed text-[#62616B] dark:border-white/10 dark:text-white/55">
          Bu öngösterim hazır seçeneklerle ilerler ve kurmaca işletmeler kullanır. Gerçek asistanlarımız yazdığınız her şeyi anlar, sohbeti doğal biçimde
          sürdürür ve sesle konuşur.
        </p>
      </div>

      {/* ── Video sahne (masaüstünde solda) ─────────────────── */}
      <div className="relative h-[620px] lg:order-1 overflow-hidden rounded-[28px] bg-[#1A1714] lg:h-[680px]">
        <video
          key={`${sectorId}-${reduced}`}
          src={reduced ? undefined : media.video}
          poster={media.poster}
          autoPlay={!reduced}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          // Safari: istemcide oluşan videoda "muted" geç uygulanırsa otomatik oynatma engellenir
          ref={(el) => {
            if (!el || reduced) return;
            el.muted = true;
            void el.play().catch(() => {});
          }}
          className={`absolute inset-0 h-full w-full object-cover ${MIRROR[sectorId] ? "-scale-x-100" : ""}`}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,12,0.2)_0%,rgba(10,10,12,0.05)_40%,rgba(10,10,12,0.55)_100%)]" />
        <p className="absolute left-5 top-5 rounded-full bg-black/35 px-3 py-1.5 text-[12px] font-medium text-white/85 backdrop-blur-md">
          {sector.business} · örnek işletme
        </p>

        {/* Sonuçlar: sahnenin sol üst köşesine bildirim olarak */}
        <ul aria-live="polite" aria-label="Sonuçlar" className="absolute left-4 right-4 top-14 z-[2] space-y-2 sm:left-auto sm:right-5 sm:top-5 sm:w-[270px]">
          {records.map((r, i) => (
            <li key={r.id} className={`${i === 0 ? "try-pop" : ""} ${i > 0 ? "hidden sm:block" : ""}`}>
              <RecordCard r={r} faded={i > 0} />
            </li>
          ))}
        </ul>

        {mode === "chat" ? (
          /* Yüzen sohbet penceresi (telefon çerçevesi yok) */
          <div className="try-pop absolute inset-x-3 bottom-3 z-[1] flex max-h-[430px] flex-col overflow-hidden rounded-[22px] bg-white/95 text-[#171719] shadow-[0_30px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[370px] lg:max-h-[470px]">
            <div className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1F5F4E] text-[13px] font-bold text-white">{sector.business.charAt(0)}</span>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold leading-tight">{sector.business}</p>
                <p className="text-[12px] text-[#62616B]">{typing ? "yazıyor…" : "Yapay zekâ asistanı · WhatsApp"}</p>
              </div>
            </div>
            <div ref={listRef} className="flex min-h-[150px] flex-1 flex-col gap-2 overflow-y-auto bg-[#F4F1EC] px-3 py-3" aria-live="polite">
              {msgs.map((m) => (
                <p
                  key={m.id}
                  className={`max-w-[85%] animate-[aiMsg_.3s_ease-out] rounded-2xl px-3 py-2 text-[14px] leading-snug ${
                    m.from === "customer" ? "self-end rounded-br-md bg-[#D7F5CF]" : "self-start rounded-bl-md bg-white shadow-[0_1px_1px_rgba(0,0,0,0.06)]"
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
            <div className="flex min-h-[58px] flex-wrap content-start gap-1.5 border-t border-black/[0.06] px-3 py-2.5">
              {options.map((o) => (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => choose(o.label, o.next)}
                  className="min-h-[36px] rounded-full border border-[#171719]/15 bg-white px-3 text-[13px] font-medium text-[#171719] transition-colors hover:border-[#171719] hover:bg-[#171719] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#DB2777]"
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Görüşme şeridi */
          <div className="try-pop absolute inset-x-3 bottom-3 z-[1] rounded-[22px] bg-[#111116]/80 p-5 text-white shadow-[0_30px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:inset-x-6 sm:bottom-6">
            <div className="flex items-center gap-4">
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/10 text-[18px] font-semibold ${call === "ringing" ? "animate-pulse" : ""}`}>
                {sector.business.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-semibold">{sector.business}</p>
                <p className="text-[13px] text-white/60" aria-live="polite">
                  {call === "idle" && "Yapay zekâ asistanı · Defne sesi"}
                  {call === "ringing" && "Aranıyor…"}
                  {call === "active" && `Görüşmede · ${mm}:${ss}`}
                  {call === "ended" && `Görüşme bitti · ${mm}:${ss}`}
                </p>
              </div>
              {call === "idle" || call === "ended" ? (
                <button
                  type="button"
                  onClick={startCall}
                  className="inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-full bg-[#22A55B] px-5 text-[15px] font-semibold text-white transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <IconPhone />
                  {call === "ended" ? "Tekrar ara" : "Ara"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={hangUp}
                  className="inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-full bg-[#E5484D] px-5 text-[15px] font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <IconPhone />
                  Kapat
                </button>
              )}
            </div>
            <div aria-hidden="true" className="mt-4 flex h-10 items-center gap-[3px]">
              {Array.from({ length: 48 }).map((_, i) => {
                const talking = call === "active" && current?.from === "assistant";
                return (
                  <span
                    key={i}
                    className={`w-[3px] flex-1 rounded-full ${talking ? "animate-[aiWave_0.9s_ease-in-out_infinite] bg-[#F472B6]" : "bg-white/20"}`}
                    style={{ height: `${12 + ((i * 37) % 26)}px`, animationDelay: `${(i % 7) * 0.08}s`, transform: talking ? undefined : "scaleY(0.3)" }}
                  />
                );
              })}
            </div>
            <div className="mt-3 min-h-[66px] space-y-1.5">
              {line >= 0 ? (
                sector.call.slice(Math.max(0, line - 1), line + 1).map((l, i, arr) => (
                  <p key={`${line}-${i}`} className={`text-[15px] leading-snug ${i === arr.length - 1 ? "" : "opacity-50"} ${l.from === "assistant" ? "text-[#F9A8D4]" : "text-white/90"}`}>
                    <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">{l.from === "assistant" ? "Asistan" : "Arayan"}</span>
                    {l.text}
                  </p>
                ))
              ) : (
                <p className="text-[14.5px] text-white/60">{call === "ringing" ? "Asistan birazdan açacak…" : "Arayın; asistan sizi işletmenin seçtiği sesle karşılasın."}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RecordCard({ r, faded }: { r: Rec; faded?: boolean }) {
  const tone =
    r.kind === "handoff"
      ? { dot: "bg-amber-500", Icon: () => <IconHandoff size={14} stroke={2} />, label: "Ekibe aktarıldı" }
      : r.kind === "info"
        ? { dot: "bg-sky-500", Icon: IconInfo, label: "Bilgi verildi" }
        : { dot: "bg-emerald-500", Icon: IconCheck, label: "Tamamlandı" };
  return (
    <div className={`flex items-center gap-3 rounded-2xl bg-white/95 px-3.5 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-opacity ${faded ? "opacity-75" : ""}`}>
      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-white ${tone.dot}`}>
        <tone.Icon />
      </span>
      <div className="min-w-0">
        <p className="text-[14px] font-semibold leading-snug text-[#171719]">{r.title}</p>
        <p className="text-[12.5px] leading-snug text-[#62616B]">
          {r.channel === "WhatsApp" ? "WhatsApp" : "Telefon"} · {r.detail}
        </p>
      </div>
      <span className="sr-only">{tone.label}</span>
    </div>
  );
}
