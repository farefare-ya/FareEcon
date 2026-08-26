import { useEffect, useState } from "react";
import { subscribeNews, describeFirebaseError } from "@/lib/firebase";
import type { NewsItem, InstrumentId, Category } from "@/lib/types";

export function useNews(options?: { instrument?: InstrumentId; category?: Category; maxItems?: number }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const instrKey = options?.instrument ?? "";
  const catKey = options?.category ?? "";

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const unsub = subscribeNews(
        (data) => {
          setNews(data);
          setLoading(false);
        },
        options,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instrKey, catKey, options?.maxItems]);

  return { news, loading, error };
}
