import { useNavigate } from "react-router-dom";
import type { Signal } from "@/lib/types";
import { useLanguage, useInstrumentMeta } from "@/lib/language";
import RiskBadge from "./RiskBadge";

const riskBar: Record<string, { width: string; color: string }> = {
  low: { width: "w-1/3", color: "bg-emerald-500" },
  medium: { width: "w-2/3", color: "bg-amber-500" },
  high: { width: "w-full", color: "bg-red-500" },
};

export default function InstrumentCard({ signal }: { signal: Signal }) {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const meta = useInstrumentMeta(signal.instrument);
  const bar = riskBar[signal.riskLevel];
  const isPos = signal.direction === "positive";
  const sentColor = isPos ? "text-[var(--risk-low-text)]" : "text-[var(--risk-high-text)]";
  const sentLabel = isPos ? t.instrumentCard.positive : t.instrumentCard.negative;

  return (
    <button
      onClick={() => navigate(`/instrument/${signal.instrument}`)}
      className="w-full text-left border border-border bg-card hover:border-[var(--border-hover)] hover:bg-muted transition-all duration-150 p-6 group cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-border">
        <div className={`h-full ${bar.width} ${bar.color} transition-all`} />
      </div>

      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground mb-1 truncate">
            {meta?.description ?? signal.instrument}
          </div>
          <div className="text-2xl font-semibold text-foreground tracking-tight">
            {meta?.label ?? signal.instrument}
          </div>
        </div>
        <div className="shrink-0">
          <RiskBadge level={signal.riskLevel} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="min-w-0">
          <div className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1.5 whitespace-nowrap">
            {t.instrumentCard.sentiment7d}
          </div>
          <div className={`text-sm font-semibold whitespace-nowrap ${sentColor}`}>
            {sentLabel}
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1.5 whitespace-nowrap">
            {t.instrumentCard.avgScore}
          </div>
          <div className={`text-sm font-mono font-medium whitespace-nowrap ${sentColor}`}>
            {signal.avgSentiment7d >= 0 ? "+" : ""}
            {signal.avgSentiment7d.toFixed(2)}
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1.5 whitespace-nowrap">
            {t.instrumentCard.news7d}
          </div>
          <div className="text-sm font-mono font-medium text-foreground whitespace-nowrap">
            {signal.newsCount7d}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {t.instrumentCard.updated(formatTime(signal.updatedAt, lang))}
        </span>
        <span className="text-xs font-medium text-accent group-hover:text-[var(--accent-hover)] transition-colors whitespace-nowrap">
          {t.instrumentCard.viewDetail}
        </span>
      </div>
    </button>
  );
}

function formatTime(d: Date, lang: "id" | "en"): string {
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const locale = lang === "id" ? "id-ID" : "en-US";
  if (mins < 60) return lang === "id" ? `${mins}m lalu` : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return lang === "id" ? `${hrs}j lalu` : `${hrs}h ago`;
  return d.toLocaleDateString(locale, { day: "numeric", month: "short" });
}
