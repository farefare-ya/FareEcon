import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { createHash } from "node:crypto";

// Service account JSON disimpan utuh di GitHub Secret FIREBASE_SERVICE_ACCOUNT.
// Ini beda dari VITE_FIREBASE_* punya Farenet — itu buat client SDK (aman dipublish),
// yang ini buat Admin SDK (harus RAHASIA, jangan pernah ditaruh di kode/commit).
function initFirebase() {
  if (getApps().length > 0) return getFirestore();

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT env var kosong. Set sebagai GitHub Secret " +
        "(isinya seluruh JSON dari Firebase Console > Project Settings > Service accounts > Generate new private key)."
    );
  }

  const serviceAccount = JSON.parse(raw);
  initializeApp({ credential: cert(serviceAccount) });
  return getFirestore();
}

export const db = initFirebase();

// ID dokumen dibuat dari hash URL, jadi otomatis dedupe:
// berita yang sama nulis ulang = overwrite dokumen yang sama, bukan duplikat baru.
export function newsIdFromUrl(url) {
  return createHash("sha256").update(url).digest("hex").slice(0, 24);
}

export async function newsExists(id) {
  const doc = await db.collection("news").doc(id).get();
  return doc.exists;
}

// Sengaja TIDAK menyimpan teks lengkap artikel — cuma judul + ringkasan
// hasil AI (beberapa kalimat). Ini jaga ukuran database tetap kecil
// (jauh dari limit 1GB Firestore) sekaligus menghindari isu hak cipta
// karena kita tidak menggandakan tulisan orang lain secara utuh.
export async function saveNews(id, data) {
  await db
    .collection("news")
    .doc(id)
    .set(
      {
        ...data,
        fetchedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
}

// signals/{instrument} nyimpen ringkasan kondisi terkini per instrumen —
// ini yang dibaca frontend, bukan koleksi `news` mentah.
export async function upsertSignal(instrument, data) {
  await db
    .collection("signals")
    .doc(instrument)
    .set(
      {
        ...data,
        instrument,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
}

// Hapus berita yang lebih tua dari `days` hari.
// Sinyal (collection `signals`) TIDAK ikut terhapus — itu memang
// tujuannya: berita mentah boleh dibuang, hasil analisis tetap utuh.
export async function pruneOldNews(days = 45) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const snap = await db
    .collection("news")
    .where("publishedAt", "<", cutoff)
    .limit(200) // batasi per-run biar gak kena limit writes/hari sekali gasak
    .get();

  const batch = db.batch();
  snap.docs.forEach((d) => batch.delete(d.ref));
  if (snap.size > 0) await batch.commit();
  return snap.size;
}

// ID dokumen = instrumen + tanggal, jadi idempoten: run ulang di hari yang
// sama akan overwrite candle itu saja (misal harga direvisi), bukan bikin duplikat.
export async function upsertPriceCandles(instrument, candles) {
  const batch = db.batch();
  for (const c of candles) {
    const dateStr = c.timestamp.toISOString().slice(0, 10); // YYYY-MM-DD
    const id = `${instrument}_${dateStr}`;
    const ref = db.collection("prices").doc(id);
    batch.set(ref, {
      instrument,
      timestamp: c.timestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
      approximate: c.approximate ?? false,
    });
  }
  await batch.commit();
  return candles.length;
}
