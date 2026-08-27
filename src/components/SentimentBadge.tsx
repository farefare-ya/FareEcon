export default function SentimentBadge({ score }: { score: number }) {
  const pct = Math.round(Math.abs(score) * 100);
  const isPos = score >= 0;
  const classes = isPos
    ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/50"
    : "bg-red-950/60 text-red-400 border-red-800/50";
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
