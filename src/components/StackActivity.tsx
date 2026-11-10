import { stackGroups } from '@/data/portfolio';
import { GitHubGraph } from './GitHubGraph';
import { Reveal } from './Reveal';

export function StackActivity() {
  return (
    <section id="stack" className="border-t border-line px-6 py-24 md:px-16 md:py-32 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-red">
            Stack / Systems
          </p>
          <h2 className="mt-4 text-5xl font-medium tracking-[-0.06em] md:text-7xl">How I build</h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2">
          {stackGroups.map((group, index) => (
            <Reveal key={group.title} delay={index * 0.05}>
              <div className="h-full bg-background p-8">
                <h3 className="text-xl font-medium tracking-[-0.03em]">{group.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted">{group.items.join(' · ')}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14" delay={0.08}>
          <GitHubGraph />
        </Reveal>
      </div>
    </section>
  );
}
