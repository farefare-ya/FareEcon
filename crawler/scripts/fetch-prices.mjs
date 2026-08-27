import { fetchBtcCandles } from "./lib/fetchers/btc.mjs";
import { fetchUsdIdrCandles } from "./lib/fetchers/usdidr.mjs";
import { fetchGoldCandles } from "./lib/fetchers/gold.mjs";
import { upsertPriceCandles } from "./lib/firestore.mjs";

// BTC dan GOLD dua-duanya lewat CoinGecko (GOLD pakai proxy token PAXG yang
// dipatok ke harga emas asli) — satu sumber, satu pola kode, tanpa API key.
// USDIDR lewat Frankfurter, juga tanpa key. IHSG masih belum ada sumber
// gratis yang solid, sengaja belum disertakan.
const JOBS = [
  { instrument: "BTC", fetch: () => fetchBtcCandles(90) },
  { instrument: "USDIDR", fetch: () => fetchUsdIdrCandles(90) },
  { instrument: "GOLD", fetch: () => fetchGoldCandles(90) },
];

async function main() {
  console.log(`Mulai ambil data harga untuk ${JOBS.length} instrumen.`);

  for (const job of JOBS) {
    try {
      const candles = await job.fetch();
      if (!candles.length) {
        console.warn(`[${job.instrument}] Fetch sukses tapi 0 candle dikembalikan, skip simpan.`);
        continue;
      }
      const saved = await upsertPriceCandles(job.instrument, candles);
      const approxNote = candles[0]?.approximate ? " (rate harian, bukan OHLC bursa asli)" : "";
      console.log(`[${job.instrument}] OK — ${saved} candle disimpan${approxNote}.`);
    } catch (err) {
      console.error(`[${job.instrument}] GAGAL: ${err.message}`);
    }
  }

  console.log("Selesai.");
  process.exit(0); // keluar paksa — koneksi Firestore Admin SDK suka menggantung kalau tidak dipaksa
}

main().catch((err) => {
  console.error("Job harga gagal total:", err);
  process.exit(1);
});
