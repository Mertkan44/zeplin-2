"use client";

import { useState } from "react";
import { BRIEF_BUDGETS, BRIEF_NEEDS, whatsappUrl } from "@/lib/contact";

type Status = "idle" | "sending" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "contact" | "need" | "message", string>>;

const ERROR_TEXT: Record<keyof FieldErrors, string> = {
  name: "Adınızı yazın.",
  contact: "Size ulaşabileceğimiz bir e-posta veya telefon yazın.",
  need: "Bir ihtiyaç seçin.",
  message: "Projenizi birkaç cümleyle anlatın (en az 10 karakter).",
};

const inputCls =
  "mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-[#DB2777] focus:outline-none focus:ring-2 focus:ring-[#DB2777]/25 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-white/60";
const labelCls = "block text-sm font-semibold text-zinc-800 dark:text-white/85";
const errCls = "mt-1.5 text-sm text-red-600 dark:text-red-400";

export default function BriefForm({ initialNeed }: { initialNeed?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.source = document.referrer || window.location.pathname;

    const local: FieldErrors = {};
    if (String(payload.name ?? "").trim().length < 2) local.name = "x";
    if (String(payload.contact ?? "").trim().length < 5) local.contact = "x";
    if (!payload.need) local.need = "x";
    if (String(payload.message ?? "").trim().length < 10) local.message = "x";
    setErrors(local);
    if (Object.keys(local).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(local)[0]}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
        return;
      }
      if (res.status === 422) {
        const body = await res.json().catch(() => ({}));
        setErrors(body.fieldErrors ?? {});
        setStatus("idle");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-3xl border border-[#DB2777]/25 bg-[#FDF2F8] p-8 dark:bg-[#DB2777]/10 md:p-10">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Talebiniz bize ulaştı.</h2>
        <p className="mt-3 text-base leading-7 text-zinc-700 dark:text-white/75">
          Mesai saatleri içinde en geç bir iş günü içinde size dönüyoruz. Acil bir durum varsa WhatsApp&apos;tan da yazabilirsiniz.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-[#DB2777] underline-offset-4 hover:underline"
        >
          Yeni bir talep gönder
        </button>
      </div>
    );
  }

  const describedBy = (k: keyof FieldErrors) => (errors[k] ? `${k}-error` : undefined);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {/* Honeypot: ekranda ve erişilebilirlik ağacında görünmez */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Web sitesi
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>Ad Soyad *</label>
          <input id="name" name="name" autoComplete="name" className={inputCls} aria-invalid={!!errors.name} aria-describedby={describedBy("name")} />
          {errors.name && <p id="name-error" className={errCls}>{ERROR_TEXT.name}</p>}
        </div>
        <div>
          <label htmlFor="company" className={labelCls}>Marka / Şirket</label>
          <input id="company" name="company" autoComplete="organization" className={inputCls} />
        </div>
      </div>

      <div>
        <label htmlFor="contact" className={labelCls}>E-posta veya telefon *</label>
        <input id="contact" name="contact" autoComplete="email" className={inputCls} aria-invalid={!!errors.contact} aria-describedby={describedBy("contact")} />
        {errors.contact && <p id="contact-error" className={errCls}>{ERROR_TEXT.contact}</p>}
      </div>

      <fieldset aria-describedby={describedBy("need")}>
        <legend className={labelCls}>Neye ihtiyacınız var? *</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {BRIEF_NEEDS.map((need) => (
            <label key={need} className="cursor-pointer">
              <input type="radio" name="need" value={need} defaultChecked={need === initialNeed} className="peer sr-only" />
              <span className="inline-block rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors peer-checked:border-[#DB2777] peer-checked:bg-[#DB2777] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#DB2777]/40 hover:border-[#DB2777] dark:border-white/20 dark:text-white/80">
                {need}
              </span>
            </label>
          ))}
        </div>
        {errors.need && <p id="need-error" className={errCls}>{ERROR_TEXT.need}</p>}
      </fieldset>

      <div>
        <label htmlFor="message" className={labelCls}>Projenizi kısaca anlatın *</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Ne yapmak istiyorsunuz, hedefiniz ne, elinizde neler var?"
          className={inputCls}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("message")}
        />
        {errors.message && <p id="message-error" className={errCls}>{ERROR_TEXT.message}</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="budget" className={labelCls}>Tahmini bütçe</label>
          <select id="budget" name="budget" className={inputCls} defaultValue="">
            <option value="">Seçin (opsiyonel)</option>
            {BRIEF_BUDGETS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="deadline" className={labelCls}>Hedef tarih</label>
          <input id="deadline" name="deadline" placeholder="Örn. Kasım ortası (opsiyonel)" className={inputCls} />
        </div>
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          Talebiniz şu an gönderilemedi. Lütfen tekrar deneyin ya da{" "}
          <a href={whatsappUrl("Merhaba Zeplin Media, web sitenizdeki form gönderilmedi; projem hakkında konuşmak istiyorum.")} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
            WhatsApp&apos;tan yazın
          </a>
          .
        </p>
      )}

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center rounded-full bg-[#DB2777] px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-[#BE185D] disabled:opacity-60"
        >
          {status === "sending" ? "Gönderiliyor…" : "Talebi Gönder"}
        </button>
        <p className="text-sm text-zinc-600 dark:text-white/60">
          Bilgileriniz yalnızca teklif hazırlamak için kullanılır.{" "}
          <a href="/gizlilik" className="underline underline-offset-4">Gizlilik</a>
        </p>
      </div>
    </form>
  );
}
