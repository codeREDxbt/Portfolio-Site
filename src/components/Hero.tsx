import Image from "next/image";
import { profile, projects } from "@/data/portfolio";
import { CommandChip } from "./CommandChip";
import { ChannelReadout } from "./ChannelReadout";
import { HeroVisual } from "./HeroVisual";

const featured = projects.filter((project) => project.featured);

/**
 * "Station" hero: the nameplate layout stays, the background becomes the
 * 3D ribbon field, and the eyebrow is a receiver readout that retunes
 * through the real role facets. Every retune pulses the ribbons — one
 * instrument from boot dock to scroll.
 */
export function Hero() {
  return (
    <section id="index" className="relative flex flex-col overflow-hidden pb-14 pt-28 lg:min-h-svh lg:pt-32">
      {/* 3D ribbon field behind everything */}
      <HeroVisual />
      <div aria-hidden="true" className="hero-vignette pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 md:px-16 lg:px-24">
        <div className="fade-in-up flex items-baseline justify-between border-b border-line pb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-dim [animation-delay:100ms]">
          <span>Portfolio</span>
          <span>Signal / 2026</span>
        </div>

        <div className="grid flex-1 grid-cols-12 content-center gap-x-8 gap-y-14 py-12 lg:py-8">
          <div className="col-span-12 lg:col-span-8">
            <ChannelReadout />

            <h1 className="mt-6 text-[clamp(4rem,10vw,10rem)] font-medium leading-[0.82] tracking-[-0.075em]">
              <span className="hero-line"><span>Vinayak</span></span>
              <span className="hero-line"><span>Vashisth<span className="text-red">.</span></span></span>
            </h1>

            <p className="fade-in-up mt-8 max-w-xl text-lg leading-8 text-muted [animation-delay:400ms]">
              I build products end to end — backends, interfaces, and everything between. Currently building Veilpay.
            </p>

            <div className="fade-in-up mt-10 flex flex-wrap items-center gap-3 [animation-delay:480ms]">
              <a
                href="#work"
                className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
              >
                View work
              </a>
              <a
                href="#contact"
                className="rounded-full border border-line px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-red hover:text-red"
              >
                Book a call
              </a>
              <CommandChip />
            </div>
          </div>

          <div className="col-span-12 flex flex-col gap-8 lg:col-span-4 lg:justify-end">
            <figure className="portrait-plate relative overflow-hidden rounded-xl border border-line bg-surface">
              {/* glitch plate: the person ⇄ the mark, swapped in slice bursts */}
              <div className="glitch-stage relative aspect-[4/3] lg:aspect-[4/5]">
                <div className="glitch-layer glitch-photo">
                  <Image
                    src="/brand/photo.jpg"
                    alt="Portrait of Vinayak Vashisth"
                    fill
                    priority
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="portrait-image object-cover object-[50%_25%]"
                  />
                </div>
                <div className="glitch-layer glitch-logo" aria-hidden="true">
                  <Image
                    src="/brand/codered-mark.png"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-contain p-6"
                  />
                </div>
                <div aria-hidden="true" className="glitch-flash" />
                <div aria-hidden="true" className="portrait-grade pointer-events-none absolute inset-0" />
              </div>
              <figcaption className="flex items-center justify-between border-t border-line px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                <span className="caption-swap">
                  <span className="caption-a">SIG/002 — Vinayak</span>
                  <span className="caption-b" aria-hidden="true">SIG/001 — codeRED</span>
                </span>
                <span className="text-red">20.59° N / 78.96° E</span>
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="grid gap-8 border-t border-line pt-7 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <nav aria-label="Featured projects" className="fade-in-up [animation-delay:600ms]">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">In this edition</p>
            <ul className="mt-3 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
              {featured.map((project) => (
                <li key={project.id} className="bg-background">
                  <a
                    href="#work"
                    className="group flex min-h-14 items-center justify-between gap-4 px-4 py-3 text-sm transition-colors hover:bg-surface hover:text-red focus-visible:text-red"
                  >
                    <span className="flex min-w-0 items-baseline gap-3">
                      <span className="font-mono text-[10px] text-dim">{project.number}</span>
                      <span className="truncate">{project.title}</span>
                    </span>
                    <span className="font-mono text-[10px] text-dim">{project.year}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <dl className="meta-rule grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 lg:pb-1">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">Role</dt>
              <dd className="mt-2 text-sm text-foreground">{profile.role}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">Based</dt>
              <dd className="mt-2 text-sm text-foreground">{profile.location}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">Status</dt>
              <dd className="mt-2 flex items-center gap-2 text-sm text-foreground">
                <span className="h-2 w-2 rounded-full bg-green" />
                {profile.availability}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">Contact</dt>
              <dd className="mt-2 text-sm">
                <a href={`mailto:${profile.email}`} className="break-all text-foreground transition-colors hover:text-red">
                  {profile.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

