'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { profile, socials } from '@/data/portfolio';
import { lockPageScroll, navigateToElement } from '@/lib/scroll';

const links = [
  { label: 'Index', href: '#index' },
  { label: 'Works', href: '#work' },
  { label: 'Stack', href: '#stack' },
  { label: 'Trail', href: '#journey' },
  { label: 'Resume', href: profile.resumeUrl, external: true },
  { label: 'Get in touch', href: '#contact' },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen "lamp" menu — warm glow + filament flicker stagger. Rendered as
 * a true modal: portaled, background inert, page scroll locked, Tab trapped,
 * Escape/backdrop close, focus returns to the dock pill on dismiss (internal
 * links hand focus to their destination instead).
 */
export function SiteMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduced = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const wasOpenRef = useRef(false);
  const [restoreOnClose, setRestoreOnClose] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const close = (restoreFocus = true) => {
    setRestoreOnClose(restoreFocus);
    onClose();
  };

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    const unlockScroll = lockPageScroll();
    const siblings = Array.from(document.body.children).filter(
      (element) => element !== dialog && element.tagName !== 'SCRIPT'
    );
    siblings.forEach((element) => element.setAttribute('inert', ''));

    const focusFrame = requestAnimationFrame(() =>
      firstLinkRef.current?.focus({ preventScroll: true })
    );
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab' || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', onKeyDown);
      siblings.forEach((element) => element.removeAttribute('inert'));
      unlockScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // focus returns to the dock pill after a dismiss (not after choosing a link)
  useEffect(() => {
    if (wasOpenRef.current && !open && restoreOnClose) {
      document
        .querySelector<HTMLElement>('[aria-controls="site-menu"]')
        ?.focus({ preventScroll: true });
    }
    wasOpenRef.current = open;
  }, [open, restoreOnClose]);

  // reset restore behavior each time the menu opens
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => setRestoreOnClose(true));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={dialogRef}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          data-lenis-prevent
          className="fixed inset-0 z-[60] overflow-y-auto bg-background/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.12 : 0.3, ease: EASE }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <motion.div
            aria-hidden="true"
            className="lamp-glow pointer-events-none absolute inset-0"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          />

          <button
            type="button"
            onClick={() => close()}
            className="neu fixed right-6 top-6 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground hover:text-red"
          >
            Close · Esc
          </button>

          <div className="mx-auto flex min-h-full max-w-7xl flex-col px-6 pb-24 pt-28 md:px-16 lg:grid lg:grid-cols-[1fr_300px] lg:content-center lg:gap-20">
            <nav aria-label="Primary navigation" className="my-auto">
              <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.2em] text-red">
                Navigation
              </p>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={link.label}>
                    <a
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      onClick={(event) => {
                        if (link.external) {
                          close(false);
                          return;
                        }
                        event.preventDefault();
                        const target = document.getElementById(link.href.slice(1));
                        close(false);
                        if (target) navigateToElement(target, link.href);
                      }}
                      className="group flex items-baseline gap-5 border-b border-line py-4 text-[clamp(2.5rem,6.2vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.05em] text-foreground transition-colors hover:text-red"
                      style={
                        reduced
                          ? undefined
                          : {
                              animation: 'filament 620ms ease-out both',
                              animationDelay: `${140 + index * 90}ms`,
                            }
                      }
                    >
                      <span className="font-mono text-xs tracking-normal text-dim">
                        0{index + 1}
                      </span>
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <aside
              className="mt-12 border-t border-line pt-8 lg:mt-0 lg:border-t-0 lg:pt-0 lg:self-center"
              style={
                reduced
                  ? undefined
                  : {
                      animation: 'filament 620ms ease-out both',
                      animationDelay: `${140 + links.length * 90 + 60}ms`,
                    }
              }
            >
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-1 lg:gap-10">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                    Status
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-foreground">
                    <span className="h-2 w-2 rounded-full bg-green" />
                    {profile.availability}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">Email</p>
                  <a
                    className="mt-2 block break-all text-sm text-foreground"
                    href={`mailto:${profile.email}`}
                  >
                    {profile.email}
                  </a>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                    Elsewhere
                  </p>
                  <div className="mt-2 flex gap-4 text-sm text-muted">
                    {socials.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-foreground"
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
