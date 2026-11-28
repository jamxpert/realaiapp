export interface NavLink {
  label: string;
  href: string;
}

const nav: NavLink[] = [
  { label: "Reviews", href: "/reviews" },
  { label: "Best Tools", href: "/best" },
  { label: "Compare", href: "/compare" },
  { label: "Tutorials", href: "/tutorials" },
  { label: "Urdu Guides", href: "/urdu" },
  { label: "Tools", href: "/tools" },
];

const footerNav: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "How We Test", href: "/how-we-test" },
  { label: "Contact", href: "/contact" },
  { label: "Advertise", href: "/advertise" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
];

// Full profile URLs. Links with an empty href are not shown in the footer.
const social: NavLink[] = [
  { label: "YouTube", href: "" },
  { label: "TikTok", href: "" },
];

/** Site-wide settings. */
export const site = {
  name: "RealAIApps",
  url: "https://realaiapps.com",
  tagline: "AI apps that do real work.",
  description:
    "Honest AI tool reviews, comparisons and step-by-step tutorials in English and Roman Urdu.",
  email: "hello@realaiapps.com",
  // Change this to the real author name before publishing articles.
  author: { name: "RealAIApps", bio: "" },
  nav,
  footerNav,
  social,

  // ---------- Optional features. All are off while their value is empty. ----------

  newsletter: {
    // The form action URL from your Brevo or Mailchimp embed code. Empty = the signup box is hidden.
    formUrl: "",
    // The name of the email field in that embed code. Brevo and Mailchimp both use "EMAIL".
    emailFieldName: "EMAIL",
  },

  analytics: {
    // Google Analytics 4 measurement ID, like "G-ABC123XYZ". Empty = no analytics script.
    googleAnalyticsId: "",
  },

  adsense: {
    // AdSense publisher ID, like "ca-pub-1234567890123456". Empty = no AdSense script and no ads.txt.
    clientId: "",
  },

  comments: {
    // Giscus comments under articles (GitHub Discussions). Copy the values from https://giscus.app
    giscus: {
      enabled: false,
      repo: "", // "owner/repo"
      repoId: "",
      category: "",
      categoryId: "",
    },
  },
};
