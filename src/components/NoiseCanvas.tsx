"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";

/**
 * Analog static for the LOCK-ON tuner's dead-air moments. Tiny 2D canvas
 * (96×54 noise scaled up, pixelated), redrawn at ~12fps only while the detune
 * intensity is meaningfully above zero and the canvas is on screen.
 */
export function NoiseCanvas({ intensity, className = "" }: { intensity: MotionValue<number>; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const W = 96;
    const H = 54;
    canvas.width = W;
    canvas.height = H;
    const image = ctx.createImageData(W, H);

    let frame = 0;
    let raf = 0;
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const render = () => {
      frame += 1;
      const level = intensity.get();
      if (visible && level > 0.02 && frame % 5 === 0) {
        const data = image.data;
        for (let i = 0; i < data.length; i += 4) {
          const v = Math.random() * 255;
          data[i] = v;
          data[i + 1] = v * 0.82;
          data[i + 2] = v * 0.82;
          data[i + 3] = 255 * Math.min(0.5, level * 0.5);
        }
        ctx.putImageData(image, 0, 0);
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none h-full w-full [image-rendering:pixelated] ${className}`}
    />
  );
}
