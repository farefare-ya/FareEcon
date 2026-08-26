import { useEffect, useState } from "react";
import { subscribeSignals, describeFirebaseError } from "@/lib/firebase";
import type { Signal, InstrumentId } from "@/lib/types";

export function useSignals() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsub = subscribeSignals(
        (data) => {
          setSignals(data);
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
  }, []);

  const getSignal = (id: InstrumentId) => signals.find((s) => s.instrument === id);

  return { signals, loading, error, getSignal };
}
