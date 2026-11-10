import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

/**
 * Minimal top bar: brand left, theme toggle right.
 * Navigation lives in the floating DockNav. The brand points at /#index so it
 * also works from sub-pages (case files) — client-side either way.
 */
export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-16">
      <Link
        href="/#index"
        className="text-sm font-medium leading-none tracking-[-0.05em] text-foreground"
      >
        code<span className="text-red">RED</span>
      </Link>
      <ThemeToggle />
    </header>
  );
}
