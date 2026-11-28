"use client";

import { useState } from "react";
import type { ArticleSummary } from "@/lib/article-summary";
import { ArticleGrid } from "./ArticleCard";

type FilterKey = "category" | "language" | "difficulty";

export interface FilterGroup {
  key: FilterKey;
  label: string;
  options: { value: string; label: string }[];
}

const chip =
  "rounded-full border border-line px-3.5 py-1.5 text-sm font-medium text-muted hover:text-fg aria-pressed:border-accent aria-pressed:text-accent";

interface Props {
  articles: ArticleSummary[];
  filters: FilterGroup[];
  /** Singular and plural nouns for the result count, e.g. ["review", "reviews"]. */
  noun: [string, string];
}

/** Article grid with chip filters. Each group allows one value or "All". */
export function FilteredArticles({ articles, filters, noun }: Props) {
  const [selected, setSelected] = useState<Partial<Record<FilterKey, string>>>({});

  // Only offer options that at least one article has.
  const groups = filters
    .map((group) => ({
      ...group,
      options: group.options.filter((o) => articles.some((a) => a[group.key] === o.value)),
    }))
    .filter((group) => group.options.length > 1);

  const shown = articles.filter((a) =>
    groups.every((group) => {
      const value = selected[group.key];
      return value === undefined || a[group.key] === value;
    }),
  );

  function choose(key: FilterKey, value: string | undefined) {
    setSelected((current) => ({ ...current, [key]: value }));
  }

  return (
    <div>
      {groups.length > 0 && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-line p-4">
          {groups.map((group) => (
            <div key={group.key} role="group" aria-label={group.label} className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm font-semibold">{group.label}:</span>
              <button
                type="button"
                className={chip}
                aria-pressed={selected[group.key] === undefined}
                onClick={() => choose(group.key, undefined)}
              >
                All
              </button>
              {group.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={chip}
                  aria-pressed={selected[group.key] === option.value}
                  onClick={() => choose(group.key, option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <p aria-live="polite" className="mb-3 text-sm text-muted">
        Showing {shown.length} {shown.length === 1 ? noun[0] : noun[1]}
      </p>

      {shown.length > 0 ? (
        <ArticleGrid articles={shown} headingLevel="h2" priorityFirst />
      ) : (
        <p className="rounded-2xl border border-line p-6 text-muted">
          Nothing matches these filters yet. Choose &quot;All&quot; to see everything.
        </p>
      )}
    </div>
  );
}
