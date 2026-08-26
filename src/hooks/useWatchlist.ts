import { useState, useEffect } from "react";
import type { InstrumentId } from "@/lib/types";

const DEFAULT_WATCHLIST: InstrumentId[] = ["USDIDR", "IHSG", "BTC", "GOLD"];
const STORAGE_KEY = "econwatch_watchlist";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<InstrumentId[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_WATCHLIST;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const toggle = (id: InstrumentId) => {
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isWatching = (id: InstrumentId) => watchlist.includes(id);

  return { watchlist, toggle, isWatching };
}
