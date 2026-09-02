import { useEffect, useRef } from "react";
import {
  createChart,
  type IChartApi,
  ColorType,
  CrosshairMode,
  CandlestickSeries,
  AreaSeries,
} from "lightweight-charts";
import type { PriceCandle } from "@/lib/types";
import { useTheme } from "@/lib/theme";

interface Props {
  candles: PriceCandle[];
}

// lightweight-charts pakai canvas, butuh warna literal (bukan var(--x)) —
// jadi dua palet ini didefinisikan langsung, dipilih sesuai tema aktif.
const PALETTES = {
  dark: {
    chartBg: "#0c1220",
    textColor: "#6b7a90",
    gridLine: "#1a2638",
    crosshair: "#38bdf8",
    areaLine: "#38bdf8",
    areaTop: "rgba(56, 189, 248, 0.28)",
    areaBottom: "rgba(56, 189, 248, 0.02)",
  },
  light: {
    chartBg: "#ffffff",
    textColor: "#64748b",
    gridLine: "#e2e8f0",
    crosshair: "#0284c7",
    areaLine: "#0284c7",
    areaTop: "rgba(2, 132, 199, 0.20)",
    areaBottom: "rgba(2, 132, 199, 0.02)",
  },
};

export default function CandlestickChart({ candles }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const { theme } = useTheme();

  // Kalau sumber datanya cuma 1 nilai/hari (rate resmi, bukan OHLC bursa asli),
  // candlestick gak masuk akal — tingginya nol semua, kelihatan kayak
  // garis putus-putus mengambang. Tampilkan sebagai garis mulus sebagai gantinya.
  const isApproximate = candles.length > 0 && candles.every((c) => c.approximate);

  useEffect(() => {
    if (!containerRef.current) return;
    const p = PALETTES[theme];

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: p.chartBg },
        textColor: p.textColor,
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: p.gridLine },
        horzLines: { color: p.gridLine },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: p.crosshair, width: 1, style: 2 },
        horzLine: { color: p.crosshair, width: 1, style: 2 },
      },
      rightPriceScale: {
        borderColor: p.gridLine,
        textColor: p.textColor,
      },
      timeScale: {
        borderColor: p.gridLine,
        timeVisible: true,
        secondsVisible: false,
      },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    if (isApproximate) {
      // Garis mulus + area tipis di bawahnya — enak dilihat untuk data rate harian.
      const series = chart.addSeries(AreaSeries, {
        lineColor: p.areaLine,
        topColor: p.areaTop,
        bottomColor: p.areaBottom,
        lineWidth: 2,
      });

      const data = candles.map((c) => ({
        time: Math.floor(c.timestamp.getTime() / 1000) as unknown as string,
        value: c.close,
      }));

      series.setData(data as Parameters<typeof series.setData>[0]);
    } else {
      // Hijau/merah candle sengaja gak ikut tema — itu makna universal
      // naik/turun, sudah kontras baik di gelap maupun terang.
      const series = chart.addSeries(CandlestickSeries, {
        upColor: "#00c46e",
        downColor: "#ff4455",
        borderUpColor: "#00c46e",
        borderDownColor: "#ff4455",
        wickUpColor: "#00c46e",
        wickDownColor: "#ff4455",
      });

      const data = candles.map((c) => ({
        time: Math.floor(c.timestamp.getTime() / 1000) as unknown as string,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));

      series.setData(data as Parameters<typeof series.setData>[0]);
    }

    chart.timeScale().fitContent();
    chartRef.current = chart;

    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.resize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [candles, isApproximate, theme]);

  return (
    <div className="w-full h-full relative">
      {isApproximate && (
        <div className="absolute top-2 left-2 z-10 text-[10px] font-mono text-muted-foreground bg-card/80 px-2 py-1 rounded border border-border">
          Rate harian resmi — bukan candlestick bursa real-time
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

