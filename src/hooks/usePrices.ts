import { useEffect, useState } from "react";
import { subscribePrices, describeFirebaseError } from "@/lib/firebase";
import type { PriceCandle, InstrumentId } from "@/lib/types";

export function usePrices(instrument: InstrumentId) {
  const [candles, setCandles] = useState<PriceCandle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const unsub = subscribePrices(
        instrument,
        (data) => {
          setCandles(data);
          setLoading(false);
        },
        (err) => {
          setError(describeFirebaseError(err));
          setLoading(false);
        }
      );
      return unsub;
    } catch (e) {
      setError(describeFirebaseError(e));
      setLoading(false);
    }
  }, [instrument]);

  return { candles, loading, error };
}
