"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { navigateToElement, refreshScrollMeasurements, registerLenis, shouldSkipFocusScroll } from "@/lib/scroll";

function isMostlyVisible(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const topClearance = 104;
  const bottomClearance = 88;
  return rect.bottom > topClearance && rect.top < window.innerHeight - bottomClearance;
}

// Focus inside fixed UI (dock pill, header, dialogs) must never move the
// page: their viewport position is scroll-independent, so a Lenis chase is
// a pure scroll glitch.
function isInsideFixedUi(element: HTMLElement) {
  let node: HTMLElement | null = element;
  while (node) {
    if (getComputedStyle(node).position === "fixed") return true;
    node = node.parentElement;
  }
  return false;
}

export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let lenis: Lenis | null = null;
    let unregisterLenis: (() => void) | null = null;
    let frame = 0;
    let resizeFrame = 0;

    const scheduleMeasurementRefresh = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        refreshScrollMeasurements();
      });
    };

    // Content can change after Motion's first measurement (fonts, images, the
    // measured footer spacer, lazy sections). Re-measure Lenis and give
    // Motion's window-scroll listeners one explicit tick whenever layout size
    // settles. ResizeObserver does not fire for transforms, so this stays cheap.
    const resizeObserver = new ResizeObserver(scheduleMeasurementRefresh);
    resizeObserver.observe(document.body);

    const onRelease = () => scheduleMeasurementRefresh();
    window.addEventListener("codered:release", onRelease);
    document.fonts?.ready.then(scheduleMeasurementRefresh).catch(() => {});

    // Anchor clicks always move focus to the target. The focus-chasing
    // handler below deliberately skips this one focus call; otherwise it
    // interrupts the Lenis tween with a second immediate scroll.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = (event.target as HTMLElement).closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!link || link.target) return;
      const hash = link.getAttribute("href");
      if (!hash || hash.length < 2) return;

      const id = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      navigateToElement(target, hash);
    };
    document.addEventListener("click", onClick);

    // Keep keyboard focus on screen without fighting anchor tweens. Native
    // tab scrolling syncs Lenis; this only catches focus that remains hidden.
    const onFocusIn = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      if (shouldSkipFocusScroll(event.target)) return;
      if (!lenis || isInsideFixedUi(event.target) || isMostlyVisible(event.target)) return;
      lenis.scrollTo(event.target, { immediate: true });
    };

    if (!reduced && !coarse) {
      lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        allowNestedScroll: true,
      });
      unregisterLenis = registerLenis(lenis);
      document.addEventListener("focusin", onFocusIn);

      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    }

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("codered:release", onRelease);
      resizeObserver.disconnect();
      cancelAnimationFrame(resizeFrame);
      if (frame) cancelAnimationFrame(frame);
      unregisterLenis?.();
      lenis?.destroy();
    };
  }, []);

  return null;
}
