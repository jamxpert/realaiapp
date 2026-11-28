import type { Metadata } from "next";
import { ArticleGrid } from "@/components/ArticleCard";
import { EmptyListing, ListingPage } from "@/components/ListingPage";
import { getArticles, toSummary } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "AI Tool Comparisons",
  description:
    "Two AI tools compared round by round: free plans, prices, features and which one to pick.",
  path: "/compare",
});

export default function ComparePage() {
  const comparisons = getArticles("comparison").map(toSummary);
  return (
    <ListingPage
      crumb="Compare"
      path="/compare"
      title="AI Tool Comparisons"
      intro="Two tools, the same tasks, round by round. Each comparison ends with a clear answer on which one to pick."
    >
      {comparisons.length > 0 ? (
        <ArticleGrid articles={comparisons} headingLevel="h2" priorityFirst />
      ) : (
        <EmptyListing>No comparisons yet. Check back soon.</EmptyListing>
      )}
    </ListingPage>
  );
}
