export default function SentimentBadge({ score }: { score: number }) {
  const pct = Math.round(Math.abs(score) * 100);
  const isPos = score >= 0;
  const classes = isPos
    ? "bg-[var(--risk-low-bg)] text-[var(--risk-low-text)] border-[var(--risk-low-border)]"
    : "bg-[var(--risk-high-bg)] text-[var(--risk-high-text)] border-[var(--risk-high-border)]";
  const label = isPos ? `+${pct}` : `-${pct}`;
  const arrow = isPos ? "+" : "-";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-mono font-medium whitespace-nowrap ${classes}`}
    >
      {arrow} {label}
    </span>
  );
}
