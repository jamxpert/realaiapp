"use client";

import Fuse from "fuse.js";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import type { SearchEntry } from "@/lib/search-types";
import { Badge } from "./Badge";

type IndexState = { status: "loading" } | { status: "ready"; entries: SearchEntry[] } | { status: "error" };

const MAX_RESULTS = 20;

export function Search({ autoFocus = true }: { autoFocus?: boolean }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(() => params.get("q") ?? "");
  const [index, setIndex] = useState<IndexState>({ status: "loading" });
  const inputId = useId();

  // The index is a static file made at build time; load it once.
  useEffect(() => {
    let cancelled = false;
    fetch("/search-index.json")
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<SearchEntry[]>;
      })
      .then((entries) => {
        if (!cancelled) setIndex({ status: "ready", entries });
      })
      .catch(() => {
        if (!cancelled) setIndex({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const fuse = useMemo(
    () =>
      index.status === "ready"
        ? new Fuse(index.entries, {
            keys: [
              { name: "title", weight: 3 },
              { name: "keywords", weight: 2 },
              { name: "description", weight: 1 },
            ],
            threshold: 0.35,
            ignoreLocation: true,
          })
        : null,
    [index],
  );

  const trimmed = query.trim();
  const results = useMemo(
    () => (fuse && trimmed ? fuse.search(trimmed, { limit: MAX_RESULTS }).map((r) => r.item) : []),
    [fuse, trimmed],
  );

  function update(value: string) {
    setQuery(value);
    // Keep ?q= in the address bar so results can be shared, without a navigation.
    const url = value.trim() ? `/search?q=${encodeURIComponent(value.trim())}` : "/search";
    window.history.replaceState(null, "", url);
  }

  let status = "";
  if (trimmed) {
    if (index.status === "loading") status = "Loading search…";
    else if (index.status === "ready")
      status = results.length === 0 ? `No results for "${trimmed}"` : `${results.length} ${results.length === 1 ? "result" : "results"}`;
  }

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor={inputId} className="sr-only">
          Search articles and tools
        </label>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => update(e.target.value)}
          placeholder="Try “ChatGPT”, “CV” or “presentation”"
          autoFocus={autoFocus}
          autoComplete="off"
          className="h-14 w-full rounded-xl border border-line bg-surface px-4 text-lg placeholder:text-muted focus:border-accent"
        />
      </form>

      {index.status === "error" && (
        <p role="alert" className="mt-4 text-accent">
          Search could not load. Please refresh the page and try again.
        </p>
      )}

      <p aria-live="polite" className="mt-4 text-sm text-muted">
        {status}
      </p>

      {results.length > 0 && (
        <ul className="mt-3 divide-y divide-line rounded-2xl border border-line">
          {results.map((entry) => (
            <li key={entry.url} className="relative p-4 hover:bg-surface">
              <div className="flex flex-wrap gap-1.5">
                <Badge>{entry.kind}</Badge>
                {entry.romanUrdu && <Badge tone="accent">Roman Urdu</Badge>}
              </div>
              <h2 className="mt-2 font-bold">
                <Link href={entry.url} className="after:absolute after:inset-0 hover:text-accent">
                  {entry.title}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-muted">{entry.description}</p>
            </li>
          ))}
        </ul>
      )}

      {trimmed && index.status === "ready" && results.length === 0 && (
        <p className="mt-2 text-muted">
          Check the spelling, try a shorter word, or browse the{" "}
          <Link href="/tools" className="font-semibold text-accent underline">
            tools directory
          </Link>
          .
        </p>
      )}
    </div>
  );
}
