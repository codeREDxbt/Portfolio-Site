'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { projectsChronological } from '@/data/portfolio';
import { scrollToTarget } from '@/lib/scroll';
import { Reveal } from './Reveal';

/**
 * "Trace / Constellation" — milestones are stars on a faint signal grid,
 * connected by arcs that draw as you scroll. The trail runs in true build
 * order (oldest → now), so the list and the map can never drift apart:
 * both are derived from `timeline.date` in the data, never from array order.
 *
 * Node grammar: featured builds are larger, awarded builds wear a second
 * ring, ongoing work carries a slowly rotating dashed ring — and a faint
 * dashed thread arcs from Veilpay's first commit to "now", because that
 * signal never stopped transmitting.
 */

type TrailEntry = {
  id: string;
  period: string;
  title: string;
  body: string;
  award?: string;
  featured: boolean;
  ongoing: boolean;
};

const entries: TrailEntry[] = [
  ...projectsChronological.map((project) => ({
    id: project.id,
    period: project.timeline.label,
    title: project.title,
    body: project.description,
    award: project.award,
    featured: project.featured,
    ongoing: project.timeline.ongoing ?? false,
  })),
  {
    id: 'now',
    period: 'Now',
    title: 'Still building Veilpay',
    body: 'Multi-chain payments with protocol-specific address isolation. Open to select work.',
    featured: true,
    ongoing: true,
  },
];

/** Deterministic pseudo-random in [0, 1) — SSR-safe, no hydration drift.
 *  Integer arithmetic only: Math.sin on large args is implementation-
 *  approximated and drifts between Node and Chromium (hydration mismatch),
 *  while imul/XOR/shifts are bit-identical on every engine. */
function pseudo(index: number, salt: number) {
  let h = (index * 2654435761) ^ (salt * 40503);
  h = Math.imul(h ^ (h >>> 13), 0x5bd1e995);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// Node placement: time flows left → right with even spacing; the y-wave and
// jitter keep it a constellation rather than a ruler, and everything adapts
// to the entry count so the map stays balanced as the roster grows.
const NODES = entries.map((entry, i) => ({
  ...entry,
  x: 56 + (i * 528) / Math.max(entries.length - 1, 1) + (pseudo(i, 1) - 0.5) * 22,
  y: clamp(190 + Math.sin(i * 1.5) * 85 + (pseudo(i, 2) - 0.5) * 40, 74, 296),
}));

type NodePoint = { x: number; y: number };

/** Gentle quadratic arc between two nodes; the bend alternates sides. */
function arcPath(a: NodePoint, b: NodePoint, bend: number) {
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy) || 1;
  return `M ${a.x} ${a.y} Q ${midX - (dy / length) * bend} ${midY + (dx / length) * bend} ${b.x} ${b.y}`;
}

const LINKS = NODES.slice(0, -1).map((node, i) => ({
  from: node,
  to: NODES[i + 1],
  d: arcPath(node, NODES[i + 1], (i % 2 === 0 ? -1 : 1) * (18 + pseudo(i, 5) * 14)),
}));

const veilpayIndex = entries.findIndex((entry) => entry.id === 'veilpay');
const nowIndex = entries.length - 1;
const THREAD_PATH = veilpayIndex >= 0 ? arcPath(NODES[veilpayIndex], NODES[nowIndex], -120) : null;

// Era ruler along the bottom — ticks pinned to real nodes, labels honest.
const ERA_TICKS = [
  { id: 'aptos-lms', label: "Q4 '25" },
  { id: 'veilpay', label: "Q1 '26" },
  { id: 'avisky', label: "APR '26" },
  { id: 'vaultpass', label: "MID '26" },
  { id: 'now', label: 'NOW' },
]
  .map((tick) => ({ ...tick, index: entries.findIndex((entry) => entry.id === tick.id) }))
  .filter((tick) => tick.index >= 0);

// Background star field — fixed seed, a quarter of the stars twinkle.
const STARS = Array.from({ length: 44 }, (_, i) => ({
  x: 12 + pseudo(i, 11) * 616,
  y: 12 + pseudo(i, 12) * 330,
  r: 0.5 + pseudo(i, 13) * 0.9,
  o: 0.12 + pseudo(i, 14) * 0.3,
  twinkle: i % 4 === 0,
  dur: 2.6 + pseudo(i, 15) * 3.4,
}));

function Connector({
  index,
  d,
  draw,
  reduced,
}: {
  index: number;
  d: string;
  draw: MotionValue<number>;
  reduced: boolean;
}) {
  const offset = useTransform(draw, [index, index + 0.6], [1, 0]);
  // the signal pulse only enters the wire once its arc has finished drawing
  const pulseOpacity = useTransform(draw, [index + 0.55, index + 0.8], [0, 0.9]);

  if (reduced) {
    return <path d={d} fill="none" stroke="var(--red)" strokeOpacity="0.45" strokeWidth="1" />;
  }

  return (
    <g>
      <motion.path
        d={d}
        fill="none"
        stroke="var(--red)"
        strokeOpacity="0.45"
        strokeWidth="1"
        strokeDasharray="1"
        pathLength={1}
        style={{ strokeDashoffset: offset }}
      />
      <motion.circle r="2.2" fill="var(--red)" style={{ opacity: pulseOpacity }}>
        <animateMotion
          dur={`${2.4 + pseudo(index, 7) * 1.6}s`}
          begin={`-${((index * 0.53) % 3).toFixed(2)}s`}
          repeatCount="indefinite"
          path={d}
        />
      </motion.circle>
    </g>
  );
}

export function Journey() {
  const listRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hot, setHot] = useState<number | null>(null);

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
  const threadOpacity = useTransform(
    draw,
    [veilpayIndex + 0.6, Math.min(veilpayIndex + 1.2, nowIndex)],
    [0, 1]
  );

  const jumpTo = (id: string) => {
    const target = document.getElementById(`journey-entry-${id}`);
    if (target) scrollToTarget(target);
  };

  return (
    <section
      id="journey"
      data-active-index={active}
      data-active-year={entries[active].period}
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
            <div className="neu-frame overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                <span>Signal map</span>
                <span>
                  {String(active + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}
                  <span className="text-red"> · {entries[active].period}</span>
                </span>
              </div>
              <motion.svg
                viewBox="0 0 640 400"
                className="block h-auto w-full"
                role="img"
                aria-label={`Milestone constellation. Active: ${entries[active].title}, ${entries[active].period}`}
                style={reduced ? undefined : { x: panX, y: panY }}
              >
                <defs>
                  <pattern id="trace-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M40 0H0V40"
                      fill="none"
                      stroke="var(--line)"
                      strokeOpacity="0.35"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="640" height="400" fill="url(#trace-grid)" />

                {/* star field */}
                {STARS.map((star, i) => (
                  <circle
                    key={`star-${i}`}
                    cx={star.x}
                    cy={star.y}
                    r={star.r}
                    fill="var(--dim)"
                    opacity={star.o}
                  >
                    {star.twinkle && !reduced ? (
                      <animate
                        attributeName="opacity"
                        values={`${star.o};${(star.o * 0.25).toFixed(3)};${star.o}`}
                        dur={`${star.dur.toFixed(2)}s`}
                        repeatCount="indefinite"
                      />
                    ) : null}
                  </circle>
                ))}

                {/* era ruler */}
                <line x1="40" y1="352" x2="600" y2="352" stroke="var(--line)" strokeWidth="1" />
                {ERA_TICKS.map((tick) => (
                  <g key={`era-${tick.id}`}>
                    <line
                      x1={NODES[tick.index].x}
                      y1="348"
                      x2={NODES[tick.index].x}
                      y2="356"
                      stroke="var(--dim)"
                      strokeWidth="1"
                    />
                    <text
                      x={NODES[tick.index].x}
                      y="372"
                      textAnchor="middle"
                      fontSize="9"
                      fontFamily="var(--font-geist-mono), monospace"
                      fill="var(--dim)"
                      letterSpacing="0.12em"
                      className="max-lg:hidden"
                    >
                      {tick.label}
                    </text>
                  </g>
                ))}

                {/* the Veilpay thread — started Q1 '26, never stopped */}
                {THREAD_PATH ? (
                  <motion.g style={{ opacity: threadOpacity }}>
                    <path
                      d={THREAD_PATH}
                      fill="none"
                      stroke="var(--red)"
                      strokeOpacity="0.3"
                      strokeWidth="1"
                      strokeDasharray="2 6"
                      strokeLinecap="round"
                    />
                    {!reduced ? (
                      <circle r="2" fill="var(--red)" opacity="0.8">
                        <animateMotion
                          dur="7s"
                          begin="-2s"
                          repeatCount="indefinite"
                          path={THREAD_PATH}
                        />
                      </circle>
                    ) : null}
                  </motion.g>
                ) : null}

                {LINKS.map((link, i) => (
                  <Connector
                    key={`link-${link.from.id}`}
                    index={i}
                    d={link.d}
                    draw={draw}
                    reduced={reduced ?? false}
                  />
                ))}

                {NODES.map((node, i) => {
                  const isActive = i === active;
                  const isPast = i < active;
                  const isHot = hot === i;
                  const radius = isActive ? 7 : node.featured ? 5 : 3.5;
                  const labelAnchor = node.x > 500 ? 'end' : node.x < 140 ? 'start' : 'middle';
                  return (
                    <g
                      key={node.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${node.title}, ${node.period}, jump to entry`}
                      className="cursor-pointer outline-none"
                      onClick={() => jumpTo(node.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          jumpTo(node.id);
                        }
                      }}
                      onMouseEnter={() => setHot(i)}
                      onMouseLeave={() => setHot((value) => (value === i ? null : value))}
                      onFocus={() => setHot(i)}
                      onBlur={() => setHot((value) => (value === i ? null : value))}
                    >
                      {isActive ? (
                        <>
                          <circle cx={node.x} cy={node.y} r="14" fill="var(--red)" opacity="0.12" />
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r="14"
                            fill="none"
                            stroke="var(--red)"
                            strokeOpacity="0.35"
                          >
                            {!reduced ? (
                              <>
                                <animate
                                  attributeName="r"
                                  values="10;18;10"
                                  dur="2.4s"
                                  repeatCount="indefinite"
                                />
                                <animate
                                  attributeName="stroke-opacity"
                                  values="0.35;0.05;0.35"
                                  dur="2.4s"
                                  repeatCount="indefinite"
                                />
                              </>
                            ) : null}
                          </circle>
                        </>
                      ) : null}
                      {/* ongoing work wears a slowly turning dashed ring */}
                      {node.ongoing ? (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={radius + 9.5}
                          fill="none"
                          stroke="var(--red)"
                          strokeOpacity={isActive ? 0.6 : 0.4}
                          strokeWidth="1"
                          strokeDasharray="2.5 4"
                        >
                          {!reduced ? (
                            <animateTransform
                              attributeName="transform"
                              type="rotate"
                              from={`0 ${node.x} ${node.y}`}
                              to={`360 ${node.x} ${node.y}`}
                              dur="14s"
                              repeatCount="indefinite"
                            />
                          ) : null}
                        </circle>
                      ) : null}
                      {/* awarded builds wear a second ring */}
                      {node.award && !isActive ? (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={radius + 4.5}
                          fill="none"
                          stroke="var(--red)"
                          strokeOpacity={isHot ? 0.6 : 0.3}
                          strokeWidth="0.75"
                        />
                      ) : null}
                      {/* focus / hover target ring */}
                      {isHot && !isActive ? (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={radius + 8}
                          fill="none"
                          stroke="var(--red)"
                          strokeOpacity="0.45"
                          strokeWidth="0.75"
                          strokeDasharray="1.5 3"
                        />
                      ) : null}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={radius}
                        fill={isActive || isPast ? 'var(--red)' : 'var(--surface)'}
                        stroke={isActive || isPast ? 'var(--red)' : 'var(--dim)'}
                        strokeWidth="1.5"
                      />
                      <text
                        x={node.x}
                        y={node.y - (node.ongoing ? 24 : 16)}
                        textAnchor="middle"
                        fontSize="11"
                        fontFamily="var(--font-geist-mono), monospace"
                        fill={isActive ? 'var(--foreground)' : 'var(--dim)'}
                        // on small screens the 640-wide map scales down and
                        // nine period labels turn to noise — keep only the
                        // active/hovered one until lg has room for all
                        className={isActive || isHot ? undefined : 'max-lg:hidden'}
                      >
                        {node.period}
                      </text>
                      {isActive || isHot ? (
                        <text
                          x={
                            node.x +
                            (labelAnchor === 'end' ? 10 : labelAnchor === 'start' ? -10 : 0)
                          }
                          y={node.y + (node.y > 270 ? -34 : 26)}
                          textAnchor={labelAnchor}
                          fontSize="12"
                          fontWeight="500"
                          fontFamily="var(--font-geist-mono), monospace"
                          fill={isActive ? 'var(--foreground)' : 'var(--muted)'}
                        >
                          {node.title}
                        </text>
                      ) : null}
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
                key={entry.id}
                id={`journey-entry-${entry.id}`}
                aria-current={i === active ? 'true' : undefined}
                className={`grid gap-2 border-b border-line py-8 transition-colors duration-500 ${
                  i === active ? 'text-foreground' : 'text-dim'
                }`}
              >
                <p className="flex flex-wrap items-center gap-3 font-mono text-xs tracking-[0.18em]">
                  <span className={i === active ? 'text-red' : ''}>{entry.period}</span>
                  {entry.ongoing ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-red/40 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-red">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red" />
                      </span>
                      Ongoing
                    </span>
                  ) : null}
                </p>
                <h3
                  className={`text-2xl font-medium tracking-[-0.03em] transition-colors duration-500 ${
                    i === active ? 'text-foreground' : 'text-muted'
                  }`}
                >
                  {entry.title}
                </h3>
                <p className="max-w-[52ch] text-sm leading-7 text-muted">{entry.body}</p>
                {entry.award ? (
                  <p className="pt-1">
                    <span className="inline-flex w-fit rounded-full border border-red/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-red">
                      {entry.award}
                    </span>
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
