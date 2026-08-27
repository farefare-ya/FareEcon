// Sumber: Frankfurter (api.frankfurter.dev) — open-source (MIT), berbasis data
// resmi bank sentral, TANPA API key sama sekali, tanpa rate limit ketat.
// Ganti dari Alpha Vantage: gak perlu daftar, gak perlu jaga kuota harian.
//
// Catatan jujur: ini rate harian resmi (1 nilai/hari, sumbernya bank sentral,
// bukan bursa forex real-time), jadi open=high=low=close sama persis —
// ditandai `approximate: true`. Ini bukan mengarang data, cuma jujur soal
// bentuk data aslinya.
export async function fetchUsdIdrCandles(days = 90) {
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const url = `https://api.frankfurter.dev/v1/${from}..?base=USD&symbols=IDR`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Frankfurter gagal: HTTP ${res.status}`);

  const data = await res.json();
  const rates = data.rates; // { "2026-05-01": { "IDR": 16234.5 }, ... }
  if (!rates) {
    throw new Error(`Format respons Frankfurter tidak sesuai harapan: ${JSON.stringify(data).slice(0, 200)}`);
  }

  return Object.entries(rates)
    .filter(([, v]) => v?.IDR != null)
    .map(([dateStr, v]) => {
      const rate = v.IDR;
      return {
        timestamp: new Date(dateStr),
        open: rate,
        high: rate,
        low: rate,
        close: rate,
        approximate: true,
      };
    });
}
