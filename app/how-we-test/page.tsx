import Link from "next/link";
import { TextPage } from "@/components/TextPage";
import { pageMetadata } from "@/lib/seo";
import { staticPages } from "@/lib/static-pages";

const page = staticPages.howWeTest;

export const metadata = pageMetadata({
  title: page.title,
  description: "How we test AI tools: we use every tool ourselves, date every price, list real cons and never sell ratings.",
  path: page.path,
});

export default function HowWeTestPage() {
  return (
    <TextPage page={page} intro="The rules we follow for every review, comparison and list on this site.">
      <h2>1. We use every tool ourselves</h2>
      <p>
        We only write about a tool after we have used it on real tasks: the kind of work our readers do,
        like writing a CV, making a presentation or editing a video. Each review says what we made, how
        long we used the tool, and which plan we were on.
      </p>

      <h2>2. Every price has a date</h2>
      <p>
        AI tools change their prices often. Every price on this site shows the day we checked it on the
        tool&apos;s own website. Prices are in US dollars unless we say otherwise. App store prices in
        Pakistan and other countries can be different.
      </p>
      <p>
        If you see a price that has changed, please <Link href="/contact">tell us</Link> and we will update it.
      </p>

      <h2>3. We always list real cons</h2>
      <p>
        No tool is perfect. Every review has a cons list with problems we actually ran into, not
        made-up ones to look balanced.
      </p>

      <h2>4. We check what matters in Pakistan</h2>
      <p>
        For each tool we note whether it works with Urdu and Roman Urdu, and whether you need an
        international card to pay. Until we have tested this ourselves, we show &quot;Not tested yet&quot;
        instead of guessing.
      </p>

      <h2>5. How our ratings work</h2>
      <p>
        We rate tools out of 10, based on how well they do the job, how good the free plan is, the price,
        and how easy they are to use. We only give a rating after we have finished testing; until then the
        review shows &quot;Rating coming soon&quot;.
      </p>

      <h2>6. Money never buys a rating</h2>
      <p>
        Some links are affiliate links, and some tools pay for a sponsored listing. Sponsored listings are
        always labelled &quot;Sponsored&quot;. Neither affiliate deals nor sponsorship change a rating, a
        verdict, or the order of a &quot;best tools&quot; list. See our{" "}
        <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
      </p>

      <h2>7. We keep articles up to date</h2>
      <p>
        When a tool changes, we update the article and its &quot;Updated&quot; date. Old prices and
        features are removed, not left to mislead you.
      </p>
    </TextPage>
  );
}
