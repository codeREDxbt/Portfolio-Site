"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

function SignalFallback() {
  return (
    <div aria-hidden="true" className="relative h-[280px] w-full md:h-[520px]">
      <div className="absolute right-0 top-10 h-64 w-64 rounded-full border border-red/30" />
      <div className="absolute right-12 top-24 h-40 w-40 rounded-full border border-red/45" />
      <div className="absolute right-24 top-36 h-16 w-16 rounded-full bg-red/15 blur-sm" />
      <div className="signal-line absolute right-4 top-44 h-px w-72 bg-red/60" />
    </div>
  );
}

const SignalScene = dynamic(() => import("./three/SignalScene"), {
  ssr: false,
  loading: SignalFallback,
});

export function HeroVisual() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const timer = window.setTimeout(() => setEnabled(true), 250);
    return () => window.clearTimeout(timer);
  }, []);

  return enabled ? <SignalScene /> : <SignalFallback />;
}
