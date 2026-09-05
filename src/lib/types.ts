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

// Cuma daftar ID di sini — label & deskripsi diambil dari dictionary bahasa
// (src/lib/i18n.ts) lewat hook useInstrumentsList()/useCategoriesList() di
// src/lib/language.tsx, supaya otomatis ikut berubah saat bahasa di-toggle.
export const INSTRUMENT_IDS: InstrumentId[] = ["USDIDR", "IHSG", "BTC", "GOLD"];

export const CATEGORY_IDS: Category[] = [
  "monetary_policy",
  "geopolitics",
  "commodities",
  "trade",
  "corporate",
  "macro_data",
  "other",
];
