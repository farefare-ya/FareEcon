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

interface Props {
  candles: PriceCandle[];
}

export default function CandlestickChart({ candles }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  // Kalau sumber datanya cuma 1 nilai/hari (rate resmi, bukan OHLC bursa asli),
  // candlestick gak masuk akal — tingginya nol semua, kelihatan kayak
  // garis putus-putus mengambang. Tampilkan sebagai garis mulus sebagai gantinya.
  const isApproximate = candles.length > 0 && candles.every((c) => c.approximate);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#0c1220" },
        textColor: "#6b7a90",
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#1a2638" },
        horzLines: { color: "#1a2638" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "#38bdf8", width: 1, style: 2 },
        horzLine: { color: "#38bdf8", width: 1, style: 2 },
      },
      rightPriceScale: {
        borderColor: "#1a2638",
        textColor: "#6b7a90",
      },
      timeScale: {
        borderColor: "#1a2638",
        timeVisible: true,
        secondsVisible: false,
      },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    if (isApproximate) {
      // Garis mulus + area tipis di bawahnya — enak dilihat untuk data rate harian.
      const series = chart.addSeries(AreaSeries, {
        lineColor: "#38bdf8",
        topColor: "rgba(56, 189, 248, 0.28)",
        bottomColor: "rgba(56, 189, 248, 0.02)",
        lineWidth: 2,
      });

      const data = candles.map((c) => ({
        time: Math.floor(c.timestamp.getTime() / 1000) as unknown as string,
        value: c.close,
      }));

      series.setData(data as Parameters<typeof series.setData>[0]);
    } else {
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
  }, [candles, isApproximate]);

  return (
    <div className="w-full h-full relative">
      {isApproximate && (
        <div className="absolute top-2 left-2 z-10 text-[10px] font-mono text-[#6b7a90] bg-[#0c1220]/80 px-2 py-1 rounded border border-[#1a2638]">
          Rate harian resmi — bukan candlestick bursa real-time
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

