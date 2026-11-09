'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { projects } from '@/data/portfolio';
import { Reveal } from './Reveal';

/**
 * "Trace / Constellation" — milestones are nodes on a faint signal grid,
 * connected by lines that draw as you scroll. The sticky constellation pans
 * against the entry list; the active node locks red. Real project data only.
 */
const entries = [
  {
    year: '2026',
    title: 'Now — building Veilpay',
    body: 'Multi-chain payments with protocol-specific address isolation. Open to select work.',
  },
  ...projects
    .filter((project) => project.id !== 'veilpay')
    .map((project) => ({ year: project.year, title: project.title, body: project.description })),
];

// deterministic node placement — spacing adapts to the entry count so the
// constellation always fills the 640-wide map, regardless of roster size
const NODES = entries.map((entry, i) => ({
  ...entry,
  x: 60 + (i * 520) / Math.max(entries.length - 1, 1) + (i % 2) * 30,
  y: 210 + Math.sin(i * 1.7) * 110 + (i % 3) * 24,
}));

type NodePoint = { x: number; y: number };

function Connector({
  index,
  from,
  to,
  draw,
  reduced,
}: {
  index: number;
  from: NodePoint;
  to: NodePoint;
  draw: ReturnType<typeof useTransform<number, number>>;
  reduced: boolean;
}) {
  const offset = useTransform(draw, [index, index + 0.6], [1, 0]);
  if (reduced) {
    return (
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke="var(--red)"
        strokeOpacity="0.45"
        strokeWidth="1"
      />
    );
  }
  return (
    <motion.line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke="var(--red)"
      strokeOpacity="0.45"
      strokeWidth="1"
      strokeDasharray="1"
      pathLength={1}
      style={{ strokeDashoffset: offset }}
    />
  );
}


export function Journey() {
  const listRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start center', 'end center'],
  });
  const activeValue = useTransform(scrollYProgress, [0, 1], [0, entries.length - 1]);
  useMotionValueEvent(activeValue, 'change', (value) =>
    setActive(Math.max(0, Math.min(entries.length - 1, Math.round(value))))
  );

  // the constellation pans against the scroll; connectors draw with progress
  const panX = useTransform(scrollYProgress, [0, 1], [30, -110]);
  const panY = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const draw = useTransform(scrollYProgress, [0, 1], [0, NODES.length - 1]);

  return (
    <section
      id="journey"
      data-active-index={active}
      data-active-year={entries[active].year}
      className="border-t border-line px-6 py-24 md:px-16 md:py-32 lg:px-24"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-red">
            Trace / Constellation
          </p>
          <h2 className="mt-4 text-5xl font-medium tracking-[-0.06em] md:text-7xl">
            The trail so far.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* sticky constellation map */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-line bg-surface/50">
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                <span>Signal map</span>
                <span>
                  {String(active + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}
                </span>
              </div>
              <motion.svg
                viewBox="0 0 640 400"
                className="block h-auto w-full"
                role="img"
                aria-label={`Milestone constellation. Active: ${entries[active].title}, ${entries[active].year}`}
                style={reduced ? undefined : { x: panX, y: panY }}
              >
                <defs>
                  <pattern id="trace-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M40 0H0V40" fill="none" stroke="var(--line)" strokeOpacity="0.35" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="640" height="400" fill="url(#trace-grid)" />

                {NODES.slice(0, -1).map((node, i) => (
                  <Connector
                    key={`link-${node.title}`}
                    index={i}
                    from={node}
                    to={NODES[i + 1]}
                    draw={draw}
                    reduced={reduced ?? false}
                  />
                ))}

                {NODES.map((node, i) => {
                  const isActive = i === active;
                  const isPast = i < active;
                  return (
                    <g key={node.title}>
                      {isActive && !reduced ? (
                        <circle cx={node.x} cy={node.y} r="14" fill="none" stroke="var(--red)" strokeOpacity="0.35">
                          <animate attributeName="r" values="10;18;10" dur="2.4s" repeatCount="indefinite" />
                          <animate attributeName="stroke-opacity" values="0.35;0.05;0.35" dur="2.4s" repeatCount="indefinite" />
                        </circle>
                      ) : null}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isActive ? 6 : 4}
                        fill={isActive || isPast ? 'var(--red)' : 'var(--surface)'}
                        stroke={isActive || isPast ? 'var(--red)' : 'var(--dim)'}
                        strokeWidth="1.5"
                      />
                      <text
                        x={node.x}
                        y={node.y - 16}
                        textAnchor="middle"
                        fontSize="11"
                        fontFamily="var(--font-geist-mono), monospace"
                        fill={isActive ? 'var(--foreground)' : 'var(--dim)'}
                      >
                        {node.year}
                      </text>
                    </g>
                  );
                })}
              </motion.svg>
            </div>
          </div>

          {/* entries */}
          <div ref={listRef} className="border-t border-line">
            {entries.map((entry, i) => (
              <article
                key={entry.title}
                className={`grid gap-2 border-b border-line py-8 transition-colors duration-500 ${
                  i === active ? 'text-foreground' : 'text-dim'
                }`}
              >
                <p className="font-mono text-xs tracking-[0.18em]">{entry.year}</p>
                <h3
                  className={`text-2xl font-medium tracking-[-0.03em] transition-colors duration-500 ${
                    i === active ? 'text-foreground' : 'text-muted'
                  }`}
                >
                  {entry.title}
                </h3>
                <p className="max-w-[52ch] text-sm leading-7 text-muted">{entry.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
