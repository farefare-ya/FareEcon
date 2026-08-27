export type RiskLevel = "low" | "medium" | "high";
export type Direction = "positive" | "negative";
export type Category =
  | "monetary_policy"
  | "geopolitics"
  | "commodities"
  | "trade"
  | "corporate"
  | "macro_data"
  | "other";

export type InstrumentId = "USDIDR" | "IHSG" | "BTC" | "GOLD";

export interface Signal {
  instrument: InstrumentId;
  avgSentiment7d: number;
  newsCount7d: number;
  riskLevel: RiskLevel;
  direction: Direction;
  updatedAt: Date;
}

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: Date;
  summary: string;
  sentiment: number;
  category: Category;
  relatedInstruments: InstrumentId[];
}

export interface PriceCandle {
  instrument: InstrumentId;
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  approximate?: boolean; // true = cuma 1 nilai/hari (rate resmi), bukan OHLC bursa asli
}

export const INSTRUMENTS: { id: InstrumentId; label: string; description: string }[] = [
  { id: "USDIDR", label: "USD/IDR", description: "Nilai tukar Dolar AS terhadap Rupiah" },
  { id: "IHSG", label: "IHSG", description: "Indeks Harga Saham Gabungan" },
  { id: "BTC", label: "Bitcoin", description: "Bitcoin / USD" },
  { id: "GOLD", label: "Emas", description: "Gold Spot / USD" },
];

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "monetary_policy", label: "Kebijakan Moneter" },
  { id: "geopolitics", label: "Geopolitik" },
  { id: "commodities", label: "Komoditas" },
  { id: "trade", label: "Perdagangan" },
  { id: "corporate", label: "Korporasi" },
  { id: "macro_data", label: "Data Makro" },
  { id: "other", label: "Lainnya" },
];
