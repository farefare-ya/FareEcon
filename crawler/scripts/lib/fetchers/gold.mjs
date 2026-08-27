// Sumber: CoinGecko, coin id "pax-gold" (PAXG) — token yang nilainya dipatok
// 1:1 ke 1 troy ons emas asli, dijaga oleh cadangan emas fisik. Harganya
// mengikuti harga emas spot sangat dekat (biasanya <0.5% selisih).
//
// Kenapa ini dipilih dan bukan API "emas" khusus: ini pakai ulang endpoint
// CoinGecko yang SAMA PERSIS dengan yang dipakai BTC — tanpa API key baru,
// tanpa kuota baru, tanpa dependency baru. OHLC-nya asli (bukan aproksimasi).
export async function fetchGoldCandles(days = 90) {
  const url = `https://api.coingecko.com/api/v3/coins/pax-gold/ohlc?vs_currency=usd&days=${days}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`CoinGecko OHLC (PAXG/emas) gagal: HTTP ${res.status}`);
  }
  const raw = await res.json();

  return raw.map(([ts, open, high, low, close]) => ({
    timestamp: new Date(ts),
    open,
    high,
    low,
    close,
    approximate: false,
  }));
}
