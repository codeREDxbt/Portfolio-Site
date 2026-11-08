import Image from "next/image";
import type { Project } from "@/data/portfolio";
import { projects } from "@/data/portfolio";
import { Reveal } from "./Reveal";

function ProjectMedia({ project }: { project: Project }) {
  const href = project.liveUrl ?? project.repoUrl;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="project-media group/media relative block aspect-[16/10] overflow-hidden rounded-xl border border-line bg-surface"
      aria-label={`View ${project.title}`}
    >
      {project.image ? (
        <Image
          src={project.image}
          alt={`${project.title} interface preview`}
          fill
          sizes="(min-width: 768px) 46vw, 100vw"
          className="object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 bg-surface">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-red/35" />
          <div className="absolute right-14 top-16 h-44 w-44 rounded-full border border-red/55" />
          <div className="absolute right-28 top-28 h-20 w-20 rounded-full bg-red/15 blur-sm" />
          <div className="signal-line absolute bottom-24 left-8 h-px w-72 bg-red/70" />
          <p className="absolute bottom-7 left-8 font-mono text-[10px] uppercase tracking-[0.2em] text-red">
            Private / Multi-chain / Payments
          </p>
        </div>
      )}
      <span className="project-view absolute bottom-4 right-4 rounded-full bg-background/80 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground backdrop-blur-md">
        View project ↗
      </span>
    </a>
  );
}

function PixelButton({ project }: { project: Project }) {
  const href = project.liveUrl ?? project.repoUrl;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 inline-flex items-center gap-3 rounded-lg bg-surface-strong px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-line"
    >
      <span className="pixel-grid" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <span key={index} style={{ animationDelay: `${index * 70}ms` }} />
        ))}
      </span>
      View project
    </a>
  );
}

function MetadataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-4 border-b border-line py-3 text-sm">
      <span className="text-dim">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

export function Projects() {
  const featured = projects.filter((project) => project.featured);
  const archive = projects.filter((project) => !project.featured);
  const headingImage = projects.find((project) => project.id === "paytrack")?.image;

  return (
    <section id="work" className="relative px-6 py-24 md:px-16 md:py-32 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="pointer-events-none top-0 z-20 mb-16 border-b border-line bg-background/90 py-6 backdrop-blur-md md:sticky">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-4 text-center">
              <span className="text-5xl font-medium tracking-[-0.06em] text-foreground md:text-7xl">Featured</span>
              <span className="relative h-16 w-28 overflow-hidden rounded-full border border-line bg-surface md:h-24 md:w-44">
                {headingImage ? (
                  <Image
                    src={headingImage}
                    alt="PayTrack interface detail"
                    fill
                    sizes="(min-width: 768px) 176px, 112px"
                    className="object-cover object-top"
                  />
                ) : null}
              </span>
              <span className="text-5xl font-medium tracking-[-0.06em] text-foreground md:text-7xl">
                Work <span className="text-dim">(04)</span>
              </span>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-x-12 gap-y-24 md:grid-cols-2">
          {featured.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.05}>
              <article className="project-card group">
                <ProjectMedia project={project} />
                <div className="mt-7">
                  <p className="font-mono text-xs tracking-[0.16em] text-dim">[ {project.number} ]</p>
                  <h3 className="mt-3 text-3xl font-medium tracking-[-0.045em] transition-colors group-hover:text-red md:text-4xl">
                    {project.title}
                  </h3>
                  <p className="mt-3 max-w-[42ch] text-base leading-7 text-muted">{project.description}</p>

                  <div className="mt-6 border-t border-line">
                    <MetadataRow label="Role" value={project.role} />
                    <MetadataRow label="Year" value={project.year} />
                    <MetadataRow label="Stack" value={project.stack.join(" / ")} />
                  </div>

                  <PixelButton project={project} />
                </div>
              </article>
            </Reveal>
          ))}
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
