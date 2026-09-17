"use client";

import { useTheme } from "./ThemeProvider";

export default function PackageBuilder() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  /*
   * Card surface stays LIGHT in both modes — matching carousel SepetCard PNGs.
   * Only the outer shadow adapts: darker/stronger in dark mode.
   */
  const cardStyle: React.CSSProperties = {
    background: `
      radial-gradient(ellipse 80% 60% at 50% 40%, #f6f6f6 0%, #efefef 50%, #e5e5e5 100%)
    `,
    boxShadow: dark
      ? `
        10px 14px 34px rgba(0,0,0,0.55),
        4px 4px 12px rgba(0,0,0,0.35),
        inset 0 2px 0 rgba(255,255,255,0.85),
        inset 0 -1px 0 rgba(0,0,0,0.03)
      `
      : `
        10px 14px 30px rgba(0,0,0,0.1),
        -3px -3px 10px rgba(255,255,255,1),
        inset 0 2px 0 rgba(255,255,255,0.9),
        inset 0 -1px 0 rgba(0,0,0,0.03)
      `,
    border: dark
      ? "1px solid rgba(255,255,255,0.12)"
      : "1px solid rgba(255,255,255,0.7)",
  };

  const btnStyle: React.CSSProperties = {
    background: `
      radial-gradient(ellipse 90% 80% at 50% 40%, #f4f4f4 0%, #eaeaea 100%)
    `,
    boxShadow: dark
      ? `
        3px 4px 8px rgba(0,0,0,0.3),
        inset 0 1px 0 rgba(255,255,255,0.7)
      `
      : `
        3px 4px 8px rgba(0,0,0,0.08),
        -2px -2px 6px rgba(255,255,255,0.95),
        inset 0 1px 0 rgba(255,255,255,0.8)
      `,
    border: dark
      ? "1px solid rgba(255,255,255,0.1)"
      : "1px solid rgba(255,255,255,0.5)",
  };

  return (
    <section className="py-14 md:py-20">
      <div className="flex flex-col md:flex-row gap-6 w-full px-6 md:px-12">
        {/* ─── LEFT PANEL (55%) ─── */}
        <div
          className="flex-[0_0_100%] md:flex-[0_0_55%] min-w-0 min-h-[420px] rounded-[24px] relative flex flex-col p-8 overflow-hidden"
          style={cardStyle}
        >
          {/* Top highlight */}
          <div
            className="absolute top-0 left-0 right-0 h-[100px] rounded-t-[24px] pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
            }}
          />
          {/* Edge vignette */}
          <div
            className="absolute inset-0 rounded-[24px] pointer-events-none"
            style={{ boxShadow: "inset 0 0 40px rgba(0,0,0,0.03)" }}
          />

          <span className="relative text-xs font-medium tracking-wide uppercase text-zinc-500">
            seçilen hizmetler
          </span>

          <div className="flex-1 flex items-center justify-center">
            <p className="text-zinc-400 text-sm text-center">
              hizmetleri buraya sürükle ↓
            </p>
          </div>
        </div>

        {/* ─── RIGHT PANEL (45%) ─── */}
        <div
          className="flex-[0_0_100%] md:flex-[0_0_calc(45%-24px)] min-w-0 rounded-[24px] p-8 relative flex flex-col min-h-[420px] overflow-hidden"
          style={cardStyle}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[100px] rounded-t-[24px] pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
            }}
          />
          <div
            className="absolute inset-0 rounded-[24px] pointer-events-none"
            style={{ boxShadow: "inset 0 0 40px rgba(0,0,0,0.03)" }}
          />

          <h2 className="relative text-3xl font-bold text-zinc-700 mb-6">
            sepetim
          </h2>

          <div className="flex-1 flex items-center justify-center">
            <p className="text-zinc-400 text-sm">henüz hizmet eklenmedi</p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button
              className="relative flex-1 h-12 flex items-center justify-center rounded-[14px] text-sm font-medium text-zinc-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={btnStyle}
            >
              <div
                className="absolute bottom-2.5 left-1/2 -translate-x-1/2 h-[5px] w-[38%] rounded-full"
                style={{
                  background: "linear-gradient(90deg, #db2777, #ec4899)",
                  boxShadow: "0 2px 8px rgba(219,39,119,0.25)",
                }}
              />
              <svg className="w-4 h-4 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              sepeti onayla
            </button>

            <button
              className="relative flex-1 h-12 flex items-center justify-center rounded-[14px] text-sm font-medium text-zinc-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={btnStyle}
            >
              <div
                className="absolute bottom-2.5 right-3 h-[5px] w-[38%] rounded-full"
                style={{
                  background: "linear-gradient(90deg, #db2777, #ec4899)",
                  boxShadow: "0 2px 8px rgba(219,39,119,0.25)",
                }}
              />
              ödemeye geç
              <svg className="w-4 h-4 ml-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
