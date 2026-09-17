"use client";

import { useCallback, useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useTheme } from "./ThemeProvider";

/* ── Types ─────────────────────────────────────────────────────────── */

interface GradientPalette { from: string; to: string; accent?: string; }
interface TileColors { light: GradientPalette; dark: GradientPalette; }

export interface GalleryTile {
  id: string;
  title: string;
  description: string;
  image: string;
  radiusProfile: string;
  speed: number;
  width: number;
  colors: TileColors;
}

interface GalleryGridProps { tiles: GalleryTile[]; }

/* ── Row config ────────────────────────────────────────────────────── */

interface RowConfig {
  direction: "left" | "right";
  speed: number;       // px shifted per px of page scroll
  height: number;      // desktop card height (px)
  hMobile: number;     // mobile card height (px)
}

/** Visual configs — cycled across all rows */
const ROW_CONFIGS: RowConfig[] = [
  { direction: "left",  speed: 0.50, height: 300, hMobile: 210 },
  { direction: "right", speed: 0.38, height: 252, hMobile: 185 },
  { direction: "left",  speed: 0.62, height: 318, hMobile: 225 },
  { direction: "right", speed: 0.30, height: 244, hMobile: 170 },
  { direction: "left",  speed: 0.45, height: 282, hMobile: 198 },
  { direction: "right", speed: 0.56, height: 328, hMobile: 218 },
];

/** Total rows rendered — keeps the layered flow without overloading scroll. */
const NUM_ROWS = 6;

/* ── Constants ─────────────────────────────────────────────────────── */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const GAP_D = 14;   // desktop gap (px)
const GAP_M = 12;   // mobile gap (px)
const MW    = 0.68; // mobile card width scale

/* ── Helpers ───────────────────────────────────────────────────────── */

/**
 * Each row gets ALL tiles, rotated by a coprime-offset (5) so every row
 * starts with a different photo — giving genuine variety across rows.
 */
function buildRows(tiles: GalleryTile[], numRows: number): GalleryTile[][] {
  const n = tiles.length;
  return Array.from({ length: numRows }, (_, i) => {
    const offset = (i * 5) % n;
    return [...tiles.slice(offset), ...tiles.slice(0, offset)];
  });
}

/* ── Tile Card ─────────────────────────────────────────────────────── */

function TileCard({
  tile,
  width,
  height,
  mobile,
  isDark,
  onSelect,
}: {
  tile: GalleryTile;
  width: number;
  height: number;
  mobile: boolean;
  isDark: boolean;
  onSelect: (t: GalleryTile) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      aria-label={tile.title}
      onClick={() => onSelect(tile)}
      onMouseEnter={() => { if (!mobile) setHovered(true);  }}
      onMouseLeave={() => { if (!mobile) setHovered(false); }}
      className="gallery-tile relative flex-shrink-0 overflow-hidden"
      style={{
        width,
        height,
        borderRadius: tile.radiusProfile,
        border: isDark
          ? "1px solid rgba(255,255,255,0.12)"
          : "1px solid rgba(0,0,0,0.08)",
        transform: hovered ? "scale(1.05)" : "scale(1)",
        transition:
          "transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 350ms ease",
        boxShadow: hovered
          ? `0 0 0 2px rgba(244,114,182,0.55),
             0 22px 48px rgba(0,0,0,0.32),
             0 8px 18px rgba(0,0,0,0.18)`
          : isDark
            ? "0 4px 18px rgba(0,0,0,0.40)"
            : "0 4px 18px rgba(0,0,0,0.12)",
        zIndex: hovered ? 10 : 1,
        backgroundImage: `url('${tile.image}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Bottom vignette for title legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.10) 45%, transparent 100%)",
        }}
      />

      {/* Hover shimmer */}
      {!mobile && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.16), transparent 55%)",
            opacity: hovered ? 1 : 0,
          }}
        />
      )}

      {/* Title */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          padding: mobile ? "0 10px 10px" : "0 16px 12px",
          ...(mobile
            ? { opacity: 1 }
            : {
                opacity: hovered ? 1 : 0,
                transform: hovered ? "translateY(0)" : "translateY(10px)",
                transition:
                  "opacity 300ms ease, transform 300ms cubic-bezier(0.22,1,0.36,1)",
              }),
        }}
      >
        <p
          className="font-bold leading-snug text-white
                     drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]"
          style={{ fontSize: mobile ? "0.82rem" : "1rem" }}
        >
          {tile.title}
        </p>
      </div>
    </button>
  );
}

/* ── Infinite Gallery Row ──────────────────────────────────────────── */

function GalleryRow({
  tiles,
  config,
  mobile,
  isDark,
  reducedMotion,
  scrollY,
  onSelect,
  rowIndex,
}: {
  tiles: GalleryTile[];
  config: RowConfig;
  mobile: boolean;
  isDark: boolean;
  reducedMotion: boolean;
  scrollY: MotionValue<number>;
  onSelect: (t: GalleryTile) => void;
  rowIndex: number;
}) {
  const h   = mobile ? config.hMobile : config.height;
  const gap = mobile ? GAP_M : GAP_D;
  const wScale = mobile ? MW : 1;

  // Width of a single tile-set (one copy's worth of content)
  const setWidth = tiles.reduce(
    (sum, t) => sum + Math.round(t.width * wScale) + gap,
    0,
  );

  /**
   * Each row gets its own starting phase (a fraction of setWidth, unique
   * per row index) so rows never line up on the same photo in the same
   * column — without this every row sat at the exact same x and, with a
   * limited tile pool, duplicate images stacked directly on top of each
   * other.
   *
   * LEFT  rows move further left: -phase → -setWidth-phase, then wrap
   * RIGHT rows move back toward 0: -phase → 0, then wrap
   *
   * The modulo keeps the travel within one copy-period so the
   * wrap is visually seamless.
   */
  const phase = (rowIndex * setWidth * 0.37) % setWidth;

  const x = useTransform(scrollY, (sy) => {
    if (reducedMotion) return -setWidth - phase;
    const traveled = (sy * config.speed) % setWidth;
    return config.direction === "left"
      ? -(setWidth + phase + traveled)  // wraps every setWidth
      : -(phase + (setWidth - traveled)); // wraps every setWidth
  });

  // 3 copies → always enough content no matter scroll depth
  const looped = [...tiles, ...tiles, ...tiles];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: h + 16, padding: "8px 0" }}
    >
      <motion.div
        className="flex items-stretch"
        style={{ gap, width: "max-content", x, height: h }}
      >
        {looped.map((tile, i) => (
          <TileCard
            key={`${tile.id}-${i}`}
            tile={tile}
            width={Math.round(tile.width * wScale)}
            height={h}
            mobile={mobile}
            isDark={isDark}
            onSelect={onSelect}
          />
        ))}
      </motion.div>
    </div>
  );
}

/* ── Tile Popup ────────────────────────────────────────────────────── */

function TilePopup({
  tile,
  isDark,
  onClose,
}: {
  tile: GalleryTile;
  isDark: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <>
      <motion.button
        type="button"
        aria-label="Kapat"
        className="fixed inset-0 z-[72] bg-black/75 backdrop-blur-md"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        onClick={onClose}
      />

      <motion.div
        className="fixed inset-0 z-[72] flex items-center justify-center p-4 md:p-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.88, y: 32, opacity: 0 }}
          animate={{ scale: 1,    y: 0,  opacity: 1 }}
          exit={{    scale: 0.88, y: 32, opacity: 0 }}
          transition={{ type: "spring", stiffness: 290, damping: 26 }}
          className="relative w-full max-w-2xl"
          role="dialog" aria-modal="true" aria-label={tile.title}
        >
          <button
            type="button" onClick={onClose} aria-label="Kapat"
            className="absolute -top-11 right-0 z-10 grid h-9 w-9
                       place-items-center rounded-full border border-white/20
                       bg-white/10 text-white text-sm
                       hover:bg-white/20 transition-colors"
          >✕</button>

          {/* Photo */}
          <div
            className="relative overflow-hidden border border-white/15"
            style={{
              aspectRatio: "16 / 10",
              borderRadius: tile.radiusProfile,
              backgroundImage: `url('${tile.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.58) 0%, transparent 55%)",
              }}
            />
            <div className="absolute bottom-5 left-5">
              <p className="text-xl font-bold text-white drop-shadow-lg">
                {tile.title}
              </p>
            </div>
          </div>

          {/* Description */}
          <motion.div
            className={`mt-3 rounded-2xl border p-5 backdrop-blur-sm ${
              isDark
                ? "border-white/10 bg-black/42"
                : "border-black/8  bg-white/82"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.28, ease: EASE, delay: 0.09 }}
          >
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-white/62" : "text-black/58"
              }`}
            >
              {tile.description}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}

/* ── Main ──────────────────────────────────────────────────────────── */

export default function GalleryGrid({ tiles }: GalleryGridProps) {
  const { theme }    = useTheme();
  const isDark       = theme === "dark";
  const reducedMotion = useReducedMotion() ?? false;
  const [selected, setSelected] = useState<GalleryTile | null>(null);
  const close    = useCallback(() => setSelected(null), []);
  const rowTiles = buildRows(tiles, NUM_ROWS);
  const { scrollY } = useScroll();

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative flex flex-col">

        {/* Desktop */}
        <div className="hidden md:flex md:flex-col md:gap-[14px]">
          {Array.from({ length: NUM_ROWS }, (_, i) => (
            <GalleryRow
              key={i}
              tiles={rowTiles[i]}
              config={ROW_CONFIGS[i % ROW_CONFIGS.length]}
              mobile={false}
              isDark={isDark}
              reducedMotion={reducedMotion}
              scrollY={scrollY}
              onSelect={setSelected}
              rowIndex={i}
            />
          ))}
        </div>

        {/* Mobile */}
        <div className="flex flex-col gap-[12px] md:hidden pb-8">
          {Array.from({ length: NUM_ROWS }, (_, i) => (
            <GalleryRow
              key={i}
              tiles={rowTiles[i]}
              config={ROW_CONFIGS[i % ROW_CONFIGS.length]}
              mobile={true}
              isDark={isDark}
              reducedMotion={reducedMotion}
              scrollY={scrollY}
              onSelect={setSelected}
              rowIndex={i}
            />
          ))}
        </div>

        <AnimatePresence>
          {selected && (
            <TilePopup tile={selected} isDark={isDark} onClose={close} />
          )}
        </AnimatePresence>
      </section>
    </MotionConfig>
  );
}
