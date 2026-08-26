import { useParams, useNavigate } from "react-router-dom";
import type { InstrumentId } from "@/lib/types";
import { INSTRUMENTS } from "@/lib/types";
import { useSignals } from "@/hooks/useSignals";
import { useNews } from "@/hooks/useNews";
import { usePrices } from "@/hooks/usePrices";
import RiskBadge from "@/components/RiskBadge";
import NewsCard from "@/components/NewsCard";
import EmptyState from "@/components/EmptyState";
import CandlestickChart from "@/components/CandlestickChart";

export default function InstrumentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const instrument = id as InstrumentId;
  const meta = INSTRUMENTS.find((i) => i.id === instrument);

  const { getSignal, loading: sigLoading, error: sigError } = useSignals();
  const { news, loading: newsLoading, error: newsError } = useNews({ instrument, maxItems: 30 });
  const { candles, loading: priceLoading, error: priceError } = usePrices(instrument);
  const anyError = sigError || newsError || priceError;

  const signal = getSignal(instrument);

  if (!meta) {
    return (
      <EmptyState
        title="Instrumen tidak ditemukan"
        description={`Instrumen "${id}" tidak dikenali.`}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-5 text-xs">
        <button
          onClick={() => navigate("/")}
          className="text-[#6b7a90] hover:text-[#d4dbe8] transition-colors"
        >
          Dashboard
        </button>
        <span className="text-[#1a2638]">/</span>
        <span className="text-[#d4dbe8]">{meta.label}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-[11px] text-[#6b7a90] mb-1">{meta.description}</div>
          <h1 className="text-2xl font-mono font-medium text-[#d4dbe8] tracking-tight">
            {meta.label}
          </h1>
        </div>
        {signal && <RiskBadge level={signal.riskLevel} />}
      </div>

      {anyError && (
        <div className="border border-red-800/40 bg-red-950/30 p-4 mb-6 rounded">
          <p className="text-xs font-mono text-red-400">Gagal memuat data: {anyError}</p>
        </div>
      )}

      {signal?.riskLevel === "high" && (
        <div className="border border-red-800/50 bg-red-950/30 p-4 mb-6 flex items-start gap-3">
          <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-red-400 mb-1">
              Volatilitas tinggi terdeteksi
            </p>
            <p className="text-xs text-red-300/70 leading-relaxed">
              Beberapa berita berdampak besar terdeteksi dalam 7 hari terakhir untuk instrumen ini.
              Pantau pergerakan lebih seksama sebelum mengambil keputusan.
            </p>
          </div>
        </div>
      )}

      {signal && (
        <div className="grid grid-cols-3 gap-px bg-[#1a2638] border border-[#1a2638] mb-6">
          <StatCell
            label="Avg. Sentimen 7d"
            value={(signal.avgSentiment7d >= 0 ? "+" : "") + signal.avgSentiment7d.toFixed(3)}
            highlight={signal.avgSentiment7d >= 0 ? "pos" : "neg"}
          />
          <StatCell label="Jumlah Berita 7d" value={String(signal.newsCount7d)} />
          <StatCell
            label="Arah Sentimen"
            value={signal.direction === "positive" ? "Positif" : "Negatif"}
            highlight={signal.direction === "positive" ? "pos" : "neg"}
          />
        </div>
      )}
      {sigLoading && !signal && (
        <div className="grid grid-cols-3 gap-px bg-[#1a2638] border border-[#1a2638] mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[#070b12] px-4 py-3 animate-pulse">
              <div className="h-2 bg-[#1a2638] rounded w-1/2 mb-2" />
              <div className="h-4 bg-[#1a2638] rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      <div className="border border-[#1a2638] bg-[#0c1220] mb-6">
        <div className="border-b border-[#1a2638] px-4 py-2.5 flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#6b7a90] uppercase tracking-wider">
            Harga Historis — Candlestick
          </span>
          {!priceLoading && candles.length > 0 && (
            <span className="text-[10px] font-mono text-[#6b7a90]">{candles.length} candle</span>
          )}
        </div>
        <div className="h-72">
          {priceLoading ? (
            <div className="h-full flex items-center justify-center">
              <span className="text-xs font-mono text-[#6b7a90] animate-pulse">
                Memuat data harga...
              </span>
            </div>
          ) : candles.length === 0 ? (
            <EmptyState
              title="Data harga belum tersedia"
              description="Data candlestick belum ada di Firestore. Akan muncul otomatis setelah price job pertama selesai."
            />
          ) : (
            <CandlestickChart candles={candles} />
          )}
        </div>
      </div>

      <div className="border border-[#1a2638]">
        <div className="border-b border-[#1a2638] px-4 py-2.5 flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#6b7a90] uppercase tracking-wider">
            Berita Terkait
          </span>
          {!newsLoading && (
            <span className="text-[10px] font-mono text-[#6b7a90]">{news.length} artikel</span>
          )}
        </div>
        {newsLoading ? (
          <NewsLoadingSkeleton />
        ) : news.length === 0 ? (
          <EmptyState
            title="Belum ada berita"
            description="Berita untuk instrumen ini belum tersedia di Firestore."
          />
        ) : (
          <div className="divide-y divide-[#1a2638]">
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
      ? "text-emerald-400"
      : highlight === "neg"
      ? "text-red-400"
      : "text-[#d4dbe8]";
  return (
    <div className="bg-[#070b12] px-4 py-3">
      <div className="text-[10px] font-mono text-[#6b7a90] uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className={`text-sm font-mono font-medium ${valColor}`}>{value}</div>
    </div>
  );
}

function NewsLoadingSkeleton() {
  return (
    <div className="divide-y divide-[#1a2638]">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 animate-pulse">
          <div className="flex gap-2 mb-2">
            <div className="h-2 bg-[#1a2638] rounded w-16" />
            <div className="h-2 bg-[#1a2638] rounded w-10" />
          </div>
          <div className="h-3 bg-[#1a2638] rounded w-3/4 mb-2" />
          <div className="h-2 bg-[#1a2638] rounded w-full mb-1" />
          <div className="h-2 bg-[#1a2638] rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}
