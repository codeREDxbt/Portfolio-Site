"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { profile, socials } from "@/data/portfolio";

const links = [
  { label: "Index", href: "#index" },
  { label: "Works", href: "#work" },
  { label: "Stack", href: "#stack" },
  { label: "Resume", href: profile.resumeUrl, external: true },
  { label: "Get in touch", href: "#contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-16">
        <a href="#index" className="font-mono text-sm font-medium tracking-tight text-foreground">
          codeRED
        </a>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
          className="rounded-full border border-line bg-background/70 px-4 py-2 text-sm text-foreground backdrop-blur-md transition-colors hover:border-red"
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -18 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -18 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mx-auto grid h-full max-w-7xl grid-cols-1 content-between px-6 pb-8 pt-28 md:grid-cols-[1fr_320px] md:px-16">
              <nav aria-label="Primary navigation">
                <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.2em] text-red">
                  Navigation
                </p>
                <ul className="space-y-2">
                  {links.map((link, index) => (
                    <motion.li
                      key={link.label}
                      initial={reduced ? false : { opacity: 0, y: 24 }}
                      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + index * 0.045, duration: 0.45 }}
                    >
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        onClick={() => setOpen(false)}
                        className="group flex items-baseline gap-5 border-b border-line py-4 text-5xl font-medium tracking-[-0.05em] text-foreground transition-colors hover:text-red md:text-7xl"
                      >
                        <span className="font-mono text-xs tracking-normal text-dim">
                          0{index + 1}
                        </span>
                        <span>{link.label}</span>
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <aside className="mt-12 space-y-8 md:mt-0 md:self-center">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">Status</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-foreground">
                    <span className="h-2 w-2 rounded-full bg-green" />
                    {profile.availability}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">Email</p>
                  <a className="mt-2 block text-sm text-foreground" href={`mailto:${profile.email}`}>
                    {profile.email}
                  </a>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">Elsewhere</p>
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
              </aside>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
