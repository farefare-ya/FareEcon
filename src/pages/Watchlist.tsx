import { INSTRUMENTS } from "@/lib/types";
import { useWatchlist } from "@/hooks/useWatchlist";

export default function Watchlist() {
  const { toggle, isWatching, watchlist } = useWatchlist();

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-sm font-semibold text-[#d4dbe8] tracking-wide uppercase mb-0.5">
          Watchlist
        </h1>
        <p className="text-xs text-[#6b7a90]">
          Pilih instrumen yang ingin ditampilkan di dashboard utama. Preferensi disimpan di browser.
        </p>
      </div>

      <div className="border border-[#1a2638] divide-y divide-[#1a2638]">
        {INSTRUMENTS.map((inst) => {
          const watching = isWatching(inst.id);
          return (
            <div
              key={inst.id}
              className={`flex items-center justify-between px-5 py-4 transition-colors ${
                watching ? "bg-[#0c1220]" : "bg-[#070b12]"
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-[#d4dbe8]">{inst.label}</span>
                  <span className="text-[11px] text-[#6b7a90] border border-[#1a2638] px-1.5 py-0.5 rounded">
                    {inst.id}
                  </span>
                </div>
                <p className="text-xs text-[#6b7a90]">{inst.description}</p>
              </div>
              <button
                onClick={() => toggle(inst.id)}
                role="switch"
                aria-checked={watching}
                aria-label={`${watching ? "Hapus" : "Tambah"} ${inst.label}`}
                className="relative w-10 h-5 shrink-0 rounded-full transition-colors duration-200"
                style={{ backgroundColor: watching ? "#38bdf8" : "#1a2638" }}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ transform: watching ? "translateX(20px)" : "translateX(0px)" }}
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 px-4 py-3 border border-[#1a2638] bg-[#0c1220]">
        <p className="text-xs text-[#6b7a90] leading-relaxed">
          Saat ini memantau{" "}
          <span className="text-[#38bdf8] font-medium">{watchlist.length} instrumen</span>. Data
          disimpan di localStorage browser ini dan akan hilang jika cache dibersihkan.
        </p>
      </div>
    </div>
  );
}
