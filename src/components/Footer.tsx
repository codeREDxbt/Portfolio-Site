'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { profile, socials } from '@/data/portfolio';
import { VisitorCount } from './VisitorCount';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const pageLinks = [
  { label: 'Index', href: '#index' },
  { label: 'Works', href: '#work' },
  { label: 'Stack', href: '#stack' },
  { label: 'Trail', href: '#journey' },
  { label: 'Contact', href: '#contact' },
];

const tickerItems = [
  'Open for select work',
  'Web3',
  'Full-stack',
  'Backend to pixel',
  'India / Remote',
  'Signal acquired',
];

function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
    });
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return <span>{time ?? '…'} IST</span>;
}

/**
 * Curtain-reveal footer: fixed behind every layer (see page.tsx), exposed
 * once the pinned contact layer lifts off it. Measures its own height into
 * --footer-h so the spacer always matches. On reveal: red hairline sweep,
 * wordmark + content stagger in, and the mono ticker keeps it alive.
 */
export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const sync = () =>
      document.documentElement.style.setProperty('--footer-h', `${el.offsetHeight}px`);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const spacer = document.querySelector('[data-footer-spacer]');
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

  const item = {
    hidden: { opacity: 0, y: reduced ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <footer
      ref={footerRef}
      data-revealed={revealed}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-0 bg-background"
    >
      {/* red hairline sweep across the top edge on reveal */}
      <motion.div
        aria-hidden="true"
        className="h-px w-full origin-left bg-red"
        initial={reduced ? false : { scaleX: 0 }}
        animate={revealed ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      />

      {/* mono ticker — slow, quiet, editorial (desktop only; saves mobile height) */}
      <div aria-hidden="true" className="hidden overflow-hidden border-b border-line sm:block">
        <div className="marquee-track py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-dim">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex shrink-0 items-center">
              {tickerItems.map((tickerItem) => (
                <span key={tickerItem} className="mx-6 whitespace-nowrap">
                  {tickerItem} <span className="text-red">{'//'}</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        inert={!revealed}
        className={`px-6 pb-6 pt-6 md:px-16 md:pb-8 md:pt-8 lg:px-24 ${revealed ? 'pointer-events-auto' : ''}`}
        initial="hidden"
        animate={revealed ? 'show' : 'hidden'}
        variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
      >
        <div className="mx-auto max-w-7xl">
          {/* mega wordmark with per-letter hover lift */}
          <motion.p
            role="img"
            aria-label="codeRED"
            variants={{
              hidden: { opacity: 0, y: reduced ? 0 : 32 },
              show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
            }}
            className="select-none text-[clamp(2.5rem,13vw,11rem)] font-medium leading-[0.85] tracking-[-0.06em]"
          >
            {'codeRED'.split('').map((letter, i) => (
              <span key={i} aria-hidden="true" className={`wl ${i >= 4 ? 'text-red' : ''}`}>
                {letter}
              </span>
            ))}
            <span className="signal-dot" aria-hidden="true" />
          </motion.p>

          {/* direct line CTA */}
          <motion.a
            variants={item}
            href={`mailto:${profile.email}`}
            className="group mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-t border-line pt-6 md:mt-8 md:pt-8"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
              Direct line
            </span>
            <span className="text-2xl font-medium tracking-[-0.03em] transition-colors group-hover:text-red md:text-4xl">
              {profile.email}
            </span>
            <span
              aria-hidden="true"
              className="text-2xl text-red transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 md:text-4xl"
            >
              ↗
            </span>
          </motion.a>

          {/* columns */}
          <div className="mt-6 grid grid-cols-2 gap-5 border-t border-line pt-6 text-sm md:mt-8 md:gap-6 md:pt-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <motion.p variants={item} className="max-w-[34ch] leading-7 text-muted">
              Full-stack engineer building secure, expressive products for the web. Backend to
              pixel.
            </motion.p>

            <motion.nav variants={item} aria-label="Pages" className="flex flex-col gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                Pages
              </span>
              {pageLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="w-fit text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </motion.nav>

            <motion.nav variants={item} aria-label="Elsewhere" className="flex flex-col gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                Elsewhere
              </span>
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit text-muted transition-colors hover:text-foreground"
                >
                  {social.label} ↗
                </a>
              ))}
              <a
                href={`mailto:${profile.email}`}
                className="w-fit text-muted transition-colors hover:text-foreground"
              >
                Email ↗
              </a>
            </motion.nav>

            <motion.div variants={item} className="flex flex-col gap-3 md:items-end md:text-right">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                Signal
              </span>
              <span className="text-muted">{profile.location}</span>
              <span className="font-mono text-xs text-muted">
                <LocalTime />
              </span>
              <span className="font-mono text-xs text-muted">
                <VisitorCount /> visits
              </span>
              <span className="text-muted">© {new Date().getFullYear()} {profile.handle}</span>
            </motion.div>
          </div>

          {/* bottom row */}
          <motion.div
            variants={item}
            className="mt-6 flex items-center justify-between border-t border-line pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-dim md:mt-8 md:pt-6"
          >
            <span>Designed and built by {profile.handle}</span>
            <a href="#index" className="transition-colors hover:text-red">
              Back to top ↑
            </a>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
}
