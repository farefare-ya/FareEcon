import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY env var kosong. Ambil gratis di Google AI Studio (aistudio.google.com).");
}

const genAI = new GoogleGenerativeAI(apiKey);
// Flash-Lite dipilih karena kuota free tier-nya paling besar (~1500 request/hari).
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

const PROMPT_TEMPLATE = (title, snippet) => `
Kamu menganalisis satu judul berita ekonomi untuk aplikasi pemantau pasar.
Judul: "${title}"
Cuplikan: "${snippet || "(tidak ada cuplikan)"}"

Balas HANYA dengan JSON valid, tanpa markdown, tanpa backtick, format persis ini:
{
  "summary": "ringkasan 1-2 kalimat memakai kata-katamu sendiri, bahasa Indonesia",
  "sentiment": <angka -1.0 sampai 1.0, negatif = buruk untuk pasar, positif = bagus>,
  "category": "<salah satu: monetary_policy | geopolitics | commodities | trade | corporate | macro_data | other>",
  "relatedInstruments": [<array string dari: "USDIDR", "IHSG", "BTC", "GOLD", "OTHER">],
  "confidence": <angka 0.0-1.0, seberapa yakin analisis ini relevan buat instrumen finansial>
}

Kalau berita ini TIDAK relevan sama sekali untuk keputusan finansial (misal berita hiburan/olahraga
yang kepilih gak sengaja), set "confidence" rendah (di bawah 0.3).
`.trim();

// Retry sederhana dengan backoff, karena free tier rawan kena 429 kalau diburu-buru.
async function callWithRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const isLast = i === retries - 1;
      if (isLast) throw err;
      const waitMs = 1500 * Math.pow(2, i);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
}

export async function analyzeNewsItem(title, snippet) {
  const prompt = PROMPT_TEMPLATE(title, snippet);

  const result = await callWithRetry(() => model.generateContent(prompt));
  const text = result.response.text().trim();

  // Kadang model tetap bungkus jawaban dengan ```json ... ``` walau sudah diminta jangan.
  const cleaned = text.replace(/^```json\s*|```$/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      summary: String(parsed.summary || "").slice(0, 500),
      sentiment: clamp(Number(parsed.sentiment) || 0, -1, 1),
      category: parsed.category || "other",
      relatedInstruments: Array.isArray(parsed.relatedInstruments) ? parsed.relatedInstruments : [],
      confidence: clamp(Number(parsed.confidence) || 0, 0, 1),
    };
  } catch (err) {
    // Kalau parsing gagal, jangan hentikan seluruh crawl — skip item ini saja.
    console.warn(`Gagal parse respons AI untuk "${title}":`, text.slice(0, 200));
    return null;
  }
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
