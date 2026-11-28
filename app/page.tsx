import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArticleGrid } from "@/components/ArticleCard";
import { Container } from "@/components/Container";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ToolCard } from "@/components/ToolCard";
import { site } from "@/data/site";
import { getArticles, getArticlesByLanguage, toSummary } from "@/lib/content";
import { features } from "@/lib/site-config";
import { JsonLd, organization, pageMetadata, websiteSchema } from "@/lib/seo";
import { sortTools } from "@/lib/tool-utils";
import { tools } from "@/lib/tools";

export const metadata: Metadata = pageMetadata({
  title: `${site.name}: ${site.tagline}`,
  description: site.description,
  path: "/",
  absoluteTitle: true,
});

const testingPoints = [
  { title: "We use every tool", text: "We try each tool on real tasks before we write about it." },
  { title: "Prices have dates", text: "Every price shows the day we checked it, so you know how fresh it is." },
  { title: "Real cons, always", text: "Every review lists what didn't work, not only what did." },
  { title: "Sponsors don't buy ratings", text: "Sponsored tools are labelled, and payment never changes a verdict." },
];

function Section({
  id,
  title,
  link,
  children,
}: {
  id: string;
  title: string;
  link?: { href: string; label: string };
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="py-10 sm:py-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 id={id} className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {link && (
          <Link href={link.href} className="font-semibold text-accent hover:underline">
            {link.label} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export default function HomePage() {
  const reviews = getArticles("review").slice(0, 3).map(toSummary);
  const tutorials = getArticles("tutorial").slice(0, 3).map(toSummary);
  const guides = [...getArticles("list"), ...getArticles("comparison")]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3)
    .map(toSummary);
  // Skip Urdu guides already shown above, so no card appears twice.
  const shown = new Set([...reviews, ...tutorials, ...guides].map((a) => a.url));
  const urdu = getArticlesByLanguage("roman-urdu")
    .filter((a) => !shown.has(a.url))
    .slice(0, 3)
    .map(toSummary);
  const popularTools = sortTools(tools, "rating").slice(0, 6);

  return (
    <>
      <JsonLd data={[websiteSchema(), organization]} />
      <div className="border-b border-line">
        <Container className="py-16 sm:py-24">
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">{site.tagline}</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted sm:text-xl">
            Honest reviews, clear comparisons and step-by-step tutorials, in English and Roman Urdu. We
            test the tools so you know what is worth your time and money.
          </p>
          <form action="/search" role="search" className="mt-8 flex max-w-xl gap-2">
            <label htmlFor="home-search" className="sr-only">
              Search articles and tools
            </label>
            <input
              id="home-search"
              name="q"
              type="search"
              placeholder="Search tools and guides"
              className="h-12 min-w-0 flex-1 rounded-lg border border-line bg-surface px-4 placeholder:text-muted focus:border-accent"
            />
            <button
              type="submit"
              className="h-12 shrink-0 rounded-lg bg-button px-5 font-semibold text-white hover:bg-button-hover"
            >
              Search
            </button>
          </form>
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link href="/reviews" className="font-semibold text-accent hover:underline">
              Read reviews
            </Link>
            <Link href="/tools" className="font-semibold text-accent hover:underline">
              Browse AI tools
            </Link>
            <Link href="/urdu" className="font-semibold text-accent hover:underline">
              Urdu guides
            </Link>
          </p>
        </Container>
      </div>

      <Container>
        {reviews.length > 0 && (
          <Section id="latest-reviews" title="Latest reviews" link={{ href: "/reviews", label: "All reviews" }}>
            <ArticleGrid articles={reviews} priorityFirst />
          </Section>
        )}

        {tutorials.length > 0 && (
          <Section id="latest-tutorials" title="Latest tutorials" link={{ href: "/tutorials", label: "All tutorials" }}>
            <ArticleGrid articles={tutorials} />
          </Section>
        )}

        {guides.length > 0 && (
          <Section id="best-and-compare" title="Best tools and comparisons" link={{ href: "/best", label: "All lists" }}>
            <ArticleGrid articles={guides} />
          </Section>
        )}

        <Section id="popular-tools" title="Popular AI tools" link={{ href: "/tools", label: "All tools" }}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool) => (
              <li key={tool.slug}>
                <ToolCard tool={tool} />
              </li>
            ))}
          </ul>
        </Section>

        <Section id="urdu-guides" title="Roman Urdu guides" link={{ href: "/urdu", label: "Sab Urdu guides" }}>
          <p className="-mt-2 max-w-2xl text-muted">
            AI tools ke asaan guides Roman Urdu mein: step by step tareeqay, copy karne wale prompts aur
            Pakistan ke liye tips.
          </p>
          {urdu.length > 0 && (
            <div className="mt-6">
              <ArticleGrid articles={urdu} />
            </div>
          )}
        </Section>

        <Section id="how-we-test" title="How we test">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {testingPoints.map((point) => (
              <li key={point.title} className="rounded-2xl border border-line bg-surface p-5">
                <h3 className="font-bold">{point.title}</h3>
                <p className="mt-2 text-sm text-muted">{point.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link href="/how-we-test" className="font-semibold text-accent hover:underline">
              Read our full testing method <span aria-hidden="true">→</span>
            </Link>
          </p>
        </Section>
        {features.newsletter && (
          <div className="pb-14">
            <NewsletterForm />
          </div>
        )}
      </Container>
    </>
  );
}
