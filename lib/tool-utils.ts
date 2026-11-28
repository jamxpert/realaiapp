// Plain helpers for tools. No zod or JSON imports here, so client components
// can use this file without shipping the validator or the data file.
import type { Tool } from "./tools";

/** Each category has its own file: data/tools/<category>.json. */
export const categories = [
  "chatbot",
  "writing",
  "coding",
  "prompting",
  "image",
  "design",
  "video",
  "video-generation",
  "voice",
  "music",
  "transcription",
  "presentation",
  "research",
  "automation",
  "productivity",
] as const;

export type Category = (typeof categories)[number];

interface CategoryInfo {
  /** Short label for chips and cards. */
  label: string;
  /** The job, the way a reader would say it. */
  job: string;
  /** Our first pick for this job. Must be a tool in this category (checked at build time). */
  topPick: string;
}

/** One entry per category, in the order they are shown. */
export const categoryInfo: Record<Category, CategoryInfo> = {
  chatbot: { label: "Chatbot", job: "Ask questions and get help with anything", topPick: "chatgpt" },
  writing: { label: "Writing", job: "Write, rewrite and fix grammar", topPick: "claude" },
  coding: { label: "Coding", job: "Write code or build an app", topPick: "cursor" },
  prompting: { label: "Prompting", job: "Write, test and improve prompts", topPick: "google-ai-studio" },
  image: { label: "Image", job: "Make images from text", topPick: "midjourney" },
  design: { label: "Design", job: "Design posts, thumbnails and graphics", topPick: "canva" },
  video: { label: "Video editing", job: "Edit videos, add captions and cut clips", topPick: "capcut" },
  "video-generation": { label: "Video generation", job: "Make videos from text or a photo", topPick: "kling-ai" },
  voice: { label: "Voice", job: "Make voice-overs and text to speech", topPick: "elevenlabs" },
  music: { label: "Music", job: "Make songs and background music", topPick: "suno" },
  transcription: { label: "Transcription", job: "Turn audio into text and take meeting notes", topPick: "turboscribe" },
  presentation: { label: "Presentation", job: "Make slides and presentations", topPick: "gamma" },
  research: { label: "Research", job: "Research with real sources", topPick: "perplexity" },
  automation: { label: "Automation", job: "Connect apps and automate work", topPick: "zapier" },
  productivity: { label: "Productivity", job: "Organise notes, tasks and documents", topPick: "notion" },
};

export const categoryLabels = Object.fromEntries(
  categories.map((c) => [c, categoryInfo[c].label]),
) as Record<Category, string>;

export const urduSupportLabels: Record<Tool["urduSupport"], string> = {
  yes: "Yes",
  partial: "Partly",
  no: "No",
  unknown: "Not tested yet",
};

export function internationalCardLabel(value: Tool["needsInternationalCard"]): string {
  if (value === "unknown") return "Not tested yet";
  return value ? "Yes" : "No";
}

export interface ToolLink {
  href: string;
  rel: string;
  isAffiliate: boolean;
}

/** The outbound link for a tool: its affiliate URL when set, otherwise its website. */
export function toolLink(tool: Pick<Tool, "affiliateUrl" | "website">): ToolLink {
  const isAffiliate = tool.affiliateUrl !== "";
  return {
    href: isAffiliate ? tool.affiliateUrl : tool.website,
    rel: isAffiliate ? "sponsored nofollow noopener" : "noopener",
    isAffiliate,
  };
}

export type ToolSort = "name" | "rating";

/** Featured tools first, then by name or by rating (unrated tools last). */
export function sortTools<T extends Pick<Tool, "name" | "rating" | "featured">>(
  list: readonly T[],
  by: ToolSort,
): T[] {
  return [...list].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (by === "rating") {
      const diff = (b.rating ?? -1) - (a.rating ?? -1);
      if (diff !== 0) return diff;
    }
    return a.name.localeCompare(b.name);
  });
}

/** The small part of a tool that cards and the client-side directory need. */
export type ToolSummary = Pick<
  Tool,
  | "slug"
  | "name"
  | "category"
  | "shortDescription"
  | "bestFor"
  | "freePlan"
  | "cheapestPaidPlan"
  | "rating"
  | "featured"
  | "sponsoredActive"
  | "affiliateUrl"
  | "website"
>;

export function toToolSummary(tool: Tool): ToolSummary {
  return {
    slug: tool.slug,
    name: tool.name,
    category: tool.category,
    shortDescription: tool.shortDescription,
    bestFor: tool.bestFor,
    freePlan: tool.freePlan,
    cheapestPaidPlan: tool.cheapestPaidPlan,
    rating: tool.rating,
    featured: tool.featured,
    sponsoredActive: tool.sponsoredActive,
    affiliateUrl: tool.affiliateUrl,
    website: tool.website,
  };
}
