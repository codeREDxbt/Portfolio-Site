"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useRef, useSyncExternalStore, type MouseEvent } from "react";
import type { Project } from "@/data/portfolio";

function useFinePointer() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const query = window.matchMedia("(pointer: fine)");
      query.addEventListener("change", onStoreChange);
      return () => query.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(pointer: fine)").matches,
    () => false,
  );
}

/**
 * Project media with a cursor-tracking red "View project" chip and
 * subtle pointer parallax. Falls back to a static corner chip on
 * coarse pointers and for reduced-motion users.
 */
export function ProjectMedia({ project, fill = false }: { project: Project; fill?: boolean }) {
  const href = project.liveUrl ?? project.repoUrl;
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();

  // chip position (px, relative to media box)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  // normalized pointer position for parallax (-0.5..0.5)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hover = useMotionValue(0);

  const chipX = useSpring(mx, { stiffness: 420, damping: 34, mass: 0.5 });
  const chipY = useSpring(my, { stiffness: 420, damping: 34, mass: 0.5 });
  const parX = useSpring(px, { stiffness: 120, damping: 20 });
  const parY = useSpring(py, { stiffness: 120, damping: 20 });
  const hoverSpring = useSpring(hover, { stiffness: 280, damping: 26 });

  const imgX = useTransform(parX, [-0.5, 0.5], [-10, 10]);
  const imgY = useTransform(parY, [-0.5, 0.5], [-8, 8]);
  const mediaScale = useTransform(hoverSpring, [0, 1], [1, 1.045]);
  const chipScale = useTransform(hoverSpring, [0, 1], [0.6, 1]);

  const interactive = fine && !reduced;

  const handleMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    mx.set(x);
    my.set(y);
    px.set(x / rect.width - 0.5);
    py.set(y / rect.height - 0.5);
    hover.set(1);
  };

  const handleLeave = () => {
    hover.set(0);
    px.set(0);
    py.set(0);
  };

  const handleFocus = () => {
    const el = ref.current;
    if (!el) return;
    mx.set(el.offsetWidth / 2);
    my.set(el.offsetHeight / 2);
    hover.set(1);
  };

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`project-media group/media relative block w-full overflow-hidden bg-surface ${
        fill ? "h-full" : "aspect-[16/10] md:aspect-[21/9]"
      }`}
      aria-label={`View ${project.title}`}
      onMouseMove={interactive ? handleMove : undefined}
      onMouseLeave={interactive ? handleLeave : undefined}
      onFocus={interactive ? handleFocus : undefined}
      onBlur={interactive ? handleLeave : undefined}
    >
      <motion.div
        className="absolute inset-0"
        style={interactive ? { x: imgX, y: imgY, scale: mediaScale } : undefined}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} interface preview`}
            fill
            sizes="(min-width: 768px) 44vw, 100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-surface">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-red/35" />
            <div className="absolute right-14 top-16 h-44 w-44 rounded-full border border-red/55" />
            <div className="absolute right-28 top-28 h-20 w-20 rounded-full bg-red/15 blur-sm" />
            <div className="signal-line absolute bottom-24 left-8 h-px w-72 bg-red/70" />
            <p className="absolute bottom-7 left-8 font-mono text-[10px] uppercase tracking-[0.2em] text-red">
              Private / Multi-chain / Payments
            </p>
          </div>
        )}
      </motion.div>

      {interactive ? (
        <motion.span
          aria-hidden="true"
          style={{ x: chipX, y: chipY, opacity: hoverSpring, scale: chipScale }}
          className="pointer-events-none absolute left-0 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-background shadow-lg shadow-red/30"
        >
          View project ↗
        </motion.span>
      ) : (
        <span className="project-view absolute bottom-4 right-4 rounded-full bg-background/80 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground backdrop-blur-md">
          View project ↗
        </span>
      )}
    </a>
  );
}
