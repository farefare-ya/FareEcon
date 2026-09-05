import { useSignals } from "@/hooks/useSignals";
import { useNews } from "@/hooks/useNews";
import { useWatchlist } from "@/hooks/useWatchlist";
import { INSTRUMENT_IDS } from "@/lib/types";
import { useLanguage } from "@/lib/language";
import InstrumentCard from "@/components/InstrumentCard";
import NewsCard from "@/components/NewsCard";
import EmptyState from "@/components/EmptyState";

// Kategori yang dianggap paling berdampak luas — kebijakan moneter (Fed/BI),
// geopolitik (perang, sanksi), dan korporasi besar (earnings raksasa teknologi).
// Bukan "trending" beneran (itu butuh deteksi lintas-sumber yang lebih canggih),
// tapi cara sederhana & jujur buat naikkan berita yang kemungkinan besar penting.
const VITAL_CATEGORIES = ["monetary_policy", "geopolitics", "corporate"];

export default function Dashboard() {
  const { signals, loading, error } = useSignals();
  const { watchlist } = useWatchlist();
  const { t, lang } = useLanguage();

  const watchedSignals = INSTRUMENT_IDS.filter((id) => watchlist.includes(id))
    .map((id) => signals.find((s) => s.instrument === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const highRiskCount = watchedSignals.filter((s) => s.riskLevel === "high").length;

  const { news } = useNews({ maxItems: 80 });
  const highlights = [...news]
    .filter((n) => VITAL_CATEGORIES.includes(n.category))
    .sort((a, b) => Math.abs(b.sentiment) - Math.abs(a.sentiment))
    .slice(0, 4);

  const todayLabel = new Date().toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-sm font-semibold text-foreground tracking-wide uppercase">
            {t.dashboard.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">{todayLabel}</p>
        </div>
        {highRiskCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--risk-high-bg)] border border-[var(--risk-high-border)] rounded text-xs text-[var(--risk-high-text)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
            </span>
            {t.dashboard.highRisk(highRiskCount)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-px bg-border border border-border mb-6 text-xs">
        {(["low", "medium", "high"] as const).map((level) => {
          const count = watchedSignals.filter((s) => s.riskLevel === level).length;
          const labelMap = {
            low: t.dashboard.riskLow,
            medium: t.dashboard.riskMedium,
            high: t.dashboard.riskHigh,
          };
          const colorMap = {
            low: "text-[var(--risk-low-text)]",
            medium: "text-[var(--risk-medium-text)]",
            high: "text-[var(--risk-high-text)]",
          };
          return (
            <div key={level} className="bg-background px-5 py-3.5 flex items-center gap-3 whitespace-nowrap">
              <span className="text-muted-foreground uppercase tracking-wide">{labelMap[level]}</span>
              <span className={`font-semibold ${colorMap[level]}`}>{count}</span>
            </div>
          );
        })}
        <div className="bg-background px-5 py-3.5 flex items-center gap-3 whitespace-nowrap">
          <span className="text-muted-foreground uppercase tracking-wide">{t.dashboard.watched}</span>
          <span className="font-semibold text-accent">{watchedSignals.length}</span>
        </div>
      </div>

      {error && (
        <div className="border border-[var(--risk-high-border)] bg-[var(--risk-high-bg)] p-4 rounded mb-6">
          <p className="text-xs text-[var(--risk-high-text)]">{t.dashboard.firestoreError(error)}</p>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : watchedSignals.length === 0 ? (
        <EmptyState title={t.dashboard.emptyTitle} description={t.dashboard.emptyDesc} />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-5">
          {watchedSignals.map((signal) => (
            <InstrumentCard key={signal.instrument} signal={signal} />
          ))}
        </div>
      )}

      {highlights.length > 0 && (
        <div className="mt-8">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide">
              {t.dashboard.highlights}
            </h2>
            <span className="text-[11px] text-muted-foreground">
              {t.dashboard.highlightsSubtitle}
            </span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-3">
            {highlights.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 border border-border bg-card p-4 flex items-start gap-3">
        <div className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t.dashboard.disclaimer}{" "}
          <span className="text-foreground">{t.dashboard.disclaimerBold}</span>
        </p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border border-border bg-card p-6 animate-pulse">
          <div className="h-3 bg-border rounded w-2/3 mb-3" />
          <div className="h-5 bg-border rounded w-1/3 mb-5" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j}>
                <div className="h-2 bg-border rounded mb-2" />
                <div className="h-3 bg-border rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
