"use client";

const mono: React.CSSProperties = {
  fontFamily: "var(--font-jost), ui-monospace, monospace",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
};

interface BentoCardProps {
  title: string;
  description: string;
  items: string[];
  backgroundImage?: string;
  mobile?: boolean;
}

export default function BentoCard({ title, items, backgroundImage }: BentoCardProps) {
  return (
    <div
      className="relative h-full overflow-hidden rounded-2xl md:rounded-3xl transition-shadow duration-300 md:cursor-pointer md:hover:shadow-[0_20px_56px_rgba(219,39,119,0.2)]"
      style={{ background: "linear-gradient(140deg, #110E18 0%, #160F1C 55%, #0D0B12 100%)" }}
    >
      {/* Top-right glow */}
      <div
        className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full opacity-90 md:-right-20 md:-top-20 md:h-60 md:w-60"
        style={{ background: "radial-gradient(circle, rgba(219,39,119,0.20) 0%, transparent 70%)" }}
      />

      {/* Pink left bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full md:top-4 md:bottom-4 md:w-[4px]"
        style={{ background: "linear-gradient(180deg, #F472B6, #DB2777)" }}
      />

      {/* Arrow badge — top right */}
      <div
        className="absolute right-4 top-4 z-20 grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/[0.06] md:right-5 md:top-5"
        style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      >
        <svg
          width="11" height="11" viewBox="0 0 24 24"
          fill="none" stroke="white" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ opacity: 0.65 }}
        >
          <path d="M7 17L17 7M11 7H17V13" />
        </svg>
      </div>

      {/* Mobile-only: faint photo overlay */}
      {backgroundImage && (
        <div
          className="pointer-events-none absolute inset-0 z-0 md:hidden"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center right",
            opacity: 0.16,
          }}
        />
      )}

      {/* Layout */}
      <div className="relative z-10 flex h-full flex-col md:flex-row">

        {/* ── Text column ── */}
        <div className="flex h-full flex-col justify-between p-5 pl-7 md:w-[54%] md:p-8 md:pl-10">

          {/* Label */}
          <span className="text-[9px] text-white/35 md:text-[10px]" style={mono}>
            ↳ {title}
          </span>

          {/* Serif tagline */}
          <h3
            className="text-white leading-[0.93]"
            style={{
              fontFamily: "var(--font-instrument), serif",
              fontWeight: 400,
              fontSize: "clamp(1.45rem, 3.8vw, 2.9rem)",
              letterSpacing: "-0.022em",
            }}
          >
            <em style={{ fontStyle: "italic", color: "#F472B6" }}>Dijital</em>{" "}
            dönüşümün
            <br />tam ortasında.
          </h3>

          {/* Numbered service list */}
          <div className="border-t border-white/[0.10]">
            {items.map((item, i) => (
              <div
                key={item}
                className="flex items-center justify-between border-b border-white/[0.07] py-[8px] last:border-b-0 md:py-[10px]"
              >
                <span className="text-[11px] font-medium text-white/70 md:text-[13px]">
                  {item}
                </span>
                <span className="text-[9px] text-white/25" style={mono}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Image panel (desktop only) ── */}
        {backgroundImage && (
          <div className="relative hidden md:block md:w-[46%]">
            {/* Left-edge fade into the dark bg */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20"
              style={{ background: "linear-gradient(to right, #110E18, transparent)" }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.62,
              }}
            />
          </div>
        )}

      </div>
    </div>
  );
}
