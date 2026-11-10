'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { profile } from '@/data/portfolio';

/**
 * "Station retune" — the hero eyebrow is a receiver readout. It holds on a
 * locked channel, briefly hashes into static, then hard-locks onto the next.
 * Each lock fires `codered:retune` so the ribbon field answers with a pulse.
 * Screen readers always get the static role; shuffle glyphs are aria-hidden.
 */
const CHANNELS = ['Full-stack Engineer', 'Web3 Systems', 'SaaS Products', 'Product Interfaces'];
const GLYPHS = '█▓▒░<>/\\|+=·';

function detune(text: string) {
  return text
    .split('')
    .map((char) => {
      if (char === ' ' || char === '-') return char;
      return Math.random() < 0.4 ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : char;
    })
    .join('');
}

export function ChannelReadout() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState(CHANNELS[0]);
  const [tuning, setTuning] = useState(false);

  useEffect(() => {
    if (reduced) return;

    let interval: number | undefined;
    let tuneTimer: number | undefined;
    let current = 0;

    const retune = () => {
      const next = (current + 1) % CHANNELS.length;
      setTuning(true);
      setDisplay(detune(CHANNELS[next]));
      tuneTimer = window.setTimeout(() => {
        current = next;
        setIndex(next);
        setDisplay(CHANNELS[next]);
        setTuning(false);
        window.dispatchEvent(new Event('codered:retune'));
      }, 190);
    };

    const start = () => {
      interval = window.setInterval(() => {
        if (!document.hidden) retune();
      }, 4200);
    };

    // Hold the first channel until the boot wordmark has docked.
    if (document.documentElement.hasAttribute('data-booting')) {
      window.addEventListener('codered:dock', start, { once: true });
    } else {
      start();
    }

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(tuneTimer);
      window.removeEventListener('codered:dock', start);
    };
  }, [reduced]);

  return (
    <p className="fade-in-up font-mono text-[11px] uppercase tracking-[0.22em] text-red [animation-delay:150ms]">
      <span className="sr-only">{profile.title}</span>
      <span aria-hidden="true" className="inline-flex items-center gap-2.5" data-tuning={tuning}>
        <span className={`channel-led ${tuning ? 'channel-led-tuning' : ''}`} />
        <span className="text-dim">CH 0{index + 1}</span>
        <span className="text-dim">·</span>
        <span className={tuning ? 'text-dim' : 'text-red'}>{display}</span>
      </span>
    </p>
  );
}
