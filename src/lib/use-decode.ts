"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "█▓▒░◢◣/\\|+·";

/**
 * Left-to-right decode reveal: while `play` is true, characters resolve
 * one at a time (~24ms/char) with unresolved slots showing signal glyphs.
 * Cancel-safe; re-arms whenever `play` flips false → true.
 */
export function useDecode(text: string, play: boolean, reduced: boolean) {
  const [display, setDisplay] = useState(text);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!play || reduced) {
      const settle = window.setTimeout(() => setDisplay(text), 0);
      return () => window.clearTimeout(settle);
    }

    let index = 0;
    const step = () => {
      index += 1;
      setDisplay(
        text
          .split("")
          .map((char, position) => {
            if (position < index) return char;
            if (char === " ") return " ";
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );
      if (index < text.length) timerRef.current = window.setTimeout(step, 24);
    };
    timerRef.current = window.setTimeout(step, 24);

    return () => window.clearTimeout(timerRef.current);
  }, [text, play, reduced]);

  return display;
}
