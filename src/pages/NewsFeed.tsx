import { useState } from "react";
import type { Category, InstrumentId } from "@/lib/types";
import { useNews } from "@/hooks/useNews";
import { useLanguage, useInstrumentsList, useCategoriesList } from "@/lib/language";
import NewsCard from "@/components/NewsCard";
import EmptyState from "@/components/EmptyState";

export default function NewsFeed() {
  const [activeInstrument, setActiveInstrument] = useState<InstrumentId | undefined>();
  const [activeCategory, setActiveCategory] = useState<Category | undefined>();
  const { t } = useLanguage();
  const instruments = useInstrumentsList();
  const categories = useCategoriesList();

  const { news, loading, error } = useNews({ instrument: activeInstrument, maxItems: 80 });

  const filtered = activeCategory
    ? news.filter((n) => n.category === activeCategory)
    : news;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-sm font-semibold text-foreground tracking-wide uppercase mb-0.5">
          {t.newsFeed.title}
        </h1>
        <p className="text-xs text-muted-foreground">
          {t.newsFeed.subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-muted-foreground uppercase tracking-wide w-20 shrink-0">
            {t.newsFeed.instrument}
          </span>
          <FilterPill
            label={t.newsFeed.all}
            active={!activeInstrument}
            onClick={() => setActiveInstrument(undefined)}
          />
          {instruments.map((inst) => (
            <FilterPill
              key={inst.id}
              label={inst.label}
              active={activeInstrument === inst.id}
              onClick={() =>
                setActiveInstrument((prev) => (prev === inst.id ? undefined : inst.id))
              }
            />
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-muted-foreground uppercase tracking-wide w-20 shrink-0">
            {t.newsFeed.category}
          </span>
          <FilterPill
            label={t.newsFeed.all}
            active={!activeCategory}
            onClick={() => setActiveCategory(undefined)}
          />
          {categories.map((cat) => (
            <FilterPill
              key={cat.id}
              label={cat.label}
              active={activeCategory === cat.id}
              onClick={() =>
                setActiveCategory((prev) => (prev === cat.id ? undefined : cat.id))
              }
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="border border-[var(--risk-high-border)] bg-[var(--risk-high-bg)] p-4 mb-4 rounded">
          <p className="text-xs text-[var(--risk-high-text)]">{t.newsFeed.error(error)}</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="text-[11px] text-muted-foreground mb-3">{t.newsFeed.articlesFound(filtered.length)}</div>
      )}

      <div className="border border-border">
        {loading ? (
          <NewsLoadingSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={t.newsFeed.emptyTitle}
            description={t.newsFeed.emptyDesc}
          />
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-[11px] px-2.5 py-1 rounded transition-colors duration-100 border ${
        active
          ? "bg-accent/15 text-accent border-accent/40 font-medium"
          : "bg-transparent text-muted-foreground border-border hover:border-[var(--border-hover)] hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function NewsLoadingSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-4 animate-pulse">
          <div className="flex gap-2 mb-2">
            <div className="h-2 bg-border rounded w-16" />
            <div className="h-2 bg-border rounded w-10" />
          </div>
          <div className="h-3 bg-border rounded w-3/4 mb-2" />
          <div className="h-2 bg-border rounded w-full mb-1" />
          <div className="h-2 bg-border rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}
