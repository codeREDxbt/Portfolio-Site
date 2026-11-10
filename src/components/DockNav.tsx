'use client';

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDecode } from '@/lib/use-decode';
import { SiteMenu } from './SiteMenu';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const MAGNET_RANGE = 90;
const MAGNET_PULL = 6;

/**
 * Floating transmit key at bottom-center — the trigger for the full-screen
 * SiteMenu. Hardware-key treatment: magnetic pull toward the cursor, tactile
 * press dip, a radar dot that sweeps while hovered or open, and a label that
 * decode-scrambles between MENU and CLOSE. Hides on scroll down (opacity
 * only, so its hit target never moves), returns on scroll up, and steps
 * aside while the menu owns focus.
 */
export function DockNav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const closeMenu = useCallback(() => setOpen(false), []);

  const wrapRef = useRef<HTMLDivElement>(null);
  const magnetX = useSpring(0, { stiffness: 260, damping: 18, mass: 0.6 });
  const magnetY = useSpring(0, { stiffness: 260, damping: 18, mass: 0.6 });

  const label = useDecode(open ? 'CLOSE' : 'MENU', true, reduced ?? false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (open) return;
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 160);
  });

  // magnetic field — fine pointers + full motion only
  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (event: PointerEvent) => {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect) return;
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);
      if (distance < MAGNET_RANGE && distance > 0) {
        const pull = (1 - distance / MAGNET_RANGE) * MAGNET_PULL;
        magnetX.set((dx / distance) * pull);
        magnetY.set((dy / distance) * pull);
      } else {
        magnetX.set(0);
        magnetY.set(0);
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced, magnetX, magnetY]);

  // the key never drifts while hidden or while the menu owns the screen
  useEffect(() => {
    if (hidden || open) {
      magnetX.set(0);
      magnetY.set(0);
    }
  }, [hidden, open, magnetX, magnetY]);

  return (
    <>
      <SiteMenu open={open} onClose={closeMenu} />
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center">
        <motion.div
          ref={wrapRef}
          className="pointer-events-auto"
          animate={(hidden || open) && !reduced ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.25, ease: EASE }}
          style={{ pointerEvents: hidden || open ? 'none' : 'auto', x: magnetX, y: magnetY }}
        >
          <motion.button
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
            whileTap={reduced ? undefined : { scale: 0.96, y: 1 }}
            className="tx-key flex items-center gap-3 rounded-full border border-line bg-background/80 py-3 pl-4 pr-5 font-mono text-xs uppercase tracking-[0.18em] text-foreground backdrop-blur-md transition-colors hover:border-red/60"
          >
            <span className="tx-radar" aria-hidden="true">
              <span className="tx-radar-sweep" />
            </span>
            <span className="inline-block min-w-[5ch] text-left">{label}</span>
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
