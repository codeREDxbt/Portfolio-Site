import { ThemeToggle } from './ThemeToggle';

/**
 * Minimal top bar: brand left, theme toggle right.
 * Navigation lives in the floating DockNav.
 */
export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-16">
      <a href="#index" className="text-sm font-medium leading-none tracking-[-0.05em] text-foreground">
        code<span className="text-red">RED</span>
      </a>
      <ThemeToggle />
    </header>
  );
}
