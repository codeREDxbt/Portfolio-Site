import { profile } from "@/data/portfolio";
import { CommandChip } from "./CommandChip";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section id="index" className="relative overflow-hidden px-6 pb-24 pt-28 md:px-16 md:pt-32 lg:px-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="fade-in-up font-mono text-[11px] uppercase tracking-[0.22em] text-red">
            {profile.name} / {profile.title}
          </p>
          <h1 className="mt-10 max-w-[840px] text-balance text-[clamp(3rem,6.8vw,6.5rem)] font-medium leading-[0.96] tracking-[-0.065em]">
            <span className="hero-line"><span>Building secure,</span></span>
            <span className="hero-line"><span>expressive products</span></span>
            <span className="hero-line"><span>for the decentralized web.</span></span>
          </h1>
          <p className="fade-in-up mt-8 max-w-xl text-lg leading-8 text-muted [animation-delay:260ms]">
            I design and build fast, resilient interfaces where complex blockchain systems feel clear, useful, and finished.
          </p>
          <div className="fade-in-up mt-10 flex flex-wrap items-center gap-3 [animation-delay:340ms]">
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

        <div className="relative lg:pt-4">
          <HeroVisual />
          <dl className="grid gap-7 border-t border-line pt-8 lg:mt-4">
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
          </dl>
        </div>
      </div>
    </section>
  );
}
