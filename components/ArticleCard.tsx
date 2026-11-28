import Image from "next/image";
import Link from "next/link";
import { type ArticleSummary, kindLabels } from "@/lib/article-summary";
import { formatDate } from "@/lib/format";
import { Badge } from "./Badge";

interface Props {
  article: ArticleSummary;
  /** Heading level for the title, so card grids keep the page's heading order. */
  headingLevel?: "h2" | "h3";
  /** Only the first card of a page should load its image eagerly. */
  priority?: boolean;
}

export function ArticleCard({ article, headingLevel = "h3", priority = false }: Props) {
  const Heading = headingLevel;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <Image
        src={article.cover.src}
        alt=""
        width={article.cover.width}
        height={article.cover.height}
        sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
        priority={priority}
        className="aspect-[1200/630] h-auto w-full border-b border-line object-cover"
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-1.5">
          <Badge>{kindLabels[article.type]}</Badge>
          {article.language === "roman-urdu" && <Badge tone="accent">Roman Urdu</Badge>}
          {article.difficulty && <Badge>{article.difficulty === "beginner" ? "Beginner" : "Intermediate"}</Badge>}
          {article.draft && <Badge tone="solid">Draft</Badge>}
        </div>
        <Heading className="mt-3 text-lg leading-snug font-bold">
          {/* The ::after makes the whole card clickable with a single link. */}
          <Link href={article.url} className="after:absolute after:inset-0 group-hover:text-accent">
            {article.title}
          </Link>
        </Heading>
        <p className="mt-2 flex-1 text-sm text-muted">{article.description}</p>
        <p className="mt-4 text-xs text-muted">
          <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
          <span aria-hidden="true"> · </span>
          {article.readingMinutes} min read
        </p>
      </div>
    </article>
  );
}

export function ArticleGrid({
  articles,
  headingLevel,
  priorityFirst = false,
}: {
  articles: ArticleSummary[];
  headingLevel?: "h2" | "h3";
  priorityFirst?: boolean;
}) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, i) => (
        <li key={article.url}>
          <ArticleCard article={article} headingLevel={headingLevel} priority={priorityFirst && i === 0} />
        </li>
      ))}
    </ul>
  );
}
