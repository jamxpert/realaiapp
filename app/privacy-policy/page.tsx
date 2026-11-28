import Link from "next/link";
import { TextPage } from "@/components/TextPage";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { features } from "@/lib/site-config";
import { staticPages } from "@/lib/static-pages";

const page = staticPages.privacy;

export const metadata = pageMetadata({
  title: page.title,
  description: "What data RealAIApps collects, which cookies are used for analytics, ads and affiliate links, and your choices.",
  path: page.path,
});

/** Shows whether an optional feature is on right now, from data/site.ts. */
function Status({ on }: { on: boolean }) {
  return <strong>{on ? "Currently: on." : "Currently: off."}</strong>;
}

export default function PrivacyPolicyPage() {
  return (
    <TextPage page={page} showUpdated>
      <p>
        This policy explains what information {site.name} ({site.url.replace("https://", "")}) collects when
        you visit, and what we do with it. In short: we have no user accounts, we don&apos;t sell your data,
        and we don&apos;t store your email address on our own servers.
      </p>

      <h2>Information we don&apos;t collect</h2>
      <p>
        You can read the whole site without signing up. We have no accounts, no login and no database of
        visitors.
      </p>

      <h2>Server logs</h2>
      <p>
        Our hosting provider (Vercel) keeps short-term technical logs, such as IP addresses, browser type
        and the pages requested, to keep the site secure and working. We don&apos;t use these logs to
        identify you.
      </p>

      <h2>Your theme choice</h2>
      <p>
        If you switch between dark and light mode, your browser remembers the choice in local storage on
        your device. It is never sent to us.
      </p>

      <h2>Cookies</h2>
      <p>
        Cookies are small files a website saves in your browser. The site itself doesn&apos;t need cookies
        to work. The services below may set them.
      </p>

      <h3>Analytics (Google Analytics)</h3>
      <p>
        <Status on={features.googleAnalyticsId !== null} /> When it is on, we use Google Analytics to count
        visits and see which pages are popular. Google Analytics uses cookies and collects information such
        as the pages you visit, how long you stay, your approximate location and your device type. We use
        this only in summary form to improve the site. Learn more in{" "}
        <a href="https://policies.google.com/technologies/partner-sites">
          how Google uses information from sites that use its services
        </a>
        . You can block it with the{" "}
        <a href="https://tools.google.com/dlpage/gaoptout">Google Analytics opt-out browser add-on</a>.
      </p>

      <h3>Advertising (Google AdSense)</h3>
      <p>
        <Status on={features.adsenseClientId !== null} /> When it is on, we show ads from Google AdSense.
      </p>
      <ul>
        <li>Third-party vendors, including Google, use cookies to serve ads based on your earlier visits to this website or other websites.</li>
        <li>
          Google&apos;s use of advertising cookies lets it and its partners serve ads to you based on your
          visits to this site and/or other sites on the internet.
        </li>
        <li>
          You can turn off personalised advertising in Google&apos;s{" "}
          <a href="https://adssettings.google.com">Ads Settings</a>. You can also opt out of some other
          vendors&apos; cookies at <a href="https://www.aboutads.info/choices/">aboutads.info</a>.
        </li>
      </ul>

      <h3>Affiliate links</h3>
      <p>
        Some links to AI tools are affiliate links (see our{" "}
        <Link href="/affiliate-disclosure">affiliate disclosure</Link>). When you click one, the tool&apos;s
        website or its affiliate partner may set a cookie to record that you came from us. That cookie is
        set by them, on their website, under their privacy policy.
      </p>

      <h2>Newsletter</h2>
      <p>
        <Status on={features.newsletter !== null} /> If you subscribe, your email address goes straight to
        our email service (Brevo or Mailchimp), not to us. It is used only to send you our newsletter. Every
        email has an unsubscribe link.
      </p>

      <h2>YouTube videos</h2>
      <p>
        Videos show a preview image first. Nothing loads from YouTube until you click play. The video then
        plays from YouTube&apos;s privacy-enhanced domain (youtube-nocookie.com), under{" "}
        <a href="https://policies.google.com/privacy">Google&apos;s privacy policy</a>.
      </p>

      <h2>Comments</h2>
      <p>
        <Status on={features.giscus !== null} /> When comments are on, they use Giscus, which stores comments
        in GitHub Discussions. To comment you sign in with GitHub, and{" "}
        <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">
          GitHub&apos;s privacy statement
        </a>{" "}
        applies.
      </p>

      <h2>Email</h2>
      <p>
        If you email us, we use your email address and message only to reply to you. We don&apos;t add you
        to any list without asking.
      </p>

      <h2>Children</h2>
      <p>This site is not aimed at children under 13, and we don&apos;t knowingly collect their information.</p>

      <h2>Your choices</h2>
      <ul>
        <li>You can block or delete cookies in your browser settings. The site still works without them.</li>
        <li>You can ask what information we hold about you, or ask us to delete it, by emailing us.</li>
      </ul>

      <h2>Changes to this policy</h2>
      <p>
        If we change this policy, we will update the &quot;Last updated&quot; date at the top of this page.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy? Email <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </TextPage>
  );
}
