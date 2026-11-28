"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type Category,
  categories,
  categoryLabels,
  sortTools,
  type ToolSort,
  type ToolSummary,
} from "@/lib/tool-utils";
import { ToolCard } from "./ToolCard";

const chip =
  "rounded-full border px-3.5 py-1.5 text-sm font-medium aria-pressed:border-accent aria-pressed:text-accent border-line text-muted hover:text-fg";

function isCategory(value: string | null): value is Category {
  return value !== null && (categories as readonly string[]).includes(value);
}

export function ToolsDirectory({ tools }: { tools: ToolSummary[] }) {
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);
  const [sort, setSort] = useState<ToolSort>("name");

  // The page is static, so ?category= is read after it loads. Every tool is in the HTML either way.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("category");
    if (isCategory(fromUrl)) setCategory(fromUrl);
  }, []);

  function chooseCategory(next: Category | "all") {
    setCategory(next);
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", next);
    window.history.replaceState(null, "", url);
  }

  const usedCategories = categories.filter((c) => tools.some((t) => t.category === c));
  const shown = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return sortTools(
      tools.filter((t) => {
        if (category !== "all" && t.category !== category) return false;
        if (freeOnly && !t.freePlan) return false;
        const haystack = `${t.name} ${t.shortDescription} ${t.bestFor} ${categoryLabels[t.category]}`.toLowerCase();
        return words.every((w) => haystack.includes(w));
      }),
      sort,
    );
  }, [tools, category, query, freeOnly, sort]);

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-2xl border border-line p-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Find a tool
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="For example: voice-over, captions, logo, code"
            className="rounded-lg border border-line bg-bg px-3 py-2 text-base font-normal"
          />
        </label>
        <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={category === "all"} onClick={() => chooseCategory("all")} className={chip}>
            All
          </button>
          {usedCategories.map((c) => (
            <button key={c} type="button" aria-pressed={category === c} onClick={() => chooseCategory(c)} className={chip}>
              {categoryLabels[c]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={freeOnly}
              onChange={(e) => setFreeOnly(e.target.checked)}
              className="size-4 accent-(--button)"
            />
            Free plan only
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            Sort by
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value === "rating" ? "rating" : "name")}
              className="rounded-lg border border-line bg-bg px-2 py-1.5"
            >
              <option value="name">Name (A to Z)</option>
              <option value="rating">Rating (high to low)</option>
            </select>
          </label>
        </div>
      </div>

      <p aria-live="polite" className="mt-6 text-sm text-muted">
        Showing {shown.length} {shown.length === 1 ? "tool" : "tools"}
      </p>

      {shown.length > 0 ? (
        <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((tool) => (
            <li key={tool.slug}>
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-2xl border border-line p-6 text-muted">
          No tools match these filters. Try other words, another category, or turn off &quot;Free plan
          only&quot;.
        </p>
      )}
    </div>
  );
}
