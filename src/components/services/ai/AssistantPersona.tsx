"use client";

/*
 * Ses seçimi, tek odak: koyu kart. Kartın tepesinde dört ses sekme olarak durur (seçili olan beyaz),
 * altında karşılama cümlesi, en altta "Sesi dinle" ve üslup. Yanında yalnızca kısa başlık.
 * Ses dosyaları /audio/voices/<ses>-<üslup>.mp3; yalnızca kullanıcı isteyince çalar.
 * (Güven ilkeleri SSS'de: yanlış bilgi, tavsiye, veri saklama.)
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DUR, EASE } from "@/lib/motion";
import { TONES, VOICES, type ToneId, type VoiceId } from "@/data/assistants";
import Reveal from "./Reveal";

type PlayState = "idle" | "loading" | "playing" | "missing";

/* Dekoratif ses dalgası: her sese sabit bir desen */
const wave = (seed: number) => Array.from({ length: 28 }, (_, i) => 8 + ((i * (seed * 7 + 13)) % 22));

export default function AssistantPersona() {
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

  const vi = VOICES.findIndex((v) => v.id === voice);
  const current = VOICES[vi];
  const toneObj = TONES.find((t) => t.id === tone)!;
  const active = state === "playing";

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-16">
      {/* ── Anlatım (masaüstünde sağda) ─────────────────── */}
      <Reveal order={1} className="lg:order-2">
        <h2 id="persona-title" className="text-[clamp(32px,4.2vw,54px)] font-semibold leading-[1.06] tracking-[-0.035em] text-[#171719] dark:text-white">
          Sesini siz seçin.
        </h2>
        <p className="mt-5 max-w-[38ch] text-[17px] leading-[1.65] text-[#62616B] dark:text-white/65 md:text-[18px]">
          Dört ses, iki üslup. Dinleyin; adını ve ifadelerini işletmenize göre birlikte belirleyelim.
        </p>
        <p className="mt-6 text-[13.5px] leading-relaxed text-[#8E8D99] dark:text-white/45">
          Ses örnekleri yapay olarak üretilmiştir. Takvim ya da CRM bağlantısı için{" "}
          <Link
            href="/hizmetler/ozel-yazilim"
            className="font-semibold text-[#3A3942] underline decoration-[#DB2777] decoration-2 underline-offset-4 transition-[text-underline-offset,color] duration-[var(--dur-2)] hover:text-[#DB2777] hover:underline-offset-[6px] dark:text-white/80"
          >
            Özel Yazılım
          </Link>
          .
        </p>
      </Reveal>

      {/* ── Kart (masaüstünde solda) ────────────────────── */}
      <Reveal className="lg:order-1">
        <div className="rounded-[28px] bg-[#111116] p-7 text-white shadow-[0_40px_90px_rgba(17,17,22,0.22)] dark:bg-[#17171C] dark:shadow-none dark:ring-1 dark:ring-white/10 md:p-10">
          {/* Ses sekmeleri */}
          <div role="group" aria-label="Ses" className="flex flex-wrap gap-x-5 gap-y-2 sm:gap-x-7">
            {VOICES.map((v) => {
              const selected = v.id === voice;
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => pickVoice(v.id)}
                  className={`relative pb-2 text-[22px] sm:text-[clamp(26px,2.6vw,38px)] font-semibold tracking-[-0.025em] transition-colors duration-[var(--dur-2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F472B6] ${
                    selected ? "text-white" : "text-white/30 hover:text-white/70"
                  }`}
                >
                  {v.name}
                  {selected && <motion.span layoutId="persona-voice-line" className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#DB2777]" transition={{ duration: DUR[3], ease: EASE }} />}
                </button>
              );
            })}
          </div>
          <p key={`${voice}-${tone}-meta`} className="ai-in mt-4 text-[14px] text-white/50">
            {current.gender} · {current.trait.toLocaleLowerCase("tr")}
          </p>

          {/* Karşılama */}
          <p key={`${voice}-${tone}`} className="ai-in mt-8 min-h-[3lh] text-[clamp(20px,1.8vw,26px)] leading-[1.45] text-white/90">
            “{toneObj.greeting}”
          </p>

          {/* Dinle + üslup */}
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4 border-t border-white/10 pt-7">
            <button
              type="button"
              onClick={play}
              aria-pressed={active}
              className="group inline-flex min-h-[52px] items-center gap-3 rounded-full bg-[#DB2777] pl-2 pr-6 text-[16px] font-semibold text-white transition-[background-color,scale] duration-[var(--dur-2)] hover:bg-[#BE185D] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F472B6]"
            >
              <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-[13px] transition-[background-color,scale] duration-[var(--dur-2)] group-hover:scale-105 group-hover:bg-white/30">
                {active || state === "loading" ? "❚❚" : "▶"}
              </span>
              {active ? "Durdur" : state === "loading" ? "Yükleniyor…" : "Sesi dinle"}
            </button>
            <span aria-hidden="true" className="hidden h-8 min-w-[80px] flex-1 items-center gap-[3px] sm:flex">
              {wave(vi + 1).map((h, k) => (
                <span
                  key={k}
                  className={`w-[3px] flex-1 rounded-full transition-colors duration-[var(--dur-3)] ${active ? "animate-[aiWave_0.9s_ease-in-out_infinite] bg-[#F472B6]" : "bg-white/15"}`}
                  style={{ height: h, animationDelay: `${(k % 7) * 0.08}s` }}
                />
              ))}
            </span>
            <div role="group" aria-label="Üslup" className="inline-flex rounded-full bg-white/[0.07] p-1">
              {TONES.map((t) => {
                const selected = tone === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => pickTone(t.id)}
                    className={`relative min-h-[40px] rounded-full px-5 text-[14px] font-semibold transition-colors duration-[var(--dur-3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F472B6] ${
                      selected ? "text-[#171719]" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {selected && <motion.span layoutId="persona-tone-pill" className="absolute inset-0 rounded-full bg-white" transition={{ duration: DUR[3], ease: EASE }} />}
                    <span className="relative">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <p aria-live="polite" className="mt-3 text-[13px] text-white/50 empty:mt-0">
            {state === "missing" ? "Bu sesin örneği henüz yüklenmedi." : ""}
          </p>
        </div>
      </Reveal>
    </div>
  );
}
