/*
 * /hizmetler/yapay-zeka — Özel Yapay Zekâ Asistanları (chatbot + callbot tek sayfada).
 * Eski /hizmetler/akilli-chatbot ve /hizmetler/sesli-asistan adresleri #chatbot / #callbot'a yönlenir.
 *
 * Sunucu bileşeni: açıklamalar okunabilir HTML olarak gelir; yalnızca konuşma demosu ve
 * ses seçici istemcide çalışır. Henüz yayında müşteri asistanı yok → her örnek etiketli.
 */

import Link from "next/link";
import { briefHref, type ServiceData } from "@/data/services";
import { whatsappUrl } from "@/lib/contact";
import TryAssistant from "./ai/TryAssistant";
import AssistantPersona from "./ai/AssistantPersona";
import AssistantFaq from "./ai/AssistantFaq";
import HeroPhone from "./ai/HeroPhone";
import NightStory from "./ai/NightStory";
import Reveal from "./ai/Reveal";

const wrap = "mx-auto w-full max-w-[1400px] px-5 md:px-10";
const eyebrow = "text-[13px] font-semibold uppercase tracking-[0.16em] text-[#DB2777] dark:text-[#F472B6]";
const h2 = "mt-4 text-[clamp(32px,4.2vw,54px)] font-semibold leading-[1.06] tracking-[-0.035em] text-[#171719] dark:text-white";
const lead = "mt-5 max-w-[60ch] text-[17px] leading-[1.65] text-[#62616B] dark:text-white/65 md:text-[18px]";
const rule = "border-[#DAD8DF] dark:border-white/10";
/* Düğmeler: renk dur-2'de değişir, basınca hafifçe çöker; ok sitenin her yerindeki gibi sağa kayar */
const btn = "group inline-flex min-h-[52px] items-center gap-2 rounded-full px-7 text-[16px] font-semibold transition-[background-color,border-color,color,scale] duration-[var(--dur-2)] active:scale-[0.98]";
const btnPrimary = `${btn} bg-[#DB2777] text-white hover:bg-[#BE185D]`;
const btnGhost = `${btn} border border-[#171719] hover:bg-[#171719] hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-[#171719]`;
const arrow = "inline-block transition-transform duration-[var(--dur-2)] group-hover:translate-x-1";
const arrowUp = "inline-block transition-transform duration-[var(--dur-2)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5";
/* Açılış metni: sitenin hero-rise'ı, --stagger ritmiyle */
const rise = (i: number) => ({ animationDelay: `calc(var(--stagger) * ${i})` });


export function AIServicePage({ service }: { service: ServiceData }) {
  return (
    <main className={`min-h-screen bg-[#F7F6F3] text-[#171719] dark:bg-[#0F0F12] dark:text-white`}>
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
              <p className={`hero-rise ${eyebrow}`} style={rise(0)}>Özel yapay zekâ asistanlarımız</p>
              <h1 id="ai-title" style={rise(1)} className="hero-rise mt-5 max-w-[11.5ch] text-[clamp(42px,5.6vw,84px)] font-semibold leading-[1.03] tracking-[-0.05em]">
                Yazan da arayan da cevapsız kalmasın<span className="text-[#DB2777]">.</span>
              </h1>
              <p style={rise(2)} className="hero-rise mt-7 max-w-[40ch] text-[18px] leading-[1.6] text-[#3A3942] dark:text-white/75 md:text-[20px]">
                WhatsApp ve web için chatbot, telefon için callbot. Sesini, üslubunu ve senaryosunu sizin seçtiğiniz yapay zekâ asistanları.
              </p>
              <div style={rise(3)} className="hero-rise mt-8 flex flex-wrap gap-3">
                <a href="#basla" className={btnPrimary}>
                  Asistanınızı tasarlayalım <span aria-hidden="true" className={arrow}>→</span>
                </a>
                <a href="#ses" className={btnGhost}>
                  Sesleri dinleyin
                </a>
              </div>
              <p style={rise(4)} className="hero-rise mt-6 text-[14px] text-[#62616B] dark:text-white/55">Rezervasyon · Randevu · Sık sorulan sorular · Sipariş takibi</p>
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

      {/* ── Asistan kimliği: ses (nasıl konuşur) + ilkeler (nasıl davranır) ── */}
      <section id="ses" aria-labelledby="persona-title" className="scroll-mt-24 py-20 md:py-28">
        <div className={wrap}>
          <AssistantPersona />
        </div>
      </section>

      {/* ── SSS: sohbet biçiminde ──────────────────────────────────── */}
      <section aria-labelledby="ai-faq-title" className={`border-t ${rule} py-20 md:py-28`}>
        <div className={wrap}>
          <AssistantFaq />
        </div>
      </section>

      {/* ── Başla ──────────────────────────────────────────────────── */}
      <section id="basla" aria-labelledby="start-title" className="scroll-mt-24 bg-[#FCE7F3]/60 py-20 dark:bg-[#DB2777]/[0.06] md:py-28">
        <div className={`${wrap} flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between`}>
          <Reveal>
            <p className={eyebrow}>Nereden başlayalım?</p>
            <h2 id="start-title" className={h2}>
              Asistanınızı birlikte tasarlayalım.
            </h2>
            <p className={lead}>İşletmenizi ve size en sık gelen soruları anlatın; uygun kanal, ses ve senaryo önerisiyle dönelim.</p>
          </Reveal>
          <Reveal order={1} className="flex flex-wrap gap-3 lg:pb-2">
            <Link href={briefHref(service)} className={btnPrimary}>
              Projeni anlat <span aria-hidden="true" className={arrow}>→</span>
            </Link>
            <a
              href={whatsappUrl("Merhaba Zeplin, yapay zekâ asistanı hakkında görüşmek istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className={btnGhost}
            >
              WhatsApp&apos;tan yazın <span aria-hidden="true" className={arrowUp}>↗</span>
            </a>
          </Reveal>
        </div>
      </section>

    </main>
  );
}
