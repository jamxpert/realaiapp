import type { Heading } from "@/lib/mdx";

function Links({ headings }: { headings: Heading[] }) {
  return (
    <ol className="space-y-1 text-sm">
      {headings.map((h) => (
        <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
          <a href={`#${h.id}`} className="block py-1 text-muted hover:text-fg hover:underline">
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Collapsible on mobile, sticky in the sidebar on desktop. Hidden when there are fewer than 2 headings. */
export function TableOfContents({ headings, variant }: { headings: Heading[]; variant: "mobile" | "desktop" }) {
  if (headings.length < 2) return null;
  if (variant === "mobile") {
    return (
      <details className="rounded-2xl border border-line px-4 py-2 lg:hidden">
        <summary className="cursor-pointer py-1 font-semibold">On this page</summary>
        <nav aria-label="Table of contents" className="pt-2 pb-1">
          <Links headings={headings} />
        </nav>
      </details>
    );
  }
  return (
    <nav aria-label="Table of contents" className="sticky top-24 hidden max-h-[calc(100dvh-8rem)] overflow-y-auto lg:block">
      <p className="mb-2 text-sm font-semibold">On this page</p>
      <Links headings={headings} />
    </nav>
  );
}
