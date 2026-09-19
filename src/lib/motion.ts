import { useEffect, useState, type RefObject } from "react";

/* Hareket sistemi — globals.css'teki --ease-* / --dur-* değişkenlerinin
   JS karşılığı. İki taraf aynı sayıları kullansın diye tek yerde duruyor;
   CSS tarafını değiştirirsen burayı da değiştir. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_EXIT: [number, number, number, number] = [0.55, 0, 1, 0.45];

/** saniye cinsinden — framer-motion süreleri saniye bekliyor */
export const DUR = {
  1: 0.16, // renk, opaklık
  2: 0.26, // buton, ikon
  3: 0.42, // kart hareketi
  4: 0.62, // bölüm girişi
  5: 0.9,  // hero girişi
} as const;

/** kardeş öğeler sırayla girerken tek ritim (globals: --stagger) */
export const STAGGER = 0.07;

export const FONT = { fontFamily: 'var(--font-jost), sans-serif' } as const;

export const revealVariants = {
  hidden: { opacity: 0.16, y: 24, scale: 0.99 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DUR[4], ease: EASE, delay },
  }),
};

export const revealViewport = {
  once: true,
  amount: 0.01,
  margin: "15% 0px 15% 0px",
} as const;

/**
 * Drop-in replacement for framer-motion's `useInView`. Fast scrolling can outrun
 * the IntersectionObserver callback and never report an element as intersecting,
 * leaving scroll-reveal content (fade-ins, counters) stuck forever. This backs
 * the observer with a rect-based poll (on scroll + interval) so the reveal always
 * eventually fires once the element has actually settled on screen.
 */
export function useReliableInView(
  ref: RefObject<Element | null>,
  options?: { margin?: string; amount?: number },
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const node = ref.current;
    if (!node) return;

    const checkRect = () => {
      const rect = node.getBoundingClientRect();
      const buffer = window.innerHeight * 0.5;
      if (rect.top < window.innerHeight + buffer && rect.bottom > -buffer) {
        setInView(true);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setInView(true);
      },
      { rootMargin: options?.margin ?? "15% 0px 15% 0px", threshold: options?.amount ?? 0.01 },
    );
    observer.observe(node);

    checkRect();
    window.addEventListener("scroll", checkRect, { passive: true });
    const interval = window.setInterval(checkRect, 300);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkRect);
      window.clearInterval(interval);
    };
  }, [ref, inView, options?.margin, options?.amount]);

  return inView;
}
