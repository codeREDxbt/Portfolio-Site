"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState, useSyncExternalStore } from "react";
import type { Project } from "@/data/portfolio";
import { scrollToOffset } from "@/lib/scroll";
import { NoiseCanvas } from "./NoiseCanvas";
import { TunerStation, TunerStationListItem } from "./TunerStation";

function useFinePointer() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const query = window.matchMedia("(pointer: fine)");
      query.addEventListener("change", onStoreChange);
      return () => query.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(pointer: fine)").matches,
    () => false
  );
}

function useWideViewport() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const query = window.matchMedia("(min-width: 1024px)");
      query.addEventListener("change", onStoreChange);
      return () => query.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => true
  );
}

/**
 * LOCK-ON — Featured Work as a receiver. One sticky stage; scroll tunes a
 * needle across four stations. Stations hold with a hard lock; between them
 * is dead air — analog static you can wipe with the cursor.
 * Falls back to a plain list on mobile / coarse pointers / reduced motion.
 */
export function WorkTuner({ projects }: { projects: Project[] }) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const wide = useWideViewport();
  const interactive = !reduced && fine && wide;

  const total = projects.length;
  const [station, setStation] = useState(0);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(total - 1, Math.max(0, Math.floor(p * total)));
    setStation((current) => (current === next ? current : next));
  });

  // Needle: follows the scroll through transitions, but inside a station's
  // hold zone the target snaps to the exact detent — the spring overshoots
  // and wobbles INTO the dot, then rests pixel-perfectly on it.
  const needleTarget = useTransform(scrollYProgress, (p) => {
    const scaled = p * total;
    const segment = Math.min(total - 1, Math.floor(scaled));
    const phase = scaled - segment;
    if (phase >= 0.25 && phase <= 0.8) return (segment + 0.5) / total;
    return p;
  });
  const needle = useSpring(needleTarget, { stiffness: 180, damping: 22, mass: 0.6 });

  // Ruler geometry — one shared scale: station i's detent sits at
  // (i + 0.5) / total of the band, needle rides the identity scale.
  const bandStart = 0.5 / total;
  const pct = (fraction: number) => `${(fraction * 100).toFixed(3)}%`;
  const needleTop = useTransform(needle, [0, 1], ["0%", "100%"]);

  const freq = useTransform(scrollYProgress, (p) => (88 + p * 20).toFixed(1));
  const signal = useTransform(scrollYProgress, (p) => {
    const t = p * total;
    const localPhase = t - Math.floor(t);
    if (localPhase < 0.3) return 1 - Math.pow(1 - localPhase / 0.3, 2.2);
    if (localPhase > 0.7) return 1 - Math.pow((localPhase - 0.7) / 0.3, 1.6);
    return 1;
  });
  const signalBars = useTransform(signal, (value) => {
    const filled = Math.round(value * 10);
    return "▓".repeat(filled) + "░".repeat(10 - filled);
  });

  const deadAir = useTransform(signal, (value) => 1 - value);
  const wipeX = useMotionValue(-400);
  const wipeY = useMotionValue(-400);
  // the pointer wipes a clear disc through the static — fog off glass
  const wipeMask = useMotionTemplate`radial-gradient(circle 150px at ${wipeX}px ${wipeY}px, transparent 0 110px, black 175px)`;

  const seek = (index: number) => {
    const runway = runwayRef.current;
    if (!runway) return;
    const top = runway.getBoundingClientRect().top + window.scrollY;
    const scrollable = runway.offsetHeight - window.innerHeight;
    scrollToOffset(top + ((index + 0.5) / total) * scrollable);
  };

  if (!interactive) {
    return (
      <div>
        {projects.map((project) => (
          <TunerStationListItem key={project.id} project={project} />
        ))}
      </div>
    );
  }

  return (
    <div ref={runwayRef} style={{ height: `${total * 120}vh` }} className="relative">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[40px_1fr] gap-6 px-6 md:px-16 lg:grid-cols-[56px_1fr] lg:gap-10 lg:px-24">
          {/* frequency ruler — dots, track, and needle share one scale */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute left-1/2 w-px -translate-x-1/2 bg-line"
              style={{ top: pct(bandStart), bottom: pct(bandStart) }}
            />
            <motion.span
              aria-hidden="true"
              className="absolute left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red bg-background shadow-[0_0_12px_var(--red)]"
              style={{ top: needleTop }}
            />
            {projects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                onClick={() => seek(index)}
                aria-label={`Tune to ${project.title}`}
                className="group absolute left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{ top: pct((index + 0.5) / total) }}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full border transition-colors ${
                    index === station
                      ? "border-red bg-red"
                      : "border-dim bg-background group-hover:border-red"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* receiver stage */}
          <div
            className="relative min-h-[70vh]"
            onPointerMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              wipeX.set(event.clientX - rect.left);
              wipeY.set(event.clientY - rect.top);
            }}
          >
            <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
              <span>
                CH 0{station + 1} · <motion.span>{freq}</motion.span> MHz
              </span>
              <span>
                SIGNAL <motion.span className="text-red">{signalBars}</motion.span>
              </span>
            </div>

            <div className="relative h-[62vh]">
              {projects.map((project, index) => (
                <TunerStation
                  key={project.id}
                  project={project}
                  index={index}
                  total={total}
                  progress={scrollYProgress}
                  active={index === station}
                  reduced={false}
                />
              ))}

              {/* dead-air static — cursor wipes a clear disc through it */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-xl"
                style={{ opacity: deadAir, WebkitMaskImage: wipeMask, maskImage: wipeMask }}
              >
                <NoiseCanvas intensity={deadAir} />
              </motion.div>
            </div>

            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
              Scroll to tune · click a node to jump
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

