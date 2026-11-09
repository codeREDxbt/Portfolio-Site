"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";

function SignalFallback() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute -right-28 top-[20%] h-[26rem] w-[26rem] rounded-full border border-red/25" />
      <div className="absolute -right-10 top-[34%] h-60 w-60 rounded-full border border-red/40" />
      <div className="absolute right-20 top-[44%] h-24 w-24 rounded-full bg-red/15 blur-md" />
      <div className="signal-line absolute right-8 top-[52%] h-px w-64 bg-red/60" />
    </div>
  );
}

const RibbonField = dynamic(() => import("./three/RibbonField"), {
  ssr: false,
  loading: SignalFallback,
});

export function HeroVisual() {
  const [enabled, setEnabled] = useState(false);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  // the field drifts down and fades as the hero scrolls away
  const opacity = useTransform(scrollY, [0, 600], [1, 0.35]);
  const y = useTransform(scrollY, [0, 600], [0, 80]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reducedMotion || coarse) return;

    const timer = window.setTimeout(() => setEnabled(true), 250);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      style={reduced ? undefined : { opacity, y }}
    >
      {enabled ? <RibbonField /> : <SignalFallback />}
    </motion.div>
  );
}
