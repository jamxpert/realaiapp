import type { Metadata } from "next";
import { ArticleGrid } from "@/components/ArticleCard";
import { EmptyListing, ListingPage } from "@/components/ListingPage";
import { getArticlesByLanguage, toSummary } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Urdu Guides: AI Roman Urdu Mein",
  description:
    "AI tools ke asaan guides Roman Urdu mein: step by step tareeqay, copy karne wale prompts aur Pakistan ke liye tips.",
  path: "/urdu",
});

export default function UrduPage() {
  const guides = getArticlesByLanguage("roman-urdu").map(toSummary);
  return (
    <ListingPage
      crumb="Urdu Guides"
      path="/urdu"
      title="Urdu Guides: AI Roman Urdu Mein"
      intro={
        <p>
          Yahan AI tools ke guides asaan Roman Urdu mein hain. Har guide mein step by step tareeqa, copy
          karne wale prompts aur Pakistan ke liye kaam ki tips hain. Naye guides sab se upar nazar aate hain.
        </p>
      }
    >
      {guides.length > 0 ? (
        <ArticleGrid articles={guides} headingLevel="h2" priorityFirst />
      ) : (
        <EmptyListing>Abhi koi guide nahi. Jald hi naye guides aa rahe hain.</EmptyListing>
      )}
    </ListingPage>
  );
}
