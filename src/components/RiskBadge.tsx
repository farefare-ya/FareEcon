import type { RiskLevel } from "@/lib/types";

const config: Record<RiskLevel, { label: string; classes: string; dot: string }> = {
  low: {
    label: "RENDAH",
    classes: "bg-[var(--risk-low-bg)] text-[var(--risk-low-text)] border-[var(--risk-low-border)]",
    dot: "bg-emerald-500",
  },
  medium: {
    label: "SEDANG",
    classes: "bg-[var(--risk-medium-bg)] text-[var(--risk-medium-text)] border-[var(--risk-medium-border)]",
    dot: "bg-amber-500",
  },
  high: {
    label: "TINGGI",
    classes: "bg-[var(--risk-high-bg)] text-[var(--risk-high-text)] border-[var(--risk-high-border)]",
    dot: "bg-red-500",
  },
};

export default function RiskBadge({ level }: { level: RiskLevel }) {
  const c = config[level];
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide whitespace-nowrap ${c.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
      RISIKO {c.label}
    </span>
  );
}
