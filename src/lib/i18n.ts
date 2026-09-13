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
  terms: {
    linkLabel: string;
    modalTitle: string;
    subtitle: string;
    intro: string;
    points: string[];
    warning: string;
    agreeButton: string;
    closeButton: string;
  };
  timeAgo: {
    minutes: (n: number) => string;
    hours: (n: number) => string;
    days: (n: number) => string;
  };
  instruments: Record<
    "USDIDR" | "IHSG" | "BTC" | "GOLD" | "NVDA" | "META" | "GOOGL" | "AAPL" | "LMT" | "PLTR",
    { label: string; description: string }
  >;
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

    terms: {
      linkLabel: "Syarat & Ketentuan",
      modalTitle: "Syarat & Ketentuan Penggunaan",
      subtitle: "Mohon baca dengan saksama sebelum melanjutkan.",
      intro:
        "FareEcon adalah alat bantu observasi sentimen berita ekonomi dan pasar, dibangun untuk tujuan edukasi dan informasi umum. Dengan menggunakan aplikasi ini, Anda menyatakan telah membaca, memahami, dan menyetujui ketentuan berikut secara penuh dan tanpa paksaan:",
      points: [
        "Seluruh data, skor sentimen, level risiko, dan grafik harga yang ditampilkan dihasilkan secara otomatis menggunakan model AI/NLP dan sumber data pihak ketiga. Data tersebut dapat mengandung kekeliruan, keterlambatan, atau bias, dan sama sekali bukan merupakan saran keuangan, saran investasi, rekomendasi jual-beli, maupun ajakan untuk melakukan transaksi apa pun.",
        "Aplikasi ini tidak berafiliasi dengan, tidak diawasi oleh, dan tidak menggantikan peran penasihat keuangan berlisensi, perusahaan sekuritas, maupun otoritas pasar modal resmi mana pun.",
        "Setiap keputusan ekonomi, keuangan, perdagangan (trading), maupun investasi nyata yang Anda ambil berdasarkan informasi dari aplikasi ini sepenuhnya merupakan keputusan dan tanggung jawab pribadi Anda sendiri.",
        "Pengembang dan pemilik aplikasi ini secara tegas TIDAK BERTANGGUNG JAWAB atas segala bentuk kerugian finansial, kerugian materiil, maupun kerugian lain dalam bentuk apa pun yang timbul, baik secara langsung maupun tidak langsung, akibat penggunaan aplikasi ini untuk kepentingan ekonomi nyata.",
      ],
      warning:
        'Dengan mengklik "Saya Setuju & Lanjutkan", Anda mengonfirmasi telah memahami risiko di atas dan membebaskan pengembang dari segala tuntutan maupun klaim ganti rugi terkait penggunaan aplikasi ini.',
      agreeButton: "Saya Setuju & Lanjutkan",
      closeButton: "Tutup",
    },

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
      NVDA: { label: "Nvidia", description: "Saham Nvidia Corporation (NVDA)" },
      META: { label: "Meta", description: "Saham Meta Platforms (META)" },
      GOOGL: { label: "Google", description: "Saham Alphabet / Google (GOOGL)" },
      AAPL: { label: "Apple", description: "Saham Apple Inc. (AAPL)" },
      LMT: { label: "Lockheed Martin", description: "Saham Lockheed Martin (LMT)" },
      PLTR: { label: "Palantir", description: "Saham Palantir Technologies (PLTR)" },
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

    terms: {
      linkLabel: "Terms & Conditions",
      modalTitle: "Terms & Conditions of Use",
      subtitle: "Please read carefully before continuing.",
      intro:
        "FareEcon is an economic and market news sentiment observation tool, built for educational and general informational purposes. By using this application, you confirm that you have read, understood, and fully agree to the following terms, without coercion:",
      points: [
        "All data, sentiment scores, risk levels, and price charts displayed are generated automatically using AI/NLP models and third-party data sources. This data may contain errors, delays, or bias, and does not in any way constitute financial advice, investment advice, a buy/sell recommendation, or a solicitation to carry out any transaction.",
        "This application is not affiliated with, is not supervised by, and does not replace the role of any licensed financial advisor, brokerage firm, or official capital market authority.",
        "Any real economic, financial, trading, or investment decision you make based on information from this application is entirely your own personal decision and responsibility.",
        "The developer and owner of this application expressly DISCLAIM ALL LIABILITY for any financial loss, material loss, or any other loss whatsoever, arising directly or indirectly from the use of this application for real economic purposes.",
      ],
      warning:
        'By clicking "I Agree & Continue", you confirm that you understand the risks above and release the developer from any claims or demands for damages related to the use of this application.',
      agreeButton: "I Agree & Continue",
      closeButton: "Close",
    },

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
      NVDA: { label: "Nvidia", description: "Nvidia Corporation stock (NVDA)" },
      META: { label: "Meta", description: "Meta Platforms stock (META)" },
      GOOGL: { label: "Google", description: "Alphabet / Google stock (GOOGL)" },
      AAPL: { label: "Apple", description: "Apple Inc. stock (AAPL)" },
      LMT: { label: "Lockheed Martin", description: "Lockheed Martin stock (LMT)" },
      PLTR: { label: "Palantir", description: "Palantir Technologies stock (PLTR)" },
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
