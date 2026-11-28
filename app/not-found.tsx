import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist. Search the site or try one of the popular pages.",
};

const popular = [
  { href: "/reviews", label: "AI tool reviews" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "/urdu", label: "Roman Urdu guides" },
  { href: "/tools", label: "AI tools directory" },
  { href: "/compare", label: "Comparisons" },
  { href: "/best", label: "Best tools lists" },
];

export default function NotFound() {
  return (
    <Container className="max-w-2xl py-16 sm:py-24">
      <p className="text-sm font-semibold tracking-wider text-accent uppercase">404 error</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">We can&apos;t find that page</h1>
      <p className="mt-4 text-lg text-muted">
        It may have moved, or the link may have a typo. Try searching for what you need.
      </p>

      {/* A plain GET form: it works without JavaScript and lands on /search?q=… */}
      <form action="/search" role="search" className="mt-8 flex gap-2">
        <label htmlFor="not-found-search" className="sr-only">
          Search articles and tools
        </label>
        <input
          id="not-found-search"
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

      <h2 className="mt-12 text-xl font-bold">Popular pages</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {popular.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-xl border border-line px-4 py-3 font-semibold hover:border-accent hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8">
        <Link href="/" className="font-semibold text-accent hover:underline">
          <span aria-hidden="true">←</span> Back to the home page
        </Link>
      </p>
    </Container>
  );
}
