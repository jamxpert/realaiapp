import type { ReactNode } from "react";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";
import { type Crumb, Breadcrumbs } from "./Breadcrumbs";
import { Container } from "./Container";

interface Props {
  title: string;
  intro: ReactNode;
  crumb: string;
  /** Site path of this page, for the breadcrumb structured data. */
  path: string;
  children: ReactNode;
}

/** Shared header for the article listing pages. */
export function ListingPage({ title, intro, crumb, path, children }: Props) {
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }, { label: crumb }];
  return (
    <Container className="py-10">
      <JsonLd data={breadcrumbSchema(crumbs, path)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
      <div className="mt-3 max-w-2xl text-lg text-muted">{intro}</div>
      <div className="mt-8">{children}</div>
    </Container>
  );
}

export function EmptyListing({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl border border-line p-6 text-muted">{children}</p>;
}
