// Daftar sumber RSS. Tambah/kurangi sesuai kebutuhan.
// PENTING: RSS feed kadang mati/berubah URL tanpa pemberitahuan.
// Sebelum deploy, coba buka tiap URL di bawah ini di browser —
// kalau muncul XML valid, feed-nya masih hidup.
//
// `instrumentHints` = instrumen yang biasanya relevan dari sumber ini,
// dipakai sebagai fallback kalau AI gagal mengklasifikasi.

export const RSS_SOURCES = [
  {
    name: "Kontan - Keuangan",
    url: "https://rss.kontan.co.id/news/keuangan",
    region: "id",
    instrumentHints: ["IHSG", "USDIDR"],
  },
  {
    name: "Kontan - Nasional",
    url: "https://rss.kontan.co.id/news/nasional",
    region: "id",
    instrumentHints: ["IHSG", "USDIDR"],
  },
  {
    name: "CNBC Indonesia - News",
    url: "https://www.cnbcindonesia.com/news/rss",
    region: "id",
    instrumentHints: ["IHSG", "USDIDR"],
  },
  {
    name: "Detik Finance",
    url: "https://finance.detik.com/rss",
    region: "id",
    instrumentHints: ["IHSG", "USDIDR"],
  },
  {
    name: "CNN Indonesia - Ekonomi",
    url: "https://www.cnnindonesia.com/ekonomi/rss",
    region: "id",
    instrumentHints: ["IHSG", "USDIDR"],
  },

  // Sumber global — verifikasi dulu sebelum dipakai, feed luar negeri
  // sering berubah kebijakan RSS-nya.
  {
    name: "Yahoo Finance - Top News",
    url: "https://finance.yahoo.com/news/rssindex",
    region: "global",
    instrumentHints: ["BTC", "USDIDR"],
  },
];
