import type { Metadata } from "next";
import { ArticleGrid } from "@/components/ArticleCard";
import { EmptyListing, ListingPage } from "@/components/ListingPage";
import { getArticles, toSummary } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Best AI Tools",
  description:
    "Lists of the best AI tools for students, freelancers and small businesses, with free plans and prices compared.",
  path: "/best",
});

export default function BestPage() {
  const lists = getArticles("list").map(toSummary);
  return (
    <ListingPage
      crumb="Best Tools"
      path="/best"
      title="Best AI Tools"
      intro="Short lists of tools for a specific job or a specific kind of user, with free plans and prices side by side."
    >
      {lists.length > 0 ? (
        <ArticleGrid articles={lists} headingLevel="h2" priorityFirst />
      ) : (
        <EmptyListing>No lists yet. Check back soon.</EmptyListing>
      )}
    </ListingPage>
  );
}
