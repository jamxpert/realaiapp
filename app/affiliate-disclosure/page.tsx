import Link from "next/link";
import { TextPage } from "@/components/TextPage";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { staticPages } from "@/lib/static-pages";

const page = staticPages.affiliate;

export const metadata = pageMetadata({
  title: page.title,
  description: "How RealAIApps uses affiliate links and sponsored listings, and why they never change our ratings.",
  path: page.path,
});

export default function AffiliateDisclosurePage() {
  return (
    <TextPage page={page} showUpdated>
      <p>
        {site.name} is free to read. To keep it running, we sometimes earn money from the links on this site.
        This page explains how.
      </p>

      <h2>Affiliate links</h2>
      <p>
        Some links to AI tools are affiliate links. If you click one and then buy a paid plan, the tool may
        pay us a commission. <strong>You pay the same price</strong> as you would without our link.
      </p>
      <p>
        Affiliate links on this site open in a new tab and are marked as sponsored links for search
        engines. Articles that contain them show a short disclosure.
      </p>

      <h2>Sponsored listings</h2>
      <p>
        Some tools pay to be shown higher in our <Link href="/tools">tools directory</Link>. These are always
        labelled &quot;Sponsored&quot;. Read more on our <Link href="/advertise">advertising page</Link>.
      </p>

      <h2>Advertising</h2>
      <p>
        We may show ads from Google AdSense. Ads are chosen by Google, not by us, and showing an ad does not
        mean we recommend the product.
      </p>

      <h2>What money does not change</h2>
      <ul>
        <li>Our ratings and review verdicts</li>
        <li>The cons we list</li>
        <li>The order of our &quot;best tools&quot; lists</li>
        <li>Which tools we recommend: we also recommend tools that pay us nothing</li>
      </ul>
      <p>
        See <Link href="/how-we-test">how we test</Link> for the full rules. Questions?{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
    </TextPage>
  );
}
