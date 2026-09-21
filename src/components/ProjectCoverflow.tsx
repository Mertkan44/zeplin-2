"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

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
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const n = projects.length;
  const active = projects[activeIdx];

  /* Elle gezinince sayaç baştan başlasın diye interval her seferinde kurulur. */
  const restartAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % n);
    }, 5500);
  }, [n]);

  useEffect(() => {
    restartAutoplay();
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [restartAutoplay]);

  const goPrev = useCallback(() => {
    setActiveIdx((i) => (i - 1 + n) % n);
    restartAutoplay();
  }, [n, restartAutoplay]);
  const goNext = useCallback(() => {
    setActiveIdx((i) => (i + 1) % n);
    restartAutoplay();
  }, [n, restartAutoplay]);

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
        <p className="text-[10px] text-foreground/40" style={monoStyle}>
          ↳ seçili işler
        </p>
        <h3
          className="mt-4 text-foreground"
          style={{
            fontFamily: "var(--font-instrument), serif",
            fontWeight: 400,
            fontSize: "clamp(2.2rem, 5.4vw, 3.9rem)",
            lineHeight: 1.06,
            letterSpacing: "-0.02em",
          }}
        >
          <em style={{ fontStyle: "italic" }}>Sahne</em> arkası, tek tek.
        </h3>
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

                  {isActive && (
                    <div
                      className="absolute right-3.5 top-3.5 flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[8.5px] text-white/90"
                      style={{
                        ...monoStyle,
                        letterSpacing: "0.14em",
                        background: "rgba(0,0,0,0.45)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.14)",
                      }}
                    >
                      <span
                        className="h-[5px] w-[5px] rounded-full bg-[#F472B6]"
                        style={{ boxShadow: "0 0 6px #F472B6" }}
                      />
                      canlı
                    </div>
                  )}

                  {/* alt-sol altyazı */}
                  <div className="absolute inset-x-5 bottom-5">
                    <div
                      className="mb-1.5 text-[9px] text-[#F472B6]"
                      style={{ ...monoStyle, letterSpacing: "0.18em" }}
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
                      onClick={() => {
                        setActiveIdx(i);
                        restartAutoplay();
                      }}
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
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-foreground/15 text-foreground/50 transition-colors duration-200 hover:border-foreground/30 hover:text-foreground active:scale-95"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12L6 8L10 4" /></svg>
        </button>

        <span
          aria-live="polite"
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
          aria-label="Sonraki proje"
          onClick={goNext}
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-foreground/15 text-foreground/50 transition-colors duration-200 hover:border-foreground/30 hover:text-foreground active:scale-95"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4L10 8L6 12" /></svg>
        </button>
      </div>

      <div className="relative mt-6 text-center">
        <Link
          href="/projeler"
          className="text-[11px] text-foreground/45 transition-colors duration-200 hover:text-foreground/80"
          style={monoStyle}
        >
          tüm işler →
        </Link>
      </div>

      <span className="sr-only" aria-live="polite">
        {active?.name}
      </span>
    </section>
  );
}
