import type { RiskLevel } from "@/lib/types";

const config: Record<RiskLevel, { label: string; classes: string; dot: string }> = {
  low: {
    label: "RENDAH",
    classes: "bg-emerald-950/60 text-emerald-400 border-emerald-800/50",
    dot: "bg-emerald-400",
  },
  medium: {
    label: "SEDANG",
    classes: "bg-amber-950/60 text-amber-400 border-amber-800/50",
    dot: "bg-amber-400",
  },
  high: {
    label: "TINGGI",
    classes: "bg-red-950/60 text-red-400 border-red-800/50",
    dot: "bg-red-400",
  },
};

export default function RiskBadge({ level }: { level: RiskLevel }) {
  const c = config[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-mono font-medium tracking-wider ${c.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      RISIKO {c.label}
    </span>
  );
}
