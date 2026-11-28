import type { ReactNode } from "react";
import { formatDate } from "@/lib/format";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";
import type { StaticPage } from "@/lib/static-pages";
import { type Crumb, Breadcrumbs } from "./Breadcrumbs";
import { Container } from "./Container";

interface Props {
  page: StaticPage;
  intro?: ReactNode;
  /** Show "Last updated" (legal pages). */
  showUpdated?: boolean;
  children: ReactNode;
}

/** Layout for about, contact, legal and other text pages. */
export function TextPage({ page, intro, showUpdated = false, children }: Props) {
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }, { label: page.title }];
  return (
    <Container className="max-w-3xl py-10">
      <JsonLd data={breadcrumbSchema(crumbs, page.path)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{page.heading}</h1>
      {intro && <p className="mt-3 text-lg text-muted">{intro}</p>}
      {showUpdated && (
        <p className="mt-3 text-sm text-muted">
          Last updated: <time dateTime={page.updated}>{formatDate(page.updated)}</time>
        </p>
      )}
      <div className="prose mt-8 sm:prose-lg">{children}</div>
    </Container>
  );
}
