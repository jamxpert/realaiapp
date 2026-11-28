import Link from "next/link";
import { features } from "@/lib/site-config";

const text = {
  en: {
    title: "Get new guides by email",
    body: "New reviews and tutorials, about once a week. No spam. Unsubscribe any time.",
    label: "Email address",
    button: "Subscribe",
    note: "The form opens our email provider in a new tab.",
    privacy: "Privacy policy",
  },
  "roman-urdu": {
    title: "Naye guides email par paayein",
    body: "Naye reviews aur tutorials, taqreeban hafte mein ek baar. Koi spam nahi. Jab chahein unsubscribe karein.",
    label: "Email address",
    button: "Subscribe karein",
    note: "Form hamare email provider ka page naye tab mein kholta hai.",
    privacy: "Privacy policy",
  },
};

/**
 * Posts straight to the Brevo or Mailchimp form in data/site.ts. We never store emails.
 * Renders nothing while newsletter.formUrl is empty.
 */
export function NewsletterForm({ language = "en" }: { language?: "en" | "roman-urdu" }) {
  const newsletter = features.newsletter;
  if (!newsletter) return null;
  const t = text[language];

  return (
    <section aria-labelledby="newsletter-heading" className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <h2 id="newsletter-heading" className="text-2xl font-bold tracking-tight">
        {t.title}
      </h2>
      <p className="mt-2 max-w-xl text-muted">{t.body}</p>
      <form action={newsletter.formUrl} method="post" target="_blank" className="mt-5 flex max-w-lg flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          {t.label}
        </label>
        <input
          id="newsletter-email"
          name={newsletter.emailFieldName}
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="h-12 min-w-0 flex-1 rounded-lg border border-line bg-bg px-4 placeholder:text-muted focus:border-accent"
        />
        <button
          type="submit"
          className="h-12 shrink-0 rounded-lg bg-button px-5 font-semibold text-white hover:bg-button-hover"
        >
          {t.button}
        </button>
      </form>
      <p className="mt-3 text-xs text-muted">
        {t.note}{" "}
        <Link href="/privacy-policy" className="underline hover:text-fg">
          {t.privacy}
        </Link>
      </p>
    </section>
  );
}
