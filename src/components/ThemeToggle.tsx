"use client";

import { flushSync } from "react-dom";
import { useCallback, useSyncExternalStore, type MouseEvent } from "react";

const THEME_EVENT = "codered:theme";
const STORAGE_KEY = "codered-theme";

type ViewTransitionStarter = (callback: () => void) => { ready: Promise<void> };

function useTheme(): string {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(THEME_EVENT, onStoreChange);
      const observer = new MutationObserver(onStoreChange);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      return () => {
        window.removeEventListener(THEME_EVENT, onStoreChange);
        observer.disconnect();
      };
    },
    () => document.documentElement.dataset.theme ?? "dark",
    () => "dark",
  );
}

/**
 * Light/dark toggle with a circular View Transitions reveal radiating
 * from the button. Falls back to an instant swap for reduced motion
 * and browsers without startViewTransition.
 */
export function ThemeToggle() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  const toggleAt = useCallback((x: number, y: number, nextTheme: string) => {
    const apply = () => {
      flushSync(() => {
        document.documentElement.dataset.theme = nextTheme;
        window.dispatchEvent(new Event(THEME_EVENT));
      });
      try {
        localStorage.setItem(STORAGE_KEY, nextTheme);
      } catch {
        // storage unavailable (private mode) — theme just won't persist
      }
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startVT = (document as unknown as { startViewTransition?: ViewTransitionStarter })
      .startViewTransition;

    if (reduced || !startVT) {
      apply();
      return;
    }

    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = startVT.call(document, apply);
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 550, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
  }, []);

  const toggle = (event: MouseEvent<HTMLButtonElement>) => toggleAt(event.clientX, event.clientY, next);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      aria-pressed={theme === "light"}
      className="grid h-11 w-11 place-items-center rounded-full border border-line bg-background/70 text-foreground backdrop-blur-md transition-colors hover:border-red"
    >
      <span className="theme-icon h-4 w-4" aria-hidden="true">
        <svg className="icon-moon h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />
        </svg>
        <svg className="icon-sun h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      </span>
    </button>
  );
}
