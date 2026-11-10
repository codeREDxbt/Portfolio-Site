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
 * from the button. The icon is an eclipse dial: a red occulting disc
 * drops through the signal sun on the way to light mode and rises back
 * on the way to dark — a total eclipse mid-transit. Falls back to an
 * instant swap for reduced motion and browsers without startViewTransition.
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
      <span className="eclipse-dial" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]">
          <g
            className="dial-rays"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M12 0.8v2.4" />
            <path d="M12 20.8v2.4" />
            <path d="M0.8 12h2.4" />
            <path d="M20.8 12h2.4" />
          </g>
          <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="4.5" fill="currentColor" />
          <circle className="dial-occulter" cx="12" cy="5.6" r="5.4" fill="var(--red)" />
        </svg>
      </span>
    </button>
  );
}
