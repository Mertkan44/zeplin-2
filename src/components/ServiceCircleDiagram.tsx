"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useTransform, useSpring, useInView } from "framer-motion";

/* ── Constants ──────────────────────────────────────────────────────────── */

const FONT = 'var(--font-jost), sans-serif';

const CIRCLE_W = 680; // center column width for circles
const ASPECT = 1912 / 2940;

/* ── RichText: **bold** markup ─────────────────────────────────────────── */

function RichText({ text, brightBold }: { text: string; brightBold?: boolean }) {
  return (
    <>
      {text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
        i % 2 === 1 ? (
          <strong
            key={i}
            style={{
              fontWeight: 700,
              color: brightBold ? "#fff" : "rgba(255,255,255,0.95)",
              transition: "color 0.4s ease",
            }}
          >
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/* ── AnimatedLayer — two-phase PNG layer with hover offset ─────────────── */

interface LayerProps {
  src: string;
  start: boolean;
  entranceDelay: number;
  breatheScale: [number, number, number];
  breatheOpacity?: [number, number, number];
  breatheDuration: number;
  breatheDelay?: number;
  transformOrigin: string;
  zIndex: number;
  hovered: boolean;
  hoverTranslateX?: number;
  hoverScale?: number;
  isVisible?: boolean;
}

function AnimatedLayer({
  src,
  start,
  entranceDelay,
  breatheScale,
  breatheOpacity,
  breatheDuration,
  breatheDelay = 0,
  transformOrigin,
  zIndex,
  hovered,
  hoverTranslateX = 0,
  hoverScale = 1,
  isVisible = true,
}: LayerProps) {
  const [breathing, setBreathing] = useState(false);

  useEffect(() => {
    if (!start) return;
    const ms = (entranceDelay + 2.5) * 1000;
    const id = setTimeout(() => setBreathing(true), ms);
    return () => clearTimeout(id);
  }, [start, entranceDelay]);

  const tx = hovered ? hoverTranslateX : 0;
  const hs = hovered ? hoverScale : 1;

  const breatheAnimate = !start
    ? { scale: 0.2, opacity: 0 }
    : breathing
    ? {
      scale: breatheScale,
      opacity: breatheOpacity || 1,
    }
    : { scale: 1, opacity: 1 };

  const breatheTransition = !start
    ? { duration: 0 }
    : breathing
    ? {
      scale: {
        duration: breatheDuration,
        repeat: isVisible ? Infinity : 0,
        ease: "easeInOut" as const,
        delay: breatheDelay,
      },
      ...(breatheOpacity
        ? {
          opacity: {
            duration: breatheDuration,
            repeat: isVisible ? Infinity : 0,
            ease: "easeInOut" as const,
            delay: breatheDelay,
          },
        }
        : {}),
    }
    : {
      type: "spring" as const,
      stiffness: 55,
      damping: 14,
      delay: entranceDelay,
    };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex,
        transform: `translateX(${tx}px) scale(${hs})`,
        transformOrigin,
        transition: "transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)",
        pointerEvents: "none",
      }}
    >
      <motion.div
        style={{ position: "absolute", inset: 0, transformOrigin }}
        initial={{ scale: 0.2, opacity: 0 }}
        animate={breatheAnimate}
        transition={breatheTransition}
      >
        <Image
          src={src}
          alt=""
          width={2940}
          height={1912}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </motion.div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          boxShadow: hovered
            ? "0 0 50px rgba(255,45,120,0.12)"
            : "none",
          transition: "box-shadow 0.6s cubic-bezier(0.25,0.1,0.25,1)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ── Orbital Particle ──────────────────────────────────────────────────── */

function OrbitalParticle({
  start,
  animName,
  duration,
  delay,
}: {
  start: boolean;
  animName: string;
  duration: number;
  delay: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 3,
        height: 3,
        borderRadius: "50%",
        background: "rgba(255, 45, 120, 0.4)",
        boxShadow: "0 0 6px rgba(255, 45, 120, 0.3)",
        pointerEvents: "none",
        zIndex: 12,
        animation: start ? `${animName} ${duration}s linear ${delay}s infinite forwards` : "none",
        opacity: 0,
      }}
    />
  );
}

/* ── Typing Dots (Chatbot indicator) ───────────────────────────────────── */

function TypingDots({ bright, isVisible }: { bright: boolean; isVisible: boolean }) {
  const dotColor = bright
    ? "rgba(255, 45, 120, 0.7)"
    : "rgba(255, 45, 120, 0.4)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, margin: "10px 0" }}>
      {[0, 0.15, 0.3].map((d, i) => (
        <motion.div
          key={i}
          animate={{ scale: [0.6, 1, 0.6] }}
          transition={{
            duration: bright ? 0.7 : 1,
            repeat: isVisible ? Infinity : 0,
            ease: "easeInOut",
            delay: d,
          }}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: dotColor,
            transition: "background 0.4s ease",
          }}
        />
      ))}
    </div>
  );
}

/* ── Audio Waveform Bars (Sesli Asistan indicator) ─────────────────────── */

const MAX_BAR_H = 28;
const WAVE_BARS = [
  { scales: [8/28, 24/28, 10/28, 18/28, 8/28], dur: 1.2 },
  { scales: [18/28, 8/28, 26/28, 10/28, 18/28], dur: 1.0 },
  { scales: [10/28, 28/28, 12/28, 22/28, 10/28], dur: 1.4 },
  { scales: [22/28, 10/28, 18/28, 8/28, 22/28], dur: 1.1 },
  { scales: [12/28, 20/28, 8/28, 26/28, 12/28], dur: 1.3 },
];

function WaveformBars({ bright, isVisible }: { bright: boolean; isVisible: boolean }) {
  const barColor = bright
    ? "rgba(255, 45, 120, 0.7)"
    : "rgba(255, 45, 120, 0.35)";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        height: 30,
        margin: "10px 0",
        justifyContent: "flex-end",
      }}
    >
      {WAVE_BARS.map((bar, i) => (
        <motion.div
          key={i}
          animate={{ scaleY: bar.scales }}
          transition={{
            duration: bright ? bar.dur * 0.8 : bar.dur,
            repeat: isVisible ? Infinity : 0,
            ease: "easeInOut",
          }}
          style={{
            width: 4,
            height: MAX_BAR_H,
            borderRadius: 2,
            background: barColor,
            transformOrigin: "bottom",
            transition: "background 0.4s ease",
          }}
        />
      ))}
    </div>
  );
}

/* ── Robot Face SVG ────────────────────────────────────────────────────── */

function RobotFace({ bright, isVisible }: { bright: boolean; isVisible: boolean }) {
  const eyeColor = bright ? "rgba(255,45,120,0.9)" : "rgba(255,45,120,0.55)";
  const ringColor = bright ? "rgba(255,45,120,0.55)" : "rgba(255,45,120,0.28)";
  const ledColor = bright ? "rgba(255,45,120,0.8)" : "rgba(255,45,120,0.35)";

  return (
    <motion.svg
      width={88}
      height={68}
      viewBox="0 0 88 68"
      style={{ display: "block", margin: "0 auto" }}
    >
      {/* Antenna dots */}
      <motion.circle cx={28} cy={5} r={2.5} fill={ringColor}
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 2, repeat: isVisible ? Infinity : 0, ease: "easeInOut" }}
      />
      <motion.circle cx={60} cy={5} r={2.5} fill={ringColor}
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 2, repeat: isVisible ? Infinity : 0, delay: 0.5, ease: "easeInOut" }}
      />
      <line x1={28} y1={7.5} x2={28} y2={13} stroke={ringColor} strokeWidth={1} />
      <line x1={60} y1={7.5} x2={60} y2={13} stroke={ringColor} strokeWidth={1} />

      {/* Left eye outer ring */}
      <motion.circle cx={25} cy={28} r={13}
        fill="rgba(255,45,120,0.05)"
        stroke={ringColor} strokeWidth={1}
        animate={{ r: [13, 13.6, 13] }}
        transition={{ duration: 3.2, repeat: isVisible ? Infinity : 0, ease: "easeInOut" }}
      />
      {/* Left eye inner ring */}
      <circle cx={25} cy={28} r={8} fill="rgba(255,45,120,0.07)" stroke={ringColor} strokeWidth={0.5} />
      {/* Left pupil — blinks */}
      <motion.ellipse cx={25} cy={28} rx={5} ry={5} fill={eyeColor}
        animate={{ ry: [5, 5, 0.08, 5] }}
        transition={{ duration: 3, repeat: isVisible ? Infinity : 0, times: [0, 0.78, 0.83, 1], ease: ["linear", "easeIn", "easeOut"] }}
      />
      {/* Left highlight */}
      <circle cx={29} cy={24} r={2} fill="rgba(255,255,255,0.55)" />

      {/* Right eye outer ring */}
      <motion.circle cx={63} cy={28} r={13}
        fill="rgba(255,45,120,0.05)"
        stroke={ringColor} strokeWidth={1}
        animate={{ r: [13, 13.6, 13] }}
        transition={{ duration: 3.2, repeat: isVisible ? Infinity : 0, ease: "easeInOut", delay: 0.9 }}
      />
      {/* Right eye inner ring */}
      <circle cx={63} cy={28} r={8} fill="rgba(255,45,120,0.07)" stroke={ringColor} strokeWidth={0.5} />
      {/* Right pupil — blinks */}
      <motion.ellipse cx={63} cy={28} rx={5} ry={5} fill={eyeColor}
        animate={{ ry: [5, 5, 0.08, 5] }}
        transition={{ duration: 3, repeat: isVisible ? Infinity : 0, times: [0, 0.78, 0.83, 1], ease: ["linear", "easeIn", "easeOut"], delay: 0.12 }}
      />
      {/* Right highlight */}
      <circle cx={67} cy={24} r={2} fill="rgba(255,255,255,0.55)" />

      {/* Mouth — smile arc that breathes */}
      <motion.path
        d="M18,57 Q44,68 70,57"
        stroke={ledColor}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        animate={{
          d: [
            "M18,57 Q44,68 70,57",
            "M18,56 Q44,63 70,56",
            "M18,57 Q44,68 70,57",
            "M18,57 Q44,70 70,57",
            "M18,57 Q44,68 70,57",
          ],
          opacity: bright ? [0.7, 1, 0.7] : [0.35, 0.75, 0.35],
        }}
        transition={{ duration: 2.2, repeat: isVisible ? Infinity : 0, ease: "easeInOut" }}
      />
      {/* Corner dots */}
      <motion.circle cx={18} cy={57} r={2.5} fill={ledColor}
        animate={{ r: [2, 2.8, 2], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.2, repeat: isVisible ? Infinity : 0, ease: "easeInOut" }}
      />
      <motion.circle cx={70} cy={57} r={2.5} fill={ledColor}
        animate={{ r: [2, 2.8, 2], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.2, repeat: isVisible ? Infinity : 0, ease: "easeInOut", delay: 0.3 }}
      />
    </motion.svg>
  );
}

/* ── Bottom tabs ───────────────────────────────────────────────────────── */

const TABS = [
  { label: "Akıllı\nChatbot", nodeId: "chatbot" },
  { label: "Özel\nYazılım", nodeId: "yazilim" },
  { label: "Sesli\nAsistan", nodeId: "sesli" },
] as const;

const SERVICE_CONTENT_MAP = {
  chatbot: {
    title: "Akıllı Chatbot",
    short:
      "WhatsApp ve web üzerinden 7/24 yanıt vererek müşteri iletişimini otomatikleştirir.",
    long:
      "**WhatsApp** hesabınıza entegre edilir, müşterilerinizle **7/24** iletişim kurar ve işletmenizin tüm yazışmalarını **profesyonelce** yönetir.",
  },
  yazilim: {
    title: "Özel Yazılım",
    short:
      "Chatbot ve sesli asistanı tek merkezde birleştirip süreçleri tek panelden yönetir.",
    long:
      "**Chatbot ve sesli asistanın birleşimi** — işletmenizin tüm iletişim süreçlerini **tek bir akıllı sistem**de toplar, size sadece **sonuçları** sunar.",
  },
  sesli: {
    title: "Sesli Asistan",
    short:
      "Telefon görüşmelerinde rezervasyon ve bilgi taleplerini doğal konuşmayla yönetir.",
    long:
      "**Restoranlar, klinikler** ve işletmeler için telefon üzerinden **rezervasyon** alır, müşterilerinizle doğal bir şekilde konuşur ve size **anlık geri bildirim** sağlar.",
  },
} as const;

/* ── Component ──────────────────────────────────────────────────────────── */

const NAV_MAP = {
  chatbot: "/hizmetler/akilli-chatbot",
  yazilim: "/hizmetler/ozel-yazilim",
  sesli: "/hizmetler/sesli-asistan",
} as const;

export default function ServiceCircleDiagram() {
  const router = useRouter();
  const circleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useInView(sectionRef as React.RefObject<Element>, { margin: "15% 0px 15% 0px" });
  const [circleCw, setCircleCw] = useState(CIRCLE_W);
  const [gridW, setGridW] = useState(1200);
  const activeTab = 0;
  const [expandedDetail, setExpandedDetail] = useState(false);
  const pulsingLabel: string | null = null;
  const [hoveredCircle, setHoveredCircle] = useState<string | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [startAnimations, setStartAnimations] = useState(false);
  const [viewportW, setViewportW] = useState(1280);

  useEffect(() => {
    const updateViewport = () => setViewportW(window.innerWidth);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  /* ── Parallax ───────────────────────────────────────────────── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const parallaxX = useTransform(springX, [-1, 1], [-12, 12]);
  const parallaxY = useTransform(springY, [-1, 1], [-12, 12]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
      mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
    },
    [mouseX, mouseY]
  );

  /* ── Mouse-position hover detection ──────────────────────────── */
  const handleDiagramMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const w = rect.width;
      const h = rect.height;

      const nx = (mx / w) * 2 - 1;
      const ny = (my / h) * 2 - 1;

      const circleAreaX = nx / 0.8;
      const circleAreaY = ny / 0.8;
      const inCircleArea = circleAreaX * circleAreaX + circleAreaY * circleAreaY < 1.2;

      if (!inCircleArea) {
        setHoveredCircle(null);
        return;
      }

      if (nx < -0.08) {
        setHoveredCircle("chatbot");
      } else if (nx > 0.08) {
        setHoveredCircle("sesli");
      } else {
        setHoveredCircle("yazilim");
      }
    },
    []
  );

  const handleDiagramMouseLeave = useCallback(() => {
    setHoveredCircle(null);
  }, []);

  const handleDiagramClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      if (nx < -0.08) router.push(NAV_MAP.chatbot);
      else if (nx > 0.08) router.push(NAV_MAP.sesli);
      else router.push(NAV_MAP.yazilim);
    },
    [router]
  );

  /* ── ResizeObservers ─────────────────────────────────────────── */
  useEffect(() => {
    const observers: ResizeObserver[] = [];
    if (circleRef.current) {
      const ro = new ResizeObserver(([e]) => setCircleCw(e.contentRect.width));
      ro.observe(circleRef.current);
      observers.push(ro);
    }
    if (gridRef.current) {
      const ro = new ResizeObserver(([e]) => setGridW(e.contentRect.width));
      ro.observe(gridRef.current);
      observers.push(ro);
    }
    return () => observers.forEach((r) => r.disconnect());
  }, []);

  /* ── Viewport trigger ───────────────────────────────────────── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (startAnimations) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStartAnimations(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "15% 0px 15% 0px",
        threshold: 0.01,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [startAnimations]);

  const circleH = circleCw * ASPECT;
  const isMobile = viewportW < 768;
  const isCompact = viewportW < 1100;
  const sectionPad = isMobile ? 16 : 24;
  const labelTitleSize = isMobile ? 18 : 20;
  const labelBodySize = isMobile ? 13.5 : 14.5;
  const activeTabBarW = isMobile ? 86 : 110;
  const idleTabBarW = isMobile ? 52 : 65;
  const hoverTabBarW = isMobile ? 78 : 100;
  const colW = isCompact ? 220 : 260;
  const activeTabNodeId = TABS[activeTab]?.nodeId ?? "chatbot";
  const activeServiceContent = SERVICE_CONTENT_MAP[activeTabNodeId];

  /* ── Derived hover — either circle or label triggers both ───── */
  const activeHover = hoveredCircle || hoveredLabel;

  function isHighlighted(id: string) {
    return activeHover === id || pulsingLabel === id;
  }

  /* ── SVG line coordinates (in grid-wide pixel space) ────────── */
  // Left column = 260px, center column starts at 260px
  // Lines go from right edge of left column → left edge of circles
  // and from left edge of right column → right edge of circles
  const centerStart = colW; // where center column begins in grid
  const centerEnd = gridW - colW;

  const svgLines = [
    // chatbot: from right edge of left column area → left circle edge
    {
      id: "chatbot",
      x1: colW - 10,
      y1: circleH * 0.22,
      x2: centerStart + circleCw * 0.22,
      y2: circleH * 0.32,
    },
    // sesli: from left edge of right column area → right circle edge
    {
      id: "sesli",
      x1: centerEnd + 10,
      y1: circleH * 0.38,
      x2: centerEnd - circleCw * 0.22,
      y2: circleH * 0.38,
    },
    // yazilim: from right edge of left column area → center circle bottom-left
    {
      id: "yazilim",
      x1: colW - 10,
      y1: circleH * 0.78,
      x2: centerStart + circleCw * 0.35,
      y2: circleH * 0.72,
    },
  ];

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        width: "100%",
        minHeight: isCompact ? "auto" : "min(860px, 92vh)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: isMobile ? 30 : 40,
        paddingBottom: isMobile ? 64 : 64,
        background: `
          radial-gradient(ellipse 50% 45% at 50% 50%, rgba(255,45,120,0.06) 0%, transparent 70%),
          radial-gradient(ellipse 70% 60% at 50% 45%, rgba(90,20,55,0.35) 0%, transparent 70%),
          radial-gradient(ellipse 40% 50% at 20% 60%, rgba(60,10,40,0.2) 0%, transparent 60%),
          radial-gradient(ellipse 40% 50% at 80% 40%, rgba(70,15,45,0.2) 0%, transparent 60%),
          linear-gradient(180deg, #0d0608 0%, #12080c 30%, #150a10 60%, #0d0608 100%)
        `,
        overflow: "hidden",
        fontFamily: FONT,
      }}
    >
      {/* ── Ambient glow ──────────────────────────────────────────── */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 55% 50% at 50% 48%, rgba(80,15,45,0.45) 0%, rgba(40,8,25,0.25) 40%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: startAnimations ? [0.3, 0.5, 0.3] : 0 }}
        transition={
          startAnimations
            ? { duration: 4, repeat: isVisible ? Infinity : 0, ease: "easeInOut" }
            : { duration: 0.8 }
        }
      />

      {/* ── Typography ────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          paddingLeft: sectionPad,
          paddingRight: sectionPad,
        }}
      >
        <h2
          style={{
            fontFamily: FONT,
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: isMobile ? "clamp(24px, 7.2vw, 34px)" : "clamp(28px, 4vw, 48px)",
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.01em",
            lineHeight: 1.15,
            marginBottom: 12,
            marginTop: 0,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 0.3em",
          }}
        >
          Yapay Zeka Hizmetlerimize Göz Atın
        </h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: startAnimations ? 1 : 0 }}
          transition={{ duration: 0.5, delay: startAnimations ? 0.25 : 0, ease: "easeOut" }}
          style={{
            fontSize: isMobile ? "14px" : "clamp(14px, 1.6vw, 18px)",
            fontWeight: 400,
            color: "rgba(255,255,255,0.45)",
            marginBottom: isMobile ? 24 : 34,
          }}
        >
          İşletmenize özel, yaşayan araçlar geliştiriyoruz.
        </motion.p>
      </div>

      {/* ── 3-Column Grid: Labels | Circles | Label ───────────────── */}
      <div
        ref={gridRef}
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : isCompact
            ? "minmax(0, 1fr) minmax(0, 1fr)"
            : "260px 1fr 260px",
          gridTemplateAreas: isMobile
            ? '"center"'
            : isCompact
            ? '"center center" "left right"'
            : '"left center right"',
          maxWidth: isMobile ? 740 : isCompact ? 980 : 1200,
          width: "100%",
          alignItems: "stretch",
          rowGap: isMobile ? 0 : isCompact ? 28 : 0,
          columnGap: isMobile ? 0 : isCompact ? 22 : 0,
          paddingLeft: sectionPad,
          paddingRight: sectionPad,
        }}
      >
        {/* ── SVG connecting lines (overlay spanning full grid) ───── */}
        {!isCompact && (
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: circleH,
              pointerEvents: "none",
              zIndex: 15,
              overflow: "visible",
            }}
          >
            {svgLines.map((line) => {
              const lit = isHighlighted(line.id);
              return (
                <motion.path
                  key={line.id}
                  d={`M ${line.x1},${line.y1} L ${line.x2},${line.y2}`}
                  fill="none"
                  style={{
                    stroke: lit
                      ? "rgba(255,45,120,0.5)"
                      : "rgba(255,255,255,0.15)",
                    strokeWidth: lit ? 1.5 : 0.8,
                    transition: "stroke 0.4s ease, stroke-width 0.4s ease",
                  }}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: startAnimations ? 1 : 0,
                    opacity: startAnimations ? 1 : 0,
                  }}
                  transition={{
                    pathLength: { duration: 0.5, delay: startAnimations ? 0.45 : 0, ease: "easeOut" },
                    opacity: { duration: 0.3, delay: startAnimations ? 0.45 : 0 },
                  }}
                />
              );
            })}
          </svg>
        )}

        {/* ── LEFT COLUMN — Labels 1 & 3 ─────────────────────────── */}
        {!isMobile && (
        <div
          style={{
            gridArea: "left",
            display: "flex",
            flexDirection: "column",
            justifyContent: isCompact ? "flex-start" : "space-between",
            gap: isCompact ? 18 : 0,
            paddingRight: isCompact ? 0 : 30,
            height: isCompact ? "auto" : circleH,
            zIndex: 16,
          }}
        >
          {/* Label 1: Akıllı Chatbot (top) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: !startAnimations ? 0 : pulsingLabel === "chatbot" ? [1, 0.4, 1] : 1,
              y: startAnimations ? 0 : 20,
            }}
            transition={
              !startAnimations
                ? { duration: 0.2 }
                : pulsingLabel === "chatbot"
                ? { opacity: { duration: 0.7, ease: "easeInOut" } }
                : { duration: 0.5, delay: 0.6, ease: "easeOut" }
            }
            onMouseEnter={() => setHoveredLabel("chatbot")}
            onMouseLeave={() => setHoveredLabel(null)}
            onClick={() => router.push(NAV_MAP.chatbot)}
            style={{
              maxWidth: isCompact ? "100%" : 260,
              cursor: "pointer",
              paddingTop: isCompact ? 0 : 20,
            }}
          >
            <p
              style={{
                fontFamily: FONT,
                fontSize: labelTitleSize,
                fontWeight: 700,
                color: isHighlighted("chatbot") ? "#fff" : "rgba(255,255,255,0.95)",
                letterSpacing: "0.01em",
                lineHeight: 1.4,
                marginBottom: 0,
                textShadow: isHighlighted("chatbot")
                  ? "0 0 15px rgba(255, 45, 120, 0.3)"
                  : "none",
                transition: "color 0.4s ease, text-shadow 0.4s ease",
              }}
            >
              {SERVICE_CONTENT_MAP.chatbot.title}
            </p>
            <TypingDots bright={isHighlighted("chatbot")} isVisible={isVisible} />
            <p
              style={{
                fontFamily: FONT,
                fontSize: labelBodySize,
                color: isHighlighted("chatbot")
                  ? "rgba(255,255,255,0.75)"
                  : "rgba(255,255,255,0.55)",
                lineHeight: 1.7,
                transition: "color 0.4s ease",
              }}
            >
              <RichText
                text={SERVICE_CONTENT_MAP.chatbot.long}
                brightBold={isHighlighted("chatbot")}
              />
            </p>
          </motion.div>

          {/* Label 3: Özel Yazılım (bottom) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: !startAnimations ? 0 : pulsingLabel === "yazilim" ? [1, 0.4, 1] : 1,
              y: startAnimations ? 0 : 20,
            }}
            transition={
              !startAnimations
                ? { duration: 0.2 }
                : pulsingLabel === "yazilim"
                ? { opacity: { duration: 0.7, ease: "easeInOut" } }
                : { duration: 0.5, delay: 0.8, ease: "easeOut" }
            }
            onMouseEnter={() => setHoveredLabel("yazilim")}
            onMouseLeave={() => setHoveredLabel(null)}
            onClick={() => router.push(NAV_MAP.yazilim)}
            style={{
              maxWidth: isCompact ? "100%" : 260,
              cursor: "pointer",
              paddingBottom: isCompact ? 0 : 20,
            }}
          >
            <p
              style={{
                fontFamily: FONT,
                fontSize: labelTitleSize,
                fontWeight: 700,
                color: isHighlighted("yazilim") ? "#fff" : "rgba(255,255,255,0.95)",
                letterSpacing: "0.01em",
                lineHeight: 1.4,
                marginBottom: 8,
                textShadow: isHighlighted("yazilim")
                  ? "0 0 15px rgba(255, 45, 120, 0.3)"
                  : "none",
                transition: "color 0.4s ease, text-shadow 0.4s ease",
              }}
            >
              {SERVICE_CONTENT_MAP.yazilim.title}
            </p>
            <p
              style={{
                fontFamily: FONT,
                fontSize: labelBodySize,
                color: isHighlighted("yazilim")
                  ? "rgba(255,255,255,0.75)"
                  : "rgba(255,255,255,0.55)",
                lineHeight: 1.7,
                transition: "color 0.4s ease",
              }}
            >
              <RichText
                text={SERVICE_CONTENT_MAP.yazilim.long}
                brightBold={isHighlighted("yazilim")}
              />
            </p>
          </motion.div>
        </div>
        )}

        {/* ── CENTER COLUMN — Circles ─────────────────────────────── */}
        <motion.div
          ref={circleRef}
          onMouseMove={isMobile ? undefined : handleDiagramMouseMove}
          onMouseLeave={isMobile ? undefined : handleDiagramMouseLeave}
          onClick={handleDiagramClick}
          style={{
            gridArea: "center",
            position: "relative",
            width: "100%",
            minWidth: isCompact ? 0 : 400,
            maxWidth: isMobile ? 520 : isCompact ? 760 : "none",
            margin: isCompact ? "0 auto" : 0,
            height: circleH,
            overflow: "visible",
            x: isMobile || isCompact ? 0 : parallaxX,
            y: isMobile || isCompact ? 0 : parallaxY,
            cursor: hoveredCircle ? "pointer" : "default",
          }}
        >
          {/* Elips 3 — center circle, BACK layer */}
          <AnimatedLayer
            src="/circles/elips3.png"
            start={startAnimations && isVisible}
            entranceDelay={0.5}
            breatheScale={[1, 1.06, 1]}
            breatheOpacity={[0.92, 1, 0.92]}
            breatheDuration={3}
            transformOrigin="50% 44%"
            zIndex={1}
            hovered={activeHover === "yazilim"}
            hoverScale={1.04}
            isVisible={isVisible}
          />

          {/* Elips 2 — right crescent, MIDDLE layer */}
          <AnimatedLayer
            src="/circles/elips2.png"
            start={startAnimations && isVisible}
            entranceDelay={0.8}
            breatheScale={[1, 1.045, 1]}
            breatheOpacity={[0.85, 1, 0.85]}
            breatheDuration={4.5}
            breatheDelay={1.3}
            transformOrigin="62% 38%"
            zIndex={2}
            hovered={activeHover === "sesli"}
            hoverTranslateX={isCompact ? 16 : 30}
            hoverScale={1.05}
            isVisible={isVisible}
          />

          {/* Elips 1 — left crescent, FRONT layer */}
          <AnimatedLayer
            src="/circles/elips1.png"
            start={startAnimations && isVisible}
            entranceDelay={0.7}
            breatheScale={[1, 1.045, 1]}
            breatheOpacity={[0.85, 1, 0.85]}
            breatheDuration={4}
            breatheDelay={0.8}
            transformOrigin="38% 50%"
            zIndex={3}
            hovered={activeHover === "chatbot"}
            hoverTranslateX={isCompact ? -16 : -30}
            hoverScale={1.05}
            isVisible={isVisible}
          />

          {/* CENTER LABEL — Robot Face */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: startAnimations ? 1 : 0 }}
            transition={{ duration: 0.45, delay: startAnimations ? 0.7 : 0 }}
            style={{
              position: "absolute",
              top: "46%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              zIndex: 16,
              pointerEvents: "none",
            }}
          >
            <RobotFace bright={isHighlighted("yazilim")} isVisible={isVisible} />
          </motion.div>

          {/* Orbital particles */}
          <OrbitalParticle start={startAnimations && isVisible} animName="svc-orbit-1" duration={18} delay={2.5} />
          <OrbitalParticle start={startAnimations && isVisible} animName="svc-orbit-2" duration={22} delay={2.8} />
          <OrbitalParticle start={startAnimations && isVisible} animName="svc-orbit-3" duration={16} delay={3.0} />
          <OrbitalParticle start={startAnimations && isVisible} animName="svc-orbit-4" duration={25} delay={3.3} />
        </motion.div>

        {/* ── RIGHT COLUMN — Label 2 ─────────────────────────────── */}
        {!isMobile && (
        <div
          style={{
            gridArea: "right",
            display: "flex",
            flexDirection: "column",
            justifyContent: isCompact ? "flex-start" : "center",
            paddingLeft: isCompact ? 0 : 30,
            height: isCompact ? "auto" : circleH,
            zIndex: 16,
          }}
        >
          {/* Label 2: Sesli Asistan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: !startAnimations ? 0 : pulsingLabel === "sesli" ? [1, 0.4, 1] : 1,
              y: startAnimations ? 0 : 20,
            }}
            transition={
              !startAnimations
                ? { duration: 0.2 }
                : pulsingLabel === "sesli"
                ? { opacity: { duration: 0.7, ease: "easeInOut" } }
                : { duration: 0.5, delay: 0.7, ease: "easeOut" }
            }
            onMouseEnter={() => setHoveredLabel("sesli")}
            onMouseLeave={() => setHoveredLabel(null)}
            onClick={() => router.push(NAV_MAP.sesli)}
            style={{
              maxWidth: isCompact ? "100%" : 260,
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <p
              style={{
                fontFamily: FONT,
                fontSize: labelTitleSize,
                fontWeight: 700,
                color: isHighlighted("sesli") ? "#fff" : "rgba(255,255,255,0.95)",
                letterSpacing: "0.01em",
                lineHeight: 1.4,
                marginBottom: 0,
                textShadow: isHighlighted("sesli")
                  ? "0 0 15px rgba(255, 45, 120, 0.3)"
                  : "none",
                transition: "color 0.4s ease, text-shadow 0.4s ease",
              }}
            >
              {SERVICE_CONTENT_MAP.sesli.title}
            </p>
            <WaveformBars bright={isHighlighted("sesli")} isVisible={isVisible} />
            <p
              style={{
                fontFamily: FONT,
                fontSize: labelBodySize,
                color: isHighlighted("sesli")
                  ? "rgba(255,255,255,0.75)"
                  : "rgba(255,255,255,0.55)",
                lineHeight: 1.7,
                transition: "color 0.4s ease",
              }}
            >
              <RichText
                text={SERVICE_CONTENT_MAP.sesli.long}
                brightBold={isHighlighted("sesli")}
              />
            </p>
          </motion.div>
        </div>
        )}
      </div>

      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: startAnimations ? 1 : 0, y: startAnimations ? 0 : 18 }}
          transition={{ duration: 0.45, delay: startAnimations ? 0.85 : 0, ease: "easeOut" }}
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: 740,
            marginTop: 30,
            paddingLeft: sectionPad,
            paddingRight: sectionPad,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 8,
              marginBottom: 8,
            }}
          >
            {TABS.map((tab, i) => {
              const isActive = activeTab === i;
              return (
                <button
                  key={tab.nodeId}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => router.push(NAV_MAP[tab.nodeId])}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: isActive ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.56)",
                    fontFamily: FONT,
                    fontSize: 12.5,
                    fontWeight: 700,
                    lineHeight: 1.28,
                    whiteSpace: "pre-line",
                    padding: "0 2px 2px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    textAlign: "center",
                    minWidth: 0,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      display: "block",
                      width: isActive ? "100%" : "58%",
                      height: 3,
                      borderRadius: 999,
                      margin: "0 auto",
                      background: isActive
                        ? "linear-gradient(90deg, #FF2D78 0%, #FF6AA7 100%)"
                        : "linear-gradient(90deg, rgba(255,45,120,0.42) 0%, rgba(255,255,255,0.08) 100%)",
                      opacity: isActive ? 1 : 0.72,
                      transition:
                        "width 180ms ease, opacity 180ms ease, background 180ms ease",
                    }}
                  />
                  <span
                    style={{
                      display: "block",
                      transition: "color 180ms ease, transform 180ms ease",
                      transform: isActive ? "translateY(0)" : "translateY(1px)",
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            style={{
              position: "relative",
              maxWidth: 360,
              margin: "4px auto 0",
              padding: "6px 6px 0",
            }}
          >
            <div
              aria-hidden
              style={{
                width: 62,
                height: 1,
                margin: "0 auto 10px",
                background:
                  "linear-gradient(90deg, rgba(255,45,120,0.92) 0%, rgba(255,255,255,0.12) 100%)",
              }}
            />
            <p
              style={{
                fontFamily: FONT,
                fontSize: 17,
                fontWeight: 700,
                color: "rgba(255,255,255,0.95)",
                margin: 0,
                textAlign: "center",
                textShadow: "0 1px 12px rgba(0,0,0,0.16)",
              }}
            >
              {activeServiceContent.title}
            </p>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 13.25,
                lineHeight: 1.58,
                color: "rgba(255,255,255,0.7)",
                marginTop: 5,
                marginBottom: 0,
                textAlign: "center",
                textWrap: "balance",
              }}
            >
              {activeServiceContent.short}
            </p>
            {expandedDetail && (
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 13,
                  lineHeight: 1.64,
                  color: "rgba(255,255,255,0.6)",
                  marginTop: 8,
                  marginBottom: 0,
                  textAlign: "center",
                  textWrap: "balance",
                  transition: "opacity 180ms ease, transform 180ms ease",
                }}
              >
                <RichText text={activeServiceContent.long} brightBold />
              </p>
            )}
            <button
              type="button"
              onClick={() => setExpandedDetail((prev) => !prev)}
              style={{
                marginTop: 8,
                border: "none",
                background: "transparent",
                color: "rgba(255, 124, 178, 0.82)",
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 600,
                padding: 0,
                letterSpacing: "0.01em",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {expandedDetail ? "Detayı Gizle" : "Detayı Gör"}
            </button>
          </div>
        </motion.div>
      )}

      {!isMobile && (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "flex-start",
            gap: "clamp(20px, 4vw, 40px)",
            marginTop: 38,
            paddingLeft: sectionPad,
            paddingRight: sectionPad,
            justifyContent: "center",
            maxWidth: 1200,
            width: "100%",
          }}
        >
          {TABS.map((tab, i) => {
            const isActive = activeTab === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: startAnimations ? 1 : 0, y: startAnimations ? 0 : 22 }}
                transition={{
                  duration: 0.5,
                  delay: startAnimations ? 0.95 + i * 0.12 : 0,
                  ease: "easeOut",
                }}
                whileHover="hover"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  cursor: "pointer",
                  fontFamily: FONT,
                  flex: "0 0 auto",
                }}
                onClick={() => router.push(NAV_MAP[tab.nodeId])}
              >
                <motion.div
                  variants={{
                    hover: {
                      width: isActive ? activeTabBarW : hoverTabBarW,
                      background: "#FF2D78",
                    },
                  }}
                  animate={{
                    width: isActive ? activeTabBarW : idleTabBarW,
                    background: isActive
                      ? "#FF2D78"
                      : "linear-gradient(to right, #FF2D78, rgba(255,45,120,0.35))",
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ height: 4, borderRadius: 2, marginBottom: 10 }}
                />
                <motion.span
                  variants={{
                    hover: { y: -2, color: "rgba(255,255,255,1)" },
                  }}
                  animate={{
                    y: 0,
                    color: isActive
                      ? "rgba(255,255,255,1)"
                      : "rgba(255,255,255,0.55)",
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    lineHeight: 1.35,
                    whiteSpace: "pre-line",
                    display: "block",
                  }}
                >
                  {tab.label}
                </motion.span>
              </motion.div>
            );
          })}
        </div>
      )}

      {isMobile && (
        <div
          aria-hidden
          style={{
            pointerEvents: "none",
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 64,
            background:
              "linear-gradient(180deg, rgba(13,6,8,0) 0%, rgba(13,6,8,0.68) 58%, rgba(13,6,8,0.92) 100%)",
          }}
        />
      )}
    </section>
  );
}
