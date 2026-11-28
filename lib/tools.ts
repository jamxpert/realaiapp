import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { type Category, categories, categoryInfo, sortTools } from "./tool-utils";

// Every category has its own file: data/tools/<category>.json, holding a list of tools.
// The file name sets the tool's category, so tools don't repeat it.
const toolsDir = path.join(process.cwd(), "data", "tools");

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only");
const httpsUrl = z.url({ protocol: /^https$/, error: "Must be a full https:// URL" });
const isoDate = z.iso.date({ error: "Must be a date written as YYYY-MM-DD" });
const text = z.string().trim().min(1, "Must not be empty");
const list = (min: number, max: number) =>
  z.array(text).min(min, `Add at least ${min}`).max(max, `Use at most ${max}`);

// strictObject: a misspelled key (for example "freeplan") fails the build
// instead of being silently ignored.
const toolSchema = z
  .strictObject({
    slug,
    name: text,
    website: httpsUrl,
    affiliateUrl: z.union([z.literal(""), httpsUrl]),
    shortDescription: text.max(160),
    // The guide shown on the tool's page.
    bestFor: text.max(120),
    about: list(1, 4),
    useCases: list(2, 8),
    features: list(2, 8),
    howToUse: z
      .array(z.strictObject({ title: text.max(80), text }))
      .min(3, "Add at least 3 steps")
      .max(8, "Use at most 8 steps"),
    tips: list(1, 6),
    examplePrompt: text.optional(),
    limitations: list(1, 5),
    // Pricing and facts.
    freePlan: z.boolean(),
    freePlanDetails: text,
    cheapestPaidPlan: text,
    otherPlans: z.array(text).default([]),
    pricingNote: z.string().default(""),
    priceCheckedOn: isoDate,
    urduSupport: z.enum(["yes", "partial", "no", "unknown"]),
    needsInternationalCard: z.union([z.boolean(), z.literal("unknown")]),
    rating: z.number().min(0).max(10).optional(),
    reviewSlug: slug.optional(),
    featured: z.boolean().default(false),
    sponsored: z.boolean().default(false),
    sponsoredUntil: isoDate.optional(),
  })
  .refine((tool) => !tool.sponsored || tool.sponsoredUntil !== undefined, {
    message: "A sponsored tool needs a sponsoredUntil date (YYYY-MM-DD)",
    path: ["sponsoredUntil"],
  });

export type Tool = z.output<typeof toolSchema> & {
  category: Category;
  /** True only while the sponsorship is still running on the build date. */
  sponsoredActive: boolean;
};

/** "[3].website" → `tool #4 "perplexity" → website`, so errors point at the right entry. */
function describeIssue(issue: z.core.$ZodIssue, raw: unknown): string {
  const [index, ...rest] = issue.path;
  if (typeof index !== "number") return `  ✖ ${issue.message}`;
  const entry: unknown = Array.isArray(raw) ? raw[index] : undefined;
  const name =
    typeof entry === "object" && entry !== null && "slug" in entry ? ` "${String(entry.slug)}"` : "";
  const field = rest.length > 0 ? ` → ${rest.join(".")}` : "";
  return `  ✖ tool #${index + 1}${name}${field}: ${issue.message}`;
}

function isCategory(name: string): name is Category {
  return (categories as readonly string[]).includes(name);
}

function loadTools(): Tool[] {
  const files = fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"));
  const today = new Date().toISOString().slice(0, 10);
  const all: Tool[] = [];

  for (const file of files) {
    const where = `data/tools/${file}`;
    const category = file.replace(/\.json$/, "");
    if (!isCategory(category)) {
      throw new Error(`${where}: "${category}" is not a category. Use one of: ${categories.join(", ")}`);
    }
    let raw: unknown;
    try {
      // Some Windows editors add an invisible BOM at the start of the file; ignore it.
      raw = JSON.parse(fs.readFileSync(path.join(toolsDir, file), "utf8").replace(/^﻿/, ""));
    } catch (error) {
      throw new Error(`${where} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
    const result = z.array(toolSchema).safeParse(raw);
    if (!result.success) {
      const issues = result.error.issues.map((i) => describeIssue(i, raw)).join("\n");
      throw new Error(`${where} is invalid:\n${issues}`);
    }
    for (const tool of result.data) {
      // Pages are built once, so an expired sponsorship turns off at the next build.
      all.push({
        ...tool,
        category,
        sponsoredActive: tool.sponsored && (tool.sponsoredUntil ?? "") >= today,
      });
    }
  }

  const seen = new Set<string>();
  for (const tool of all) {
    if (seen.has(tool.slug)) throw new Error(`data/tools: the slug "${tool.slug}" is used twice`);
    seen.add(tool.slug);
  }

  for (const category of categories) {
    const pick = categoryInfo[category].topPick;
    const tool = all.find((t) => t.slug === pick);
    if (!tool || tool.category !== category) {
      throw new Error(
        `lib/tool-utils.ts: the top pick for "${category}" is "${pick}", but there is no such tool in data/tools/${category}.json`,
      );
    }
  }

  return sortTools(all, "name");
}

export const tools: Tool[] = loadTools();

export function getTool(toolSlug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === toolSlug);
}

/** Like getTool, but fails the build with a clear message for an unknown slug. */
export function requireTool(toolSlug: string, usedIn: string): Tool {
  const tool = getTool(toolSlug);
  if (!tool) {
    const known = tools.map((t) => t.slug).join(", ");
    throw new Error(`Unknown tool "${toolSlug}" in ${usedIn}. Known tools: ${known}`);
  }
  return tool;
}

/** Other tools for the same job, top pick first. */
export function getAlternatives(tool: Tool, limit = 4): Tool[] {
  const pick = categoryInfo[tool.category].topPick;
  return tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .sort((a, b) => Number(b.slug === pick) - Number(a.slug === pick))
    .slice(0, limit);
}
