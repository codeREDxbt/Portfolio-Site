type SignalMarkProps = {
  className?: string;
};

/**
 * codeRED red-signal identity mark: a miniaturized signal origin
 * (concentric rings, acquisition hairline, rotating arc, pulse).
 * Pure SVG + CSS — renders static under prefers-reduced-motion.
 */
export function SignalMark({ className = "" }: SignalMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-block overflow-hidden rounded-full border border-line bg-surface ${className}`}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 176 96"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {/* concentric signal rings, cropped by the pill edges */}
        <circle cx="88" cy="48" r="46" style={{ stroke: "var(--red)" }} strokeOpacity="0.12" />
        <circle cx="88" cy="48" r="30" style={{ stroke: "var(--red)" }} strokeOpacity="0.2" />
        <circle cx="88" cy="48" r="15" style={{ stroke: "var(--red)" }} strokeOpacity="0.3" />

        {/* acquisition hairline + edge ticks */}
        <line x1="0" y1="48" x2="176" y2="48" style={{ stroke: "var(--red)" }} strokeOpacity="0.22" />
        <line x1="12" y1="43" x2="12" y2="53" style={{ stroke: "var(--red)" }} strokeOpacity="0.35" />
        <line x1="164" y1="43" x2="164" y2="53" style={{ stroke: "var(--red)" }} strokeOpacity="0.35" />

        {/* rotating sweep arc */}
        <circle
          className="signal-arc"
          cx="88"
          cy="48"
          r="30"
          style={{ stroke: "var(--red)" }}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="26 163"
        />

        {/* expanding pulse + solid core */}
        <circle className="signal-ping" cx="88" cy="48" r="4" style={{ stroke: "var(--red)" }} opacity="0" />
        <circle className="signal-ping signal-ping-delay" cx="88" cy="48" r="4" style={{ stroke: "var(--red)" }} opacity="0" />
        <circle cx="88" cy="48" r="3" style={{ fill: "var(--red)" }} />
      </svg>
    </span>
  );
}
