import type { kindLabels } from "./article-summary";

// Shape of /search-index.json. Client-safe: types only.

export interface SearchEntry {
  kind: (typeof kindLabels)[keyof typeof kindLabels] | "Tool";
  url: string;
  title: string;
  description: string;
  /** Tags, tool names and categories: matched, but not shown. */
  keywords: string[];
  romanUrdu: boolean;
}
