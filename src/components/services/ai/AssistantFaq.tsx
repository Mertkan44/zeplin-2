"use client";

/*
 * SSS, sohbet biçiminde: solda sorular, sağda seçilen sorunun cevabı bir sohbet balonu olarak
 * ("Zeplin yanıtlıyor…" kısa yazıyor göstergesiyle). Mobilde ve JS yokken native <details>.
 */

import { useRef, useState } from "react";
import { FAQ } from "@/data/assistants";
import Reveal from "./Reveal";

const DISPLAY = { fontFamily: "var(--font-jost), sans-serif" } as const;
const MONO = { fontFamily: "var(--font-jost), sans-serif", fontWeight: 500 } as const;

export default function AssistantFaq() {
  const [open, setOpen] = useState(0);
  const [typing, setTyping] = useState(false);
  const timer = useRef(0);

  // Soru seçilince kısa bir "yazıyor" anından sonra cevap belirir
  const ask = (i: number) => {
    setOpen(i);
    setTyping(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setTyping(false), 650);
  };

  const item = FAQ[open];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
      <Reveal>
        <p className="text-[12px] uppercase tracking-[0.2em] text-[#DB2777] dark:text-[#F472B6]" style={MONO}>
          Sık sorulanlar
        </p>
        <h2 id="ai-faq-title" className="mt-4 font-bold leading-[1.02] tracking-[-0.025em] text-[#171719] dark:text-white" style={{ ...DISPLAY, fontSize: "clamp(38px, 4.6vw, 72px)" }}>
          Sorun, yanıtlayalım.
        </h2>

        {/* Masaüstü: soru listesi */}
        <ol role="tablist" aria-orientation="vertical" aria-label="Sorular" className="mt-10 hidden border-t border-[#DAD8DF] dark:border-white/10 lg:block">
          {FAQ.map((f, i) => {
            const selected = i === open;
            return (
              <li key={f.q} className="border-b border-[#DAD8DF] dark:border-white/10">
                <button
                  type="button"
                  role="tab"
                  id={`faq-tab-${i}`}
                  aria-selected={selected}
                  aria-controls="faq-answer"
                  onClick={() => ask(i)}
                  className={`group flex w-full items-baseline gap-5 py-4 text-left transition-colors duration-[var(--dur-2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DB2777] ${
                    selected ? "text-[#171719] dark:text-white" : "text-[#8E8D99] hover:text-[#3A3942] dark:hover:text-white/80"
                  }`}
                >
                  <span className={`w-7 shrink-0 text-[12px] tabular-nums transition-colors duration-[var(--dur-2)] ${selected ? "text-[#DB2777]" : "group-hover:text-[#DB2777]/70"}`} style={MONO}>
                    0{i + 1}
                  </span>
                  <span className="flex-1 font-semibold tracking-[-0.02em]" style={{ ...DISPLAY, fontSize: "clamp(18px, 1.5vw, 22px)" }}>
                    {f.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`text-[18px] transition-[opacity,translate,color] duration-[var(--dur-2)] ${selected ? "translate-x-0 text-[#DB2777]" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}
                  >
                    →
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Mobil: açılır liste */}
        <div className="mt-8 border-t border-[#DAD8DF] dark:border-white/10 lg:hidden">
          {FAQ.map((f, i) => (
            <details key={f.q} className="ai-details group border-b border-[#DAD8DF] dark:border-white/10">
              <summary className="flex min-h-[60px] cursor-pointer list-none items-baseline gap-4 py-4 [&::-webkit-details-marker]:hidden">
                <span className="w-7 shrink-0 text-[12px] text-[#DB2777]" style={MONO}>
                  0{i + 1}
                </span>
                <span className="flex-1 text-[18px] font-semibold leading-snug tracking-[-0.02em]" style={DISPLAY}>
                  {f.q}
                </span>
                <span aria-hidden="true" className="text-[22px] text-[#DB2777] transition-transform duration-[var(--dur-3)] group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="ai-details-body mb-5 ml-11 rounded-2xl rounded-tl-md bg-[#111116] px-4 py-3 text-[15.5px] leading-relaxed text-white/85">{f.a}</p>
            </details>
          ))}
        </div>
      </Reveal>

      {/* Masaüstü: sohbet biçiminde cevap */}
      <Reveal order={1} className="hidden lg:block">
        <div
          id="faq-answer"
          role="tabpanel"
          aria-labelledby={`faq-tab-${open}`}
          className="sticky top-28 overflow-hidden rounded-[28px] bg-[#111116] p-8 text-white shadow-[0_40px_90px_rgba(17,17,22,0.22)]"
        >
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/45" style={MONO}>
            <span>Zeplin · yapay zekâ asistanları</span>
            <span key={open} className="ai-in text-[#F472B6]">{String(open + 1).padStart(2, "0")} / {String(FAQ.length).padStart(2, "0")}</span>
          </div>
          <div className="mt-8 flex min-h-[340px] flex-col gap-4">
            <p key={`q-${open}`} className="ai-in max-w-[85%] self-end rounded-2xl rounded-br-md bg-[#DB2777] px-5 py-3.5 text-[17px] font-medium leading-snug">
              {item.q}
            </p>
            {typing ? (
              <span className="ai-in inline-flex gap-1.5 self-start rounded-2xl rounded-bl-md bg-white/10 px-4 py-3.5" aria-label="Zeplin yazıyor">
                {[0, 1, 2].map((k) => (
                  <span key={k} className="ai-dot h-2 w-2 rounded-full bg-white" style={{ animationDelay: `${k * 0.15}s` }} />
                ))}
              </span>
            ) : (
              <p key={`a-${open}`} className="ai-in max-w-[92%] self-start rounded-2xl rounded-bl-md bg-white/[0.08] px-5 py-4 text-[17px] leading-relaxed text-white/90" aria-live="polite">
                {item.a}
              </p>
            )}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={() => ask((open + 1) % FAQ.length)}
              className="group text-[14px] font-semibold text-white/70 transition-colors duration-[var(--dur-2)] hover:text-white"
            >
              Sonraki soru{" "}
              <span aria-hidden="true" className="inline-block transition-transform duration-[var(--dur-2)] group-hover:translate-x-1">
                →
              </span>
            </button>
            <span className="text-[12px] text-white/40" style={MONO}>
              sorunuz yoksa aşağıdan yazın
            </span>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
