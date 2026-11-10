'use client';

import Link from 'next/link';
import { motion, useTransform, useMotionTemplate, type MotionValue } from 'motion/react';
import type { Project } from '@/data/portfolio';
import { ProjectMedia } from './ProjectMedia';
import { useDecode } from '@/lib/use-decode';

function liveHost(url?: string) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/**
 * One station on the LOCK-ON receiver. Visibility is a pure function of
 * detune: noise hangs on during tune-in, collapses at the lock point, holds
 * clean, then detunes out.
 */
export function TunerStation({
  project,
  index,
  total,
  progress,
  active,
  reduced,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  active: boolean;
  reduced: boolean;
}) {
  const start = index / total;
  const end = (index + 1) / total;

  const local = useTransform(progress, [start, end], [0, 1]);
  const detune = useTransform(local, (t) => {
    if (t < 0.3) return Math.pow(1 - t / 0.3, 2.2);
    if (t > 0.7) return Math.pow((t - 0.7) / 0.3, 1.6);
    return 0;
  });

  const blur = useTransform(detune, [0, 1], [0, 16]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const opacity = useTransform(detune, [0, 1], [1, 0]);
  const scale = useTransform(detune, [0, 1], [1, 1.05]);
  const y = useTransform(detune, [0, 1], [0, -24]);

  const decodedTitle = useDecode(project.title, active, reduced);
  const host = liveHost(project.liveUrl);

  return (
    <motion.article
      aria-hidden={!active}
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={
        reduced ? undefined : { opacity, scale, y, filter, pointerEvents: active ? 'auto' : 'none' }
      }
    >
      {/* one lockup, sized off the viewport height so the screen always fills
          its frame edge-to-edge (covers are designed at 21:9 — zero crop) and
          the dossier band below aligns to the screen's exact width */}
      <div className="flex w-[min(100%,calc(38vh*21/9))] flex-col gap-4">
        <div className="tuner-screen relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-line bg-surface">
          <ProjectMedia project={project} fill />
          {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
            <motion.span
              key={corner}
              aria-hidden="true"
              className={`pointer-events-none absolute z-10 h-5 w-5 border-red ${
                corner === 'tl' ? 'left-3 top-3 border-l-2 border-t-2' : ''
              }${corner === 'tr' ? 'right-3 top-3 border-r-2 border-t-2' : ''}${
                corner === 'bl' ? 'bottom-3 left-3 border-b-2 border-l-2' : ''
              }${corner === 'br' ? 'bottom-3 right-3 border-b-2 border-r-2' : ''}`}
              initial={false}
              animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
            <p>
              [ {project.number} · {project.year} · {project.role} ]
            </p>
            {host ? <span>{host}</span> : null}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2">
            <h3 className="text-3xl font-medium tracking-[-0.04em] text-foreground md:text-4xl">
              <span className="sr-only">{project.title}</span>
              <span aria-hidden="true">{decodedTitle}</span>
            </h3>
            {project.award ? (
              <span className="rounded-full border border-red/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-red">
                {project.award}
              </span>
            ) : null}
          </div>

          {project.caseFile ? (
            <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 border-t border-line pt-3 sm:grid-cols-3">
              {(
                [
                  ['Challenge', project.caseFile.challenge],
                  ['Decision', project.caseFile.decision],
                  ['Outcome', project.caseFile.outcome],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.24em] text-dim">
                    {label}
                  </dt>
                  <dd className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {project.liveUrl || project.caseStudy ? (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={active ? 0 : -1}
                  className="inline-flex rounded-full bg-foreground px-5 py-2.5 text-xs font-medium text-background transition-transform hover:-translate-y-0.5"
                >
                  Open feed ↗ <span className="sr-only">: {project.title} (opens in new tab)</span>
                </a>
              ) : null}
              {project.caseStudy ? (
                <Link
                  href={`/work/${project.id}`}
                  tabIndex={active ? 0 : -1}
                  className="inline-flex rounded-full border border-line px-5 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-red"
                >
                  Read case file → <span className="sr-only">: {project.title}</span>
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

/** Plain editorial block for the list fallback (mobile / reduced motion). */
export function TunerStationListItem({ project }: { project: Project }) {
  return (
    <article className="grid gap-6 border-b border-line py-10">
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <ProjectMedia project={project} />
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
          [ {project.number} · {project.year} · {project.role} ]
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <h3 className="text-3xl font-medium tracking-[-0.04em]">{project.title}</h3>
          {project.award ? (
            <span className="rounded-full border border-red/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-red">
              {project.award}
            </span>
          ) : null}
        </div>
        {project.caseFile ? (
          <dl className="mt-6 border-t border-line">
            {(
              [
                ['Challenge', project.caseFile.challenge],
                ['Decision', project.caseFile.decision],
                ['Outcome', project.caseFile.outcome],
              ] as const
            ).map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[96px_1fr] gap-4 border-b border-line py-3"
              >
                <dt className="font-mono text-[9px] uppercase tracking-[0.24em] text-dim">
                  {label}
                </dt>
                <dd className="text-sm leading-6 text-muted">{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {project.liveUrl || project.caseStudy ? (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full bg-foreground px-5 py-2.5 text-xs font-medium text-background"
              >
                Open feed ↗ <span className="sr-only">: {project.title} (opens in new tab)</span>
              </a>
            ) : null}
            {project.caseStudy ? (
              <Link
                href={`/work/${project.id}`}
                className="inline-flex rounded-full border border-line px-5 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-red"
              >
                Read case file → <span className="sr-only">: {project.title}</span>
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
