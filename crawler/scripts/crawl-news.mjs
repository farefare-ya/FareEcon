import Parser from "rss-parser";
import { RSS_SOURCES } from "./lib/sources.mjs";
import { analyzeNewsItem } from "./lib/ai.mjs";
import { newsIdFromUrl, newsExists, saveNews, upsertSignal, pruneOldNews } from "./lib/firestore.mjs";

const parser = new Parser({
  timeout: 15000,
  headers: {
    // Beberapa server RSS menolak request tanpa User-Agent sama sekali.
    // Ini identitas jujur, bukan menyamar jadi browser.
    "User-Agent": "EconWatch-RSS-Reader/1.0 (+https://github.com/farefare-ya/FareEcon)",
  },
});

// Batasi jumlah item baru yang dianalisis AI per-run, biar tidak
// tiba-tiba menghabiskan kuota harian Gemini kalau ada lonjakan berita.
const MAX_NEW_ITEMS_PER_RUN = 40;

async function fetchSource(source) {
  try {
    const feed = await parser.parseURL(source.url);
    return (feed.items || []).map((item) => ({ ...item, _source: source }));
  } catch (err) {
    console.warn(`[skip] Gagal fetch "${source.name}" (${source.url}): ${err.message}`);
    return [];
  }
}

async function main() {
  console.log(`Mulai crawl. Sumber: ${RSS_SOURCES.length}`);

  const allItemsPerSource = await Promise.all(RSS_SOURCES.map(fetchSource));
  const allItems = allItemsPerSource.flat();
  console.log(`Total item ditemukan di semua feed: ${allItems.length}`);

  let processed = 0;
  const touchedInstruments = new Set();

  for (const item of allItems) {
    if (processed >= MAX_NEW_ITEMS_PER_RUN) {
      console.log(`Batas ${MAX_NEW_ITEMS_PER_RUN} item/run tercapai, sisanya diproses run berikutnya.`);
      break;
    }
    if (!item.link || !item.title) continue;

    const id = newsIdFromUrl(item.link);
    if (await newsExists(id)) continue; // sudah pernah diproses, skip (dedupe)

    let analysis;
    try {
      analysis = await analyzeNewsItem(item.title, item.contentSnippet);
    } catch (err) {
      // 1 berita gagal dianalisis AI (rate limit, model error, dll) tidak boleh
      // menggagalkan seluruh crawl — skip berita ini, lanjut ke berikutnya.
      console.warn(`  [skip-ai] "${item.title.slice(0, 60)}": ${err.message}`);
      continue;
    }
    if (!analysis || analysis.confidence < 0.3) continue; // gak relevan finansial, skip

    await saveNews(id, {
      title: item.title,
      url: item.link,
      source: item._source.name,
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      summary: analysis.summary,
      sentiment: analysis.sentiment,
      category: analysis.category,
      relatedInstruments: analysis.relatedInstruments.length
        ? analysis.relatedInstruments
        : item._source.instrumentHints,
    });

    analysis.relatedInstruments.forEach((i) => touchedInstruments.add(i));
    processed++;
    console.log(`  + [${analysis.sentiment.toFixed(2)}] ${item.title.slice(0, 70)}`);
  }

  console.log(`Berita baru diproses: ${processed}`);

  // Hitung ulang sinyal ringkas untuk tiap instrumen yang baru dapat berita.
  for (const instrument of touchedInstruments) {
    await recomputeSignal(instrument);
  }

  const deleted = await pruneOldNews(45);
  console.log(`Berita lama (>45 hari) dihapus: ${deleted}`);

  console.log("Selesai.");
}

// Ambil rata-rata sentimen 7 hari terakhir untuk satu instrumen dan
// simpan sebagai satu dokumen ringkas di collection `signals`.
// NOTE: versi awal ini query dari collection `news` langsung (masih kecil).
// Kalau nanti datanya besar, ganti jadi baca dari agregat harian supaya hemat reads.
import { db } from "./lib/firestore.mjs";

async function recomputeSignal(instrument) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const snap = await db
    .collection("news")
    .where("relatedInstruments", "array-contains", instrument)
    .where("publishedAt", ">=", sevenDaysAgo)
    .get();

  if (snap.empty) return;

  const sentiments = snap.docs.map((d) => d.data().sentiment ?? 0);
  const avgSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;

  let riskLevel = "low";
  if (Math.abs(avgSentiment) > 0.6) riskLevel = "high";
  else if (Math.abs(avgSentiment) > 0.3) riskLevel = "medium";

  await upsertSignal(instrument, {
    avgSentiment7d: avgSentiment,
    newsCount7d: sentiments.length,
    riskLevel,
    direction: avgSentiment >= 0 ? "positive" : "negative",
  });

  console.log(`  ~ signal ${instrument}: avgSentiment=${avgSentiment.toFixed(2)} risk=${riskLevel}`);
}

main().catch((err) => {
  console.error("Crawl gagal total:", err);
  process.exit(1);
});
