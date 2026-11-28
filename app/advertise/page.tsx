import Link from "next/link";
import { TextPage } from "@/components/TextPage";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { staticPages } from "@/lib/static-pages";

const page = staticPages.advertise;

export const metadata = pageMetadata({
  title: page.title,
  description: "Sponsored listings for AI tools on RealAIApps: what you get, how they are labelled, and how to get in touch.",
  path: page.path,
});

export default function AdvertisePage() {
  const subject = encodeURIComponent("Sponsored listing on RealAIApps");
  return (
    <TextPage page={page} intro="Put your AI tool in front of people who are actively looking for one.">
      <p>
        RealAIApps readers come here to choose an AI tool, in English and in Roman Urdu. A sponsored listing
        helps them notice yours.
      </p>

      <h2>What a sponsored listing includes</h2>
      <ul>
        <li>
          Your tool is shown near the top of the <Link href="/tools">AI tools directory</Link>, for the
          dates we agree
        </li>
        <li>Its tool page shows your link and its free plan and pricing</li>
        <li>The listing ends on its own on the end date, with nothing for you to cancel</li>
      </ul>

      <h2>Our rules (they protect our readers and you)</h2>
      <ul>
        <li>
          Every sponsored tool is clearly labelled <strong>&quot;Sponsored&quot;</strong>, wherever it appears
        </li>
        <li>Sponsorship never changes a rating, a review verdict or the order of a &quot;best tools&quot; list</li>
        <li>We don&apos;t sell reviews. If we review your tool, we write what we really find, including cons</li>
        <li>We only accept tools that are real, working AI products</li>
      </ul>
      <p>
        You can read more about this in <Link href="/how-we-test">how we test</Link>.
      </p>

      <h2>Prices and dates</h2>
      <p>Email us with your tool&apos;s name and website, and the dates you would like. We will reply with current rates.</p>
      <p>
        <a href={`mailto:${site.email}?subject=${subject}`} className="font-semibold">
          Email {site.email}
        </a>
      </p>
    </TextPage>
  );
}
