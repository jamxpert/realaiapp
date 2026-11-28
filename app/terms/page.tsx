import Link from "next/link";
import { TextPage } from "@/components/TextPage";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { staticPages } from "@/lib/static-pages";

const page = staticPages.terms;

export const metadata = pageMetadata({
  title: page.title,
  description: "The terms for using RealAIApps: information only, prices can change, third-party tools and links.",
  path: page.path,
});

export default function TermsPage() {
  return (
    <TextPage page={page} showUpdated>
      <p>
        By using {site.name} ({site.url.replace("https://", "")}) you agree to these terms. If you don&apos;t
        agree, please don&apos;t use the site.
      </p>

      <h2>Information only</h2>
      <p>
        Our reviews, comparisons and tutorials are our honest opinion, for general information. They are not
        professional, legal or financial advice. Decide for yourself whether a tool is right for you.
      </p>

      <h2>Prices and features change</h2>
      <p>
        We show the date we checked every price, but AI tools change their prices, plans and features often.
        Always check the current price on the tool&apos;s own website before you pay.
      </p>

      <h2>Third-party tools and links</h2>
      <p>
        We link to tools and websites that we don&apos;t own or control. We aren&apos;t responsible for their
        content, their service, or how they use your data. Using them is under their own terms. Some links are
        affiliate links; see our <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
      </p>

      <h2>Using AI output</h2>
      <p>
        AI tools can make mistakes or invent facts. Check anything an AI tool writes for you before you use
        it, especially for school, work, health or money.
      </p>

      <h2>Our content</h2>
      <p>
        The articles, images and design on this site belong to {site.name}. You may share links and short
        quotes with credit. Please don&apos;t copy whole articles or republish them without permission.
        Product names and logos belong to their owners.
      </p>

      <h2>No warranty</h2>
      <p>
        We work hard to keep the site accurate and online, but we provide it &quot;as is&quot;, without any
        guarantee. As far as the law allows, we are not responsible for any loss that comes from using the
        site or the tools we write about.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. The &quot;Last updated&quot; date at the top shows when they last changed.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </TextPage>
  );
}
