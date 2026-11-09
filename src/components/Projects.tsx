import { projects } from "@/data/portfolio";
import { Reveal } from "./Reveal";
import { SignalMark } from "./SignalMark";
import { WorkTuner } from "./WorkTuner";

export function Projects() {
  const featured = projects.filter((project) => project.featured);
  const archive = projects.filter((project) => !project.featured);

  return (
    <section id="work" className="relative px-6 py-24 md:px-16 md:py-32 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div>
          <header className="pointer-events-none mb-10 border-b border-line py-6">
            <Reveal>
              <h2 className="group pointer-events-auto mx-auto flex w-fit cursor-default flex-wrap items-center justify-center gap-x-5 gap-y-4 text-center">
                <span className="text-5xl font-medium tracking-[-0.06em] text-foreground md:text-7xl">Featured</span>
                <span className="-mx-5 w-0 overflow-hidden opacity-0 transition-[width,margin,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:mx-0 group-hover:w-28 group-hover:opacity-100 md:group-hover:w-44">
                  <SignalMark className="h-16 w-28 md:h-24 md:w-44" />
                </span>
                <span className="text-5xl font-medium tracking-[-0.06em] text-foreground md:text-7xl">
                  Work <span className="text-dim">({String(featured.length).padStart(2, "0")})</span>
                </span>
              </h2>
            </Reveal>
          </header>

          <WorkTuner projects={featured} />
        </div>

        <Reveal delay={0.08}>
          <div className="mt-28">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">Archive</p>
            <div className="mt-6 divide-y divide-line border-y border-line">
              {archive.map((project) => (
                <a
                  key={project.id}
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid gap-3 py-6 transition-colors md:grid-cols-[60px_1fr_1.5fr_100px] md:items-center"
                >
                  <span className="font-mono text-xs text-dim">{project.number}</span>
                  <span className="text-xl font-medium tracking-[-0.03em] transition-colors group-hover:text-red">
                    {project.title}
                  </span>
                  <span className="text-sm text-muted">{project.description}</span>
                  <span className="font-mono text-xs text-dim md:text-right">{project.year} ↗</span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
