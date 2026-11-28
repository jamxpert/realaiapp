import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ToolBadges } from "@/components/Badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { PricingTable } from "@/components/PricingTable";
import { ToolCard } from "@/components/ToolCard";
import { ToolLinkButton } from "@/components/ToolLinkButton";
import { getArticlesForTool, typeConfig } from "@/lib/content";
import { formatDate } from "@/lib/format";
import {
  categoryInfo,
  categoryLabels,
  internationalCardLabel,
  toolLink,
  urduSupportLabels,
} from "@/lib/tool-utils";
import { getAlternatives, getTool, tools } from "@/lib/tools";
import { type JsonLdObject, JsonLd, absoluteUrl, breadcrumbSchema, pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getTool((await params).slug);
  if (!tool) return {};
  return pageMetadata({
    hasOwnImage: true,
    title: `${tool.name}: How to Use It, Features and Pricing`,
    description: `${tool.shortDescription} Best for: ${tool.bestFor}. Step-by-step guide, tips and prices.`.slice(0, 155),
    path: `/tools/${tool.slug}`,
  });
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-10">
      <h2 id={id} className="scroll-mt-24 text-2xl font-bold">
        {title}
      </h2>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function ToolPage({ params }: Props) {
  const tool = getTool((await params).slug);
  if (!tool) notFound();
  const articles = getArticlesForTool(tool.slug);
  const alternatives = getAlternatives(tool);
  const isTopPick = categoryInfo[tool.category].topPick === tool.slug;
  const path = `/tools/${tool.slug}`;
  const crumbs = [{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: tool.name }];
  // Facts from data/tools only. No rating until we have reviewed the tool.
  const app: JsonLdObject = {
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.shortDescription,
    url: absoluteUrl(path),
    sameAs: tool.website,
    applicationCategory: `${categoryLabels[tool.category]} application`,
    operatingSystem: "Web",
    ...(tool.freePlan ? { offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } } : {}),
  };

  const facts: [string, string][] = [
    ["Category", categoryLabels[tool.category]],
    ["Works in Urdu", urduSupportLabels[tool.urduSupport]],
    ["Needs an international card", internationalCardLabel(tool.needsInternationalCard)],
    ["Our rating", tool.rating !== undefined ? `${tool.rating}/10` : "Not reviewed yet"],
  ];

  const contents: [string, string][] = [
    ["about", `What is ${tool.name}?`],
    ["uses", "What you can use it for"],
    ["how-to", "How to use it"],
    ["tips", "Tips"],
    ["limits", "Limits"],
    ["pricing", "Pricing"],
    ...(alternatives.length > 0 ? ([["alternatives", "Alternatives"]] as [string, string][]) : []),
  ];

  return (
    <Container className="max-w-3xl py-10">
      <JsonLd data={[breadcrumbSchema(crumbs, path), app]} />
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{tool.name}</h1>
      <p className="mt-3 text-lg text-muted">{tool.shortDescription}</p>
      <div className="mt-4">
        <ToolBadges tool={tool} />
      </div>
      {tool.sponsoredActive && (
        <p className="mt-3 text-sm text-muted">
          This is a sponsored listing. Sponsorship never changes our rating or review.
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-line bg-surface p-4">
        <p>
          <span className="font-semibold">Best for: </span>
          {tool.bestFor}
        </p>
        {isTopPick && (
          <p className="mt-1 text-sm text-muted">
            Our first pick to: {categoryInfo[tool.category].job.toLowerCase()}.
          </p>
        )}
        <p className="mt-1 text-sm text-muted">
          Free plan: {tool.freePlan ? "yes" : "no"} · Paid from: {tool.cheapestPaidPlan}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <ToolLinkButton tool={tool} />
        {tool.reviewSlug && (
          <Link href={`/reviews/${tool.reviewSlug}`} className="font-semibold text-accent hover:underline">
            Read our {tool.name} review
          </Link>
        )}
      </div>
      {toolLink(tool).isAffiliate && (
        <p className="mt-2 text-xs text-muted">
          Affiliate link: we may earn a commission at no extra cost to you.
        </p>
      )}

      <nav aria-label="On this page" className="mt-8 border-y border-line py-3">
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {contents.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="text-muted hover:text-accent hover:underline">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Section id="about" title={`What is ${tool.name}?`}>
        {tool.about.map((paragraph) => (
          <p key={paragraph} className="mt-4">
            {paragraph}
          </p>
        ))}
      </Section>

      <Section id="uses" title="What you can use it for">
        <BulletList items={tool.useCases} />
      </Section>

      <Section id="features" title="Main features">
        <BulletList items={tool.features} />
      </Section>

      <Section id="how-to" title={`How to use ${tool.name}, step by step`}>
        <ol className="mt-4 space-y-4">
          {tool.howToUse.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-fg text-sm font-bold text-bg"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-bold">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-1">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {tool.examplePrompt && (
        <Section id="example" title="Example prompt to try">
          <p className="mt-2 text-sm text-muted">Copy this, then change the details to fit what you need.</p>
          <blockquote className="mt-3 rounded-2xl border border-line bg-surface p-4 font-mono text-sm leading-relaxed break-words">
            {tool.examplePrompt}
          </blockquote>
        </Section>
      )}

      <Section id="tips" title="Tips for better results">
        <BulletList items={tool.tips} />
      </Section>

      <Section id="limits" title="Limits to know before you start">
        <BulletList items={tool.limitations} />
      </Section>

      <Section id="pricing" title="Pricing">
        <PricingTable tool={tool} />
      </Section>

      <Section id="details" title="Details">
        <dl className="mt-4 divide-y divide-line rounded-2xl border border-line">
          {facts.map(([label, value]) => (
            <div key={label} className="grid gap-1 px-4 py-3 sm:grid-cols-[2fr_3fr]">
              <dt className="text-sm font-semibold text-muted">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {alternatives.length > 0 && (
        <Section id="alternatives" title={`Alternatives to ${tool.name}`}>
          <p className="mt-2 text-muted">
            Other tools to {categoryInfo[tool.category].job.toLowerCase()}.{" "}
            <Link href={`/tools?category=${tool.category}`} className="font-semibold text-accent hover:underline">
              See all {categoryLabels[tool.category].toLowerCase()} tools
            </Link>
          </p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {alternatives.map((alt) => (
              <li key={alt.slug}>
                <ToolCard tool={alt} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {articles.length > 0 && (
        <Section id="articles" title={`Articles that mention ${tool.name}`}>
          <ul className="mt-4 divide-y divide-line rounded-2xl border border-line">
            {articles.map((article) => (
              <li key={article.url} className="px-4 py-3">
                <Link href={article.url} className="font-semibold hover:text-accent hover:underline">
                  {article.title}
                </Link>
                <p className="mt-1 text-sm text-muted">
                  {typeConfig[article.type].label}
                  {article.language === "roman-urdu" && " · Roman Urdu"} · {formatDate(article.updatedAt)}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </Container>
  );
}
