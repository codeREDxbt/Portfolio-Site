import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { profile, projects } from "@/data/portfolio";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SiteNav } from "@/components/SiteNav";
import { ProjectMedia } from "@/components/ProjectMedia";

const featured = projects.filter((p) => p.featured && p.caseStudy);

function liveHost(url?: string) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  return featured.map((p) => ({ slug: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = featured.find((p) => p.id === slug);
  if (!project) return {};
  return {
    title: `${project.title} Case File | codeRED`,
    description: project.description,
    alternates: { canonical: `/work/${project.id}` },
    openGraph: {
      title: `${project.title} | codeRED case file`,
      description: project.description,
      images: project.image ? [{ url: project.image, width: 1600, height: 686 }] : undefined,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = featured.find((p) => p.id === slug);
  if (!project || !project.caseStudy) notFound();
  const study = project.caseStudy;

  const index = featured.findIndex((p) => p.id === project.id);
  const next = featured[(index + 1) % featured.length];
  const host = liveHost(project.liveUrl);

  const chapters = [
    ["01", "Challenge", study.challenge],
    ["02", "Decision", study.decision],
    ["03", "Outcome", study.outcome],
  ] as const;

  return (
    <>
      <SmoothScroll />
      <SiteNav />
      <main id="main" tabIndex={-1}>
        {/* Case header */}
        <section className="px-6 pt-36 md:px-16 md:pt-44">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-red">
                Case file · {project.number}/{String(featured.length).padStart(2, "0")}
              </p>
              {project.award ? (
                <span className="rounded-full border border-red/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-red">
                  {project.award}
                </span>
              ) : null}
            </div>
            <h1 className="hero-line mt-6 text-5xl font-medium tracking-[-0.05em] md:text-7xl">
              <span>{project.title}.</span>
            </h1>
            <p className="fade-in-up mt-6 max-w-[65ch] text-base leading-8 text-muted">
              {study.lede}
            </p>
            <div className="fade-in-up mt-8 border-t border-line pt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                [ {project.number} · {project.year} · {project.role} ]
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                {project.stack.join(" / ")}
                {host ? ` · ${host}` : ""}
              </p>
            </div>
            <div className="fade-in-up mt-8 flex flex-wrap items-center gap-3">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-foreground px-5 py-2.5 text-xs font-medium text-background transition-transform hover:-translate-y-0.5"
                >
                  Open feed ↗ <span className="sr-only">: {project.title} (opens in new tab)</span>
                </a>
              ) : null}
              {project.repoUrl ? (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-line px-5 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-red"
                >
                  Source ↗ <span className="sr-only">: {project.title} repository (opens in new tab)</span>
                </a>
              ) : null}
              <Link
                href="/#work"
                className="inline-flex rounded-full border border-line px-5 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-red"
              >
                ← Back to works
              </Link>
            </div>
          </div>
        </section>

        {/* Receiver frame */}
        <section className="px-6 pt-14 md:px-16 md:pt-20">
          <div className="mx-auto max-w-6xl">
            <div className="tuner-screen relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-line bg-surface">
              <ProjectMedia
                project={project}
                fill
                linked={false}
                sizes="(min-width: 1200px) 1152px, 100vw"
              />
              {(["tl", "tr", "bl", "br"] as const).map((corner) => (
                <span
                  key={corner}
                  aria-hidden="true"
                  className={`pointer-events-none absolute z-10 h-5 w-5 border-red ${
                    corner === "tl" ? "left-3 top-3 border-l-2 border-t-2" : ""
                  }${corner === "tr" ? "right-3 top-3 border-r-2 border-t-2" : ""}${
                    corner === "bl" ? "bottom-3 left-3 border-b-2 border-l-2" : ""
                  }${corner === "br" ? "bottom-3 right-3 border-b-2 border-r-2" : ""}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Chapters with signal-path rail */}
        <section className="px-6 py-20 md:px-16 md:py-28">
          <div className="mx-auto max-w-5xl md:grid md:grid-cols-[160px_1fr] md:gap-12">
            <aside className="hidden md:block">
              <nav
                aria-label="Case file sections"
                className="sticky top-32 space-y-3 font-mono text-[10px] uppercase tracking-[0.24em]"
              >
                <p className="text-dim">Signal path</p>
                {chapters.map(([num, label]) => (
                  <a
                    key={label}
                    href={`#${label.toLowerCase()}`}
                    className="block text-muted transition-colors hover:text-red"
                  >
                    {num} / {label}
                  </a>
                ))}
                <a
                  href="#next-transmission"
                  className="block text-muted transition-colors hover:text-red"
                >
                  04 / Next
                </a>
              </nav>
            </aside>
            <div className="space-y-16">
              {chapters.map(([num, label, paragraphs]) => (
                <section
                  key={label}
                  id={label.toLowerCase()}
                  className="scroll-mt-28 border-t border-line pt-10"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">
                    {num} / {label}
                  </p>
                  <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-foreground">
                    {label}
                  </h2>
                  <div className="mt-5 max-w-[65ch] space-y-5">
                    {paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 32)} className="text-[15px] leading-8 text-muted">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        {/* Next transmission */}
        <section id="next-transmission" className="scroll-mt-28 border-t border-line px-6 py-20 md:px-16 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">
              Next transmission
            </p>
            <Link
              href={`/work/${next.id}`}
              className="group mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2"
            >
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-red">
                CH {next.number}
              </span>
              <span className="text-4xl font-medium tracking-[-0.05em] text-foreground transition-colors group-hover:text-red md:text-6xl">
                {next.title}.
              </span>
              <span
                aria-hidden="true"
                className="text-2xl text-dim transition-transform duration-300 group-hover:translate-x-2 md:text-3xl"
              >
                →
              </span>
            </Link>
            <p className="mt-4 max-w-[52ch] text-sm leading-6 text-muted">{next.description}</p>
          </div>
        </section>

        <footer className="border-t border-line px-6 py-8 md:px-16">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
            <p>
              © {new Date().getFullYear()} {profile.handle} · {profile.name}
            </p>
            <a href={`mailto:${profile.email}`} className="transition-colors hover:text-red">
              {profile.email}
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}
