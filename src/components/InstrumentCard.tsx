import { useNavigate } from "react-router-dom";
import type { Signal } from "@/lib/types";
import { INSTRUMENTS } from "@/lib/types";
import RiskBadge from "./RiskBadge";

const riskBar: Record<string, { width: string; color: string }> = {
  low: { width: "w-1/3", color: "bg-emerald-500" },
  medium: { width: "w-2/3", color: "bg-amber-500" },
  high: { width: "w-full", color: "bg-red-500" },
};

export default function InstrumentCard({ signal }: { signal: Signal }) {
  const navigate = useNavigate();
  const meta = INSTRUMENTS.find((i) => i.id === signal.instrument);
  const bar = riskBar[signal.riskLevel];
  const isPos = signal.direction === "positive";
  const sentColor = isPos ? "text-emerald-400" : "text-red-400";
  const sentLabel = isPos ? "Positif" : "Negatif";

  return (
    <button
      onClick={() => navigate(`/instrument/${signal.instrument}`)}
      className="w-full text-left border border-[#1a2638] bg-[#0c1220] hover:border-[#243450] hover:bg-[#0f1a2c] transition-all duration-150 p-6 group cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#1a2638]">
        <div className={`h-full ${bar.width} ${bar.color} transition-all`} />
      </div>

      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="min-w-0">
          <div className="text-xs text-[#6b7a90] mb-1 truncate">
            {meta?.description ?? signal.instrument}
          </div>
          <div className="text-2xl font-semibold text-[#d4dbe8] tracking-tight">
            {meta?.label ?? signal.instrument}
          </div>
        </div>
        <RiskBadge level={signal.riskLevel} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-[11px] text-[#6b7a90] uppercase tracking-wide mb-1.5">
            Sentimen 7D
          </div>
          <div className={`text-sm font-semibold ${sentColor}`}>
            {sentLabel}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-[#6b7a90] uppercase tracking-wide mb-1.5">
            Avg. Skor
          </div>
          <div className={`text-sm font-mono font-medium ${sentColor}`}>
            {signal.avgSentiment7d >= 0 ? "+" : ""}
            {signal.avgSentiment7d.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-[#6b7a90] uppercase tracking-wide mb-1.5">
            Berita 7D
          </div>
          <div className="text-sm font-mono font-medium text-[#d4dbe8]">
            {signal.newsCount7d}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#1a2638]">
        <span className="text-xs text-[#6b7a90]">
          Diperbarui {formatTime(signal.updatedAt)}
        </span>
        <span className="text-xs font-medium text-[#38bdf8] group-hover:text-[#7dd3fc] transition-colors">
          Lihat detail →
        </span>
      </div>
    </button>
  );
}

function formatTime(d: Date): string {
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}j lalu`;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}
