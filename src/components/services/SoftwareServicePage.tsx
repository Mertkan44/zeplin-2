"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE, FONT, revealVariants } from "@/lib/motion";
import { getRelatedServices } from "@/data/services";
import type { ServiceData } from "@/data/services";
import { RelatedServices } from "./RelatedServices";
import { CTABanner } from "./CTABanner";

/* ── Hub nodes ────────────────────────────────────────────────────── */
// Icons are drawn in a 16×16 coordinate space, centered via translate(nx-8, ny-8)
const hubNodes = [
  {
    id: "chatbot", label: "Akıllı Chatbot", angle: 210, color: "#DB2777",
    icon: <path d="M1.5 1h13a1 1 0 011 1v7a1 1 0 01-1 1H8l-4 3.5V10H1.5a1 1 0 01-1-1V2a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" strokeLinecap="round"/>,
  },
  {
    id: "voice", label: "Sesli Asistan", angle: 270, color: "#9D174D",
    icon: <><rect x="5" y="0.5" width="6" height="8.5" rx="3" stroke="currentColor" strokeWidth="1.3" fill="none"/><path d="M2 7.5a6 6 0 0012 0M8 14v1.5M5.5 15.5h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none"/></>,
  },
  {
    id: "crm", label: "CRM", angle: 330, color: "#EC4899",
    icon: <><rect x="0.5" y="1" width="15" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" fill="none"/><path d="M0.5 5h15M4 8.5h8M4 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></>,
  },
  {
    id: "erp", label: "ERP", angle: 30, color: "#F472B6",
    icon: <><path d="M1 12.5L4.5 7 8 10.5 11.5 4 15 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M1 15.5h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></>,
  },
  {
    id: "report", label: "Raporlama", angle: 90, color: "#DB2777",
    icon: <><rect x="0.5" y="9.5" width="4" height="6" rx="0.75" stroke="currentColor" strokeWidth="1.3" fill="none"/><rect x="6" y="5" width="4" height="10.5" rx="0.75" stroke="currentColor" strokeWidth="1.3" fill="none"/><rect x="11.5" y="0.5" width="4" height="15" rx="0.75" stroke="currentColor" strokeWidth="1.3" fill="none"/></>,
  },
  {
    id: "api", label: "Özel API", angle: 150, color: "#9D174D",
    icon: <path d="M10.5 1.5L7 14.5M2.5 5.5L0.5 8l2 2.5M13.5 5.5L15.5 8l-2 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  },
];

/* ── Dashboard rows ───────────────────────────────────────────────── */
const dashStats = [
  { label: "Aktif Konuşma", value: "1,284", trend: "+12%" },
  { label: "Çözüm Oranı",  value: "%94.7",  trend: "+3.1%" },
  { label: "Ort. Süre",    value: "1:42",   trend: "-18%" },
  { label: "Bu Hafta",     value: "8,391",  trend: "+27%" },
];

/* ── Hub Diagram ──────────────────────────────────────────────────── */
function HubDiagram({ isActive }: { isActive: boolean }) {
  // Everything lives inside the SVG — fully responsive, no fixed pixel sizes
  const cx = 220;
  const cy = 220;
  const r  = 140;   // node orbit radius
  const lr = 192;   // label orbit radius

  return (
    <div className="mx-auto w-full max-w-[480px]">
      <svg
        viewBox="0 0 440 440"
        className="h-auto w-full"
        style={{ overflow: "visible" }}
      >
        {/* Outer orbit ring (dashed, slow spin) */}
        <motion.circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="rgba(219,39,119,0.14)"
          strokeWidth={1}
          strokeDasharray="5 7"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Inner glow ring */}
        <circle cx={cx} cy={cy} r={52} fill="rgba(219,39,119,0.06)" stroke="rgba(219,39,119,0.18)" strokeWidth={1} />

        {/* Lines + pulses + nodes */}
        {hubNodes.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const nx  = cx + r  * Math.cos(rad);
          const ny  = cy + r  * Math.sin(rad);
          const lx  = cx + lr * Math.cos(rad);
          const ly  = cy + lr * Math.sin(rad);

          return (
            <g key={node.id}>
              {/* Connection line */}
              <motion.line
                x1={cx} y1={cy} x2={nx} y2={ny}
                stroke="rgba(219,39,119,0.22)"
                strokeWidth={1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isActive ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 0.55, delay: 0.3 + i * 0.09, ease: EASE }}
              />

              {/* Data pulse */}
              {isActive && (
                <motion.circle
                  r={3}
                  fill={node.color}
                  animate={{ cx: [cx, nx, cx], cy: [cy, ny, cy], opacity: [0, 1, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.42, ease: "easeInOut" }}
                />
              )}

              {/* Satellite node circle */}
              <motion.g
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.45 + i * 0.1, ease: EASE }}
                style={{ transformOrigin: `${nx}px ${ny}px` }}
              >
                <circle
                  cx={nx} cy={ny} r={26}
                  fill="rgba(8,5,7,0.95)"
                  stroke={node.color}
                  strokeWidth={1}
                  strokeOpacity={0.45}
                />
                {/* SVG icon, centered at node — 16×16 coordinate space */}
                <g
                  transform={`translate(${nx - 8}, ${ny - 8})`}
                  stroke={node.color}
                  strokeOpacity={0.9}
                >
                  {node.icon}
                </g>
              </motion.g>

              {/* Label as SVG text — stays inside SVG, scales with it */}
              <motion.text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10.5}
                fill="rgba(255,255,255,0.38)"
                fontFamily="var(--font-jost), sans-serif"
                fontWeight={500}
                letterSpacing={0.3}
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.7 + i * 0.08 }}
              >
                {node.label}
              </motion.text>
            </g>
          );
        })}

        {/* Center node */}
        <motion.circle
          cx={cx} cy={cy} r={46}
          fill="url(#centerGrad)"
          stroke="rgba(219,39,119,0.5)"
          strokeWidth={1}
          animate={isActive ? { r: [46, 49, 46] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <defs>
          <radialGradient id="centerGrad" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#2a0e1e" />
            <stop offset="100%" stopColor="#0d0508" />
          </radialGradient>
        </defs>

        {/* Center icon */}
        <g transform={`translate(${cx - 10}, ${cy - 10})`} stroke="#F472B6" strokeWidth={1.4} strokeLinecap="round" fill="none">
          <circle cx={10} cy={10} r={3} fill="#F472B6" stroke="none" />
          <path d="M10 2.5v3M10 14.5v3M2.5 10h3M14.5 10h3M4.6 4.6l2.1 2.1M13.3 13.3l2.1 2.1M4.6 15.4l2.1-2.1M13.3 6.7l2.1-2.1" strokeOpacity={0.55} />
        </g>

        {/* Center label */}
        <text
          x={cx} y={cy + 62}
          textAnchor="middle"
          fontSize={9}
          fill="rgba(244,114,182,0.6)"
          fontFamily="var(--font-jost), sans-serif"
          fontWeight={600}
          letterSpacing={1.5}
        >
          MERKEZ
        </text>
      </svg>
    </div>
  );
}

/* ── Dashboard Mockup ─────────────────────────────────────────────── */
function DashboardMockup({ isActive }: { isActive: boolean }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0a0608] shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
      {/* Titlebar */}
      <div className="flex items-center gap-2.5 border-b border-white/[0.05] bg-[#070405] px-5 py-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
        </div>
        <span className="mx-auto text-[11px] text-white/25" style={FONT}>Zeplin · Yönetim Paneli</span>
        <span className="flex items-center gap-1 text-[10px] text-emerald-400/70">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />canlı
        </span>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="flex w-10 flex-col gap-2 border-r border-white/[0.05] bg-[#070405] py-4 items-center">
          {[
            <path key="h" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
            <><rect key="b1" x="3" y="4" width="6" height="16" rx="1"/><rect key="b2" x="9" y="8" width="6" height="12" rx="1"/><rect key="b3" x="15" y="11" width="6" height="9" rx="1"/></>,
            <path key="c" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />,
            <circle key="s" cx="11" cy="11" r="8"/>,
          ].map((icon, i) => (
            <div key={i} className={`flex h-7 w-7 items-center justify-center rounded-lg ${i === 0 ? "bg-[#DB2777]/20" : ""}`}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={i === 0 ? "#F472B6" : "rgba(255,255,255,0.2)"} strokeWidth="1.8" strokeLinecap="round">
                {icon}
              </svg>
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 p-4">
          {/* Stat strip */}
          <div className="mb-3 grid grid-cols-4 gap-2">
            {dashStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.35, delay: 0.2 + i * 0.07, ease: EASE }}
                className="rounded-[10px] border border-white/[0.05] bg-white/[0.02] p-2.5"
              >
                <p className="text-[9px] text-white/30 truncate" style={FONT}>{s.label}</p>
                <p className="mt-0.5 text-[14px] font-semibold leading-none text-white" style={FONT}>{s.value}</p>
                <p className="mt-1 text-[9px] text-emerald-400/70">{s.trend}</p>
              </motion.div>
            ))}
          </div>

          {/* Chart area */}
          <div className="rounded-[12px] border border-white/[0.05] bg-white/[0.015] p-3">
            <p className="mb-3 text-[10px] text-white/30" style={FONT}>Son 7 Gün · Konuşma Hacmi</p>
            <div className="flex items-end gap-1.5" style={{ height: 72 }}>
              {[38, 52, 44, 68, 60, 76, 88].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t-[3px]"
                  style={{
                    background: i === 6
                      ? "linear-gradient(to top, #9D174D, #F472B6)"
                      : "rgba(219,39,119,0.18)",
                    maxWidth: 20,
                  }}
                  initial={{ height: 0 }}
                  animate={isActive ? { height: h } : { height: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.06, ease: EASE }}
                />
              ))}
            </div>
          </div>

          {/* Channel rows */}
          <div className="mt-3 flex flex-col gap-1.5">
            {[
              { name: "WhatsApp", pct: 62, color: "#25D366" },
              { name: "Web",      pct: 24, color: "#DB2777" },
              { name: "Sesli",    pct: 14, color: "#9D174D" },
            ].map((ch, i) => (
              <motion.div
                key={ch.name}
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.8 + i * 0.08 }}
                className="flex items-center gap-2"
              >
                <span className="w-12 text-[9px] text-white/30 shrink-0" style={FONT}>{ch.name}</span>
                <div className="flex-1 h-[5px] rounded-full bg-white/[0.05]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: ch.color, opacity: 0.7 }}
                    initial={{ width: "0%" }}
                    animate={isActive ? { width: `${ch.pct}%` } : {}}
                    transition={{ duration: 0.6, delay: 0.9 + i * 0.08, ease: EASE }}
                  />
                </div>
                <span className="w-7 text-right text-[9px] text-white/25 shrink-0" style={FONT}>{ch.pct}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */

export function SoftwareServicePage({ service }: { service: ServiceData }) {
  const related  = getRelatedServices(service.relatedSlugs);
  const hubRef   = useRef<HTMLDivElement>(null);
  const dashRef  = useRef<HTMLDivElement>(null);
  const hubInView  = useInView(hubRef,  { once: true, margin: "15% 0px 15% 0px" });
  const dashInView = useInView(dashRef, { once: true, margin: "15% 0px 15% 0px" });

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-[#0a0a0a] dark:text-zinc-100">

      {/* ── Hub Diyagramı ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" ref={hubRef}>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#080508_0%,#0d0810_50%,#080508_100%)]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DB2777]/5 blur-[160px]" />

        <div className="relative mx-auto max-w-[1200px] px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
            <motion.div
              variants={revealVariants} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={0}
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/30" style={FONT}>
                entegrasyon merkezi
              </span>
              <h2 className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-white md:text-[36px]" style={FONT}>
                Hepsi Tek<br />Sistemde
              </h2>
              <p className="mt-4 max-w-[38ch] text-[14px] leading-[1.75] text-white/45" style={FONT}>
                Chatbot, sesli asistan, CRM, ERP ve tüm iş araçlarınız tek merkezden yönetilir. Veri akışı kesintisiz, süreçler birbirine bağlı.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                {[
                  "Tüm kanallar tek panelde",
                  "Gerçek zamanlı veri akışı",
                  "Özel API entegrasyonları",
                  "Rol bazlı erişim yönetimi",
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    variants={revealVariants} initial="hidden" whileInView="visible"
                    viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={0.1 + i * 0.06}
                    className="flex items-center gap-3"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DB2777]/15">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="text-[13.5px] text-white/60" style={FONT}>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={revealVariants} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={0.12}
            >
              <HubDiagram isActive={hubInView} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Dashboard Mockup ──────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-14 md:py-20" ref={dashRef}>
        <motion.div
          variants={revealVariants} initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={0}
          className="mb-10"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600" style={FONT}>
            yönetim paneli
          </span>
          <h2 className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-900 dark:text-white md:text-[36px]" style={FONT}>
            Her Şey Bir Bakışta
          </h2>
          <p className="mt-3 max-w-[50ch] text-[14px] leading-[1.75] text-zinc-500 dark:text-zinc-400" style={FONT}>
            Canlı konuşma akışları, kanal bazlı dağılım, çözüm oranı ve haftalık trendler — hepsi gerçek zamanlı olarak tek ekranda.
          </p>
        </motion.div>

        <motion.div
          variants={revealVariants} initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={0.08}
        >
          <DashboardMockup isActive={dashInView} />
        </motion.div>
      </section>

      {/* ── Özellikler ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1a0e17_0%,#120a10_50%,#1a0e17_100%)]" />
        <div className="pointer-events-none absolute -left-32 top-1/3 h-[400px] w-[400px] rounded-full bg-[#DB2777]/6 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-1/3 h-[300px] w-[300px] rounded-full bg-[#9D174D]/5 blur-[100px]" />

        <div className="relative mx-auto max-w-[1200px] px-6 py-16 md:py-24">
          <motion.div
            variants={revealVariants} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={0}
            className="mb-12"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/30" style={FONT}>özellikler</span>
            <h2 className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-white md:text-[36px]" style={FONT}>
              Platform Ne Sunar?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {service.features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={revealVariants} initial="hidden" whileInView="visible"
                viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={i * 0.08}
                className="group relative overflow-hidden rounded-[22px] border border-white/[0.06] bg-white/[0.02] p-6 transition-colors duration-300 hover:border-[#DB2777]/20 hover:bg-white/[0.04] md:p-7"
              >
                {/* Glow on hover */}
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#DB2777]/0 blur-[40px] transition-all duration-500 group-hover:bg-[#DB2777]/12" />
                <div className="relative flex items-start gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#9D174D]/30 bg-[#9D174D]/10">
                    <span className="text-[13px] font-bold tabular-nums text-[#F472B6]" style={FONT}>0{i + 1}</span>
                  </span>
                  <div>
                    <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-white" style={FONT}>{f.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-[1.7] text-white/40" style={FONT}>{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Süreç ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-14 md:py-20">
        <motion.div
          variants={revealVariants} initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={0}
          className="mb-12"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600" style={FONT}>çalışma süreci</span>
          <h2 className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-900 dark:text-white md:text-[36px]" style={FONT}>
            Nasıl Kurulur?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-4">
          {service.process.map((step, i) => (
            <motion.div
              key={step.step}
              variants={revealVariants} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.01, margin: "15% 0px 15% 0px" }} custom={i * 0.1}
              className="relative flex flex-col items-start"
            >
              {i < service.process.length - 1 && (
                <div className="pointer-events-none absolute left-14 right-0 top-7 hidden h-[1px] bg-gradient-to-r from-[#DB2777]/20 to-transparent md:block" />
              )}
              <div className="relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#DB2777]/25 bg-[#DB2777]/8">
                <span className="text-[14px] font-bold tabular-nums text-[#F472B6]" style={FONT}>{step.step}</span>
              </div>
              <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-zinc-900 dark:text-white" style={FONT}>{step.title}</h3>
              <p className="mt-1.5 text-[12.5px] leading-[1.65] text-zinc-500 dark:text-zinc-400" style={FONT}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <RelatedServices services={related} />
      <CTABanner />
    </main>
  );
}
