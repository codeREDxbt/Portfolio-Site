'use client';

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const STATUS_LINES = ['Tuning frequency', 'Locking signal', 'Signal acquired'];
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * "Signal acquisition" boot sequence on every page load, on a fixed timeline:
 * corner coordinates fade in, the codeRED wordmark reveals letter by letter,
 * a mono counter runs 000→100 alongside a progress hairline while status
 * readouts cycle (1.05s), the content drifts out (0.32s), then the panel
 * lifts like a curtain (0.62s). The hero's entrance animations stay paused
 * under html[data-booting] so they play as the curtain lifts.
 */
export function PageLoader() {
  const [phase, setPhase] = useState<'load' | 'dock' | 'done'>('load');
  const [statusIndex, setStatusIndex] = useState(0);
  const [dock, setDock] = useState<{ x: number; y: number; scale: number } | null>(null);
  const wordmarkRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  const count = useMotionValue(0);
  const counter = useTransform(count, (v) => String(Math.round(v)).padStart(3, '0'));
  const progress = useTransform(count, [0, 100], [0, 1]);

  // safety: never leave the boot flag behind
  useEffect(() => () => document.documentElement.removeAttribute('data-booting'), []);

  useEffect(() => {
    document.documentElement.dataset.booting = 'true';

    if (reduced) {
      const timer = window.setTimeout(() => {
        document.documentElement.removeAttribute('data-booting');
        window.dispatchEvent(new Event('codered:release'));
        setPhase('done');
      }, 250);
      return () => window.clearTimeout(timer);
    }

    const statusTimer = window.setInterval(
      () => setStatusIndex((i) => Math.min(i + 1, STATUS_LINES.length - 1)),
      400
    );
    const controls = animate(count, 100, {
      duration: 1.05,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => setPhase('dock'),
    });
    return () => {
      window.clearInterval(statusTimer);
      controls.stop();
    };
  }, [reduced, count]);

  // dock phase: the wordmark flies to the header logo, the panel lifts,
  // and the hero's paused entrance animations release underneath — one motion.
  useEffect(() => {
    if (phase !== 'dock') return;
    document.documentElement.removeAttribute('data-booting');
    window.dispatchEvent(new Event('codered:release'));
    const dockBeat = window.setTimeout(() => window.dispatchEvent(new Event('codered:dock')), 500);

    const frame = requestAnimationFrame(() => {
      const word = wordmarkRef.current;
      const logo = document.querySelector('header a');
      if (word && logo) {
        const wr = word.getBoundingClientRect();
        const lr = logo.getBoundingClientRect();
        setDock({
          x: lr.left + lr.width / 2 - (wr.left + wr.width / 2),
          y: lr.top + lr.height / 2 - (wr.top + wr.height / 2),
          scale: lr.height / wr.height,
        });
      }
    });

    const timer = window.setTimeout(() => setPhase('done'), 540);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(dockBeat);
      window.clearTimeout(timer);
    };
  }, [phase]);

  // hard safety: never keep the page frozen no matter what
  useEffect(() => {
    const failsafe = window.setTimeout(
      () => document.documentElement.removeAttribute('data-booting'),
      4000
    );
    return () => window.clearTimeout(failsafe);
  }, []);

  const letters = 'codeRED'.split('');

  return (
    <AnimatePresence>
      {phase !== 'done' ? (
        <>
          {/* lifting panel */}
          <motion.div
            key="panel"
            aria-hidden="true"
            className="fixed inset-0 z-[90] bg-background"
            initial={false}
            animate={phase === 'dock' && !reduced ? { y: '-100%' } : { y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.65, ease: EASE }}
          >
            <motion.div
              className="flex h-full flex-col justify-between px-6 pb-7 pt-6 md:px-12 md:pb-9 md:pt-8"
              animate={phase === 'dock' && !reduced ? { opacity: 0, y: -18 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              {/* corner marks */}
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                <motion.span
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                >
                  Vinayak Vashisth / Portfolio
                </motion.span>
                <motion.span
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.22, duration: 0.5 }}
                >
                  © 2026
                </motion.span>
              </div>

              {/* bottom: coordinates + counter */}
              <div className="flex items-end justify-between gap-8">
                <motion.p
                  className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  SIG/001 — 20.59° N / 78.96° E
                </motion.p>
                <motion.p
                  className="font-mono text-6xl font-medium leading-none tracking-[-0.04em] text-foreground md:text-8xl"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.18, duration: 0.5 }}
                >
                  {counter}
                </motion.p>
              </div>
            </motion.div>

            {/* progress hairline synced to the counter */}
            <motion.div
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-px w-full origin-left bg-red"
              style={{ scaleX: progress }}
            />
          </motion.div>

          {/* the wordmark docks into the header logo — independent of the lifting panel */}
          <motion.div
            key="wordmark"
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[95] flex flex-col items-center justify-center gap-7"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: EASE }}
          >
            <motion.p
              ref={wordmarkRef}
              className="text-[clamp(3.25rem,11vw,7.5rem)] font-medium leading-none tracking-[-0.05em] text-foreground"
              animate={
                dock && !reduced
                  ? { x: dock.x, y: dock.y, scale: dock.scale }
                  : { x: 0, y: 0, scale: 1 }
              }
              transition={{ duration: 0.5, ease: EASE }}
            >
              {letters.map((letter, i) => (
                <span key={i} className="inline-block overflow-hidden align-baseline">
                  <motion.span
                    className={`inline-block ${i >= 4 ? 'text-red' : ''}`}
                    initial={reduced ? false : { y: '115%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.12 + i * 0.045, duration: 0.65, ease: EASE }}
                  >
                    {letter}
                  </motion.span>
                </span>
              ))}
            </motion.p>

            {/* status readout under the wordmark — fades as the dock begins */}
            <motion.p
              key={statusIndex}
              className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={phase === 'dock' && !reduced ? { opacity: 0, y: -8 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              {STATUS_LINES[statusIndex]}
            </motion.p>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
