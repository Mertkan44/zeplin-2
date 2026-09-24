"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export type LightboxItem = {
  src: string;
  alt: string;
  /** Video öğeleri için poster görseli */
  poster?: string;
};

export const isVideo = (src: string) => src.endsWith(".mp4");

/** `/videos/ritim-bitti-web.mp4` → `/videos/posters/ritim-bitti-poster.jpg` */
export function posterFor(src: string) {
  const name = src.split("/").pop()!.replace(/(-web)?\.mp4$/, "");
  return `/videos/posters/${name}-poster.jpg`;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';

/**
 * Erişilebilir tam ekran medya görüntüleyici.
 * Backdrop tıklaması, Escape, ok tuşları, odak kilidi ve kapanışta odağı geri verme.
 */
export default function MediaLightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const open = index !== null;
  const item = open ? items[index] : null;
  const many = items.length > 1;

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndexChange((index + delta + items.length) % items.length);
    },
    [index, items.length, onIndexChange],
  );

  // Açılışta odağı panele taşı, kapanışta açan öğeye geri ver, arka planı kilitle
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      returnFocusRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight" && many) {
        go(1);
      } else if (e.key === "ArrowLeft" && many) {
        go(-1);
      } else if (e.key === "Tab" && panelRef.current) {
        const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, many, go, onClose]);

  if (!item) return null;

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-10"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Kapat"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white md:right-6 md:top-6"
      >
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M3 3l10 10M13 3L3 13" />
        </svg>
      </button>

      {many && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Önceki"
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white md:left-6"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 3L5 8l5 5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Sonraki"
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white md:right-6"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </button>
        </>
      )}

      {isVideo(item.src) ? (
        <video
          key={item.src}
          src={item.src}
          poster={item.poster}
          controls
          autoPlay
          playsInline
          className="h-full max-h-[88svh] w-auto max-w-full rounded-xl bg-black object-contain"
          style={{ aspectRatio: "9 / 16" }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- orijinal kadrajı ve oranı korumak için doğal boyut
        <img
          key={item.src}
          src={item.src}
          alt={item.alt}
          className="max-h-full max-w-full rounded-xl object-contain"
        />
      )}

      {many && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm tabular-nums text-white/70" aria-live="polite">
          {index! + 1} / {items.length}
        </p>
      )}
    </div>,
    document.body,
  );
}
