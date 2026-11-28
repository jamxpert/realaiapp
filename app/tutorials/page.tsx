import type { Metadata } from "next";
import { FilteredArticles } from "@/components/FilteredArticles";
import { EmptyListing, ListingPage } from "@/components/ListingPage";
import { getArticles, toSummary } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "AI Tutorials",
  description:
    "Step-by-step AI tutorials in English and Roman Urdu, with prompts you can copy.",
  path: "/tutorials",
});

export default function TutorialsPage() {
  const tutorials = getArticles("tutorial").map(toSummary);
  return (
    <ListingPage
      crumb="Tutorials"
      path="/tutorials"
      title="AI Tutorials"
      intro="Step-by-step guides in English and Roman Urdu. Each one tells you how long it takes and gives you prompts to copy."
    >
      {tutorials.length > 0 ? (
        <FilteredArticles
          articles={tutorials}
          noun={["tutorial", "tutorials"]}
          filters={[
            {
              key: "language",
              label: "Language",
              options: [
                { value: "en", label: "English" },
                { value: "roman-urdu", label: "Roman Urdu" },
              ],
            },
            {
              key: "difficulty",
              label: "Level",
              options: [
                { value: "beginner", label: "Beginner" },
                { value: "intermediate", label: "Intermediate" },
              ],
            },
          ]}
        />
      ) : (
        <EmptyListing>No tutorials yet. Check back soon.</EmptyListing>
      )}
    </ListingPage>
  );
}
