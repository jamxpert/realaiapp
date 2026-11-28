import Link from "next/link";

export function AffiliateDisclosure() {
  return (
    <aside role="note" className="not-prose my-8 rounded-xl border border-line px-4 py-3 text-sm text-muted">
      <strong className="text-fg">Affiliate disclosure:</strong> some links in this article may be affiliate
      links. If you buy through them, we may earn a commission at no extra cost to you. It never changes our
      ratings or verdicts.{" "}
      <Link href="/affiliate-disclosure" className="text-accent underline">
        Read our affiliate disclosure
      </Link>
    </aside>
  );
}
