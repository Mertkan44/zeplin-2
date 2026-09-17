"use client";

import { useEffect } from "react";

export default function HomeScrollReset() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;

    const previousScrollRestoration = "scrollRestoration" in window.history
      ? window.history.scrollRestoration
      : null;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const reset = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    reset();
    const raf = window.requestAnimationFrame(reset);
    const timer = window.setTimeout(reset, 120);

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && !window.location.hash) reset();
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.removeEventListener("pageshow", handlePageShow);
      if (previousScrollRestoration && "scrollRestoration" in window.history) {
        window.history.scrollRestoration = previousScrollRestoration;
      }
    };
  }, []);

  return null;
}
