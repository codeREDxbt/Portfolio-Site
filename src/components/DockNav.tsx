'use client';

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { CommandMenu } from './CommandMenu';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Floating dock pill at bottom-center — the visible trigger for the ⌘K
 * command palette. Hides on scroll down (opacity only, so its hit target
 * never moves), returns on scroll up, and steps aside while the palette owns
 * focus.
 */
export function DockNav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const closeMenu = useCallback(() => setOpen(false), []);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (open) return;
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 160);
  });

  // ⌘K / Ctrl+K — the engineer's shortcut
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <CommandMenu open={open} onClose={closeMenu} />
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center">
        <motion.div
          className="pointer-events-auto"
          animate={(hidden || open) && !reduced ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.25, ease: EASE }}
          style={{ pointerEvents: hidden || open ? 'none' : 'auto' }}
        >
          <button
            type="button"
            aria-expanded={open}
            aria-controls="command-menu"
            onClick={() => setOpen((value) => !value)}
            className="flex items-center gap-2.5 rounded-full border border-line bg-background/80 px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-foreground backdrop-blur-md transition-colors hover:border-red"
          >
            <span className="signal-dot" style={{ width: 7, height: 7 }} aria-hidden="true" />
            {open ? 'Close' : 'Menu'}
            <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[9px] normal-case tracking-normal text-dim sm:inline">
              ⌘K
            </kbd>
          </button>
        </motion.div>
      </div>
    </>
  );
}
