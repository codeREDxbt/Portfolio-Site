'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useMotionValueEvent, useScroll } from 'motion/react';
import { profile } from '@/data/portfolio';
import { BookingModal } from './BookingModal';

/** true on the client after hydration, false on the server — portal guard. */
const useMounted = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

/**
 * Pinned contact layer — the middle layer of the page's closing stack.
 * The curtain (sheet with hero → trail) lifts off it; once fully revealed,
 * THIS layer lifts in turn, uncovering the pinned footer beneath it. The
 * lift is scroll-coupled over the footer spacer's window, so the footer's
 * reveal keeps its exact pixel-accurate feel.
 *
 * Measures itself into --contact-h so the spacer in page.tsx always matches;
 * min-h-screen keeps the reveal cinematic and makes the spacer a reliable
 * #contact anchor (a fixed element can't be scrolled to). The booking modal
 * portals to <body>: inside this fixed stacking context it would render
 * beneath the page curtain.
 */
export function Contact() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const mounted = useMounted();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const lift = useMotionValue(0);
  const liftWindow = useRef({ start: 0, length: 0 });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const sync = () =>
      document.documentElement.style.setProperty('--contact-h', `${el.offsetHeight}px`);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const spacer = document.querySelector('[data-contact-spacer]');
    if (!spacer) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.02 }
    );
    observer.observe(spacer);
    return () => observer.disconnect();
  }, []);

  // the lift window: while the footer's scroll room passes through the
  // viewport, this layer slides up by exactly the footer's height
  useEffect(() => {
    const spacer = document.querySelector<HTMLElement>('[data-footer-spacer]');
    if (!spacer) return;
    const measure = () => {
      liftWindow.current = {
        start: spacer.getBoundingClientRect().top + window.scrollY - window.innerHeight,
        length: spacer.offsetHeight,
      };
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(spacer);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const { start, length } = liftWindow.current;
    if (length <= 0) return;
    const progress = Math.min(Math.max((latest - start) / length, 0), 1);
    lift.set(-progress * length);
  });

  const panel = `motion-safe:transition-all motion-safe:duration-700 ${
    revealed ? 'opacity-100 motion-safe:translate-y-0' : 'opacity-0 motion-safe:translate-y-6'
  }`;

  return (
    <motion.section
      ref={sectionRef}
      data-revealed={revealed}
      aria-label="Contact: start a conversation"
      style={{ y: lift }}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex min-h-screen flex-col justify-center border-t border-line bg-background px-6 py-24 md:px-16 lg:px-24"
    >
      <div
        inert={!revealed}
        className={`mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1fr_420px] lg:items-end ${
          revealed ? 'pointer-events-auto' : ''
        }`}
      >
        <div className={panel}>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-red">
            Contact / Start a conversation
          </p>
          <h2 className="mt-6 max-w-3xl text-6xl font-medium leading-[0.95] tracking-[-0.07em] md:text-8xl">
            Have something worth building?
          </h2>
        </div>
        <div className={`${panel} motion-safe:delay-100`}>
          <p className="text-base leading-8 text-muted">
            Tell me about the product, the problem, and where it is stuck. Contracts, backends,
            interfaces: I build all of it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
            >
              Book a call ↗
            </button>
            <a
              href={`mailto:${profile.email}`}
              className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors hover:border-red hover:text-red"
            >
              {profile.email}
            </a>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors hover:border-red hover:text-red"
            >
              Resume ↗
            </a>
          </div>
        </div>
      </div>
      {mounted
        ? createPortal(
            <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />,
            document.body
          )
        : null}
    </motion.section>
  );
}
