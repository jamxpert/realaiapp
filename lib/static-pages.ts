// The site's text pages. The sitemap reads this list; each page reads its own entry.
// "title" is for the browser tab, search results and breadcrumbs; "heading" is the big title on the page.
// Change "updated" whenever you edit a page.

export const staticPages = {
  about: { path: "/about", title: "About", heading: "About RealAIApps", updated: "2026-11-28" },
  howWeTest: { path: "/how-we-test", title: "How We Test", heading: "How We Test AI Tools", updated: "2026-11-28" },
  contact: { path: "/contact", title: "Contact", heading: "Contact Us", updated: "2026-11-28" },
  advertise: { path: "/advertise", title: "Advertise", heading: "Advertise on RealAIApps", updated: "2026-11-28" },
  privacy: { path: "/privacy-policy", title: "Privacy Policy", heading: "Privacy Policy", updated: "2026-11-28" },
  terms: { path: "/terms", title: "Terms of Use", heading: "Terms of Use", updated: "2026-11-28" },
  affiliate: { path: "/affiliate-disclosure", title: "Affiliate Disclosure", heading: "Affiliate Disclosure", updated: "2026-11-28" },
} as const;

export type StaticPage = (typeof staticPages)[keyof typeof staticPages];
