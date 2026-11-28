import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/ArticleLayout";
import {
  type ArticleType,
  getArticle,
  getArticles,
  getRelatedArticles,
  getTranslation,
  toSummary,
  typeConfig,
} from "./content";
import { articleSchemas } from "./article-schema";
import { renderArticle } from "./mdx";
import { JsonLd, pageMetadata } from "./seo";

interface Props {
  params: Promise<{ slug: string }>;
}

/** Shared static params, metadata and page for /reviews, /best, /compare and /tutorials. */
export function makeArticleRoute(type: ArticleType) {
  return {
    generateStaticParams() {
      return getArticles(type).map((article) => ({ slug: article.slug }));
    },

    async generateMetadata({ params }: Props): Promise<Metadata> {
      const article = getArticle(type, (await params).slug);
      if (!article) return {};
      return pageMetadata({
        hasOwnImage: true,
        title: article.title,
        description: article.description,
        path: article.url,
        article: {
          publishedTime: article.publishedAt,
          modifiedTime: article.updatedAt,
          tags: article.tags,
          section: typeConfig[type].plural,
        },
      });
    },

    async Page({ params }: Props) {
      const article = getArticle(type, (await params).slug);
      if (!article) notFound();
      const { content, headings } = await renderArticle(article);
      return (
        <>
          <JsonLd data={articleSchemas(article)} />
          <ArticleLayout
            article={article}
            content={content}
            headings={headings}
            translation={getTranslation(article)}
            related={getRelatedArticles(article).map(toSummary)}
          />
        </>
      );
    },
  };
}
