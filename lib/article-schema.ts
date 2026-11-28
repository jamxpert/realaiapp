import { site } from "@/data/site";
import { type Article, typeConfig } from "./content";
import { type JsonLdObject, absoluteUrl, breadcrumbSchema, organization } from "./seo";
import { categoryLabels } from "./tool-utils";
import { getTool } from "./tools";

/** Placeholder text that must never reach search engines. */
const PLACEHOLDER = /\[(?:ADD YOUR EXPERIENCE|SCREENSHOT)[^\]]*\]/g;

function plainText(mdx: string): string {
  return mdx
    .replace(PLACEHOLDER, " ")
    .replace(/<[^>]+>/g, " ") // component tags (their text content stays)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [text](url) → text
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function hasPlaceholder(text: string): boolean {
  return new RegExp(PLACEHOLDER.source).test(text);
}

/** Steps from <Step number={1} title="...">...</Step> in the MDX body. */
export function stepsFromBody(body: string): { number: number; title: string; text: string }[] {
  const steps: { number: number; title: string; text: string }[] = [];
  for (const match of body.matchAll(/<Step\b([^>]*)>([\s\S]*?)<\/Step>/g)) {
    const attrs = match[1] ?? "";
    const number = Number(/number=\{(\d+)\}/.exec(attrs)?.[1]);
    const title = /title="([^"]*)"/.exec(attrs)?.[1];
    if (!Number.isFinite(number) || !title) continue;
    const text = plainText(match[2] ?? "");
    steps.push({ number, title, text: text.length > 0 ? text.slice(0, 500) : title });
  }
  return steps;
}

/** "20 minutes", "1 hour", "1.5 hours" → ISO 8601 duration, or undefined. */
export function isoDuration(time: string): string | undefined {
  const match = /^\s*(\d+(?:\.\d+)?)\s*(minute|min|hour|hr)s?\b/i.exec(time);
  if (!match) return undefined;
  const minutes = Math.round(Number(match[1]) * (/^h/i.test(match[2] ?? "") ? 60 : 1));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `PT${hours > 0 ? `${hours}H` : ""}${rest > 0 ? `${rest}M` : ""}`;
}

function author(name: string): JsonLdObject {
  return name === site.name ? { "@type": "Organization", name, url: site.url } : { "@type": "Person", name };
}

/** All structured data for an article page. */
export function articleSchemas(article: Article): JsonLdObject[] {
  const url = absoluteUrl(article.url);
  const config = typeConfig[article.type];
  const image = absoluteUrl(article.cover.src);
  const schemas: JsonLdObject[] = [];

  schemas.push({
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.description,
    url,
    mainEntityOfPage: url,
    image,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: article.language === "roman-urdu" ? "ur-Latn" : "en",
    author: author(article.author),
    publisher: organization,
    keywords: article.tags.join(", "),
    articleSection: config.plural,
  });

  schemas.push(
    breadcrumbSchema(
      [{ label: "Home", href: "/" }, { label: config.plural, href: config.base }, { label: article.title }],
      article.url,
    ),
  );

  // Review: only once there is a real rating. Google needs reviewRating, and we never invent one.
  if (article.type === "review" && article.verdict.rating !== null) {
    const tool = getTool(article.toolSlug);
    if (tool) {
      schemas.push({
        "@type": "Review",
        "@id": `${url}#review`,
        url,
        name: article.title,
        datePublished: article.publishedAt,
        author: author(article.author),
        publisher: organization,
        ...(hasPlaceholder(article.verdict.summary) ? {} : { reviewBody: article.verdict.summary }),
        reviewRating: { "@type": "Rating", ratingValue: article.verdict.rating, bestRating: 10, worstRating: 0 },
        itemReviewed: {
          "@type": "SoftwareApplication",
          name: tool.name,
          url: tool.website,
          applicationCategory: `${categoryLabels[tool.category]} application`,
          operatingSystem: "Web",
          ...(tool.freePlan ? { offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } } : {}),
        },
      });
    }
  }

  if (article.type === "tutorial") {
    const steps = stepsFromBody(article.body);
    if (steps.length > 0) {
      const totalTime = isoDuration(article.timeNeeded);
      schemas.push({
        "@type": "HowTo",
        "@id": `${url}#howto`,
        name: article.title,
        description: article.description,
        image,
        inLanguage: article.language === "roman-urdu" ? "ur-Latn" : "en",
        ...(totalTime ? { totalTime } : {}),
        tool: article.toolSlugs.map((s) => ({ "@type": "HowToTool", name: getTool(s)?.name ?? s })),
        step: steps.map((step) => ({
          "@type": "HowToStep",
          position: step.number,
          name: step.title,
          text: step.text,
          url: `${url}#step-${step.number}`,
        })),
      });
    }
    if (article.videoId && article.videoUploadDate) {
      schemas.push({
        "@type": "VideoObject",
        name: article.title,
        description: article.description,
        thumbnailUrl: `https://i.ytimg.com/vi/${article.videoId}/hqdefault.jpg`,
        uploadDate: article.videoUploadDate,
        embedUrl: `https://www.youtube-nocookie.com/embed/${article.videoId}`,
        contentUrl: `https://www.youtube.com/watch?v=${article.videoId}`,
      });
    }
  }

  // FAQ answers that are still placeholders are left out.
  const faq = (article.faq ?? []).filter((f) => !hasPlaceholder(f.question) && !hasPlaceholder(f.answer));
  if (faq.length > 0) {
    schemas.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  return schemas;
}
