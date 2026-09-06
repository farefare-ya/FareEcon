// Sumber: Stooq (stooq.com) — CSV export gratis, TANPA API key, tanpa registrasi.
//
// CATATAN JUJUR: ini bukan "API resmi" yang didokumentasikan Stooq secara formal.
// Ini endpoint yang sama persis dipakai tombol "Download data in .csv file" di
// situs mereka sendiri — jadi ini fitur ekspor yang memang mereka sediakan untuk
// publik (beda dari scraping halaman internal yang gak dimaksudkan buat diakses
// otomatis). Tapi tetap: TIDAK ada jaminan SLA resmi, format bisa berubah kapan
// saja tanpa pemberitahuan. Belum pernah dites langsung ke endpoint aslinya dari
// lingkunganku (gak ada akses jaringan ke stooq.com) — verifikasi manual dulu
// sebelum production (buka URL-nya di browser, harus keluar teks CSV).
const STOOQ_TICKERS = {
  NVDA: "nvda.us",
  META: "meta.us",
  GOOGL: "googl.us",
  AAPL: "aapl.us",
  LMT: "lmt.us",
  PLTR: "pltr.us",
};

export async function fetchStockCandles(instrument) {
  const symbol = STOOQ_TICKERS[instrument];
  if (!symbol) throw new Error(`Ticker Stooq tidak dikenal untuk instrumen "${instrument}"`);

  const url = `https://stooq.com/q/d/l/?s=${symbol}&i=d`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Stooq gagal: HTTP ${res.status}`);

  const text = await res.text();
  // Stooq balas HTML atau teks pesan (bukan HTTP error code) kalau simbol salah
  // atau kena limit — jadi harus dicek manual begini, bukan cuma res.ok.
  if (text.trim().startsWith("<") || text.length < 20) {
    throw new Error(`Respons Stooq tidak sesuai harapan untuk "${symbol}": ${text.slice(0, 150)}`);
  }

  const lines = text.trim().split("\n");
  const rows = lines.slice(1); // baris pertama header: Date,Open,High,Low,Close,Volume

  return rows
    .map((line) => {
      const [date, open, high, low, close] = line.split(",");
      if (!date || !open || open === "N/D") return null;
      return {
        timestamp: new Date(date),
        open: Number(open),
        high: Number(high),
        low: Number(low),
        close: Number(close),
        approximate: false,
      };
    })
    .filter((c) => c !== null);
}
