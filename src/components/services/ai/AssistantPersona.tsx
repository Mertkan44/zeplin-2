"use client";

/*
 * Asistan kimliği: ses + üslup seçimi (nasıl konuşur) ile ilkeler (nasıl davranır) tek bölümde.
 * Seçimler sağdaki kimlik kartına yansır; kart bir yaka kartı gibi: ad, ses, karşılama, dinle,
 * altında ilkeler. Ses dosyaları /audio/voices/<ses>-<üslup>.mp3; yalnızca kullanıcı isteyince çalar.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DUR, EASE } from "@/lib/motion";
import Reveal from "./Reveal";
import { PRINCIPLES, TONES, VOICES, type ToneId, type VoiceId } from "@/data/assistants";

type PlayState = "idle" | "loading" | "playing" | "missing";

const DISPLAY = { fontFamily: "var(--font-jost), sans-serif" } as const;
const MONO = { fontFamily: "var(--font-jost), sans-serif", fontWeight: 500 } as const;

/* Her sese sabit, ayırt edici bir dalga deseni (dekoratif) */
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
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
      {/* ── Sağ (masaüstü): anlatım + seçim ─────────────────── */}
      <Reveal order={1} className="lg:order-2">
        <h2 id="persona-title" className="font-bold leading-[1.02] tracking-[-0.025em] text-[#171719] dark:text-white" style={{ ...DISPLAY, fontSize: "clamp(38px, 4.6vw, 72px)" }}>
          Sesini siz seçin, sınırlarını birlikte belirleyelim.
        </h2>

        <fieldset className="mt-10">
          <legend className="mb-2 text-[11.5px] uppercase tracking-[0.18em] text-[#62616B] dark:text-white/55" style={MONO}>
            01 · Ses
          </legend>
          <div className="divide-y divide-[#DAD8DF] border-y border-[#DAD8DF] dark:divide-white/10 dark:border-white/10">
            {VOICES.map((v, i) => {
              const selected = v.id === voice;
              return (
                <label
                  key={v.id}
                  className={`group flex cursor-pointer items-center gap-5 py-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#DB2777]`}
                >
                  <input type="radio" name="persona-voice" value={v.id} checked={selected} onChange={() => pickVoice(v.id)} className="sr-only" />
                  <span className={`w-8 text-[12px] tabular-nums transition-colors duration-[var(--dur-2)] ${selected ? "text-[#DB2777]" : "text-[#8E8D99] group-hover:text-[#DB2777]/70"}`} style={MONO}>
                    0{i + 1}
                  </span>
                  <span
                    className={`min-w-[110px] font-bold tracking-[-0.015em] transition-[color,translate] duration-[var(--dur-2)] ${selected ? "text-[#171719] dark:text-white" : "text-[#8E8D99] group-hover:translate-x-1 group-hover:text-[#3A3942] dark:group-hover:text-white/80"}`}
                    style={{ ...DISPLAY, fontSize: "clamp(26px, 2.4vw, 36px)" }}
                  >
                    {v.name}
                  </span>
                  <span className={`hidden flex-1 text-[15px] transition-colors duration-[var(--dur-2)] sm:block ${selected ? "text-[#3A3942] dark:text-white/75" : "text-[#8E8D99]"}`}>{v.trait}</span>
                  <span aria-hidden="true" className="ml-auto flex h-6 items-center gap-[2px]">
                    {wave(i + 1)
                      .slice(0, 14)
                      .map((h, k) => (
                        <span
                          key={k}
                          className={`w-[2px] rounded-full transition-colors duration-[var(--dur-2)] ${
                            selected && active
                              ? "animate-[aiWave_0.9s_ease-in-out_infinite] bg-[#DB2777]"
                              : selected
                                ? "bg-[#DB2777]"
                                : "bg-[#C9C7CF] group-hover:animate-[aiWave_0.9s_ease-in-out_infinite] group-hover:bg-[#DB2777]/50 dark:bg-white/20"
                          }`}
                          style={{ height: h * 0.8, animationDelay: `${(k % 7) * 0.08}s` }}
                        />
                      ))}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mt-8">
          <legend className="mb-3 text-[11.5px] uppercase tracking-[0.18em] text-[#62616B] dark:text-white/55" style={MONO}>
            02 · Üslup
          </legend>
          <div className="inline-flex rounded-full border border-[#DAD8DF] bg-white p-1 dark:border-white/15 dark:bg-white/[0.04]">
            {TONES.map((t) => (
              <label key={t.id} className="relative cursor-pointer rounded-full has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#DB2777]">
                <input type="radio" name="persona-tone" value={t.id} checked={tone === t.id} onChange={() => pickTone(t.id)} className="sr-only" />
                {tone === t.id && <motion.span layoutId="persona-tone-pill" className="absolute inset-0 rounded-full bg-[#171719] dark:bg-white" transition={{ duration: DUR[3], ease: EASE }} />}
                <span
                  className={`relative block min-h-[42px] rounded-full px-6 text-[15px] font-semibold leading-[42px] transition-colors duration-[var(--dur-3)] ${
                    tone === t.id ? "text-white dark:text-[#171719]" : "text-[#3A3942] hover:text-[#171719] dark:text-white/75 dark:hover:text-white"
                  }`}
                >
                  {t.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </Reveal>

      {/* ── Sol (masaüstü): kimlik kartı ──────────────────── */}
      <Reveal className="lg:order-1">
        <article className="relative overflow-hidden rounded-[28px] bg-[#111116] text-white shadow-[0_40px_90px_rgba(17,17,22,0.25)]">
          {/* Yaka kartı askısı */}
          <div aria-hidden="true" className="flex justify-center pt-4">
            <span className="h-2 w-16 rounded-full bg-white/15" />
          </div>
          <div className="px-7 pb-7 pt-5 md:px-9 md:pb-9">
            <div className="flex items-start justify-between gap-4 text-[11px] uppercase tracking-[0.2em] text-white/45" style={MONO}>
              <span>Atlas Restoran · asistan</span>
              <span key={voice} className="ai-in text-[#F472B6]">No. 0{vi + 1}</span>
            </div>

            <p key={voice} className="ai-in mt-6 font-extrabold leading-[0.9] tracking-[-0.035em]" style={{ ...DISPLAY, fontSize: "clamp(64px, 8vw, 120px)" }}>
              {current.name}
            </p>
            <p key={`meta-${voice}-${tone}`} className="ai-in mt-3 text-[12px] uppercase tracking-[0.16em] text-white/55" style={{ ...MONO, animationDelay: "var(--stagger)" }}>
              {current.gender} · Türkçe · {toneObj.label}
            </p>

            <p key={`${voice}-${tone}`} className="ai-in mt-7 border-l-2 border-[#DB2777] pl-4 text-[19px] leading-[1.5] text-white/90 md:text-[21px]">
              “{toneObj.greeting}”
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
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
              <span aria-hidden="true" className="flex h-8 flex-1 items-center gap-[3px]">
                {wave(vi + 1).map((h, k) => (
                  <span
                    key={k}
                    className={`w-[3px] flex-1 rounded-full transition-colors duration-[var(--dur-3)] ${active ? "animate-[aiWave_0.9s_ease-in-out_infinite] bg-[#F472B6]" : "bg-white/20"}`}
                    style={{ height: h, animationDelay: `${(k % 7) * 0.08}s` }}
                  />
                ))}
              </span>
            </div>
            <p aria-live="polite" className="mt-2 min-h-[20px] text-[13px] text-white/50">
              {state === "missing" ? "Bu sesin örneği henüz yüklenmedi." : ""}
            </p>

            {/* İlkeler: kartın arka yüzü gibi, aynı kimliğin davranışı */}
            <div className="mt-5 border-t border-dashed border-white/20 pt-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/45" style={MONO}>
                İlkeleri
              </p>
              <ol className="mt-4 space-y-4">
                {PRINCIPLES.map((pr, i) => (
                  <li key={pr.title} className="grid grid-cols-[28px_1fr] gap-x-2">
                    <span className="pt-[3px] text-[12px] text-[#F472B6]" style={MONO}>
                      0{i + 1}
                    </span>
                    <div>
                      <p className="text-[17px] font-semibold leading-snug">{pr.title}</p>
                      <p className="mt-1 text-[14.5px] leading-relaxed text-white/60">{pr.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </article>
        <p className="mt-4 text-[13.5px] leading-relaxed text-[#62616B] dark:text-white/55">
          Ses örnekleri yapay olarak üretilmiştir; asistanın adını ve ifadelerini birlikte belirleriz. Kendi panelinize, takviminize ya da CRM&apos;inize bağlamak
          için{" "}
          <Link href="/hizmetler/ozel-yazilim" className="font-semibold text-[#171719] underline decoration-[#DB2777] decoration-2 underline-offset-4 transition-[text-underline-offset,color] duration-[var(--dur-2)] hover:text-[#DB2777] hover:underline-offset-[6px] dark:text-white">
            Özel Yazılım
          </Link>
          .
        </p>
      </Reveal>
    </div>
  );
}
