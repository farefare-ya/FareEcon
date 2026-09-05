import { useParams, useNavigate } from "react-router-dom";
import type { InstrumentId } from "@/lib/types";
import { useSignals } from "@/hooks/useSignals";
import { useNews } from "@/hooks/useNews";
import { usePrices } from "@/hooks/usePrices";
import { useLanguage, useInstrumentMeta } from "@/lib/language";
import RiskBadge from "@/components/RiskBadge";
import NewsCard from "@/components/NewsCard";
import EmptyState from "@/components/EmptyState";
import CandlestickChart from "@/components/CandlestickChart";

export default function InstrumentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const instrument = id as InstrumentId;
  const { t } = useLanguage();
  const meta = useInstrumentMeta(instrument);

  const { getSignal, loading: sigLoading, error: sigError } = useSignals();
  const { news, loading: newsLoading, error: newsError } = useNews({ instrument, maxItems: 30 });
  const { candles, loading: priceLoading, error: priceError } = usePrices(instrument);
  const anyError = sigError || newsError || priceError;

  const signal = getSignal(instrument);

  if (!meta) {
    return (
      <EmptyState
        title={t.instrumentDetail.notFoundTitle}
        description={t.instrumentDetail.notFoundDesc(id ?? "")}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-5 text-xs">
        <button
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {t.nav.dashboard}
        </button>
        <span className="text-border">/</span>
        <span className="text-foreground">{meta.label}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-[11px] text-muted-foreground mb-1">{meta.description}</div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">
            {meta.label}
          </h1>
        </div>
        {signal && <RiskBadge level={signal.riskLevel} />}
      </div>

      {anyError && (
        <div className="border border-[var(--risk-high-border)] bg-[var(--risk-high-bg)] p-4 mb-6 rounded">
          <p className="text-xs text-[var(--risk-high-text)]">{t.instrumentDetail.error(anyError)}</p>
        </div>
      )}

      {signal?.riskLevel === "high" && (
        <div className="border border-[var(--risk-high-border)] bg-[var(--risk-high-bg)] p-4 mb-6 flex items-start gap-3">
          <div className="w-1 h-1 rounded-full bg-red-500 mt-1.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-[var(--risk-high-text)] mb-1">
              {t.instrumentDetail.highVolatility}
            </p>
            <p className="text-xs text-[var(--risk-high-text)] opacity-70 leading-relaxed">
              {t.instrumentDetail.highVolatilityDesc}
            </p>
          </div>
        </div>
      )}

      {signal && (
        <div className="grid grid-cols-3 gap-px bg-border border border-border mb-6">
          <StatCell
            label={t.instrumentDetail.avgSentiment7d}
            value={(signal.avgSentiment7d >= 0 ? "+" : "") + signal.avgSentiment7d.toFixed(3)}
            highlight={signal.avgSentiment7d >= 0 ? "pos" : "neg"}
          />
          <StatCell label={t.instrumentDetail.newsCount7d} value={String(signal.newsCount7d)} />
          <StatCell
            label={t.instrumentDetail.direction}
            value={signal.direction === "positive" ? t.instrumentCard.positive : t.instrumentCard.negative}
            highlight={signal.direction === "positive" ? "pos" : "neg"}
          />
        </div>
      )}
      {sigLoading && !signal && (
        <div className="grid grid-cols-3 gap-px bg-border border border-border mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-background px-4 py-3 animate-pulse">
              <div className="h-2 bg-border rounded w-1/2 mb-2" />
              <div className="h-4 bg-border rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      <div className="border border-border bg-card mb-6">
        <div className="border-b border-border px-4 py-2.5 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
            {t.instrumentDetail.priceHistory}
          </span>
          {!priceLoading && candles.length > 0 && (
            <span className="text-[11px] text-muted-foreground">{t.instrumentDetail.candleCount(candles.length)}</span>
          )}
        </div>
        <div className="h-72">
          {priceLoading ? (
            <div className="h-full flex items-center justify-center">
              <span className="text-xs text-muted-foreground animate-pulse">
                {t.instrumentDetail.loadingPrice}
              </span>
            </div>
          ) : candles.length === 0 ? (
            <EmptyState
              title={t.instrumentDetail.noPriceTitle}
              description={t.instrumentDetail.noPriceDesc}
            />
          ) : (
            <CandlestickChart candles={candles} />
          )}
        </div>
      </div>

      <div className="border border-border">
        <div className="border-b border-border px-4 py-2.5 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
            {t.instrumentDetail.relatedNews}
          </span>
          {!newsLoading && (
            <span className="text-[11px] text-muted-foreground">{t.instrumentDetail.articleCount(news.length)}</span>
          )}
        </div>
        {newsLoading ? (
          <NewsLoadingSkeleton />
        ) : news.length === 0 ? (
          <EmptyState
            title={t.instrumentDetail.noNewsTitle}
            description={t.instrumentDetail.noNewsDesc}
          />
        ) : (
          <div className="divide-y divide-border">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCell({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "pos" | "neg";
}) {
  const valColor =
    highlight === "pos"
      ? "text-[var(--risk-low-text)]"
      : highlight === "neg"
      ? "text-[var(--risk-high-text)]"
      : "text-foreground";
  return (
    <div className="bg-background px-4 py-3 min-w-0">
      <div className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1 truncate">
        {label}
      </div>
      <div className={`text-sm font-mono font-medium whitespace-nowrap ${valColor}`}>{value}</div>
    </div>
  );
}

function NewsLoadingSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 animate-pulse">
          <div className="flex gap-2 mb-2">
            <div className="h-2 bg-border rounded w-16" />
            <div className="h-2 bg-border rounded w-10" />
          </div>
          <div className="h-3 bg-border rounded w-3/4 mb-2" />
          <div className="h-2 bg-border rounded w-full mb-1" />
          <div className="h-2 bg-border rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}
