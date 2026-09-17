"use client";

import { useEffect } from "react";

const STUCK_SELECTOR =
  '[style*="opacity:0.16"],[style*="opacity: 0.16"],[style*="opacity:0.12"],[style*="opacity: 0.12"]';

/**
 * Fast scrolling can outrun the IntersectionObserver behind framer-motion's
 * whileInView reveals, leaving elements permanently stuck at their hidden,
 * dimmed opacity even once they've settled on screen. This sweeps the page
 * and completes any reveal that's clearly on screen but never got its trigger.
 */
export default function ScrollRevealRescue() {
  useEffect(() => {
    let raf = 0;

    const sweep = () => {
      const stuck = document.querySelectorAll<HTMLElement>(STUCK_SELECTOR);
      const vh = window.innerHeight;
      stuck.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const settled = rect.top < vh && rect.bottom > 0;
        if (!settled) return;
        el.style.transition =
          "opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)";
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sweep);
    };

    sweep();
    window.addEventListener("scroll", onScroll, { passive: true });
    const interval = window.setInterval(sweep, 400);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(interval);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
