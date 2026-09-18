"use client";

import { useEffect, useRef, useState } from "react";
import HeroField from "./HeroField";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * Hero — magenta degrade zemin, iki yandan uzanan eller.
 * Scroll ilerledikçe eller birbirine yaklaşır, başlık geri çekilir.
 */

const HEADLINE_TOP = "Markanızı zirveye";
const HEADLINE_BOTTOM = "çıkarmaya hazır mısınız?";

function Words({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const parts = text.split(" ");
  return (
    <span className={className}>
      {parts.map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden pb-[0.08em] align-bottom"
          style={{ marginRight: i < parts.length - 1 ? "0.26em" : undefined }}
        >
          <span className="hero-rise inline-block" style={{ animationDelay: `${delay + i * 0.07}s` }}>
            {w}
          </span>
        </span>
      ))}
    </span>
  );
}

/* monopo'daki gibi üç kısa ifade, her biri iki satır. Dev başlık yerine
   kompozisyonun ağırlığını bunlar taşıyor. */
const STATEMENTS: [string, string][] = [
  ["İstanbul'da kurulu", "Sahada büyüdü"],
  ["Prodüksiyon odaklı", "yaratıcı ajans"],
  ["Çekim, dikey sinema", "ve gerilla prodüksiyon"],
];

function useIstanbulClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("tr-TR", {
          timeZone: "Europe/Istanbul",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function HeroStage() {
  const ref = useRef<HTMLElement>(null);
  const time = useIstanbulClock();
  const reduced = useReducedMotion();

  /* Scroll ilerlemesi. useScroll scroll olayını dinler; kare döngüsüne
     ihtiyaç duymaz, boştayken de iş yapmaz. */
  const { scrollYProgress: progress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /* Doğrudan ilerlemeyi kullanıyoruz, araya yay koymuyoruz.
     useSpring kaydırma durduktan sonra da hareketi sürdürüyor; bu, scroll'a
     bağlı bir animasyonda yumuşaklık değil gecikme olarak hissediliyor.
     Kaydırma zaten sürekli bir girdi, ayrıca süzmeye gerek yok. */
  const eased = progress;

  /* Eller çapraz yaklaşıyor.

     Yol mesafesinin bir üst sınırı var: kollar PNG'lerin kenarından kesik
     (sol el sol+üst, sağ el sağ+alt). Başlangıçta her el %13 yani ~187px
     dışarıda duruyor; hareket bunu aşarsa kesik kenar kadraja girip bilek
     düz bir çizgiyle biter. 576px genişlikte 187px = %32, o yüzden yatayı
     %28'de tutuyoruz — kesik dışarıda kalıyor, payı da var.
     Dikey, çapraz açı bozulmasın diye aynı oranda ölçekleniyor. */
  const leftX = useTransform(eased, [0, 1], ["0%", "28%"]);
  const leftY = useTransform(eased, [0, 1], ["0%", "20%"]);
  const rightX = useTransform(eased, [0, 1], ["0%", "-28%"]);
  const rightY = useTransform(eased, [0, 1], ["0%", "-20%"]);
  const handScale = useTransform(eased, [0, 1], [1, 1.04]);

  // başlık geri çekilip soluyor
  const textOpacity = useTransform(eased, [0.2, 0.8], [1, 0]);

  /* İmleç takibi. Merkeze göre -1..1 aralığında normalize ediliyor.
     Burada yay KULLANIYORUZ: fare kesikli bir girdi, araya yay koymak
     yumuşaklık katıyor. Scroll'da tam tersiydi — orada gecikme yaratıyordu. */
  const pointerX = useMotionValue(0);   // -1..1, merkeze göre
  const pointerY = useMotionValue(0);
  const px = useSpring(pointerX, { stiffness: 60, damping: 20, mass: 0.5 });
  const py = useSpring(pointerY, { stiffness: 60, damping: 20, mass: 0.5 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointerX.set((e.clientX / window.innerWidth) * 2 - 1);
      pointerY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
    };
  }, [pointerX, pointerY, reduced]);

  // eller derinlik hissi için ters yönde kayıyor
  const leftPX = useTransform(px, (v) => v * 16);
  const leftPY = useTransform(py, (v) => v * 11);
  const rightPX = useTransform(px, (v) => v * -20);
  const rightPY = useTransform(py, (v) => v * -14);
  const still = reduced ? 0 : undefined;

  return (
    <section ref={ref} className="relative h-[210svh]">
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-[#0A0308]">
        {/* magenta degrade zemin — görsel değil, kod. Rengi buradan ayarlanır. */}
        {/* Akan hacimli ışık alanı — WebGL.
            Önceki CSS radyal lekeleri düz ve genel duruyordu; referanstaki
            formlar alan bükmesi gerektiriyor, onu shader'da yapıyoruz.
            Grain de piksel başına burada üretiliyor, ayrı katman yok. */}
        <HeroField scrollProgress={eased} />

        {/* film greni — sabit, dokuyu canlı tutuyor */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23n)' opacity='.78'/%3E%3C/svg%3E\")",
            backgroundSize: "150px 150px",
            mixBlendMode: "soft-light",
          }}
        />
        {/* eller */}
        {/* Sarmalayıcı imleç parallax'ını, görselin kendisi scroll hareketini
            taşıyor. İki kaynağı ayrı katmanlara bölmek, yüzde/piksel birimlerini
            calc ile toplama zorunluluğunu ortadan kaldırıyor. */}
        <motion.div
          className="pointer-events-none absolute -left-[13%] -top-[15%] w-[40vw] max-w-[580px]"
          style={{
            x: still !== undefined ? 0 : leftPX,
            y: still !== undefined ? 0 : leftPY,
            willChange: "transform",
          }}
        >
          <motion.img
            src="/images/hand-left.webp"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="w-full origin-left select-none"
            style={{
              x: still !== undefined ? 0 : leftX,
              y: still !== undefined ? 0 : leftY,
              scale: still !== undefined ? 1 : handScale,
              willChange: "transform",
            }}
          />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute -right-[13%] -bottom-[15%] w-[40vw] max-w-[580px]"
          style={{
            x: still !== undefined ? 0 : rightPX,
            y: still !== undefined ? 0 : rightPY,
            willChange: "transform",
          }}
        >
          <motion.img
            src="/images/hand-right.webp"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="w-full origin-right select-none"
            style={{
              x: still !== undefined ? 0 : rightX,
              y: still !== undefined ? 0 : rightY,
              scale: still !== undefined ? 1 : handScale,
              willChange: "transform",
            }}
          />
        </motion.div>

        {/* Ortada başlık — gerçek monopo'da da var, kaldırmam hatalıydı */}
        <motion.div
          style={{ opacity: still !== undefined ? 1 : textOpacity, willChange: "opacity" }}
          className="pointer-events-none relative z-20 flex h-full items-center justify-center px-6 pb-[14vh]"
        >
          <h1
            className="text-center font-[family-name:var(--font-jost)] font-light text-white"
            style={{ fontSize: "clamp(2.2rem, 5.4vw, 4.7rem)", lineHeight: 1.08, letterSpacing: "-0.02em" }}
          >
            <Words text={HEADLINE_TOP} className="block" delay={0.3} />
            <Words text={HEADLINE_BOTTOM} className="block text-white/65" delay={0.5} />
          </h1>
        </motion.div>

        {/* İçerik — monopo dili: orta tamamen boş, bütün metin altta
            üç sütunlu bir ızgarada, tipografi küçük ve geniş aralıklı. */}
        <motion.div
          style={{
            opacity: still !== undefined ? 1 : textOpacity,
            willChange: "opacity",
          }}
          className="absolute inset-x-0 bottom-0 z-20 px-6 pb-8 sm:px-10 sm:pb-10"
        >
          <div className="grid grid-cols-1 gap-y-7 sm:grid-cols-3 sm:gap-x-10">
            {STATEMENTS.map((st, i) => (
              <div
                key={st[0]}
                className="hero-fade text-[0.92rem] leading-[1.45]"
                style={{ animationDelay: `${0.5 + i * 0.14}s` }}
              >
                <div className="font-semibold text-white">{st[0]}</div>
                <div className="text-white/45">{st[1]}</div>
              </div>
            ))}
          </div>

          {/* alt satır: saat · konum · kaydırma ipucu */}
          <div
            className="hero-fade mt-9 flex items-end justify-between text-[0.66rem] tracking-[0.18em] text-white/35"
            style={{ animationDelay: "1.05s" }}
          >
            <span className="tabular-nums">{time || " "}</span>
            <span className="hidden sm:block">İSTANBUL, TR</span>
            <motion.span
              animate={reduced ? undefined : { y: [0, 4, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
              className="text-white/50"
            >
              ↓
            </motion.span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
