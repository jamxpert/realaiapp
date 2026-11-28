import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import type { ArticleSummary } from "@/lib/article-summary";
import { type Article, typeConfig } from "@/lib/content";
import { formatDate } from "@/lib/format";
import type { Heading } from "@/lib/mdx";
import { ArticleGrid } from "./ArticleCard";
import { features } from "@/lib/site-config";
import { Badge } from "./Badge";
import { Comments } from "./Comments";
import { NewsletterForm } from "./NewsletterForm";
import { Breadcrumbs } from "./Breadcrumbs";
import { Container } from "./Container";
import { TableOfContents } from "./TableOfContents";
import { AffiliateDisclosure } from "./mdx/AffiliateDisclosure";
import { YouTube } from "./mdx/YouTube";

interface Props {
  article: Article;
  content: ReactElement;
  headings: Heading[];
  translation?: Article;
  related: ArticleSummary[];
}

export function ArticleLayout({ article, content, headings, translation, related }: Props) {
  const config = typeConfig[article.type];
  const isUrdu = article.language === "roman-urdu";
  const showDisclosure = article.hasAffiliateLinks && !article.body.includes("<AffiliateDisclosure");

  return (
    <Container className="py-8 sm:py-10">
      {article.draft && (
        <p className="mb-6 rounded-xl border border-accent px-4 py-2 text-sm font-semibold text-accent">
          Draft: only visible in development. It will not be published.
        </p>
      )}
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12">
        <article className="min-w-0">
          <header className="max-w-3xl">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: config.plural, href: config.base },
                { label: article.title },
              ]}
            />
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge>{config.label}</Badge>
              {isUrdu && <Badge tone="accent">Roman Urdu</Badge>}
              {article.type === "tutorial" && (
                <>
                  <Badge>{article.difficulty === "beginner" ? "Beginner" : "Intermediate"}</Badge>
                  <Badge>{article.timeNeeded}</Badge>
                </>
              )}
            </div>
            <h1 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">{article.title}</h1>
            <p className="mt-4 text-lg text-muted sm:text-xl">{article.description}</p>
            <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
              <span>By {article.author}</span>
              <span aria-hidden="true">·</span>
              <span>
                Published <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              </span>
              {article.updatedAt !== article.publishedAt && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    Updated <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
                  </span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>{article.readingMinutes} min read</span>
            </p>
            {translation && (
              <p className="mt-4 rounded-xl border border-line px-4 py-3 text-sm">
                {translation.language === "en" ? "Yeh guide English mein bhi hai: " : "This guide is also in Roman Urdu: "}
                <Link href={translation.url} className="font-semibold text-accent underline">
                  {translation.title}
                </Link>
              </p>
            )}
          </header>

          <div className="mt-8 max-w-3xl">
            {article.type === "tutorial" && article.videoId ? (
              <YouTube id={article.videoId} title={article.title} />
            ) : (
              <Image
                src={article.cover.src}
                alt={article.coverAlt}
                width={article.cover.width}
                height={article.cover.height}
                sizes="(min-width: 1024px) 768px, 100vw"
                priority
                className="h-auto w-full rounded-2xl border border-line"
              />
            )}
          </div>

          <div className="mt-8 max-w-3xl">
            <TableOfContents headings={headings} variant="mobile" />
          </div>

          <div className="prose mt-8 max-w-3xl sm:prose-lg">
            {content}
            {showDisclosure && <AffiliateDisclosure />}
          </div>
        </article>

        <aside className="hidden lg:block">
          <TableOfContents headings={headings} variant="desktop" />
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-16 border-t border-line pt-10">
          <h2 id="related-heading" className="text-2xl font-bold tracking-tight">
            {isUrdu ? "Yeh bhi parhein" : "Related articles"}
          </h2>
          <div className="mt-6">
            <ArticleGrid articles={related} />
          </div>
        </section>
      )}

      {features.newsletter && (
        <div className="mt-16">
          <NewsletterForm language={article.language} />
        </div>
      )}

      {features.giscus && <Comments {...features.giscus} />}
    </Container>
  );
}
