import type Lenis from "lenis";

let lenis: Lenis | null = null;
let lockCount = 0;
let previousBodyOverflow = "";
let focusSuppressedFor: HTMLElement | null = null;

export function registerLenis(instance: Lenis) {
  lenis = instance;
  return () => {
    if (lenis === instance) lenis = null;
  };
}

export function refreshScrollMeasurements() {
  lenis?.resize();
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("scroll", { bubbles: false }));
  });
}

export function scrollToTarget(target: HTMLElement) {
  if (lenis) {
    lenis.scrollTo(target, {
      duration: 1.05,
      easing: (value: number) => 1 - Math.pow(1 - value, 4),
    });
    return;
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

export function shouldSkipFocusScroll(target: HTMLElement) {
  return focusSuppressedFor === target;
}

export function scrollToOffset(y: number) {
  if (lenis) {
    lenis.scrollTo(y, {
      duration: 1.0,
      easing: (value: number) => 1 - Math.pow(1 - value, 4),
    });
    return;
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
}

export function navigateToElement(target: HTMLElement, hash: string) {
  history.pushState(null, "", hash);
  target.setAttribute("tabindex", "-1");

  // The focus-in repair handler must not turn this focus move into an
  // immediate competing scroll while the smooth tween is running.
  focusSuppressedFor = target;

  // Let an overlay that is closing on this same click remove inert/scroll
  // locks before focus and the tween start.
  requestAnimationFrame(() => {
    target.focus({ preventScroll: true });
    requestAnimationFrame(() => {
      scrollToTarget(target);
      window.setTimeout(() => {
        if (focusSuppressedFor === target) focusSuppressedFor = null;
      }, 0);
    });
  });
}

export function lockPageScroll() {
  lockCount += 1;

  if (lockCount === 1) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
  }

  return () => {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount > 0) return;

    document.body.style.overflow = previousBodyOverflow;
    lenis?.start();
    refreshScrollMeasurements();
  };
}
