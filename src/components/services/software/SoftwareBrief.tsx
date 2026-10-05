"use client";

/*
 * Üç adımlı ihtiyaç seçimi → okunabilir özet → iletişim formu.
 * Fiyat hesaplayıcı ya da otomatik danışman değildir; özet kesin çözüm, fiyat veya
 * tarih vaat etmez. Formu kullanıcı adına göndermez; yalnızca izinli kimlikleri taşır.
 */

import Link from "next/link";
import { useRef, useState } from "react";
import {
  BRIEF_STEPS,
  softwareBriefSummary,
  softwareContactHref,
  softwareWhatsappMessage,
  type BriefSelection,
} from "@/data/software";
import { whatsappUrl } from "@/lib/contact";

export default function SoftwareBrief() {
  const [step, setStep] = useState(0); // 0..2 sorular, 3 özet
  const [sel, setSel] = useState<BriefSelection>({});
  const headingRef = useRef<HTMLHeadingElement>(null);

  const go = (next: number) => {
    setStep(next);
    // Adım değişince odak yeni başlığa: klavye ve ekran okuyucu bağlamı kaybetmez.
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const current = BRIEF_STEPS[step];
  const chosen = current ? sel[current.key] : undefined;
  const summary = softwareBriefSummary(sel);

  return (
    <div className="rounded-[24px] border border-[#DAD8DF] bg-white p-5 shadow-[0_20px_60px_rgba(23,23,25,0.06)] dark:border-white/10 dark:bg-white/[0.04] md:p-8">
      {/* İlerleme */}
      <ol className="flex gap-2" aria-label="Adımlar">
        {BRIEF_STEPS.map((st, i) => (
          <li
            key={st.key}
            aria-current={i === step ? "step" : undefined}
            className={`h-1.5 flex-1 rounded-full ${i < step || step === 3 ? "bg-[#DB2777]" : i === step ? "bg-[#DB2777]/50" : "bg-[#DAD8DF] dark:bg-white/15"}`}
          >
            <span className="sr-only">
              {i + 1}. adım: {st.question} {i < step || step === 3 ? "(tamamlandı)" : ""}
            </span>
          </li>
        ))}
      </ol>

      {current ? (
        <fieldset className="mt-7">
          <legend className="w-full">
            <span className="block text-[13px] font-semibold uppercase tracking-[0.14em] text-[#DB2777]">
              Adım {step + 1} / {BRIEF_STEPS.length}
            </span>
            <h3 ref={headingRef} tabIndex={-1} className="mt-2 block text-[24px] font-semibold leading-tight tracking-[-0.02em] text-[#171719] outline-none dark:text-white md:text-[30px]">
              {current.question}
            </h3>
          </legend>
          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {current.options.map((o) => (
              <label
                key={o.id}
                className={`flex min-h-[52px] cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-[16px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#DB2777] ${
                  chosen === o.id
                    ? "border-[#DB2777] bg-[#FCE7F3] font-semibold text-[#171719] dark:bg-[#DB2777]/15 dark:text-white"
                    : "border-[#DAD8DF] text-[#3A3942] hover:border-[#171719] dark:border-white/15 dark:text-white/80 dark:hover:border-white/50"
                }`}
              >
                <input
                  type="radio"
                  name={`brief-${current.key}`}
                  value={o.id}
                  checked={chosen === o.id}
                  onChange={() => setSel((v) => ({ ...v, [current.key]: o.id }))}
                  className="h-4 w-4 shrink-0 accent-[#DB2777]"
                />
                {o.label}
              </label>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => go(step - 1)}
                className="min-h-[48px] rounded-full border border-[#DAD8DF] px-6 text-[15px] font-semibold text-[#171719] transition-colors hover:border-[#171719] dark:border-white/20 dark:text-white"
              >
                Geri
              </button>
            )}
            <button
              type="button"
              onClick={() => go(step + 1)}
              disabled={!chosen}
              className="min-h-[48px] rounded-full bg-[#171719] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#DB2777] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-[#171719]"
            >
              {step === BRIEF_STEPS.length - 1 ? "Özeti gör" : "Devam"}
            </button>
            {!chosen && <span className="text-[14px] text-[#62616B] dark:text-white/55">Devam etmek için bir seçenek işaretleyin.</span>}
          </div>
        </fieldset>
      ) : (
        <div className="mt-7">
          <span className="block text-[13px] font-semibold uppercase tracking-[0.14em] text-[#DB2777]">Özet</span>
          <h3 ref={headingRef} tabIndex={-1} className="mt-2 text-[24px] font-semibold leading-tight tracking-[-0.02em] text-[#171719] outline-none dark:text-white md:text-[30px]">
            Görüşmeye buradan başlayabiliriz.
          </h3>
          <p className="mt-4 max-w-[60ch] rounded-2xl bg-[#F7F6F3] px-5 py-4 text-[17px] leading-relaxed text-[#3A3942] dark:bg-white/5 dark:text-white/80">
            {summary}
          </p>
          <p className="mt-3 text-[14px] text-[#62616B] dark:text-white/55">
            Bu özet bir teklif değildir; formda düzenleyebilir, ayrıntı ekleyebilirsiniz.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={softwareContactHref(sel)}
              className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-[#DB2777] px-7 text-[16px] font-semibold text-white transition-colors hover:bg-[#BE185D]"
            >
              Bu özetle iletişime geç <span aria-hidden="true">→</span>
            </Link>
            <button
              type="button"
              onClick={() => go(0)}
              className="min-h-[48px] rounded-full px-4 text-[15px] font-semibold text-[#171719] underline-offset-4 hover:underline dark:text-white"
            >
              Seçimleri değiştir
            </button>
          </div>
        </div>
      )}

      {/* Aracı tamamlamak zorunlu değil */}
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#DAD8DF] pt-5 text-[15px] dark:border-white/10">
        <span className="w-full text-[#62616B] dark:text-white/55">Seçim yapmak istemiyor musunuz?</span>
        <Link href={softwareContactHref()} className="whitespace-nowrap font-semibold text-[#171719] underline-offset-4 hover:underline dark:text-white">
          Doğrudan projenizi anlatın →
        </Link>
        <a
          href={whatsappUrl(softwareWhatsappMessage(sel.need))}
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap font-semibold text-[#DB2777] underline-offset-4 hover:underline dark:text-[#F9A8D4]"
        >
          WhatsApp&apos;tan yazın ↗
        </a>
      </div>
    </div>
  );
}
