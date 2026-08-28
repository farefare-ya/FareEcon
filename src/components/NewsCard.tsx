import type { NewsItem } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import SentimentBadge from "./SentimentBadge";

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  const days = Math.floor(hrs / 24);
  return `${days} hari lalu`;
}

export default function NewsCard({ item }: { item: NewsItem }) {
  const catLabel = CATEGORIES.find((c) => c.id === item.category)?.label ?? item.category;
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border-b border-[#1a2638] bg-[#0c1220] hover:bg-[#0f1a2c] transition-colors duration-150 p-4 group last:border-b-0"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-[#6b7a90]">{item.source}</span>
          <span className="text-[#1a2638]">·</span>
          <span className="text-[11px] text-[#6b7a90]">{timeAgo(item.publishedAt)}</span>
          <span className="text-[11px] text-[#38bdf8]/60 border border-[#38bdf8]/20 px-1.5 py-0.5 rounded">
            {catLabel}
          </span>
        </div>
        <SentimentBadge score={item.sentiment} />
      </div>
      <h3 className="text-sm font-medium text-[#d4dbe8] group-hover:text-white leading-snug mb-1.5">
        {item.title}
      </h3>
      <p className="text-[12px] text-[#6b7a90] leading-relaxed line-clamp-2">{item.summary}</p>
      <div className="flex gap-1.5 mt-2 flex-wrap">
        {item.relatedInstruments.map((inst) => (
          <span
            key={inst}
            className="text-[11px] font-medium text-[#38bdf8]/70 bg-[#38bdf8]/5 border border-[#38bdf8]/15 px-1.5 py-0.5 rounded"
          >
            {inst}
          </span>
        ))}
      </div>
    </a>
  );
}
