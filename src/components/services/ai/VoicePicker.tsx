"use client";

/*
 * "Asistanınızın sesini seçin": ses + üslup seçimi ve örnek dinleme.
 * Ses dosyaları /audio/voices/<ses>-<üslup>.mp3. Dosya yoksa düğme hata vermez,
 * "örnek henüz yüklenmedi" der. Otomatik çalmaz; yalnızca kullanıcı isteyince.
 */

import { useEffect, useRef, useState } from "react";
import { TONES, VOICES, type ToneId, type VoiceId } from "@/data/assistants";

type PlayState = "idle" | "loading" | "playing" | "missing";

export default function VoicePicker() {
  const [voice, setVoice] = useState<VoiceId>("defne");
  const [tone, setTone] = useState<ToneId>("samimi");
  const [state, setState] = useState<PlayState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setState("idle");
  };

  useEffect(() => () => audioRef.current?.pause(), []);

  const play = () => {
    if (state === "playing" || state === "loading") return stop();
    const audio = new Audio(`/audio/voices/${voice}-${tone}.mp3`);
    audioRef.current = audio;
    setState("loading");
    audio.addEventListener("playing", () => audioRef.current === audio && setState("playing"));
    audio.addEventListener("ended", () => audioRef.current === audio && setState("idle"));
    audio.addEventListener("error", () => audioRef.current === audio && setState("missing"));
    audio.play().catch(() => audioRef.current === audio && setState("missing"));
  };

  const pickVoice = (id: VoiceId) => {
    stop();
    setVoice(id);
  };
  const pickTone = (id: ToneId) => {
    stop();
    setTone(id);
  };

  const current = VOICES.find((v) => v.id === voice)!;
  const greeting = TONES.find((t) => t.id === tone)!.greeting;
  const active = state === "playing";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
      {/* Sesler */}
      <fieldset>
        <legend className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#62616B] dark:text-white/55">1 · Ses</legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {VOICES.map((v) => {
            const selected = v.id === voice;
            return (
              <label
                key={v.id}
                className={`flex min-h-[72px] cursor-pointer items-center gap-3.5 rounded-2xl border px-4 py-3 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#DB2777] ${
                  selected
                    ? "border-[#DB2777] bg-[#FCE7F3] dark:bg-[#DB2777]/15"
                    : "border-[#DAD8DF] bg-white hover:border-[#171719] dark:border-white/15 dark:bg-white/[0.04] dark:hover:border-white/40"
                }`}
              >
                <input type="radio" name="voice" value={v.id} checked={selected} onChange={() => pickVoice(v.id)} className="sr-only" />
                <span
                  aria-hidden="true"
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-[16px] font-bold ${
                    selected ? "bg-[#DB2777] text-white" : "bg-[#F1EFF3] text-[#3A3942] dark:bg-white/10 dark:text-white"
                  }`}
                >
                  {selected && active ? <Bars /> : v.name.charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block text-[16px] font-semibold text-[#171719] dark:text-white">{v.name}</span>
                  <span className="block text-[14px] text-[#62616B] dark:text-white/60">{v.trait}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Üslup + dinle */}
      <div>
        <fieldset>
          <legend className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#62616B] dark:text-white/55">2 · Üslup</legend>
          <div className="inline-flex rounded-full border border-[#DAD8DF] bg-white p-1 dark:border-white/15 dark:bg-white/[0.04]">
            {TONES.map((t) => (
              <label key={t.id} className="cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#DB2777] rounded-full">
                <input type="radio" name="tone" value={t.id} checked={tone === t.id} onChange={() => pickTone(t.id)} className="sr-only" />
                <span
                  className={`block min-h-[40px] rounded-full px-5 text-[14px] font-semibold leading-[40px] transition-colors ${
                    tone === t.id ? "bg-[#171719] text-white dark:bg-white dark:text-[#171719]" : "text-[#3A3942] dark:text-white/75"
                  }`}
                >
                  {t.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 rounded-[24px] bg-[#111116] p-6 text-white md:p-7">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#F9A8D4]">
            {current.name} · {TONES.find((t) => t.id === tone)!.label.toLowerCase()} karşılama
          </p>
          <p className="mt-3 text-[20px] leading-[1.45] md:text-[22px]">“{greeting}”</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={play}
              aria-pressed={active}
              className="inline-flex min-h-[52px] items-center gap-3 rounded-full bg-[#DB2777] pl-2 pr-6 text-[16px] font-semibold text-white transition-colors hover:bg-[#BE185D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F472B6]"
            >
              <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-white/20">
                {active || state === "loading" ? "❚❚" : "▶"}
              </span>
              {active ? "Durdur" : state === "loading" ? "Yükleniyor…" : "Sesi dinle"}
            </button>
            <p aria-live="polite" className="text-[14px] text-white/60">
              {state === "missing" ? "Bu sesin örneği henüz yüklenmedi." : `${current.gender} · Türkçe`}
            </p>
          </div>
        </div>
        <p className="mt-3 text-[14px] text-[#62616B] dark:text-white/55">
          Ses örnekleri yapay olarak üretilmiştir. Asistanınızın adını, karşılama cümlesini ve kullanacağı ifadeleri birlikte belirleriz.
        </p>
      </div>
    </div>
  );
}

function Bars() {
  return (
    <span className="flex h-4 items-end gap-[2px]">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="w-[3px] animate-[aiWave_0.8s_ease-in-out_infinite] rounded-full bg-white" style={{ height: 16, animationDelay: `${i * 0.12}s` }} />
      ))}
    </span>
  );
}
