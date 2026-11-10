import { apiError, apiJson, applyCors, corsPreflight } from '@/lib/api';

type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

type RawContributionDay = {
  date?: unknown;
  count?: unknown;
  level?: unknown;
};

function validateUsername(username: string) {
  return /^[a-zA-Z0-9-]{1,39}$/.test(username);
}

function normalizeWeeks(days: ContributionDay[]) {
  const weeks: ContributionDay[][] = [];
  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }
  return weeks.slice(-52);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'codeREDxbt';

  if (!validateUsername(username)) {
    return applyCors(
      request,
      apiError(400, 'Username can only contain letters, numbers, and hyphens')
    );
  }

  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      {
        headers: { 'User-Agent': 'codered-portfolio/2.0' },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    const data = await response.json();
    const rawDays: RawContributionDay[] = Array.isArray(data.contributions)
      ? data.contributions
      : [];
    const days: ContributionDay[] = rawDays
      .filter((day): day is RawContributionDay & { date: string } => typeof day.date === 'string')
      .map((day) => ({
        date: day.date,
        count: Number(day.count) || 0,
        level: Math.max(0, Math.min(4, Number(day.level) || 0)),
      }))
      .sort((a: ContributionDay, b: ContributionDay) => a.date.localeCompare(b.date));

    const total =
      typeof data.total === 'number' ? data.total : days.reduce((sum, day) => sum + day.count, 0);
    const result = apiJson({ status: 'success', username, total, weeks: normalizeWeeks(days) });
    result.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=1800');
    return applyCors(request, result);
  } catch {
    return applyCors(
      request,
      apiError(500, 'Failed to fetch GitHub contributions', { fallback: true })
    );
  }
}

export function OPTIONS(request: Request) {
  return corsPreflight(request);
}

export function POST(request: Request) {
  return applyCors(request, apiError(405, 'Method not allowed'));
}
