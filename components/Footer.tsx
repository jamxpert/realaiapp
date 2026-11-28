import Link from "next/link";
import { site } from "@/data/site";
import { Container } from "./Container";
import { Logo } from "./Logo";

export function Footer() {
  const social = site.social.filter((link) => link.href !== "");
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="grid gap-8 py-10 md:grid-cols-2">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-muted">{site.description}</p>
          {social.length > 0 && (
            <ul className="mt-4 flex gap-4">
              {social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener"
                    className="text-accent hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-4">
            {site.footerNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block py-2 text-muted hover:text-fg hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-wrap justify-between gap-3 py-5 text-sm text-muted">
          <span>© 2026 {site.name}</span>
          {/* A plain <a>: the feed is an XML file, not a page. */}
          <a href="/feed.xml" className="hover:text-fg hover:underline">
            RSS feed
          </a>
        </Container>
      </div>
    </footer>
  );
}
