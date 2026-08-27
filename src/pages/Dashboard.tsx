import { useSignals } from "@/hooks/useSignals";
import { useWatchlist } from "@/hooks/useWatchlist";
import { INSTRUMENTS } from "@/lib/types";
import InstrumentCard from "@/components/InstrumentCard";
import EmptyState from "@/components/EmptyState";

export default function Dashboard() {
  const { signals, loading, error } = useSignals();
  const { watchlist } = useWatchlist();

  const watchedSignals = INSTRUMENTS.filter((i) => watchlist.includes(i.id))
    .map((i) => signals.find((s) => s.instrument === i.id))
    .filter(Boolean) as ReturnType<typeof useSignals>["signals"];

  const highRiskCount = watchedSignals.filter((s) => s.riskLevel === "high").length;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-sm font-semibold text-[#d4dbe8] tracking-wide uppercase">
            Market Dashboard
          </h1>
          <p className="text-xs text-[#6b7a90] mt-0.5">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        {highRiskCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-950/50 border border-red-800/40 rounded text-xs text-red-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
            </span>
            {highRiskCount} instrumen risiko tinggi
          </div>
        )}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-px bg-[#1a2638] border border-[#1a2638] mb-6 text-xs">
        {(["low", "medium", "high"] as const).map((level) => {
          const count = watchedSignals.filter((s) => s.riskLevel === level).length;
          const labelMap = { low: "Rendah", medium: "Sedang", high: "Tinggi" };
          const colorMap = { low: "text-emerald-400", medium: "text-amber-400", high: "text-red-400" };
          return (
            <div key={level} className="bg-[#070b12] px-5 py-3.5 flex items-center gap-3 whitespace-nowrap">
              <span className="text-[#6b7a90] uppercase tracking-wide">Risiko {labelMap[level]}</span>
              <span className={`font-semibold ${colorMap[level]}`}>{count}</span>
            </div>
          );
        })}
        <div className="bg-[#070b12] px-5 py-3.5 flex items-center gap-3 whitespace-nowrap">
          <span className="text-[#6b7a90] uppercase tracking-wide">Dipantau</span>
          <span className="font-semibold text-[#38bdf8]">{watchedSignals.length}</span>
        </div>
      </div>

      {error && (
        <div className="border border-red-800/40 bg-red-950/30 p-4 rounded mb-6">
          <p className="text-xs text-red-400">
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

      <div className="mt-8 border border-[#1a2638] bg-[#0c1220] p-4 flex items-start gap-3">
        <div className="w-1 h-1 rounded-full bg-[#38bdf8] mt-1.5 shrink-0" />
        <p className="text-xs text-[#6b7a90] leading-relaxed">
          Skor sentimen dihitung dari berita 7 hari terakhir menggunakan NLP. Level risiko
          mencerminkan volatilitas relatif berdasarkan volume dan dampak berita.{" "}
          <span className="text-[#d4dbe8]">Ini bukan saran investasi.</span>
        </p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border border-[#1a2638] bg-[#0c1220] p-6 animate-pulse">
          <div className="h-3 bg-[#1a2638] rounded w-2/3 mb-3" />
          <div className="h-5 bg-[#1a2638] rounded w-1/3 mb-5" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j}>
                <div className="h-2 bg-[#1a2638] rounded mb-2" />
                <div className="h-3 bg-[#1a2638] rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
