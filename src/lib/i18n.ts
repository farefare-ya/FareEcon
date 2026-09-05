export type Lang = "id" | "en";

export interface Translations {
  nav: { dashboard: string; newsFeed: string; watchlist: string };
  theme: { toLight: string; toDark: string };
  lang: { switch: string };
  dashboard: {
    title: string;
    highRisk: (n: number) => string;
    riskLow: string;
    riskMedium: string;
    riskHigh: string;
    watched: string;
    firestoreError: (e: string) => string;
    emptyTitle: string;
    emptyDesc: string;
    highlights: string;
    highlightsSubtitle: string;
    disclaimer: string;
    disclaimerBold: string;
  };
  instrumentCard: {
    sentiment7d: string;
    avgScore: string;
    news7d: string;
    updated: (t: string) => string;
    viewDetail: string;
    positive: string;
    negative: string;
  };
  newsFeed: {
    title: string;
    subtitle: string;
    instrument: string;
    category: string;
    all: string;
    error: (e: string) => string;
    articlesFound: (n: number) => string;
    emptyTitle: string;
    emptyDesc: string;
  };
  watchlist: {
    title: string;
    subtitle: string;
    remove: string;
    add: string;
    watchingPrefix: string;
    watchingUnit: (n: number) => string;
    watchingNote: string;
  };
  instrumentDetail: {
    notFoundTitle: string;
    notFoundDesc: (id: string) => string;
    error: (e: string) => string;
    highVolatility: string;
    highVolatilityDesc: string;
    avgSentiment7d: string;
    newsCount7d: string;
    direction: string;
    priceHistory: string;
    candleCount: (n: number) => string;
    loadingPrice: string;
    noPriceTitle: string;
    noPriceDesc: string;
    relatedNews: string;
    articleCount: (n: number) => string;
    noNewsTitle: string;
    noNewsDesc: string;
  };
  emptyState: { defaultTitle: string; defaultDesc: string };
  riskBadge: { low: string; medium: string; high: string };
  timeAgo: {
    minutes: (n: number) => string;
    hours: (n: number) => string;
    days: (n: number) => string;
  };
  instruments: Record<"USDIDR" | "IHSG" | "BTC" | "GOLD", { label: string; description: string }>;
  categories: Record<
    "monetary_policy" | "geopolitics" | "commodities" | "trade" | "corporate" | "macro_data" | "other",
    string
  >;
}

// Semua teks UI (bukan konten berita — itu tetap Bahasa Indonesia karena
// memang dihasilkan AI dalam bahasa itu saat crawling, terpisah dari
// terjemahan UI ini).
const dict: Record<Lang, Translations> = {
  id: {
    nav: { dashboard: "Dashboard", newsFeed: "Feed Berita", watchlist: "Watchlist" },
    theme: { toLight: "Ganti ke tema terang", toDark: "Ganti ke tema gelap" },
    lang: { switch: "Ganti ke English" },

    dashboard: {
      title: "Market Dashboard",
      highRisk: (n: number) => `${n} instrumen risiko tinggi`,
      riskLow: "Risiko Rendah",
      riskMedium: "Risiko Sedang",
      riskHigh: "Risiko Tinggi",
      watched: "Dipantau",
      firestoreError: (e: string) =>
        `Gagal terhubung ke Firestore: ${e}. Pastikan konfigurasi Firebase sudah benar.`,
      emptyTitle: "Belum ada sinyal pasar",
      emptyDesc: "Belum ada data di Firestore. Tunggu sinkronisasi pertama dari job crawler.",
      highlights: "Sorotan Utama",
      highlightsSubtitle: "Kebijakan moneter, geopolitik & korporasi berdampak besar",
      disclaimer:
        "Skor sentimen dihitung dari berita 7 hari terakhir menggunakan NLP. Level risiko mencerminkan volatilitas relatif berdasarkan volume dan dampak berita.",
      disclaimerBold: "Ini bukan saran investasi.",
    },

    instrumentCard: {
      sentiment7d: "Sentimen 7D",
      avgScore: "Avg. Skor",
      news7d: "Berita 7D",
      updated: (t: string) => `Diperbarui ${t}`,
      viewDetail: "Lihat detail →",
      positive: "Positif",
      negative: "Negatif",
    },

    newsFeed: {
      title: "Feed Berita",
      subtitle: "Berita ekonomi global lintas instrumen, urut terbaru",
      instrument: "Instrumen",
      category: "Kategori",
      all: "Semua",
      error: (e: string) => `Gagal memuat data: ${e}`,
      articlesFound: (n: number) => `${n} artikel ditemukan`,
      emptyTitle: "Tidak ada berita",
      emptyDesc: "Belum ada berita yang cocok dengan filter ini, atau Firestore belum memiliki data.",
    },

    watchlist: {
      title: "Watchlist",
      subtitle: "Pilih instrumen yang ingin ditampilkan di dashboard utama. Preferensi disimpan di browser.",
      remove: "Hapus",
      add: "Tambah",
      watchingPrefix: "Saat ini memantau",
      watchingUnit: (_n: number) => "instrumen",
      watchingNote: ". Data disimpan di localStorage browser ini dan akan hilang jika cache dibersihkan.",
    },

    instrumentDetail: {
      notFoundTitle: "Instrumen tidak ditemukan",
      notFoundDesc: (id: string) => `Instrumen "${id}" tidak dikenali.`,
      error: (e: string) => `Gagal memuat data: ${e}`,
      highVolatility: "Volatilitas tinggi terdeteksi",
      highVolatilityDesc:
        "Beberapa berita berdampak besar terdeteksi dalam 7 hari terakhir untuk instrumen ini. Pantau pergerakan lebih seksama sebelum mengambil keputusan.",
      avgSentiment7d: "Avg. Sentimen 7d",
      newsCount7d: "Jumlah Berita 7d",
      direction: "Arah Sentimen",
      priceHistory: "Harga Historis — Candlestick",
      candleCount: (n: number) => `${n} candle`,
      loadingPrice: "Memuat data harga...",
      noPriceTitle: "Data harga belum tersedia",
      noPriceDesc: "Data candlestick belum ada di Firestore. Akan muncul otomatis setelah price job pertama selesai.",
      relatedNews: "Berita Terkait",
      articleCount: (n: number) => `${n} artikel`,
      noNewsTitle: "Belum ada berita",
      noNewsDesc: "Berita untuk instrumen ini belum tersedia di Firestore.",
    },

    emptyState: {
      defaultTitle: "Belum ada data",
      defaultDesc: "Tunggu sinkronisasi pertama dari crawler. Data akan muncul otomatis setelah job pertama selesai.",
    },

    riskBadge: { low: "RISIKO RENDAH", medium: "RISIKO SEDANG", high: "RISIKO TINGGI" },

    timeAgo: {
      minutes: (n: number) => `${n} menit lalu`,
      hours: (n: number) => `${n} jam lalu`,
      days: (n: number) => `${n} hari lalu`,
    },

    instruments: {
      USDIDR: { label: "USD/IDR", description: "Nilai tukar Dolar AS terhadap Rupiah" },
      IHSG: { label: "IHSG", description: "Indeks Harga Saham Gabungan" },
      BTC: { label: "Bitcoin", description: "Bitcoin / USD" },
      GOLD: { label: "Emas", description: "Gold Spot / USD" },
    },

    categories: {
      monetary_policy: "Kebijakan Moneter",
      geopolitics: "Geopolitik",
      commodities: "Komoditas",
      trade: "Perdagangan",
      corporate: "Korporasi",
      macro_data: "Data Makro",
      other: "Lainnya",
    },
  },

  en: {
    nav: { dashboard: "Dashboard", newsFeed: "News Feed", watchlist: "Watchlist" },
    theme: { toLight: "Switch to light theme", toDark: "Switch to dark theme" },
    lang: { switch: "Switch to Bahasa Indonesia" },

    dashboard: {
      title: "Market Dashboard",
      highRisk: (n: number) => `${n} high-risk instrument${n === 1 ? "" : "s"}`,
      riskLow: "Low Risk",
      riskMedium: "Medium Risk",
      riskHigh: "High Risk",
      watched: "Watched",
      firestoreError: (e: string) =>
        `Failed to connect to Firestore: ${e}. Check your Firebase configuration.`,
      emptyTitle: "No market signals yet",
      emptyDesc: "No data in Firestore yet. Waiting for the first crawler sync.",
      highlights: "Top Highlights",
      highlightsSubtitle: "High-impact monetary policy, geopolitics & corporate news",
      disclaimer:
        "Sentiment scores are computed from the last 7 days of news using NLP. Risk levels reflect relative volatility based on news volume and impact.",
      disclaimerBold: "This is not investment advice.",
    },

    instrumentCard: {
      sentiment7d: "Sentiment 7D",
      avgScore: "Avg. Score",
      news7d: "News 7D",
      updated: (t: string) => `Updated ${t}`,
      viewDetail: "View detail →",
      positive: "Positive",
      negative: "Negative",
    },

    newsFeed: {
      title: "News Feed",
      subtitle: "Global economic news across all instruments, newest first",
      instrument: "Instrument",
      category: "Category",
      all: "All",
      error: (e: string) => `Failed to load data: ${e}`,
      articlesFound: (n: number) => `${n} article${n === 1 ? "" : "s"} found`,
      emptyTitle: "No news found",
      emptyDesc: "No news matches this filter yet, or Firestore has no data yet.",
    },

    watchlist: {
      title: "Watchlist",
      subtitle: "Choose which instruments appear on the main dashboard. Saved in your browser.",
      remove: "Remove",
      add: "Add",
      watchingPrefix: "Currently watching",
      watchingUnit: (n: number) => `instrument${n === 1 ? "" : "s"}`,
      watchingNote: ". Stored in this browser's localStorage and will be lost if the cache is cleared.",
    },

    instrumentDetail: {
      notFoundTitle: "Instrument not found",
      notFoundDesc: (id: string) => `Instrument "${id}" is not recognized.`,
      error: (e: string) => `Failed to load data: ${e}`,
      highVolatility: "High volatility detected",
      highVolatilityDesc:
        "Several high-impact news items were detected for this instrument in the last 7 days. Watch price movement closely before making decisions.",
      avgSentiment7d: "Avg. Sentiment 7d",
      newsCount7d: "News Count 7d",
      direction: "Sentiment Direction",
      priceHistory: "Price History — Candlestick",
      candleCount: (n: number) => `${n} candle${n === 1 ? "" : "s"}`,
      loadingPrice: "Loading price data...",
      noPriceTitle: "Price data not available yet",
      noPriceDesc: "No candlestick data in Firestore yet. Will appear automatically once the price job runs.",
      relatedNews: "Related News",
      articleCount: (n: number) => `${n} article${n === 1 ? "" : "s"}`,
      noNewsTitle: "No news yet",
      noNewsDesc: "News for this instrument isn't available in Firestore yet.",
    },

    emptyState: {
      defaultTitle: "No data yet",
      defaultDesc: "Waiting for the first crawler sync. Data will appear automatically once the first job finishes.",
    },

    riskBadge: { low: "LOW RISK", medium: "MEDIUM RISK", high: "HIGH RISK" },

    timeAgo: {
      minutes: (n: number) => `${n}m ago`,
      hours: (n: number) => `${n}h ago`,
      days: (n: number) => `${n}d ago`,
    },

    instruments: {
      USDIDR: { label: "USD/IDR", description: "US Dollar to Indonesian Rupiah exchange rate" },
      IHSG: { label: "IHSG", description: "Indonesia Composite Stock Price Index" },
      BTC: { label: "Bitcoin", description: "Bitcoin / USD" },
      GOLD: { label: "Gold", description: "Gold Spot / USD" },
    },

    categories: {
      monetary_policy: "Monetary Policy",
      geopolitics: "Geopolitics",
      commodities: "Commodities",
      trade: "Trade",
      corporate: "Corporate",
      macro_data: "Macro Data",
      other: "Other",
    },
  },
};

export default dict;
