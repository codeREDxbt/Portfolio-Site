import { narrative } from "@/data/portfolio";
import { Reveal } from "./Reveal";

export function Narrative() {
  return (
    <section aria-label="Introduction and approach" className="border-t border-line px-6 py-24 md:px-16 lg:px-24">
      <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-3">
        {narrative.map((item, index) => (
          <Reveal key={item.number} delay={index * 0.08}>
            <article>
              <p className="font-mono text-xs tracking-[0.18em] text-red">[ {item.number} ]</p>
              <h2 className="mt-5 text-2xl font-medium tracking-[-0.04em]">{item.title}</h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-muted">{item.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
