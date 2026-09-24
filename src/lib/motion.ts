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
 * framer-motion `useInView` yerine. IntersectionObserver'a ek olarak kaydırma
 * durduğunda tek bir konum kontrolü yapar; çok hızlı kaydırmada gözlemci
 * tetiklenmese bile sayaç/video gibi içerik sonunda başlar. Sürekli
 * zamanlayıcı kullanmaz; görünür olduktan sonra tüm dinleyiciler kalkar.
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

    let timer = 0;
    const checkRect = () => {
      const rect = node.getBoundingClientRect();
      const buffer = window.innerHeight * 0.5;
      if (rect.top < window.innerHeight + buffer && rect.bottom > -buffer) {
        setInView(true);
      }
    };
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(checkRect, 150);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setInView(true);
      },
      { rootMargin: options?.margin ?? "15% 0px 15% 0px", threshold: options?.amount ?? 0.01 },
    );
    observer.observe(node);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [ref, inView, options?.margin, options?.amount]);

  return inView;
}
