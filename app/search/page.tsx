import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { Search } from "@/components/Search";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Search",
  description:
    "Search all RealAIApps reviews, comparisons, tutorials and AI tools.",
  path: "/search",
});

export default function SearchPage() {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Search</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">Find reviews, comparisons, tutorials and tools.</p>
      <div className="mt-8 max-w-3xl">
        {/* Search reads ?q= from the URL, which is only known in the browser. */}
        <Suspense fallback={<div className="h-14 rounded-xl border border-line" />}>
          <Search />
        </Suspense>
      </div>
    </Container>
  );
}
