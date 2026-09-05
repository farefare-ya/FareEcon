import type { NewsItem } from "@/lib/types";
import { useLanguage, useCategoryLabel } from "@/lib/language";
import SentimentBadge from "./SentimentBadge";

function timeAgo(date: Date, t: ReturnType<typeof useLanguage>["t"]): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return t.timeAgo.minutes(mins);
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t.timeAgo.hours(hrs);
  const days = Math.floor(hrs / 24);
  return t.timeAgo.days(days);
}

export default function NewsCard({ item }: { item: NewsItem }) {
  const { t } = useLanguage();
  const catLabel = useCategoryLabel(item.category);
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border-b border-border bg-card hover:bg-muted transition-colors duration-150 p-4 group last:border-b-0"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-muted-foreground">{item.source}</span>
          <span className="text-border">·</span>
          <span className="text-[11px] text-muted-foreground">{timeAgo(item.publishedAt, t)}</span>
          <span className="text-[11px] text-accent/60 border border-accent/20 px-1.5 py-0.5 rounded">
            {catLabel}
          </span>
        </div>
        <SentimentBadge score={item.sentiment} />
      </div>
      <h3 className="text-sm font-medium text-foreground group-hover:text-white leading-snug mb-1.5">
        {item.title}
      </h3>
      <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">{item.summary}</p>
      <div className="flex gap-1.5 mt-2 flex-wrap">
        {item.relatedInstruments.map((inst) => (
          <span
            key={inst}
            className="text-[11px] font-medium text-accent/70 bg-accent/5 border border-accent/15 px-1.5 py-0.5 rounded"
          >
            {inst}
          </span>
        ))}
      </div>
    </a>
  );
}
