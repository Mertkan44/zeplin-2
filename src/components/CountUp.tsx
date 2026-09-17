"use client";

import { useState, useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { useReliableInView } from "@/lib/motion";

export function CountUp({
  value,
  suffix,
  delay,
}: {
  value: number;
  suffix: string;
  delay: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useReliableInView(ref);
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 50, damping: 20, mass: 1 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => motionVal.set(value), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, value, delay, motionVal]);

  useEffect(() => {
    const unsub = spring.on("change", (v: number) => {
      setDisplay(Math.round(v).toString());
    });
    return unsub;
  }, [spring]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}
