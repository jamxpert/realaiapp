import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { type ImageInfo, getImageInfo } from "./images";
import type { ArticleSummary } from "./article-summary";
import { getTool, tools } from "./tools";

// ---------- Article types ----------

export const articleTypes = ["review", "list", "comparison", "tutorial"] as const;
export type ArticleType = (typeof articleTypes)[number];

/** Folder in /content and URL prefix for each type. */
export const typeConfig: Record<ArticleType, { folder: string; base: string; label: string; plural: string }> = {
  review: { folder: "reviews", base: "/reviews", label: "Review", plural: "Reviews" },
  list: { folder: "lists", base: "/best", label: "Best tools", plural: "Best Tools" },
  comparison: { folder: "comparisons", base: "/compare", label: "Comparison", plural: "Compare" },
  tutorial: { folder: "tutorials", base: "/tutorials", label: "Tutorial", plural: "Tutorials" },
};

// ---------- Frontmatter schema ----------

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only");

// YAML turns an unquoted 2026-11-24 into a Date; accept both forms.
const isoDate = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z.iso.date({ error: "Must be a date written as YYYY-MM-DD" }),
);

const common = {
  title: z.string().min(1).max(110),
  description: z.string().min(1).max(155, "Keep the description at 155 characters or less"),
  slug,
  language: z.enum(["en", "roman-urdu"]),
  publishedAt: isoDate,
  updatedAt: isoDate,
  author: z.string().min(1),
  coverImage: z.string().regex(/^\/images\/.+\.(png|jpe?g|webp|avif)$/, "Use a path like /images/<slug>/cover.png"),
  coverAlt: z
    .string({ error: "coverAlt is required: describe the cover image in a few words" })
    .min(1, "coverAlt is required: describe the cover image in a few words"),
  tags: z.array(z.string().min(1)).default([]),
  tools: z.array(slug).default([]),
  draft: z.boolean().default(false),
  faq: z.array(z.strictObject({ question: z.string().min(1), answer: z.string().min(1) })).optional(),
};

const frontmatterSchema = z.discriminatedUnion("type", [
  z.strictObject({
    ...common,
    type: z.literal("review"),
    toolSlug: slug,
    verdict: z.strictObject({
      // null = not rated yet ("Rating coming soon").
      rating: z.number().min(0).max(10).nullable(),
      bestFor: z.string().min(1),
      notFor: z.string().min(1),
      summary: z.string().min(1),
    }),
    pros: z.array(z.string().min(1)).min(1),
    cons: z.array(z.string().min(1)).min(1),
  }),
  z.strictObject({ ...common, type: z.literal("list"), audience: z.string().min(1) }),
  z.strictObject({
    ...common,
    type: z.literal("comparison"),
    toolA: slug,
    toolB: slug,
    winner: z.union([slug, z.literal("depends")]),
    useCase: z.string().min(1),
  }),
  z.strictObject({
    ...common,
    type: z.literal("tutorial"),
    difficulty: z.enum(["beginner", "intermediate"]),
    timeNeeded: z.string().min(1),
    videoId: z.string().regex(/^[A-Za-z0-9_-]{11}$/, "Use the 11-character YouTube video ID").optional(),
    // The date the video went live on YouTube (needed for video search results).
    videoUploadDate: isoDate.optional(),
    translationOf: slug.optional(),
  }),
]);

export type Frontmatter = z.output<typeof frontmatterSchema>;

export type Article = Frontmatter & {
  /** Path from the project root, used in error messages. */
  file: string;
  body: string;
  url: string;
  readingMinutes: number;
  cover: ImageInfo;
  /** Every tool the article uses: frontmatter plus tools used by components in the body. */
  toolSlugs: string[];
  hasAffiliateLinks: boolean;
};

// ---------- Loading ----------

const CONTENT_DIR = path.join(process.cwd(), "content");
const showDrafts = process.env.NODE_ENV !== "production";

function fail(file: string, message: string): never {
  throw new Error(`${file}: ${message}`);
}

function describeIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `  ✖ ${issue.path.length > 0 ? `${issue.path.join(".")}: ` : ""}${issue.message}`)
    .join("\n");
}

/** Tool slugs used by components in the body: tool="x" and tools={["x","y"]}. */
function toolsUsedInBody(body: string): string[] {
  const found = new Set<string>();
  for (const match of body.matchAll(/\btool="([^"]*)"/g)) found.add(match[1] ?? "");
  for (const match of body.matchAll(/\btools=\{\[([^\]]*)\]\}/g)) {
    for (const item of (match[1] ?? "").matchAll(/"([^"]*)"/g)) found.add(item[1] ?? "");
  }
  return [...found];
}

function readingMinutes(body: string): number {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`[\]()|-]/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function loadFile(type: ArticleType, fileName: string): Article {
  const file = `content/${typeConfig[type].folder}/${fileName}`;
  const { data, content } = matter(fs.readFileSync(path.join(process.cwd(), file), "utf8"));

  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) fail(file, `frontmatter is invalid:\n${describeIssues(parsed.error)}`);
  const fm = parsed.data;

  const expectedSlug = fileName.replace(/\.mdx$/, "");
  if (fm.slug !== expectedSlug) fail(file, `slug "${fm.slug}" must match the file name "${expectedSlug}"`);
  if (fm.type !== type) fail(file, `type is "${fm.type}" but the file is in content/${typeConfig[type].folder}`);
  if (fm.updatedAt < fm.publishedAt) fail(file, "updatedAt can't be earlier than publishedAt");
  if (fm.type === "tutorial" && fm.videoId && !fm.videoUploadDate) {
    fail(file, "videoUploadDate is required when videoId is set: the date the video went live on YouTube (YYYY-MM-DD)");
  }

  const extraTools =
    fm.type === "review"
      ? [fm.toolSlug]
      : fm.type === "comparison"
        ? [fm.toolA, fm.toolB, ...(fm.winner === "depends" ? [] : [fm.winner])]
        : [];
  const toolSlugs = [...new Set([...fm.tools, ...extraTools, ...toolsUsedInBody(content)])];
  const known = tools.map((t) => t.slug).join(", ");
  for (const toolSlug of toolSlugs) {
    if (!getTool(toolSlug)) fail(file, `unknown tool "${toolSlug}". Known tools: ${known}`);
  }
  if (fm.type === "comparison" && fm.winner !== "depends" && fm.winner !== fm.toolA && fm.winner !== fm.toolB) {
    fail(file, `winner must be "${fm.toolA}", "${fm.toolB}" or "depends"`);
  }

  const hasAffiliateLinks =
    content.includes("<AffiliateButton") || toolSlugs.some((s) => getTool(s)?.affiliateUrl !== "");

  return {
    ...fm,
    file,
    body: content,
    url: `${typeConfig[type].base}/${fm.slug}`,
    readingMinutes: readingMinutes(content),
    cover: getImageInfo(fm.coverImage, `${file} (coverImage)`),
    toolSlugs,
    hasAffiliateLinks,
  };
}

function loadAll(): Article[] {
  const all: Article[] = [];
  for (const type of articleTypes) {
    const dir = path.join(CONTENT_DIR, typeConfig[type].folder);
    if (!fs.existsSync(dir)) continue;
    for (const fileName of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).sort()) {
      const article = loadFile(type, fileName);
      if (article.draft && !showDrafts) continue;
      all.push(article);
    }
  }
  checkLinks(all);
  return all.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title));
}

/** Cross-file checks: translations and review links in data/tools must point at real articles. */
function checkLinks(all: Article[]): void {
  for (const article of all) {
    if (article.type !== "tutorial" || !article.translationOf) continue;
    const other = all.find((a) => a.type === "tutorial" && a.slug === article.translationOf);
    if (!other) fail(article.file, `translationOf "${article.translationOf}" is not a published tutorial`);
    if (other.language === article.language) fail(article.file, "translationOf must point at a tutorial in the other language");
  }
  for (const tool of tools) {
    if (!tool.reviewSlug) continue;
    const review = all.find((a) => a.type === "review" && a.slug === tool.reviewSlug);
    if (!review || review.type !== "review") {
      throw new Error(`data/tools: "${tool.slug}" has reviewSlug "${tool.reviewSlug}", but there is no published review with that slug`);
    }
    if (review.toolSlug !== tool.slug) {
      throw new Error(`data/tools: "${tool.slug}" links to review "${review.slug}", which reviews "${review.toolSlug}"`);
    }
    const rating = review.verdict.rating;
    if (tool.rating !== undefined && rating !== null && tool.rating !== rating) {
      throw new Error(`Rating mismatch for "${tool.slug}": data/tools says ${tool.rating}, ${review.file} says ${rating}`);
    }
  }
}

const articles: Article[] = loadAll();

// ---------- Queries ----------

export function getArticles(type?: ArticleType): Article[] {
  return type ? articles.filter((a) => a.type === type) : articles;
}

export function getArticle(type: ArticleType, articleSlug: string): Article | undefined {
  return articles.find((a) => a.type === type && a.slug === articleSlug);
}

export function getArticlesForTool(toolSlug: string): Article[] {
  return articles.filter((a) => a.toolSlugs.includes(toolSlug));
}

/** The other-language version of a tutorial, linked in either direction. */
export function getTranslation(article: Article): Article | undefined {
  if (article.type !== "tutorial") return undefined;
  return articles.find(
    (a) =>
      a.type === "tutorial" &&
      a.slug !== article.slug &&
      (a.slug === article.translationOf || (a.translationOf !== undefined && a.translationOf === article.slug)),
  );
}

export function getArticlesByLanguage(language: Article["language"]): Article[] {
  return articles.filter((a) => a.language === language);
}

/**
 * Up to `limit` related articles: 2 points per shared tool, 1 per shared tag.
 * Ties go to the newer article. Articles with nothing in common are not shown.
 */
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const tags = new Set(article.tags.map((t) => t.toLowerCase()));
  return articles
    .filter((a) => a !== article)
    .map((a) => ({
      a,
      score:
        a.toolSlugs.filter((s) => article.toolSlugs.includes(s)).length * 2 +
        a.tags.filter((t) => tags.has(t.toLowerCase())).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((x, y) => y.score - x.score || y.a.publishedAt.localeCompare(x.a.publishedAt))
    .slice(0, limit)
    .map(({ a }) => a);
}

/** The serialisable view used by cards, client-side filters and the search index. */
export function toSummary(article: Article): ArticleSummary {
  return {
    type: article.type,
    slug: article.slug,
    url: article.url,
    title: article.title,
    description: article.description,
    language: article.language,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    readingMinutes: article.readingMinutes,
    cover: { ...article.cover, alt: article.coverAlt },
    tags: article.tags,
    toolSlugs: article.toolSlugs,
    category: article.type === "review" ? getTool(article.toolSlug)?.category : undefined,
    difficulty: article.type === "tutorial" ? article.difficulty : undefined,
    draft: article.draft,
  };
}
