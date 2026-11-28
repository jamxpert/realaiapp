import type { Metadata } from "next";
import { ArticleGrid } from "@/components/ArticleCard";
import { EmptyListing, ListingPage } from "@/components/ListingPage";
import { getArticles, toSummary } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Best AI Tools: Lists for Every Job and Every User",
  description:
    "The best AI tools for students, professionals, freelancers, teachers and businesses, and for coding, video, voice, images and more.",
  path: "/best",
});

// Lists named "best-ai-tools-for-<people>" are about who you are; every other list is about a job.
const isForPeople = (url: string) => url.startsWith("/best/best-ai-tools-for-");

export default function BestPage() {
  const lists = getArticles("list").map(toSummary);
  const forPeople = lists.filter((l) => isForPeople(l.url));
  const forJobs = lists.filter((l) => !isForPeople(l.url));
  return (
    <ListingPage
      crumb="Best Tools"
      path="/best"
      title="Best AI Tools"
      intro="Short lists of the best AI tools for who you are or the job you need done, with free plans and prices side by side."
    >
      {lists.length === 0 ? (
        <EmptyListing>No lists yet. Check back soon.</EmptyListing>
      ) : (
        <div className="space-y-12">
          {forPeople.length > 0 && (
            <section aria-labelledby="for-people">
              <h2 id="for-people" className="mb-5 text-2xl font-extrabold tracking-tight">
                By who you are
              </h2>
              <ArticleGrid articles={forPeople} headingLevel="h3" priorityFirst />
            </section>
          )}
          {forJobs.length > 0 && (
            <section aria-labelledby="for-jobs">
              <h2 id="for-jobs" className="mb-5 text-2xl font-extrabold tracking-tight">
                By job
              </h2>
              <ArticleGrid articles={forJobs} headingLevel="h3" />
            </section>
          )}
        </div>
      )}
    </ListingPage>
  );
}
