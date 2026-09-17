"use client";

import { useEffect, useRef } from "react";

interface FirstScrollSnapProps {
  targetId: string;
  minWidth?: number;
}

export default function FirstScrollSnap({
  targetId,
  minWidth = 768,
}: FirstScrollSnapProps) {
  const handledRef = useRef(false);
  const animatingRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(`(min-width: ${minWidth}px)`);
    if (!mediaQuery.matches) return;

    const getTargetY = () => {
      const target = document.getElementById(targetId);
      if (!target) return null;

      const nav = document.querySelector<HTMLElement>("[data-site-nav]");
      const navOffset = nav
        ? Math.ceil(nav.getBoundingClientRect().top + nav.getBoundingClientRect().height + 24)
        : 112;

      return Math.max(
        0,
        window.scrollY + target.getBoundingClientRect().top - navOffset,
      );
    };

    const runSnap = () => {
      const targetY = getTargetY();
      if (targetY === null) return;

      handledRef.current = true;
      animatingRef.current = true;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      window.scrollTo({
        top: targetY,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });

      window.setTimeout(() => {
        animatingRef.current = false;
      }, prefersReducedMotion ? 0 : 700);
    };

    const handleWheel = (event: WheelEvent) => {
      if (handledRef.current || animatingRef.current) return;
      if (window.scrollY > 8) {
        handledRef.current = true;
        return;
      }
      if (event.deltaY <= 12 || event.ctrlKey) return;

      event.preventDefault();
      runSnap();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (handledRef.current || animatingRef.current) return;
      if (window.scrollY > 8) {
        handledRef.current = true;
        return;
      }

      if (!["ArrowDown", "PageDown", " "].includes(event.key)) return;

      event.preventDefault();
      runSnap();
    };

    const handleScroll = () => {
      if (window.scrollY > 8 && !animatingRef.current) {
        handledRef.current = true;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [minWidth, targetId]);

  return null;
}
