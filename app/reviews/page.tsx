import type { Metadata } from "next";
import { FilteredArticles } from "@/components/FilteredArticles";
import { EmptyListing, ListingPage } from "@/components/ListingPage";
import { getArticles, toSummary } from "@/lib/content";
import { categories, categoryLabels } from "@/lib/tool-utils";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "AI Tool Reviews",
  description:
    "Honest AI tool reviews with real pros and cons, dated prices and who each tool is for.",
  path: "/reviews",
});

export default function ReviewsPage() {
  const reviews = getArticles("review").map(toSummary);
  return (
    <ListingPage
      crumb="Reviews"
      path="/reviews"
      title="AI Tool Reviews"
      intro="We use each tool ourselves before we review it. Every review lists real cons and the date we checked the price."
    >
      {reviews.length > 0 ? (
        <FilteredArticles
          articles={reviews}
          noun={["review", "reviews"]}
          filters={[
            { key: "category", label: "Category", options: categories.map((c) => ({ value: c, label: categoryLabels[c] })) },
          ]}
        />
      ) : (
        <EmptyListing>No reviews yet. Check back soon.</EmptyListing>
      )}
    </ListingPage>
  );
}
