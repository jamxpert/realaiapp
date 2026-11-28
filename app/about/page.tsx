import Link from "next/link";
import { TextPage } from "@/components/TextPage";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { staticPages } from "@/lib/static-pages";

const page = staticPages.about;

export const metadata = pageMetadata({
  title: page.title,
  description: "Who runs RealAIApps, why we started it, and how the site makes money.",
  path: page.path,
});

export default function AboutPage() {
  return (
    <TextPage page={page} intro={site.tagline}>
      <p>
        RealAIApps helps you find AI tools that are worth your time and money. We write honest reviews,
        clear comparisons and step-by-step tutorials, in English and in Roman Urdu.
      </p>

      <h2>Who runs this site</h2>
      <p>
        RealAIApps is run by <strong>{site.author.name}</strong>.
      </p>
      <p>
        {site.author.bio ||
          "[ADD YOUR EXPERIENCE: who you are, what you do, and why people can trust your opinion on AI tools. Set this text as author.bio in data/site.ts.]"}
      </p>

      <h2>Why we started</h2>
      <p>
        Most AI tool lists copy the same marketing text and skip the parts that matter: what the free plan
        really gives you, what it costs after that, and whether it works for people outside the US. We
        wanted one place that answers those questions plainly.
      </p>
      <p>
        Many of our readers are in Pakistan, so we also check things like Urdu support and whether you need
        an international card to pay.
      </p>

      <h2>What you will find here</h2>
      <ul>
        <li>
          <Link href="/reviews">Reviews</Link> of single tools, with real pros and cons
        </li>
        <li>
          <Link href="/best">Best tools lists</Link> for a specific job or type of user
        </li>
        <li>
          <Link href="/compare">Comparisons</Link> of two tools, round by round
        </li>
        <li>
          <Link href="/tutorials">Tutorials</Link> and <Link href="/urdu">Roman Urdu guides</Link> with prompts
          you can copy
        </li>
        <li>
          A <Link href="/tools">tools directory</Link> with free plans and dated prices
        </li>
      </ul>

      <h2>How we make money</h2>
      <p>
        Some links on this site are affiliate links: if you buy through them, we may earn a commission at
        no extra cost to you. Some tools pay for a sponsored listing, which is always labelled
        &quot;Sponsored&quot;. Neither of these changes our ratings or reviews. Read our{" "}
        <Link href="/affiliate-disclosure">affiliate disclosure</Link> and{" "}
        <Link href="/how-we-test">how we test</Link>.
      </p>

      <h2>Get in touch</h2>
      <p>
        Found a mistake or an old price? Want us to review a tool? <Link href="/contact">Contact us</Link>.
      </p>
    </TextPage>
  );
}
