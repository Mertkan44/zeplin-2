"use client";

/*
 * "Kendiniz deneyin": ziyaretçi asistanı izlemez, kullanır.
 * - Yazarak: hazır seçeneklerle dallanan sohbet (CHAT_FLOWS). Serbest metin ve gerçek yapay zekâ yok;
 *   bu bir öngösterim olarak açıkça etiketlenir.
 * - Arayarak: "Ara"ya basınca görüşme gerçekten sesli oynar; konuşulan satır ekrana eşzamanlı düşer.
 * - Panel: her sonuç (rezervasyon, ekibe aktarma…) yandaki listeye eklenir.
 * Zamanlayıcılar ve ses, sektör/kanal değişince temizlenir.
 */

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CHAT_FLOWS, SECTORS, callAudio, type ChatRecord, type SectorId } from "@/data/assistants";

type Mode = "chat" | "call";
type Msg = { id: number; from: "customer" | "assistant"; text: string };
type Rec = ChatRecord & { id: number; channel: "WhatsApp" | "Telefon"; sector: string };
type CallState = "idle" | "ringing" | "active" | "ended";

const TYPE_MS = 750;

// Mesaj/kayıt kimlikleri (yalnızca liste anahtarı; render dışında artar)
let nextId = 1;
const newId = () => nextId++;
const startMessages = (id: SectorId): Msg[] => CHAT_FLOWS[id].start.bot.map((t) => ({ id: newId(), from: "assistant", text: t }));

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

  const addRecord = useCallback((r: ChatRecord, channel: Rec["channel"], sectorName: string) => {
    setRecords((list) => [{ ...r, channel, sector: sectorName, id: newId() }, ...list].slice(0, 6));
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
            if (target.record) addRecord(target.record, "WhatsApp", sector.business);
          }
        }, TYPE_MS * (i + 1)),
      );
    });
  };

  // Yeni mesajda sohbet aşağı kayar
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
    const sec = sector; // görüşme boyunca sabit (sektör değişirse ses zaten durur)

    // Satırları sırayla çalar; bir satır bitince kısa nefes payıyla sıradakine geçer.
    const playLine = (i: number) => {
      if (audioRef.current !== audio) return;
      if (i >= sec.call.length) {
        setCall("ended");
        setLine(sec.call.length - 1);
        const rec = sec.records.find((r) => r.channel === "Telefon");
        if (rec) addRecord(rec, "Telefon", sec.business);
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

  // Görüşme süresi
  useEffect(() => {
    if (call !== "active") return;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [call]);

  /* ── Sektör / kanal değişimi: her şeyi temiz başlat ─────── */
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

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
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
    pickSector(SECTORS[next].id);
    tabRefs.current[next]?.focus();
  };

  const options = node && !typing ? flow[node]?.options ?? [] : [];
  const current = line >= 0 ? sector.call[line] : null;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="overflow-hidden rounded-[28px] bg-[#111116] text-white">
      {/* Öngösterim notu */}
      <div className="flex gap-3 border-b border-white/10 bg-[#DB2777]/10 px-5 py-4 md:px-7">
        <span aria-hidden="true" className="mt-0.5 text-[18px]">🧪</span>
        <p className="text-[14.5px] leading-relaxed text-white/85">
          <strong className="font-semibold text-white">Öngösterim.</strong> Bu demo hazır seçeneklerle ilerler ve kurmaca işletmeler kullanır.
          Gerçek asistanlarımız yazdığınız her şeyi anlar, sohbeti doğal biçimde sürdürür ve sesle konuşur.
        </p>
      </div>

      {/* Sektör + kanal */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-4 py-4 md:px-7">
        <div role="tablist" aria-label="Örnek sektörler" className="flex gap-2">
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
                aria-selected={selected}
                aria-controls="try-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => pickSector(s.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`min-h-[44px] rounded-full px-4 text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F472B6] ${
                  selected ? "bg-white text-[#171719]" : "border border-white/15 text-white/75 hover:border-white/40"
                }`}
              >
                {s.tab}
              </button>
            );
          })}
        </div>
        <div role="group" aria-label="Kanal" className="ml-auto inline-flex rounded-full border border-white/15 p-1">
          {(
            [
              ["chat", "💬 Yazarak", " deneyin"],
              ["call", "📞 Arayarak", " dinleyin"],
            ] as const
          ).map(([m, label, rest]) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => pickMode(m)}
              className={`min-h-[40px] rounded-full px-4 text-[14px] font-semibold transition-colors ${mode === m ? "bg-[#DB2777] text-white" : "text-white/75 hover:text-white"}`}
            >
              {label}
              <span className="hidden sm:inline">{rest}</span>
            </button>
          ))}
        </div>
      </div>

      <div id="try-panel" role="tabpanel" className="grid gap-8 px-4 py-8 md:px-8 md:py-10 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-12">
        {/* Telefon */}
        <div className="mx-auto w-full max-w-[400px]">
          <div className="rounded-[44px] border border-white/10 bg-[#050507] p-2.5 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            <div className="relative h-[600px] overflow-hidden rounded-[35px]">
              {mode === "chat" ? (
                <div className="flex h-full flex-col bg-[#EFE9E1] text-[#171719]">
                  <div className="flex items-center gap-3 bg-[#1F5F4E] px-4 pb-3 pt-9 text-white">
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
                  {/* Hazır yanıtlar */}
                  <div className="border-t border-black/5 bg-[#F7F4EF] px-3 pb-3 pt-2.5">
                    <div className="flex min-h-[44px] flex-wrap gap-1.5">
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
                    <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/10 text-[30px] font-semibold">{sector.business.charAt(0)}</span>
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
                    {call === "idle" && <p className="text-center text-[14px] text-white/55">Aramayı başlatın; asistan açacak. Sesiniz açık olsun 🔊</p>}
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

        {/* Panel */}
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-[22px] font-semibold tracking-[-0.02em] md:text-[28px]">
              {mode === "chat" ? "Bir soru seçin, asistan yanıtlasın." : "Arayın, asistan açsın."}
            </h3>
            <p className="mt-2 max-w-[52ch] text-[16px] leading-relaxed text-white/65">
              {mode === "chat"
                ? "Seçeneklere dokunarak konuşmayı yönlendirin. Rezervasyon, bilgi ya da ekibe aktarma; her sonuç aşağıdaki panele düşer."
                : "Görüşme sesli oynar ve konuşulan cümle ekrana yazılır. Görüşme bitince sonucu panelde görürsünüz."}
            </p>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-[#1C1C24] p-4 md:p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <p className="text-[14px] font-semibold">▦ Panel · gelen konuşmalar</p>
              {records.length > 0 && (
                <button type="button" onClick={() => setRecords([])} className="text-[13px] text-white/55 underline-offset-4 hover:text-white hover:underline">
                  Temizle
                </button>
              )}
            </div>
            <ul className="mt-3 space-y-2.5" aria-live="polite">
              {records.length === 0 ? (
                <li className="rounded-xl border border-dashed border-white/15 px-4 py-5 text-[14px] text-white/45">
                  Bir konuşma başlatın; sonuç burada belirir.
                </li>
              ) : (
                records.map((r) => (
                  <li key={r.id} className="animate-[aiMsg_.4s_ease-out] rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[12.5px] text-white/55">
                        {r.channel === "WhatsApp" ? "💬 WhatsApp" : "📞 Telefon"} · {r.sector}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[12px] font-medium ${
                          r.kind === "handoff"
                            ? "border-amber-300/40 bg-amber-300/10 text-amber-200"
                            : r.kind === "info"
                              ? "border-sky-300/30 bg-sky-300/10 text-sky-200"
                              : "border-emerald-300/35 bg-emerald-400/10 text-emerald-200"
                        }`}
                      >
                        <span aria-hidden="true">{r.kind === "handoff" ? "↪" : r.kind === "info" ? "i" : "✓"}</span>
                        {r.kind === "handoff" ? "Ekibe aktarıldı" : r.kind === "info" ? "Bilgi verildi" : "Tamamlandı"}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[15.5px] font-semibold">{r.title}</p>
                    <p className="text-[14px] text-white/65">{r.detail}</p>
                  </li>
                ))
              )}
            </ul>
            <p className="mt-4 text-[13px] leading-relaxed text-white/45">
              Gerçek kurulumda kayıtlar sizin panelinize, takviminize ya da kullandığınız CRM&apos;e düşer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
