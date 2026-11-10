"use client";

import { useEffect, useState } from "react";

export function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/visitor-increment", { method: "POST" });
        const data = await response.json();
        if (!cancelled && typeof data.count === "number") setCount(data.count);
      } catch {
        // Visitor count is decorative; fail quietly.
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return <span>{count ? count.toLocaleString() : "…"}</span>;
}
