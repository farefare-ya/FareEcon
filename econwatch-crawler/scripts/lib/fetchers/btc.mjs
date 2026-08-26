// Sumber: CoinGecko — benar-benar gratis, tanpa API key, well-documented.
// Endpoint /coins/{id}/ohlc mengembalikan candle asli (bukan aproksimasi),
// jadi ini yang paling "solid" dari 4 instrumen yang kita pantau.
export async function fetchBtcCandles(days = 90) {
  const url = `https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=${days}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`CoinGecko OHLC gagal: HTTP ${res.status}`);
  }
  const raw = await res.json(); // [[timestamp_ms, open, high, low, close], ...]

  return raw.map(([ts, open, high, low, close]) => ({
    timestamp: new Date(ts),
    open,
    high,
    low,
    close,
    approximate: false,
  }));
}
