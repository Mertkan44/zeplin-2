"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";

interface Project {
  name: string;
  image: string;
  description?: string;
  imagePosition?: string;
  tags?: string[];
  variant?: "image" | "website";
  slug?: string;
  year?: string;
  client?: string;
}

interface ProjectCoverflowProps {
  projects: Project[];
}

const monoStyle: CSSProperties = {
  fontFamily: "var(--font-jost), ui-monospace, monospace",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

/* Aktif karta göre dairesel mesafe: -2..2 görünür, ötesi gizlenir. */
function slotOf(index: number, active: number, total: number) {
  let slot = index - active;
  if (slot > total / 2) slot -= total;
  if (slot < -total / 2) slot += total;
  return slot;
}

/* Yay üzerindeki konum — Swiper'ın coverflow formülü: yana kayan kart aynı
   zamanda Z'de geriye gider, küçülme ölçekle değil gerçek perspektifle olur.
   Değerler globals.css'teki --cf-* değişkenlerinden; kırılım noktalarında
   ölçekler CSS tarafında değişiyor. */
function slotTransform(slot: number): CSSProperties {
  const depth = Math.abs(slot);

  if (depth > 2) {
    return {
      transform: "translateX(0) translateZ(-320px)",
      opacity: 0,
      pointerEvents: "none",
    };
  }
  if (depth === 0) {
    return { transform: "translateX(0) translateZ(0) rotateY(0deg)", zIndex: 10 };
  }

  const dir = slot < 0 ? -1 : 1;
  return {
    transform: `translateX(calc(var(--cf-x${depth}) * ${dir})) translateZ(calc(var(--cf-z${depth}) * -1)) rotateY(calc(var(--cf-ry${depth}) * ${-dir}))`,
    zIndex: 10 - depth,
  };
}

export default function ProjectCoverflow({ projects }: ProjectCoverflowProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  /* Otomatik geçiş yalnızca kimse karusele dokunmuyorken çalışır:
     kullanıcı duraklattıysa, elle gezindiyse, fare/odak içerideyse veya
     azaltılmış hareket tercihi varsa durur. */
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const reducedMotion = useReducedMotion();
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef(0);

  const n = projects.length;
  const active = projects[activeIdx];
  const autoplaying = !userPaused && !reducedMotion;
  const running = autoplaying && !hovering && !focusWithin;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % n), 5500);
    return () => clearInterval(id);
  }, [running, n, activeIdx]);

  /* Elle gezinmek otomatik geçişi kalıcı olarak kapatır. */
  const select = useCallback((i: number) => {
    setActiveIdx(i);
    setUserPaused(true);
  }, []);
  const goPrev = useCallback(() => select((activeIdx - 1 + n) % n), [activeIdx, n, select]);
  const goNext = useCallback(() => select((activeIdx + 1) % n), [activeIdx, n, select]);

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchDeltaXRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (touchStartXRef.current === null) return;
    touchDeltaXRef.current = e.touches[0].clientX - touchStartXRef.current;
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaXRef.current) > 45) {
      if (touchDeltaXRef.current < 0) goNext();
      else goPrev();
    }
    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  return (
    <section
      className="coverflow relative mx-[calc(50%-50vw)] overflow-hidden py-10 md:py-14"
      aria-roledescription="carousel"
      aria-label="Seçili işler"
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocusWithin(false);
      }}
    >
      {/* merkezdeki karta arkadan hafif marka ışıması */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--cf-glow) 0%, rgba(219,39,119,0) 70%)",
          filter: "blur(20px)",
        }}
        aria-hidden="true"
      />

      {/* başlık */}
      <div className="relative text-center">
        <p className="text-[12px] text-foreground/60" style={monoStyle}>
          ↳ seçili işler
        </p>
        <h2
          className="mt-4 text-foreground"
          style={{
            fontFamily: "var(--font-instrument), serif",
            fontWeight: 400,
            fontSize: "clamp(2.2rem, 5.4vw, 3.9rem)",
            lineHeight: 1.06,
            letterSpacing: "-0.02em",
          }}
        >
          Son <em style={{ fontStyle: "italic" }}>işlerimiz</em>, tek tek.
        </h2>
      </div>

      {/* yay — perspective kartların DOĞRUDAN ebeveyninde olmalı, yoksa
          aradaki eleman 3B'yi düzleştirir ve rotateY yalnızca daraltır */}
      <div className="relative mt-8 md:mt-12" style={{ height: "var(--cf-stage)" }}>
        <ul
          className="relative h-full list-none p-0 m-0"
          style={{ perspective: "var(--cf-persp)" }}
        >
          {projects.map((project, i) => {
            const slot = slotOf(i, activeIdx, n);
            const depth = Math.abs(slot);
            const isActive = slot === 0;
            const hidden = depth > 2;

            return (
              <li
                key={project.slug ?? project.name}
                className="coverflow-card absolute left-1/2 top-1/2"
                data-depth={depth}
                style={{
                  width: "var(--cf-w)",
                  height: "var(--cf-h)",
                  marginLeft: "calc(var(--cf-w) / -2)",
                  marginTop: "calc(var(--cf-h) / -2)",
                  ...slotTransform(slot),
                }}
                aria-hidden={hidden ? true : undefined}
              >
                <div
                  className="relative h-full w-full overflow-hidden rounded-2xl"
                  style={{
                    boxShadow: isActive ? "var(--cf-shadow-active)" : "var(--cf-shadow)",
                  }}
                >
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 340px, (min-width: 768px) 290px, 240px"
                    className="object-cover"
                    style={{
                      objectPosition: project.imagePosition ?? "center",
                      filter: isActive
                        ? "none"
                        : depth === 1
                        ? "var(--cf-dim-1)"
                        : "var(--cf-dim-2)",
                      transition: "filter var(--dur-4) var(--ease-zeplin)",
                    }}
                  />

                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 42%, rgba(0,0,0,0.82) 100%)",
                    }}
                  />

                  {isActive && project.slug && (
                    <div
                      className="absolute right-3.5 top-3.5 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-white"
                      style={{
                        background: "rgba(0,0,0,0.5)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.18)",
                      }}
                      aria-hidden="true"
                    >
                      Projeyi incele →
                    </div>
                  )}

                  {/* alt-sol altyazı */}
                  <div className="absolute inset-x-5 bottom-5">
                    <div
                      className="mb-1.5 text-[12px] text-[#F9A8D4]"
                      style={{ ...monoStyle, letterSpacing: "0.16em" }}
                    >
                      {project.name}
                      {isActive && project.year ? ` · ${project.year}` : ""}
                    </div>
                    {project.description && (
                      <p
                        className="m-0 text-white"
                        style={{
                          fontFamily: "var(--font-jost), sans-serif",
                          fontWeight: 500,
                          fontSize: isActive ? "1.3rem" : "1.05rem",
                          lineHeight: 1.28,
                          letterSpacing: "-0.005em",
                          textWrap: "pretty",
                        }}
                      >
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* etkileşim katmanı: aktif kart projeye gider, diğerleri öne alır */}
                  {isActive ? (
                    project.slug ? (
                      <Link
                        href={`/projeler/${project.slug}`}
                        className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EC4899]"
                      >
                        <span className="sr-only">{project.name} projesini incele</span>
                      </Link>
                    ) : null
                  ) : (
                    <button
                      type="button"
                      onClick={() => select(i)}
                      tabIndex={hidden ? -1 : 0}
                      className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EC4899]"
                    >
                      <span className="sr-only">{project.name} projesini öne getir</span>
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* gezinme */}
      <div className="relative mt-10 flex items-center justify-center gap-4 md:mt-12">
        <button
          type="button"
          aria-label="Önceki proje"
          onClick={goPrev}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/25 text-foreground/70 transition-colors duration-200 hover:border-foreground/40 hover:text-foreground active:scale-95"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12L6 8L10 4" /></svg>
        </button>

        <span
          className="text-foreground"
          style={{
            fontFamily: "var(--font-instrument), serif",
            fontSize: "1.2rem",
            letterSpacing: "-0.01em",
          }}
        >
          <span style={{ color: "#EC4899" }}>{String(activeIdx + 1).padStart(2, "0")}</span>
          <span style={{ opacity: 0.3, margin: "0 4px" }}>/</span>
          <span style={{ opacity: 0.45 }}>{String(n).padStart(2, "0")}</span>
        </span>

        <button
          type="button"
          aria-label={autoplaying ? "Otomatik geçişi durdur" : "Otomatik geçişi başlat"}
          aria-pressed={!autoplaying}
          onClick={() => setUserPaused((p) => !p)}
          disabled={!!reducedMotion}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/25 text-foreground/70 transition-colors duration-200 hover:border-foreground/40 hover:text-foreground disabled:hidden"
        >
          {autoplaying ? (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="3.5" y="3" width="3" height="10" rx="1" /><rect x="9.5" y="3" width="3" height="10" rx="1" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" /></svg>
          )}
        </button>

        <button
          type="button"
          aria-label="Sonraki proje"
          onClick={goNext}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/25 text-foreground/70 transition-colors duration-200 hover:border-foreground/40 hover:text-foreground active:scale-95"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4L10 8L6 12" /></svg>
        </button>
      </div>

      <div className="relative mt-6 text-center">
        <Link
          href="/projeler"
          className="inline-flex items-center rounded-full border border-foreground/20 px-5 py-2.5 text-[13px] font-semibold text-foreground/80 transition-colors duration-200 hover:border-foreground/40 hover:text-foreground"
        >
          Tüm işleri gör →
        </Link>
      </div>

      <span className="sr-only" aria-live={running ? "off" : "polite"}>
        {active?.name}
      </span>
    </section>
  );
}
