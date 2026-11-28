import { z } from "zod";
import { site } from "@/data/site";

// Checks the optional settings in data/site.ts at build time, so a typo
// fails the build with a clear message instead of quietly breaking the site.

const optional = <T extends z.ZodType<string>>(schema: T) => z.union([z.literal(""), schema]);

const schema = z.object({
  newsletter: z.object({
    formUrl: optional(z.url({ protocol: /^https$/, error: "Must be the https:// form action URL from your embed code" })),
    emailFieldName: z.string().min(1, "Set the email field name (usually EMAIL)"),
  }),
  analytics: z.object({
    googleAnalyticsId: optional(z.string().regex(/^G-[A-Z0-9]{4,}$/, 'Must look like "G-ABC123XYZ"')),
  }),
  adsense: z.object({
    clientId: optional(z.string().regex(/^ca-pub-\d{10,20}$/, 'Must look like "ca-pub-1234567890123456"')),
  }),
  comments: z.object({
    giscus: z
      .object({
        enabled: z.boolean(),
        repo: optional(z.string().regex(/^[\w.-]+\/[\w.-]+$/, 'Must look like "owner/repo"')),
        repoId: z.string(),
        category: z.string(),
        categoryId: z.string(),
      })
      .refine((g) => !g.enabled || (g.repo && g.repoId && g.category && g.categoryId), {
        error: "Giscus is enabled, so repo, repoId, category and categoryId must all be set (copy them from giscus.app)",
      }),
  }),
});

const parsed = schema.safeParse(site);
if (!parsed.success) {
  const lines = parsed.error.issues.map((i) => `  ✖ ${i.path.join(".")}: ${i.message}`).join("\n");
  throw new Error(`data/site.ts has invalid settings:\n${lines}`);
}

/** The optional features, checked. */
export const features = {
  newsletter: site.newsletter.formUrl !== "" ? site.newsletter : null,
  googleAnalyticsId: site.analytics.googleAnalyticsId || null,
  adsenseClientId: site.adsense.clientId || null,
  giscus: site.comments.giscus.enabled ? site.comments.giscus : null,
};
