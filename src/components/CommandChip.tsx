'use client';

import { useState } from 'react';
import { profile } from '@/data/portfolio';

export function CommandChip() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${profile.command}`}
      aria-pressed={copied}
      className={`neu rounded-full px-4 py-3 font-mono text-xs transition-colors hover:text-foreground ${copied ? 'text-green' : 'text-muted'}`}
    >
      {copied ? 'Copied ✓' : `$ ${profile.command}`}
    </button>
  );
}
