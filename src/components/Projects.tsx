import Image from "next/image";
import { projects } from "@/data/portfolio";
import { Reveal } from "./Reveal";

function ProjectMedia({ image, title }: { image?: string; title: string }) {
  if (!image) {
    return (
      <div className="project-media relative h-56 overflow-hidden rounded-2xl border border-line bg-surface md:h-64">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-red/40" />
        <div className="absolute right-10 top-10 h-36 w-36 rounded-full border border-red/60" />
        <div className="absolute bottom-8 left-8 font-mono text-[10px] uppercase tracking-[0.2em] text-red">
          Private / Multi-chain / Payments
        </div>
      </div>
    );
  }

  return (
    <div className="project-media relative h-56 overflow-hidden rounded-2xl border border-line bg-surface md:h-64">
      <Image
        src={image}
        alt={`${title} interface preview`}
        fill
        sizes="(min-width: 1024px) 42vw, 100vw"
        className="object-cover object-top"
      />
    </div>
  );
}

export function Projects() {
  const featured = projects.filter((project) => project.featured);
  const archive = projects.filter((project) => !project.featured);

  return (
    <section id="work" className="px-6 py-24 md:px-16 md:py-32 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-16 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-red">Work / Selected builds</p>
              <h2 className="mt-4 text-5xl font-medium tracking-[-0.06em] md:text-7xl">Selected work</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-muted md:text-right">
              Four product stories first. Two supporting builds in the archive.
            </p>
          </div>
        </Reveal>

        <div className="space-y-20">
          {featured.map((project) => (
            <Reveal key={project.id} delay={0.05}>
              <article className="project-card group grid gap-8 border-t border-line pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:items-center">
                <div>
                  <div className="project-rule mb-8 h-px w-full bg-line" />
                  <p className="font-mono text-xs text-dim">{project.number}</p>
                  <h3 className="mt-3 text-4xl font-medium tracking-[-0.05em] transition-colors group-hover:text-red md:text-6xl">
                    {project.title}
                  </h3>
                  <p className="mt-5 max-w-xl text-base leading-7 text-muted">{project.description}</p>
                  <div className="mt-7 space-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-dim">
                    <p>Role&nbsp;&nbsp;{project.role}</p>
                    <p>Year&nbsp;&nbsp;{project.year}</p>
                    <p>Stack&nbsp;&nbsp;{project.stack.join(" / ")}</p>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-4 text-sm">
                    {project.liveUrl ? (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-red">
                        View live ↗
                      </a>
                    ) : null}
                    {project.repoUrl ? (
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-foreground">
                        Source ↗
                      </a>
                    ) : null}
                  </div>
                </div>
                <ProjectMedia image={project.image} title={project.title} />
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.08}>
          <div className="mt-24">
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
