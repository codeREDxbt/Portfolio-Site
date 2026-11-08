"use client";

import { useEffect, useMemo, useState } from "react";

type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

type ContributionResponse = {
  status: "success" | "error";
  total?: number;
  weeks?: ContributionDay[][];
};

const colors = ["#292524", "#274536", "#35694B", "#4B9B6A", "#67C792"];

function fallbackWeeks(): ContributionDay[][] {
  return Array.from({ length: 52 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => {
      const value = (week * 3 + day * 5) % 9;
      return {
        date: `fallback-${week}-${day}`,
        count: value < 4 ? 0 : value,
        level: value < 4 ? 0 : value < 6 ? 1 : value < 8 ? 2 : 3,
      };
    }),
  );
}

export function GitHubGraph() {
  const [weeks, setWeeks] = useState<ContributionDay[][]>(() => fallbackWeeks());
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/github-contributions?username=codeREDxbt");
        const data = (await response.json()) as ContributionResponse;
        if (!cancelled && data.status === "success" && data.weeks) {
          setWeeks(data.weeks);
          setTotal(data.total ?? null);
        }
      } catch {
        // Keep the deterministic fallback graph.
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const label = useMemo(
    () => (total ? `${total.toLocaleString()} contributions in the last year` : loading ? "Loading contributions…" : "Contribution activity"),
    [loading, total],
  );

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 md:p-8">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h3 className="text-xl font-medium tracking-[-0.03em]">GitHub contributions</h3>
          <p className="mt-2 text-sm text-muted">{label}</p>
        </div>
        <a
          href="https://github.com/codeREDxbt"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-green"
        >
          Explore GitHub ↗
        </a>
      </div>
      <div className="mt-8 overflow-x-auto pb-2">
        <div className="grid min-w-[760px] grid-cols-[repeat(52,minmax(0,1fr))] gap-[4px]" role="img" aria-label={label}>
          {weeks.map((week) =>
            week.map((day) => (
              <span
                key={day.date}
                title={`${day.count} contributions on ${day.date}`}
                className="aspect-square rounded-[3px]"
                style={{ backgroundColor: colors[Math.min(day.level, colors.length - 1)] }}
              />
            )),
          )}
        </div>
      </div>
    </div>
  );
}
