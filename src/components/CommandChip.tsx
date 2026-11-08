"use client";

import { useState } from "react";
import { profile } from "@/data/portfolio";

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
      className="rounded-full border border-line bg-surface px-4 py-3 font-mono text-xs text-muted transition-colors hover:border-red hover:text-foreground"
    >
      {copied ? "Copied ✓" : `$ ${profile.command}`}
    </button>
  );
}
