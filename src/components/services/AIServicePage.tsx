"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { EASE, FONT, revealVariants } from "@/lib/motion";
import { CountUp } from "@/components/CountUp";
import type { ServiceData } from "@/data/services";
import { getRelatedServices } from "@/data/services";
import { ServiceHero } from "./ServiceHero";
import { RelatedServices } from "./RelatedServices";
import { CTABanner } from "./CTABanner";

/* ── Chat Demo Data ───────────────────────────────────────────────── */
const chatMessages = [
  { role: "user" as const, text: "Merhaba, sipariş durumumu öğrenebilir miyim?" },
  { role: "bot" as const, text: "Tabii! Sipariş numaranızı paylaşır mısınız? Hemen kontrol edeyim." },
  { role: "user" as const, text: "#ZP-2847" },
  { role: "bot" as const, text: "Siparişiniz şu an kargoda! Tahmini teslimat: Yarın 14:00-18:00 arası. Takip linkini SMS olarak gönderdim." },
];

const aiMetrics = [
  { value: 95, suffix: "%", label: "Müşteri Memnuniyeti" },
  { value: 24, suffix: "/7", label: "Kesintisiz Hizmet" },
  { value: 60, suffix: "%", label: "Maliyet Tasarrufu" },
  { value: 3, suffix: "sn", label: "Ort. Yanıt Süresi" },
];

/* ── AI Capabilities ──────────────────────────────────────────────── */
const capabilities = [
  {
    id: "chatbot",
    title: "AI Chatbot",
    subtitle: "7/24 Akıllı Müşteri Destek",
    desc: "Doğal dil işleme ile müşterilerinizin sorularını anlayan, öğrenen ve çözen chatbot sistemi. Web sitenize, WhatsApp'a ve sosyal medya kanallarınıza entegre edilir.",
    highlights: ["Doğal dil anlama", "Çoklu kanal desteği", "Öğrenen sistem", "Canlı temsilciye aktarım"],
  },
  {
    id: "callbot",
    title: "AI Callbot",
    subtitle: "Sesli Yanıt Otomasyonu",
    desc: "Telefon hatlarınızdaki yükü azaltan, müşterilerinizi doğru departmana yönlendiren ve basit işlemleri otomatik tamamlayan sesli asistan.",
    highlights: ["Ses tanıma", "Doğal konuşma akışı", "IVR entegrasyonu", "Çok dilli destek"],
  },
  {
    id: "workflow",
    title: "İş Akışı Otomasyonu",
    subtitle: "Süreç Optimizasyonu",
    desc: "Tekrarlayan manuel süreçlerinizi otomatikleştiriyoruz. Fatura işlemlerinden envanter takibine, sipariş yönetiminden raporlamaya kadar operasyonel verimliliğinizi artırıyoruz.",
    highlights: ["Süreç haritalama", "Otomatik tetikleyiciler", "Hata azaltma", "Gerçek zamanlı izleme"],
  },
  {
    id: "crm",
    title: "CRM Entegrasyonu",
    subtitle: "Sistem Entegrasyonu",
    desc: "Mevcut CRM, ERP ve iş süreçleri yazılımlarınızla AI çözümlerimizi entegre ediyoruz. Veri akışı kesintisiz, süreçler bağlantılı.",
    highlights: ["API entegrasyonu", "Veri senkronizasyonu", "Özel connector'lar", "Salesforce, HubSpot, Zoho"],
  },
];

/* ── Typing Dots Component ────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-[6px] w-[6px] rounded-full bg-[#F472B6]/60"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.18,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   AI SERVICE PAGE
   ══════════════════════════════════════════════════════════════════════ */

export function AIServicePage({ service }: { service: ServiceData }) {
  const related = getRelatedServices(service.relatedSlugs);
  const [expandedCard, setExpandedCard] = useState<string | null>("chatbot");

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-[#0a0a0a] dark:text-zinc-100">
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <ServiceHero
        title={service.title}
        description={service.longDesc}
        categoryLabel={service.categoryLabel}
        categorySlug={service.category}
        heroImage={service.heroImage}
      />

      {/* ── Bölüm: 3 Alt Hizmet Kartları ─────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-12 md:py-16">
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
          custom={0}
          className="mb-8 md:mb-10"
        >
          <span
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-700"
            style={FONT}
          >
            hizmetlerimiz
          </span>
          <h2
            className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-900 dark:text-white md:text-[38px]"
            style={FONT}
          >
            Hangi Çözümü Arıyorsunuz?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              href: "/hizmetler/akilli-chatbot",
              title: "Akıllı Chatbot",
              desc: "WhatsApp ve web üzerinden 7/24 müşteri iletişimi ve otomatik yanıt sistemi.",
              icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.4"/>
                  <circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/>
                  <circle cx="14.5" cy="10.5" r="1.5" fill="currentColor"/>
                  <path d="M7 14.5c1 1.2 7 1.2 8 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              ),
            },
            {
              href: "/hizmetler/ozel-yazilim",
              title: "Özel Yazılım",
              desc: "Tüm AI kanallarını tek merkezde birleştiren özel platform ve yönetim paneli.",
              icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect x="2" y="4" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M7 11l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 9h2M14 12h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              ),
            },
            {
              href: "/hizmetler/sesli-asistan",
              title: "Sesli Asistan",
              desc: "Telefon görüşmelerinde rezervasyon, yönlendirme ve doğal dil etkileşimi.",
              icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M6 4.5C6 3.7 6.7 3 7.5 3h1C9.3 3 10 3.7 10 4.5v3C10 8.3 9.3 9 8.5 9h-1C6.7 9 6 8.3 6 7.5v-3z" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M4 7c0 3.3 2.7 6 6 6s6-2.7 6-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M10 15v3M8 18h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              ),
            },
          ].map((item, i) => (
            <motion.div
              key={item.href}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
              custom={i * 0.08}
            >
              <Link href={item.href} className="group block h-full">
                <div className="flex h-full flex-col gap-4 rounded-[20px] border border-zinc-100 bg-white p-6 transition-all duration-300 hover:border-[#F472B6]/30 hover:shadow-[0_8px_32px_rgba(219,39,119,0.06)] dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-[#9D174D]/40 dark:hover:bg-white/[0.04] md:p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F472B6]/20 bg-[#DB2777]/6 text-[#DB2777] dark:border-[#9D174D]/30 dark:bg-[#9D174D]/10 dark:text-[#F472B6]">
                      {item.icon}
                    </span>
                    <motion.span
                      className="text-zinc-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#DB2777] dark:text-zinc-700 dark:group-hover:text-[#F472B6]"
                      aria-hidden
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-zinc-900 dark:text-white md:text-[19px]" style={FONT}>
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-[1.7] text-zinc-500 dark:text-zinc-400" style={FONT}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bölüm 2: İnteraktif Chatbot Demo ──────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-24">
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
          custom={0}
          className="mb-10 md:mb-14"
        >
          <span
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-700"
            style={FONT}
          >
            nasıl çalışır
          </span>
          <h2
            className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-900 dark:text-white md:text-[38px]"
            style={FONT}
          >
            Yapay Zeka Deneyimi
          </h2>
        </motion.div>

        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
          custom={0.1}
        >
          <ChatDemo />
        </motion.div>
      </section>

      {/* ── Bölüm 3: Yetenek Kartları (Expanding) ─────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-10 md:py-16">
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
          custom={0}
          className="mb-10 md:mb-14"
        >
          <span
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-700"
            style={FONT}
          >
            çözümlerimiz
          </span>
          <h2
            className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-900 dark:text-white md:text-[38px]"
            style={FONT}
          >
            AI Hizmet Paketleri
          </h2>
        </motion.div>

        <div className="flex flex-col gap-3">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.id}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
              custom={i * 0.06}
            >
              <button
                onClick={() =>
                  setExpandedCard(expandedCard === cap.id ? null : cap.id)
                }
                className="w-full text-left"
              >
                <div
                  className={`overflow-hidden rounded-[20px] border transition-all duration-500 ${
                    expandedCard === cap.id
                      ? "border-[#F472B6]/30 bg-zinc-50 shadow-[0_8px_40px_rgba(219,39,119,0.06)] dark:border-[#9D174D]/40 dark:bg-white/[0.03] dark:shadow-[0_8px_40px_rgba(157,23,77,0.1)]"
                      : "border-zinc-100 bg-white hover:border-zinc-200 dark:border-white/[0.06] dark:bg-white/[0.01] dark:hover:border-white/[0.1]"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-7 py-5 md:px-9 md:py-6">
                    <div className="flex items-center gap-4">
                      <span
                        className="text-[13px] font-semibold tabular-nums tracking-[0.08em] text-[#DB2777] dark:text-[#F472B6]"
                        style={FONT}
                      >
                        0{i + 1}
                      </span>
                      <div>
                        <h3
                          className="text-[17px] font-semibold tracking-[-0.01em] text-zinc-900 dark:text-white md:text-[19px]"
                          style={FONT}
                        >
                          {cap.title}
                        </h3>
                        <p
                          className="mt-0.5 text-[13px] text-zinc-400 dark:text-zinc-500"
                          style={FONT}
                        >
                          {cap.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Expand icon */}
                    <motion.div
                      animate={{ rotate: expandedCard === cap.id ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M7 2v10M2 7h10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          className="text-zinc-400 dark:text-zinc-500"
                        />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Expandable content */}
                  <AnimatePresence>
                    {expandedCard === cap.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-zinc-100 px-7 pb-7 pt-5 dark:border-white/[0.06] md:px-9 md:pb-8 md:pt-6">
                          <p
                            className="max-w-[60ch] text-[14px] leading-[1.75] text-zinc-500 dark:text-zinc-400"
                            style={FONT}
                          >
                            {cap.desc}
                          </p>

                          <div className="mt-5 flex flex-wrap gap-2">
                            {cap.highlights.map((h) => (
                              <span
                                key={h}
                                className="rounded-full border border-[#F472B6]/20 bg-[#DB2777]/5 px-3 py-1 text-[12px] font-medium text-[#DB2777] dark:border-[#9D174D]/30 dark:bg-[#9D174D]/10 dark:text-[#F472B6]"
                                style={FONT}
                              >
                                {h}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bölüm 4: Süreç Adımları ───────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1a0e17_0%,#120a10_50%,#1a0e17_100%)]" />
        <div className="pointer-events-none absolute -left-32 top-1/4 h-[400px] w-[400px] rounded-full bg-[#DB2777]/6 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-1/4 h-[300px] w-[300px] rounded-full bg-[#EC4899]/4 blur-[100px]" />

        <div className="relative mx-auto max-w-[1200px] px-6 py-16 md:py-24">
          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
            custom={0}
            className="mb-12 md:mb-16"
          >
            <span
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/30"
              style={FONT}
            >
              çalışma sürecimiz
            </span>
            <h2
              className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-white md:text-[38px]"
              style={FONT}
            >
              Nasıl Entegre Ediyoruz?
            </h2>
          </motion.div>

          <div className="relative">
            <div className="pointer-events-none absolute left-0 right-0 top-[28px] hidden h-[1px] bg-gradient-to-r from-transparent via-[#DB2777]/20 to-transparent md:block" />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-4">
              {service.process.map((step, i) => (
                <motion.div
                  key={step.step}
                  variants={revealVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
                  custom={i * 0.1}
                  className="relative flex flex-col items-start md:items-center md:text-center"
                >
                  <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#DB2777]/30 bg-[#DB2777]/10 backdrop-blur-sm">
                    <span
                      className="text-[14px] font-bold tabular-nums text-[#F472B6]"
                      style={FONT}
                    >
                      {step.step}
                    </span>
                  </div>
                  <h3
                    className="text-[17px] font-semibold tracking-[-0.01em] text-white"
                    style={FONT}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="mt-2 max-w-[24ch] text-[13px] leading-[1.65] text-white/45"
                    style={FONT}
                  >
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bölüm 5: Metrikler ─────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-12 md:py-20">
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }}
          custom={0}
          className="border-y border-zinc-200/80 py-2 dark:border-white/10 md:py-4"
        >
          <div className="grid grid-cols-2 gap-x-4 gap-y-0 md:grid-cols-4 md:gap-x-0">
            {aiMetrics.map((m, i) => (
              <div
                key={m.label}
                className={`flex min-h-[84px] flex-col justify-center border-zinc-200/80 py-3 dark:border-white/10 md:min-h-[108px] md:border-b-0 md:px-6 md:py-2 md:first:pl-0 md:last:pr-0 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-zinc-200/80 md:dark:[&:not(:first-child)]:border-white/10 ${i < 2 ? "border-b" : ""}`}
              >
                <div>
                  <span
                    className="block text-[28px] font-medium leading-none tracking-[-0.05em] text-zinc-950 dark:text-white md:text-[40px]"
                    style={FONT}
                  >
                    <CountUp value={m.value} suffix={m.suffix} delay={i * 0.14} />
                  </span>
                  <span
                    className="mt-2 block max-w-[14ch] text-[11px] leading-[1.35] tracking-[0.08em] text-zinc-500 dark:text-zinc-500 md:tracking-[0.14em]"
                    style={FONT}
                  >
                    {m.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Bölüm 6: İlgili Hizmetler ─────────────────────────────── */}
      <RelatedServices services={related} />

      {/* ── Bölüm 7: CTA Banner ───────────────────────────────────── */}
      <CTABanner />
    </main>
  );
}

/* ── ChatDemo Component ───────────────────────────────────────────── */

function ChatDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "15% 0px 15% 0px" });
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    let timeout: NodeJS.Timeout;
    let msgIndex = 0;

    const showNext = () => {
      if (msgIndex < chatMessages.length) {
        // Show typing for bot messages
        if (chatMessages[msgIndex].role === "bot") {
          setShowTyping(true);
          timeout = setTimeout(() => {
            setShowTyping(false);
            msgIndex++;
            setVisibleMessages(msgIndex);
            timeout = setTimeout(showNext, 800);
          }, 1200);
        } else {
          msgIndex++;
          setVisibleMessages(msgIndex);
          timeout = setTimeout(showNext, 600);
        }
      }
    };

    timeout = setTimeout(showNext, 400);
    return () => clearTimeout(timeout);
  }, [isInView]);

  return (
    <div
      ref={ref}
      className="mx-auto max-w-[560px] overflow-hidden rounded-[24px] border border-zinc-100 bg-zinc-50/80 dark:border-white/[0.08] dark:bg-white/[0.02]"
    >
      {/* Chat header */}
      <div className="flex items-center gap-3 border-b border-zinc-100 px-6 py-4 dark:border-white/[0.06]">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#DB2777,#9D174D)]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM5.5 9.5a.75.75 0 110-1.5.75.75 0 010 1.5zm5 0a.75.75 0 110-1.5.75.75 0 010 1.5z"
              fill="white"
            />
          </svg>
        </div>
        <div>
          <span className="block text-[14px] font-semibold text-zinc-900 dark:text-white" style={FONT}>
            Zeplin AI Asistan
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-zinc-400 dark:text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Çevrimiçi
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex min-h-[280px] flex-col gap-3 px-5 py-5 md:min-h-[320px] md:px-6 md:py-6">
        <AnimatePresence mode="popLayout">
          {chatMessages.slice(0, visibleMessages).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.35,
                ease: EASE,
              }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-[16px] px-4 py-2.5 text-[13px] leading-[1.6] md:text-[14px] ${
                  msg.role === "user"
                    ? "bg-[linear-gradient(135deg,#DB2777,#9D174D)] text-white"
                    : "bg-white text-zinc-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:bg-white/[0.06] dark:text-zinc-300 dark:shadow-none"
                }`}
                style={FONT}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {showTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex justify-start"
            >
              <div className="rounded-[16px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:bg-white/[0.06] dark:shadow-none">
                <TypingDots />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
