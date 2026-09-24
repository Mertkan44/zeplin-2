import { NextResponse } from "next/server";
import { BRIEF_BUDGETS, BRIEF_NEEDS } from "@/lib/contact";

/**
 * "Projeni Anlat" formu → e-posta (Resend).
 * Gerekli ortam değişkenleri:
 *   RESEND_API_KEY     — Resend API anahtarı
 *   CONTACT_TO_EMAIL   — talebin düşeceği adres
 *   CONTACT_FROM_EMAIL — doğrulanmış gönderici (ör. "Zeplin Web <form@zeplinmedia.com>")
 *                        Alan adı doğrulanana kadar "onboarding@resend.dev" kullanılabilir.
 */

type Brief = {
  name: string;
  company: string;
  contact: string;
  need: string;
  budget: string;
  deadline: string;
  message: string;
  source: string;
  website: string; // honeypot
};

const LIMITS: Record<keyof Brief, number> = {
  name: 100,
  company: 120,
  contact: 150,
  need: 60,
  budget: 60,
  deadline: 60,
  message: 3000,
  source: 200,
  website: 200,
};

const escapeHtml = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const data = Object.fromEntries(
    (Object.keys(LIMITS) as (keyof Brief)[]).map((k) => [
      k,
      typeof raw[k] === "string" ? (raw[k] as string).trim().slice(0, LIMITS[k]) : "",
    ]),
  ) as Brief;

  // Bot doldurduysa sessizce başarılı dön
  if (data.website) return NextResponse.json({ ok: true });

  const fieldErrors: Partial<Record<keyof Brief, string>> = {};
  if (data.name.length < 2) fieldErrors.name = "required";
  if (data.contact.length < 5) fieldErrors.contact = "required";
  if (!(BRIEF_NEEDS as readonly string[]).includes(data.need)) fieldErrors.need = "required";
  if (data.message.length < 10) fieldErrors.message = "short";
  if (data.budget && !(BRIEF_BUDGETS as readonly string[]).includes(data.budget)) data.budget = "";
  if (Object.keys(fieldErrors).length) {
    return NextResponse.json({ error: "validation", fieldErrors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Zeplin Web <onboarding@resend.dev>";
  if (!apiKey || !to) {
    console.error("[brief] RESEND_API_KEY veya CONTACT_TO_EMAIL tanımlı değil");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const rows: [string, string][] = [
    ["Ad Soyad", data.name],
    ["Marka / Şirket", data.company || "—"],
    ["İletişim", data.contact],
    ["İhtiyaç", data.need],
    ["Bütçe", data.budget || "—"],
    ["Hedef tarih", data.deadline || "—"],
    ["Geldiği sayfa", data.source || "—"],
  ];

  const html = `
    <h2 style="font-family:sans-serif">Yeni proje talebi</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 12px 6px 0;color:#666">${k}</td><td style="padding:6px 0"><strong>${escapeHtml(v)}</strong></td></tr>`,
        )
        .join("")}
    </table>
    <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap;margin-top:16px">${escapeHtml(data.message)}</p>`;

  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${data.message}`;
  const replyTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact) ? data.contact : undefined;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Proje talebi: ${data.need} — ${data.company || data.name}`,
      html,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    console.error("[brief] Resend hatası", res.status, await res.text());
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
