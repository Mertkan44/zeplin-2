"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { EASE, FONT, revealVariants } from "@/lib/motion";
import { getRelatedServices } from "@/data/services";
import type { ServiceData } from "@/data/services";
import { ServiceHero } from "./ServiceHero";
import { RelatedServices } from "./RelatedServices";
import { CTABanner } from "./CTABanner";

/* ── Channel data ─────────────────────────────────────────────────── */
const channels = [
  {
    name: "WhatsApp",
    desc: "Business API ile doğrudan entegrasyon",
    color: "#25D366",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.848L.057 23.903a.5.5 0 00.614.614l6.055-1.475A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.95 9.95 0 01-5.08-1.389l-.364-.215-3.772.918.938-3.672-.235-.378A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
    ),
  },
  {
    name: "Web Widget",
    desc: "Sitenize gömülü sohbet arayüzü",
    color: "#DB2777",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
        <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none"/>
        <circle cx="12" cy="10" r="1" fill="currentColor" stroke="none"/>
        <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    desc: "DM ve yorum otomasyonu",
    color: "#E1306C",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    name: "Telegram",
    desc: "Bot entegrasyonu ve grup yönetimi",
    color: "#2CA5E0",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-2.002 9.433c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.12l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.861.788z"/>
      </svg>
    ),
  },
];

/* ── Chat messages ────────────────────────────────────────────────── */
const chatMessages = [
  { role: "user" as const, text: "Merhaba, sipariş durumumu öğrenebilir miyim?" },
  { role: "bot" as const, text: "Merhaba! Sipariş numaranızı paylaşır mısınız?" },
  { role: "user" as const, text: "#ZP-2847" },
  { role: "bot" as const, text: "Siparişiniz kargoda! Tahmini teslimat: Yarın 14:00–18:00 🚚" },
];

/* ── Metrics ──────────────────────────────────────────────────────── */
const metrics = [
  { value: "< 3sn", label: "Ort. Yanıt Süresi" },
  { value: "7/24", label: "Kesintisiz Hizmet" },
  { value: "%95", label: "Çözüm Oranı" },
  { value: "%60", label: "Ekip Yük Azalması" },
];

/* ── Typing Dots ──────────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-[6px] w-[6px] rounded-full bg-[#F472B6]/60"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ── Chat Mockup ──────────────────────────────────────────────────── */
function ChatMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "15% 0px 15% 0px" });
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    let timeout: ReturnType<typeof setTimeout>;
    let idx = 0;

    const next = () => {
      if (idx >= chatMessages.length) return;
      if (chatMessages[idx].role === "bot") {
        setShowTyping(true);
        timeout = setTimeout(() => {
          setShowTyping(false);
          idx++;
          setVisibleMessages(idx);
          timeout = setTimeout(next, 900);
        }, 1300);
      } else {
        idx++;
        setVisibleMessages(idx);
        timeout = setTimeout(next, 700);
      }
    };

    timeout = setTimeout(next, 500);
    return () => clearTimeout(timeout);
  }, [isInView]);

  return (
    <div ref={ref} className="mx-auto max-w-[340px] overflow-hidden rounded-[28px] border border-white/10 bg-[#1a1a1a] shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#111] px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#DB2777,#9D174D)]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM5.5 9.5a.75.75 0 110-1.5.75.75 0 010 1.5zm5 0a.75.75 0 110-1.5.75.75 0 010 1.5z" fill="white"/>
          </svg>
        </div>
        <div>
          <span className="block text-[13px] font-semibold text-white" style={FONT}>Zeplin Asistan</span>
          <span className="flex items-center gap-1.5 text-[11px] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />çevrimiçi
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex min-h-[260px] flex-col gap-2.5 px-4 py-4">
        <AnimatePresence mode="popLayout">
          {chatMessages.slice(0, visibleMessages).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: EASE }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] rounded-[14px] px-3.5 py-2 text-[12.5px] leading-[1.6] ${
                  msg.role === "user"
                    ? "bg-[linear-gradient(135deg,#DB2777,#9D174D)] text-white"
                    : "bg-white/[0.08] text-white/80"
                }`}
                style={FONT}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {showTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex justify-start"
            >
              <div className="rounded-[14px] bg-white/[0.08]">
                <TypingDots />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 border-t border-white/[0.06] px-4 py-3">
        <div className="flex-1 rounded-full bg-white/[0.06] px-4 py-2 text-[12px] text-white/25" style={FONT}>
          Mesajınızı yazın…
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DB2777]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */

export function ChatbotServicePage({ service }: { service: ServiceData }) {
  const related = getRelatedServices(service.relatedSlugs);

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-[#0a0a0a] dark:text-zinc-100">
      <ServiceHero
        title={service.title}
        description={service.longDesc}
        categoryLabel={service.categoryLabel}
        categorySlug={service.category}
        heroImage={service.heroImage}
      />

      {/* ── Kanallar ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-14 md:py-20">
        <motion.div
          variants={revealVariants} initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={0}
          className="mb-10"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600" style={FONT}>
            entegrasyon
          </span>
          <h2 className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-900 dark:text-white md:text-[36px]" style={FONT}>
            Hangi Kanalları Destekler?
          </h2>
          <p className="mt-3 max-w-[48ch] text-[14px] leading-[1.75] text-zinc-500 dark:text-zinc-400" style={FONT}>
            Müşterilerinizin bulunduğu her platformda, tek sistemden yönetilebilir bir iletişim katmanı kuruyoruz.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {channels.map((ch, i) => (
            <motion.div
              key={ch.name}
              variants={revealVariants} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={i * 0.07}
            >
              <div className="group flex flex-col gap-4 rounded-[20px] border border-zinc-100 bg-zinc-50 p-5 transition-all duration-300 hover:border-[#F472B6]/30 hover:bg-white hover:shadow-[0_8px_32px_rgba(219,39,119,0.06)] dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:bg-white/[0.04]">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                  style={{ background: `${ch.color}18`, color: ch.color }}
                >
                  {ch.icon}
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-zinc-900 dark:text-white" style={FONT}>{ch.name}</p>
                  <p className="mt-1 text-[12.5px] leading-[1.6] text-zinc-500 dark:text-zinc-400" style={FONT}>{ch.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Chat Demo + Stats ─────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0d0608_0%,#120810_50%,#0d0608_100%)]" />
        <div className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-[#DB2777]/5 blur-[130px]" />
        <div className="pointer-events-none absolute -right-40 bottom-1/4 h-[400px] w-[400px] rounded-full bg-[#9D174D]/5 blur-[110px]" />

        <div className="relative mx-auto max-w-[1200px] px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
            {/* Left: stats */}
            <motion.div
              variants={revealVariants} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={0}
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/30" style={FONT}>
                performans
              </span>
              <h2 className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-white md:text-[36px]" style={FONT}>
                7/24 Kesintisiz<br />Müşteri İletişimi
              </h2>
              <p className="mt-4 max-w-[38ch] text-[14px] leading-[1.75] text-white/45" style={FONT}>
                Chatbot devreye girdiğinde ekibiniz rutin sorularla değil, gerçek sorunlarla ilgilenir.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-4">
                {metrics.map((m, i) => (
                  <motion.div
                    key={m.label}
                    variants={revealVariants} initial="hidden" whileInView="visible"
                    viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={0.1 + i * 0.06}
                    className="rounded-[16px] border border-white/[0.08] bg-white/[0.03] p-5"
                  >
                    <span className="block text-[28px] font-semibold leading-none tracking-[-0.04em] text-white" style={FONT}>
                      {m.value}
                    </span>
                    <span className="mt-2 block text-[11px] leading-[1.4] tracking-[0.1em] text-white/35" style={FONT}>
                      {m.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: chat mockup */}
            <motion.div
              variants={revealVariants} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={0.15}
            >
              <ChatMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Özellikler ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-14 md:py-20">
        <motion.div
          variants={revealVariants} initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={0}
          className="mb-10"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600" style={FONT}>
            özellikler
          </span>
          <h2 className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-900 dark:text-white md:text-[36px]" style={FONT}>
            Ne Yapabilir?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {service.features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={revealVariants} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={i * 0.08}
              className="flex gap-5 rounded-[20px] border border-zinc-100 bg-white p-6 dark:border-white/[0.06] dark:bg-white/[0.02] md:p-7"
            >
              <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#F472B6]/20 bg-[#DB2777]/6 text-[#DB2777] dark:border-[#9D174D]/30 dark:bg-[#9D174D]/10 dark:text-[#F472B6]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <div>
                <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-zinc-900 dark:text-white" style={FONT}>{f.title}</h3>
                <p className="mt-1.5 text-[13px] leading-[1.7] text-zinc-500 dark:text-zinc-400" style={FONT}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Süreç ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1a0e17_0%,#120a10_50%,#1a0e17_100%)]" />
        <div className="pointer-events-none absolute -left-32 top-1/4 h-[400px] w-[400px] rounded-full bg-[#DB2777]/6 blur-[120px]" />

        <div className="relative mx-auto max-w-[1200px] px-6 py-16 md:py-24">
          <motion.div
            variants={revealVariants} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={0}
            className="mb-14"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/30" style={FONT}>çalışma süreci</span>
            <h2 className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-white md:text-[36px]" style={FONT}>
              Nasıl Kurulur?
            </h2>
          </motion.div>

          <div className="relative">
            <div className="pointer-events-none absolute left-0 right-0 top-[28px] hidden h-[1px] bg-gradient-to-r from-transparent via-[#DB2777]/20 to-transparent md:block" />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-4">
              {service.process.map((step, i) => (
                <motion.div
                  key={step.step}
                  variants={revealVariants} initial="hidden" whileInView="visible"
                  viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={i * 0.1}
                  className="relative flex flex-col items-start md:items-center md:text-center"
                >
                  <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#DB2777]/30 bg-[#DB2777]/10">
                    <span className="text-[14px] font-bold tabular-nums text-[#F472B6]" style={FONT}>{step.step}</span>
                  </div>
                  <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-white" style={FONT}>{step.title}</h3>
                  <p className="mt-2 max-w-[22ch] text-[12.5px] leading-[1.65] text-white/40" style={FONT}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <RelatedServices services={related} />
      <CTABanner />
    </main>
  );
}
