import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  type Firestore,
  Timestamp,
} from "firebase/firestore";
import type { Signal, NewsItem, PriceCandle, InstrumentId, Category } from "./types";

// ─────────────────────────────────────────────
// Firebase config — replace with your project's values
// from Firebase Console → Project settings → Your apps
// ─────────────────────────────────────────────
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "REPLACE_ME",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "REPLACE_ME",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "REPLACE_ME",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "REPLACE_ME",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "REPLACE_ME",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "REPLACE_ME",
};

let app: FirebaseApp;
let db: Firestore;

// Ubah error Firestore jadi pesan yang jelas, bukan cuma kode teknis.
// Dua penyebab paling umum kalau app "stuck loading": rules belum di-publish,
// atau query butuh composite index yang belum dibuat.
export function describeFirebaseError(err: unknown): string {
  const e = err as { code?: string; message?: string };
  if (e?.code === "permission-denied") {
    return "Akses ditolak oleh Firestore Rules. Pastikan isi firestore.rules sudah di-publish di Firebase Console → Firestore Database → Rules.";
  }
  if (e?.code === "failed-precondition") {
    return `Query butuh composite index yang belum dibuat. Buka Console browser (F12) — Firestore biasanya menaruh link untuk membuat index-nya otomatis di sana. Detail: ${e.message ?? ""}`;
  }
  if (e?.code === "unauthenticated") {
    return "Firestore menolak koneksi (unauthenticated). Cek apakah firebaseConfig di src/lib/firebase.ts sudah diisi nilai asli (bukan REPLACE_ME).";
  }
  return e?.message ?? String(err);
}

export function getDb(): Firestore {
  if (!db) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return db;
}

function toDate(val: unknown): Date {
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return new Date();
}

// ─── Signals ────────────────────────────────

export function subscribeSignals(
  cb: (signals: Signal[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const db = getDb();
  const q = collection(db, "signals");
  return onSnapshot(
    q,
    (snap) => {
      const signals: Signal[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          instrument: data.instrument,
          avgSentiment7d: data.avgSentiment7d ?? 0,
          newsCount7d: data.newsCount7d ?? 0,
          riskLevel: data.riskLevel ?? "low",
          direction: data.direction ?? "positive",
          updatedAt: toDate(data.updatedAt),
        } as Signal;
      });
      cb(signals);
    },
    (err) => {
      console.error("subscribeSignals error:", err);
      onError?.(err);
    }
  );
}

// ─── News ────────────────────────────────────

export function subscribeNews(
  cb: (news: NewsItem[]) => void,
  options?: {
    instrument?: InstrumentId;
    category?: Category;
    maxItems?: number;
  },
  onError?: (err: unknown) => void
): () => void {
  const db = getDb();
  let q = query(
    collection(db, "news"),
    orderBy("publishedAt", "desc"),
    limit(options?.maxItems ?? 50)
  );
  if (options?.instrument) {
    q = query(
      collection(db, "news"),
      where("relatedInstruments", "array-contains", options.instrument),
      orderBy("publishedAt", "desc"),
      limit(options?.maxItems ?? 30)
    );
  }
  return onSnapshot(
    q,
    (snap) => {
      let items: NewsItem[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title ?? "",
          url: data.url ?? "",
          source: data.source ?? "",
          publishedAt: toDate(data.publishedAt),
          summary: data.summary ?? "",
          sentiment: data.sentiment ?? 0,
          category: data.category ?? "other",
          relatedInstruments: data.relatedInstruments ?? [],
        } as NewsItem;
      });
      if (options?.category) {
        items = items.filter((n) => n.category === options.category);
      }
      cb(items);
    },
    (err) => {
      console.error("subscribeNews error:", err);
      onError?.(err);
    }
  );
}

// ─── Prices ─────────────────────────────────

export function subscribePrices(
  instrument: InstrumentId,
  cb: (candles: PriceCandle[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const db = getDb();
  const q = query(
    collection(db, "prices"),
    where("instrument", "==", instrument),
    orderBy("timestamp", "asc"),
    limit(300)
  );
  return onSnapshot(
    q,
    (snap) => {
      const candles: PriceCandle[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          instrument: data.instrument,
          timestamp: toDate(data.timestamp),
          open: data.open ?? 0,
          high: data.high ?? 0,
          low: data.low ?? 0,
          close: data.close ?? 0,
          approximate: data.approximate ?? false,
        } as PriceCandle;
      });
      cb(candles);
    },
    (err) => {
      console.error("subscribePrices error:", err);
      onError?.(err);
    }
  );
}
