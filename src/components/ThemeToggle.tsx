"use client";

import { useId } from "react";
import { useTheme } from "./ThemeProvider";

const TRANSITION = "500ms cubic-bezier(0.22, 1, 0.36, 1)";

const rays = [
  { x1: 12, y1: 1, x2: 12, y2: 3 },
  { x1: 12, y1: 21, x2: 12, y2: 23 },
  { x1: 4.22, y1: 4.22, x2: 5.64, y2: 5.64 },
  { x1: 18.36, y1: 18.36, x2: 19.78, y2: 19.78 },
  { x1: 1, y1: 12, x2: 3, y2: 12 },
  { x1: 21, y1: 12, x2: 23, y2: 12 },
  { x1: 4.22, y1: 19.78, x2: 5.64, y2: 18.36 },
  { x1: 18.36, y1: 5.64, x2: 19.78, y2: 4.22 },
];

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const maskId = useId();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Gündüz moduna geç" : "Gece moduna geç"}
      className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95"
      style={{
        background: isDark
          ? "rgba(255,255,255,0.1)"
          : "rgba(255,255,255,0.25)",
        backdropFilter: "blur(8px)",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-4 h-4"
        style={{ transition: `transform ${TRANSITION}`, transform: isDark ? "rotate(40deg)" : "rotate(90deg)" }}
      >
        <mask id={maskId}>
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <circle
            cx={isDark ? 17 : 33}
            cy="9"
            r="8"
            fill="black"
            style={{ transition: `cx ${TRANSITION}` }}
          />
        </mask>

        {/* Merkez daire — güneşte küçük, ayda büyük */}
        <circle
          cx="12"
          cy="12"
          r={isDark ? 9 : 5}
          fill="white"
          mask={`url(#${maskId})`}
          style={{ transition: `r ${TRANSITION}` }}
        />

        {/* Işınlar — güneşte görünür, ayda kaybolur */}
        <g
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            transition: `opacity ${TRANSITION}, transform ${TRANSITION}`,
            opacity: isDark ? 0 : 1,
            transform: isDark ? "scale(0)" : "scale(1)",
            transformOrigin: "center",
          }}
        >
          {rays.map((ray, i) => (
            <line key={i} x1={ray.x1} y1={ray.y1} x2={ray.x2} y2={ray.y2} />
          ))}
        </g>
      </svg>
    </button>
  );
}
