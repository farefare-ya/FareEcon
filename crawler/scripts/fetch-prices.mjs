import { fetchBtcCandles } from "./lib/fetchers/btc.mjs";
import { fetchUsdIdrCandles } from "./lib/fetchers/usdidr.mjs";
import { upsertPriceCandles } from "./lib/firestore.mjs";

// Sengaja cuma 2 instrumen: BTC (CoinGecko) dan USDIDR (Frankfurter) — dua-duanya
// gratis, open-source/terdokumentasi baik, dan TIDAK butuh API key sama sekali.
// GOLD dan IHSG sengaja belum dimasukkan karena belum ada sumber gratis yang
// solid untuk itu — daripada nambah API pihak ketiga yang meragukan, mending
// jujur belum mendukung dulu. Bisa ditambah nanti kalau ketemu sumber yang layak.
const JOBS = [
  { instrument: "BTC", fetch: () => fetchBtcCandles(90) },
  { instrument: "USDIDR", fetch: () => fetchUsdIdrCandles(90) },
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
}

main().catch((err) => {
  console.error("Job harga gagal total:", err);
  process.exit(1);
});
