import { useSignals } from "@/hooks/useSignals";
import { useNews } from "@/hooks/useNews";
import { useWatchlist } from "@/hooks/useWatchlist";
import { INSTRUMENTS } from "@/lib/types";
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

  const watchedSignals = INSTRUMENTS.filter((i) => watchlist.includes(i.id))
    .map((i) => signals.find((s) => s.instrument === i.id))
    .filter(Boolean) as ReturnType<typeof useSignals>["signals"];

  const highRiskCount = watchedSignals.filter((s) => s.riskLevel === "high").length;

  const { news } = useNews({ maxItems: 80 });
  const highlights = [...news]
    .filter((n) => VITAL_CATEGORIES.includes(n.category))
    .sort((a, b) => Math.abs(b.sentiment) - Math.abs(a.sentiment))
    .slice(0, 4);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-sm font-semibold text-foreground tracking-wide uppercase">
            Market Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        {highRiskCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--risk-high-bg)] border border-[var(--risk-high-border)] rounded text-xs text-[var(--risk-high-text)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
            </span>
            {highRiskCount} instrumen risiko tinggi
          </div>
        )}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-px bg-border border border-border mb-6 text-xs">
        {(["low", "medium", "high"] as const).map((level) => {
          const count = watchedSignals.filter((s) => s.riskLevel === level).length;
          const labelMap = { low: "Rendah", medium: "Sedang", high: "Tinggi" };
          const colorMap = {
            low: "text-[var(--risk-low-text)]",
            medium: "text-[var(--risk-medium-text)]",
            high: "text-[var(--risk-high-text)]",
          };
          return (
            <div key={level} className="bg-background px-5 py-3.5 flex items-center gap-3 whitespace-nowrap">
              <span className="text-muted-foreground uppercase tracking-wide">Risiko {labelMap[level]}</span>
              <span className={`font-semibold ${colorMap[level]}`}>{count}</span>
            </div>
          );
        })}
        <div className="bg-background px-5 py-3.5 flex items-center gap-3 whitespace-nowrap">
          <span className="text-muted-foreground uppercase tracking-wide">Dipantau</span>
          <span className="font-semibold text-accent">{watchedSignals.length}</span>
        </div>
      </div>

      {error && (
        <div className="border border-[var(--risk-high-border)] bg-[var(--risk-high-bg)] p-4 rounded mb-6">
          <p className="text-xs text-[var(--risk-high-text)]">
            Gagal terhubung ke Firestore: {error}. Pastikan konfigurasi Firebase sudah benar.
          </p>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : watchedSignals.length === 0 ? (
        <EmptyState
          title="Belum ada sinyal pasar"
          description="Belum ada data di Firestore. Tunggu sinkronisasi pertama dari job crawler."
        />
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
              Sorotan Utama
            </h2>
            <span className="text-[11px] text-muted-foreground">
              Kebijakan moneter, geopolitik &amp; korporasi berdampak besar
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
          Skor sentimen dihitung dari berita 7 hari terakhir menggunakan NLP. Level risiko
          mencerminkan volatilitas relatif berdasarkan volume dan dampak berita.{" "}
          <span className="text-foreground">Ini bukan saran investasi.</span>
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
