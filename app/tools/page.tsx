import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { ToolsDirectory } from "@/components/ToolsDirectory";
import { categories, categoryInfo, toToolSummary } from "@/lib/tool-utils";
import { tools } from "@/lib/tools";
import { JsonLd, breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "AI Tools Directory: The Best AI Tool for Every Job",
  description:
    "The best AI tools for chat, writing, coding, prompts, images, video editing, voice-overs, music, transcription, slides, research and automation, with guides and prices.",
  path: "/tools",
});

const crumbs = [{ label: "Home", href: "/" }, { label: "Tools" }];

/** For each job: our pick first, then the other tools in that category. */
const jobs = categories.map((category) => {
  const info = categoryInfo[category];
  const inCategory = tools.filter((t) => t.category === category);
  const pick = inCategory.find((t) => t.slug === info.topPick);
  return { category, info, pick, others: inCategory.filter((t) => t !== pick) };
});

export default function ToolsPage() {
  return (
    <Container className="py-10">
      <JsonLd data={breadcrumbSchema(crumbs, "/tools")} />
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">AI Tools Directory</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        {tools.length} AI tools, grouped by the job they do best. Every tool has a full guide: what it is,
        how to use it step by step, tips, limits, and what the cheapest plan costs.
      </p>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Tools marked &quot;Sponsored&quot; paid for their placement. Sponsorship never changes our
        ratings or reviews.
      </p>

      <section aria-labelledby="by-job" className="mt-10">
        <h2 id="by-job" className="text-2xl font-bold">
          Which AI tool for which job?
        </h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {jobs.map(({ category, info, pick, others }) => (
            <li key={category} className="rounded-2xl border border-line p-4">
              <p className="text-sm font-semibold text-muted">{info.label}</p>
              <h3 className="mt-0.5 font-bold">{info.job}</h3>
              {pick && (
                <p className="mt-2">
                  <span className="text-sm text-muted">Our pick: </span>
                  <Link href={`/tools/${pick.slug}`} className="font-semibold text-accent hover:underline">
                    {pick.name}
                  </Link>
                </p>
              )}
              {others.length > 0 && (
                <p className="mt-1 text-sm">
                  <span className="text-muted">Also good: </span>
                  {others.map((t, i) => (
                    <span key={t.slug}>
                      {i > 0 && ", "}
                      <Link href={`/tools/${t.slug}`} className="hover:text-accent hover:underline">
                        {t.name}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="all-tools" className="mt-12">
        <h2 id="all-tools" className="text-2xl font-bold">
          All tools
        </h2>
        <div className="mt-4">
          <ToolsDirectory tools={tools.map(toToolSummary)} />
        </div>
      </section>
    </Container>
  );
}
