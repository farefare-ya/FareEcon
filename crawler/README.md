# EconWatch Crawler

Job terjadwal (bukan server yang selalu nyala) yang mengambil berita ekonomi
dari RSS, menganalisisnya pakai AI, lalu menyimpan hasilnya ke Firestore.
Jalan otomatis lewat GitHub Actions setiap 30 menit — tidak butuh laptop
atau server nyala terus.

Ini **project terpisah** dari project lain — tidak menggunakan ulang kode
apa pun, cuma pola arsitekturnya sama: GitHub Actions + Firebase.

## Cara kerja singkat

```
RSS feeds  ─▶  GitHub Actions (cron tiap 30 menit)
                 │
                 ├─▶ ambil item baru (dedupe pakai hash URL)
                 ├─▶ kirim ke Gemini AI → ringkasan + skor sentimen
                 └─▶ tulis ke Firestore
                          ├─ collection `news`     (berita + hasil analisis, auto-hapus setelah 45 hari)
                          └─ collection `signals`  (ringkasan per instrumen, permanen, INI yang dibaca frontend)

CoinGecko / Frankfurter ─▶ GitHub Actions (cron harian, TANPA API key)
                              └─▶ collection `prices` (candle harian per instrumen)
```

## Status keandalan sumber data harga

| Instrumen | Sumber | Butuh API key? | Status |
|---|---|---|---|
| BTC | CoinGecko `/ohlc` | Tidak | Solid — OHLC asli |
| USDIDR | Frankfurter (open-source, data bank sentral) | Tidak | Solid — tapi rate harian resmi (1 nilai/hari, ditandai `approximate: true`), bukan OHLC bursa forex real-time |

**GOLD dan IHSG sengaja tidak disertakan** di versi ini — belum ada sumber gratis
yang cukup solid untuk keduanya tanpa menambah API pihak ketiga yang meragukan
(Alpha Vantage sempat dicoba, tapi limitnya ketat dan dukungan untuk IHSG
khususnya tidak pasti). Mending jujur belum mendukung dulu daripada memaksakan
dependency yang rapuh. Bisa ditambah nanti kalau ketemu sumber yang layak.

## Setup dari nol

### 1. Buat project Firebase baru

Di [Firebase Console](https://console.firebase.google.com/), buat project baru
(pisah dari project lain kamu). Aktifkan **Firestore Database** (mode production).

### 2. Buat Service Account key

Firebase Console → ⚙️ Project Settings → **Service accounts** → **Generate new private key**.
File JSON yang ke-download itu **RAHASIA** — jangan pernah di-commit ke git.

### 3. Ambil Gemini API key (gratis)

Ke [Google AI Studio](https://aistudio.google.com/apikey) → Create API key.
Free tier: sekitar 1.500 request/hari untuk model Flash-Lite yang dipakai di sini,
lebih dari cukup untuk cron tiap 30 menit (48x/hari).

Ini satu-satunya API key yang dibutuhkan seluruh backend. Job harga (CoinGecko +
Frankfurter) tidak butuh key apa pun.

### 4. Pasang GitHub Secrets

Push repo ini ke GitHub, lalu di **Settings → Secrets and variables → Actions**, tambah:

| Nama secret | Isi |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | **Seluruh isi** file JSON dari langkah 2 (copy-paste apa adanya) |
| `GEMINI_API_KEY` | API key dari langkah 3 |

### 5. Terapkan Firestore rules

Copy isi `firestore.rules` di repo ini → paste ke Firebase Console →
Firestore Database → Rules → Publish.

### 6. Jalankan

Workflow otomatis jalan tiap 30 menit. Untuk tes manual tanpa nunggu:
tab **Actions** di GitHub → pilih workflow "Crawl News" → **Run workflow**.

Cek hasilnya di Firebase Console → Firestore Database, harus muncul
dokumen baru di collection `news` dan `signals`.

## Struktur data Firestore

**`news/{id}`** — id = hash SHA-256 dari URL (otomatis dedupe)
```
{
  title, url, source, publishedAt, fetchedAt,
  summary,              // ringkasan AI, BUKAN teks artikel lengkap
  sentiment,             // -1.0 s/d 1.0
  category,               // monetary_policy | geopolitics | commodities | trade | corporate | macro_data | other
  relatedInstruments     // ["USDIDR", "BTC", ...]
}
```
Sengaja tidak menyimpan teks lengkap artikel — cuma judul + ringkasan singkat
hasil AI. Ini menjaga ukuran database (limit gratis 1GB) dan tidak
menggandakan tulisan media lain secara utuh.

**`signals/{instrument}`** — satu dokumen ringkas per instrumen, permanen
```
{
  avgSentiment7d, newsCount7d, riskLevel,   // low | medium | high
  direction,                                 // positive | negative
  updatedAt
}
```
Ini yang nantinya dibaca frontend — bukan query ke `news` langsung.

**`prices/{instrument}_{YYYY-MM-DD}`** — satu candle harian per instrumen
```
{
  instrument, timestamp, open, high, low, close,
  approximate   // true kalau sumbernya cuma 1 nilai/hari (misal GOLD), bukan OHLC asli
}
```

## Yang belum ada (langkah berikutnya)

Backend inti (berita + sinyal + harga) sudah lengkap. Belum termasuk:
- Frontend (lihat project terpisah `FareEcon` / prompt Figma Make)
- Deteksi event besar / risk alert yang lebih canggih
- Visualisasi data yang lebih hidup (network graph berita↔instrumen, dll —
  ide ini disimpan di `ROADMAP.md` di project frontend)

Sengaja dibuat bertahap dulu supaya tidak menumpuk sekaligus.

## Kalau job-nya rusak, apa kamu bakal tahu?

Ini kekhawatiran yang wajar — job otomatis yang dibiarkan berjalan tanpa
diawasi memang bisa jadi masalah kalau diam-diam rusak dan gak ada yang sadar.
Tapi GitHub Actions **otomatis kirim email** ke kamu setiap kali scheduled
workflow gagal (ini perilaku default, gak perlu setup tambahan) — jadi kalau
job-nya berhenti bekerja, kamu bakal tahu dari email, bukan diam-diam jadi
"sampah digital" yang mengambang.

## Catatan biaya

Semua yang dipakai di sini gratis: GitHub Actions (repo publik = tanpa batas
menit), Firestore Spark plan (50rb reads / 20rb writes per hari — jauh di bawah
itu), Gemini API free tier, CoinGecko (gratis, tanpa key), Frankfurter
(open-source, gratis, tanpa key). Total API key yang perlu diurus: **cuma 1**
(Gemini), plus 1 service account Firebase.
