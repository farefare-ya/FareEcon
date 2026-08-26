# Roadmap / Catatan Belum Dikerjakan

## Visual (frontend)
- [ ] Grafik/diagram yang lebih "hidup" dan unik — bukan cuma line/bar chart standar.
      Ide: network graph gaya neuron (node = instrumen & event berita, garis penghubung
      = keterkaitan/dampak), animasi halus saat data update, dashboard yang terasa "bernapas"
      bukan statis. Explorasi lib: D3.js (paling fleksibel untuk network graph custom),
      atau Recharts/visx untuk chart data-viz yang lebih standar tapi tetap bisa dikustom
      style-nya biar gak generik.
- [ ] Setelah ada data harga asli, desain ulang halaman detail instrumen supaya
      candlestick + network graph + berita bisa dilihat sekaligus tanpa penuh sesak.

## Backend
- [x] Crawler berita (RSS → AI sentiment → Firestore `news` + `signals`) — sudah jadi,
      lihat project `econwatch-crawler`.
- [ ] **Belum ada**: job pengambil data harga (crypto/forex/saham) untuk isi collection
      `prices` — ini yang dibutuhkan supaya candlestick chart di frontend beneran nampilin
      sesuatu (sekarang masih "data harga belum tersedia").
- [ ] Setelah ada data harga + berita cukup lama, baru masuk akal bikin agregasi/network
      graph di atas — jangan didesain sebelum ada data asli untuk dicoba.

## Urutan yang disarankan
1. Setup Firebase + deploy crawler berita (sudah siap sekarang).
2. Tambah job data harga (belum dibuat — bisa mulai kapan saja).
3. Baru masuk ke eksplorasi visual "neuron" setelah ada 2 jenis data itu mengalir nyata,
   supaya desainnya dibuat berdasarkan bentuk data asli, bukan tebakan.
