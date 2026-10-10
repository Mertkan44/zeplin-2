/*
 * /hizmetler/yapay-zeka — Özel Yapay Zekâ Asistanları (chatbot + callbot tek sayfada).
 * Eski /hizmetler/akilli-chatbot ve /hizmetler/sesli-asistan adresleri #chatbot / #callbot'a yönlenir.
 *
 * Sunucu bileşeni: açıklamalar okunabilir HTML olarak gelir; yalnızca konuşma demosu ve
 * ses seçici istemcide çalışır. Henüz yayında müşteri asistanı yok → her örnek etiketli.
 */

import Link from "next/link";
import { JetBrains_Mono } from "next/font/google";
import { briefHref, getRelatedServices, type ServiceData } from "@/data/services";
import { CHANNELS, FAQ, PRINCIPLES } from "@/data/assistants";
import { whatsappUrl } from "@/lib/contact";
import { RelatedServices } from "./RelatedServices";
import TryAssistant from "./ai/TryAssistant";
import VoicePicker from "./ai/VoicePicker";
import HeroPhone from "./ai/HeroPhone";
import NightStory from "./ai/NightStory";

// Gece sahnesindeki saat, damga ve fiş satırları için (yalnızca bu sayfada yüklenir)
const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "700"], variable: "--font-night-mono", display: "swap" });

const wrap = "mx-auto w-full max-w-[1400px] px-5 md:px-10";
const eyebrow = "text-[13px] font-semibold uppercase tracking-[0.16em] text-[#DB2777] dark:text-[#F472B6]";
const h2 = "mt-4 text-[clamp(32px,4.2vw,54px)] font-semibold leading-[1.06] tracking-[-0.035em] text-[#171719] dark:text-white";
const lead = "mt-5 max-w-[60ch] text-[17px] leading-[1.65] text-[#62616B] dark:text-white/65 md:text-[18px]";
const rule = "border-[#DAD8DF] dark:border-white/10";


export function AIServicePage({ service }: { service: ServiceData }) {
  const related = getRelatedServices(service.relatedSlugs);

  return (
    <main className={`${mono.variable} min-h-screen bg-[#F7F6F3] text-[#171719] dark:bg-[#0F0F12] dark:text-white`}>
      {/* ── Açılış + iki kanal demosu ──────────────────────────────── */}
      <section aria-labelledby="ai-title" className="overflow-x-clip pb-12 pt-28 md:pb-16 md:pt-36">
        <div className={wrap}>
          <nav aria-label="Breadcrumb" className="text-[14px] text-[#62616B] dark:text-white/55">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="underline-offset-4 hover:text-[#171719] hover:underline dark:hover:text-white">Ana sayfa</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/hizmetler" className="underline-offset-4 hover:text-[#171719] hover:underline dark:hover:text-white">Hizmetler</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-[#171719] dark:text-white">{service.title}</li>
            </ol>
          </nav>

          <div className="mt-8 grid items-start gap-6 lg:mt-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-0">
            <div className="lg:pt-6">
              <p className={eyebrow}>Özel yapay zekâ asistanlarımız</p>
              <h1 id="ai-title" className="mt-5 max-w-[11.5ch] text-[clamp(42px,5.6vw,84px)] font-semibold leading-[1.03] tracking-[-0.05em]">
                Yazan da arayan da cevapsız kalmasın<span className="text-[#DB2777]">.</span>
              </h1>
              <p className="mt-7 max-w-[40ch] text-[18px] leading-[1.6] text-[#3A3942] dark:text-white/75 md:text-[20px]">
                WhatsApp ve web için chatbot, telefon için callbot. Sesini, üslubunu ve senaryosunu sizin seçtiğiniz yapay zekâ asistanları.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#basla" className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-[#DB2777] px-7 text-[16px] font-semibold text-white transition-colors hover:bg-[#BE185D]">
                  Asistanınızı tasarlayalım <span aria-hidden="true">→</span>
                </a>
                <a
                  href="#ses"
                  className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-[#171719] px-7 text-[16px] font-semibold transition-colors hover:bg-[#171719] hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-[#171719]"
                >
                  Sesleri dinleyin
                </a>
              </div>
              <p className="mt-6 text-[14px] text-[#62616B] dark:text-white/55">Rezervasyon · Randevu · Sık sorulan sorular · Sipariş takibi</p>
            </div>
            <HeroPhone />
          </div>
        </div>
      </section>

      {/* ── Kendiniz deneyin (öngösterim) ──────────────────────────── */}
      <section id="demo" aria-labelledby="try-title" className={`scroll-mt-24 border-t ${rule} py-20 md:py-28`}>
        <div className={`${wrap} overflow-x-clip`}>
          <TryAssistant />
        </div>
      </section>

      {/* ── Bir gece, bir asistan: kanallar + yetenekler hikâye olarak ("23.47") ── */}
      <span id="chatbot" className="block scroll-mt-24" aria-hidden="true" />
      <span id="callbot" className="block" aria-hidden="true" />
      <NightStory />
      <div className={`${wrap} grid gap-3 py-8 text-[13.5px] leading-relaxed text-[#62616B] dark:text-white/55 md:grid-cols-2 md:gap-10`}>
        {CHANNELS.map((c) => (
          <p key={c.id}>
            <span className="font-semibold text-[#3A3942] dark:text-white/80">{c.name} · {c.where}:</span> {c.lead} {c.note}
          </p>
        ))}
      </div>

      {/* ── Ses ve kişilik ─────────────────────────────────────────── */}
      <section id="ses" aria-labelledby="voice-title" className={`scroll-mt-24 border-t ${rule} py-20 md:py-28`}>
        <div className={wrap}>
          <div className="mb-10 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <p className={eyebrow}>Ses ve kişilik</p>
              <h2 id="voice-title" className={h2}>
                Asistanınızın sesini siz seçin.
              </h2>
            </div>
            <p className="max-w-[46ch] text-[17px] leading-[1.65] text-[#62616B] dark:text-white/65 lg:pb-2">
              Bir ses ve üslup seçin, karşılamayı dinleyin. Markanıza en çok yakışanı birlikte buluruz.
            </p>
          </div>
          <VoicePicker />
        </div>
      </section>

      {/* ── Güven ve sınırlar ──────────────────────────────────────── */}
      <section aria-labelledby="trust-title" className="bg-[#111116] py-20 text-white md:py-28">
        <div className={`${wrap} grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20`}>
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#F9A8D4]">Güven</p>
            <h2 id="trust-title" className="mt-4 text-[clamp(32px,4.2vw,54px)] font-semibold leading-[1.06] tracking-[-0.035em]">
              Akıllı olduğu kadar sınırlarını bilen.
            </h2>
            <p className="mt-5 max-w-[48ch] text-[17px] leading-[1.65] text-[#B5B4C0]">
              Asistanı kendi panelinize, takviminize ya da CRM&apos;inize bağlamak mı istiyorsunuz?{" "}
              <Link href="/hizmetler/ozel-yazilim" className="font-semibold text-white underline decoration-[#DB2777] decoration-2 underline-offset-4">
                Özel Yazılım
              </Link>{" "}
              sayfasında anlatıyoruz.
            </p>
          </div>
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title} className="grid gap-2 py-6 sm:grid-cols-[48px_1fr]">
                <span className="text-[15px] font-semibold tabular-nums text-[#F472B6]">0{i + 1}</span>
                <div>
                  <h3 className="text-[22px] font-semibold tracking-[-0.015em]">{p.title}</h3>
                  <p className="mt-2 text-[16.5px] leading-[1.6] text-[#D6D5DE]">{p.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Süreç ──────────────────────────────────────────────────── */}
      <section aria-labelledby="ai-process-title" className="py-20 md:py-28">
        <div className={wrap}>
          <p className={eyebrow}>Nasıl kuruyoruz</p>
          <h2 id="ai-process-title" className={h2}>
            Dört adımda yayında.
          </h2>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {service.process.map((s) => (
              <li key={s.step} className={`border-t-2 border-[#DB2777] pt-5`}>
                <span className="text-[15px] font-semibold tabular-nums text-[#DB2777]">{s.step}</span>
                <h3 className="mt-2 text-[22px] font-semibold tracking-[-0.015em]">{s.title}</h3>
                <p className="mt-2 text-[16px] leading-[1.6] text-[#3A3942] dark:text-white/70">{s.desc}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-[15px] text-[#62616B] dark:text-white/55">Süre; kanal sayısına ve senaryoların kapsamına göre ilk görüşmede netleşir.</p>
        </div>
      </section>

      {/* ── SSS ────────────────────────────────────────────────────── */}
      <section aria-labelledby="ai-faq-title" className={`border-t ${rule} py-20 md:py-28`}>
        <div className={`${wrap} grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20`}>
          <div>
            <p className={eyebrow}>Sık sorulanlar</p>
            <h2 id="ai-faq-title" className={h2}>
              Aklınızdaki sorular.
            </h2>
          </div>
          <div className={`border-t ${rule}`}>
            {FAQ.map((f) => (
              <details key={f.q} className={`group border-b ${rule}`}>
                <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-6 py-4 text-[18px] font-semibold leading-snug [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden="true" className="text-[24px] font-normal text-[#DB2777] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-[64ch] pb-6 text-[16.5px] leading-[1.65] text-[#3A3942] dark:text-white/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Başla ──────────────────────────────────────────────────── */}
      <section id="basla" aria-labelledby="start-title" className="scroll-mt-24 bg-[#FCE7F3]/60 py-20 dark:bg-[#DB2777]/[0.06] md:py-28">
        <div className={`${wrap} flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between`}>
          <div>
            <p className={eyebrow}>Nereden başlayalım?</p>
            <h2 id="start-title" className={h2}>
              Asistanınızı birlikte tasarlayalım.
            </h2>
            <p className={lead}>İşletmenizi ve size en sık gelen soruları anlatın; uygun kanal, ses ve senaryo önerisiyle dönelim.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:pb-2">
            <Link href={briefHref(service)} className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-[#DB2777] px-7 text-[16px] font-semibold text-white transition-colors hover:bg-[#BE185D]">
              Projeni anlat <span aria-hidden="true">→</span>
            </Link>
            <a
              href={whatsappUrl("Merhaba Zeplin, yapay zekâ asistanı hakkında görüşmek istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-[#171719] px-7 text-[16px] font-semibold hover:bg-[#171719] hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-[#171719]"
            >
              WhatsApp&apos;tan yazın <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <RelatedServices services={related} />
    </main>
  );
}
