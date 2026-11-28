import { type ArticleType, getArticle, getArticles, typeConfig } from "./content";
import { renderOgImage } from "./og";

/** Static params and image for app/<type>/[slug]/opengraph-image.tsx, built at build time. */
export function makeArticleOgImage(type: ArticleType) {
  return {
    generateStaticParams() {
      return getArticles(type).map((article) => ({ slug: article.slug }));
    },
    async Image({ params }: { params: Promise<{ slug: string }> }) {
      const article = getArticle(type, (await params).slug);
      return renderOgImage({
        title: article?.title ?? typeConfig[type].plural,
        label: typeConfig[type].label,
        romanUrdu: article?.language === "roman-urdu",
      });
    },
  };
}
