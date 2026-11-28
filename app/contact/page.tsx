import Link from "next/link";
import { TextPage } from "@/components/TextPage";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { staticPages } from "@/lib/static-pages";

const page = staticPages.contact;

export const metadata = pageMetadata({
  title: page.title,
  description: `Contact ${site.name} about a review, a wrong price, a tool to test or advertising.`,
  path: page.path,
});

export default function ContactPage() {
  return (
    <TextPage page={page} intro="The easiest way to reach us is by email.">
      <p>
        <a href={`mailto:${site.email}`} className="text-xl font-semibold">
          {site.email}
        </a>
      </p>

      <h2>Write to us about</h2>
      <ul>
        <li>A price or feature that has changed</li>
        <li>A mistake in one of our articles</li>
        <li>A tool you would like us to review or compare</li>
        <li>
          A sponsored listing for your tool (see <Link href="/advertise">Advertise</Link>)
        </li>
      </ul>
      <p>
        You can write in English or Roman Urdu. We read every email, but we may not be able to reply to all
        of them.
      </p>

      <h2>Please note</h2>
      <p>
        We are not the makers of the tools we review. For help with your account, billing or a refund,
        please contact the tool&apos;s own support team.
      </p>
    </TextPage>
  );
}
