# RealAIApps.com

Honest AI tool reviews, comparisons and tutorials in English and Roman Urdu.

This is a Next.js website with **no database and no login**. All content lives in files in this repo:
articles are MDX files in `content/`, and the tools data is in `data/tools/`. Every page is built ahead of
time, so the site is fast and hosting on Vercel's free plan is enough.

The old coming-soon page is in `coming-soon/` (see [Coming-soon page](#coming-soon-page) at the end).

---

## 1. Run it on your computer

You need [Node.js](https://nodejs.org) 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Pages reload when you save a file.

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Builds the full site, the same way Vercel does. Run this before you push. |
| `npm start` | Serves the built site at http://localhost:3000 |
| `npm run typecheck` | Checks the TypeScript code |

**If something is wrong in an article or a tool file, the build stops and tells you the file and the
problem.** For example:

```
content/reviews/canva-review.mdx: unknown tool "canvaa". Known tools: chatgpt, claude, gemini, ...
```

Fix the line it names and run the command again.

---

## 2. Add an article

There are four article types. Each has a folder and a template:

| Type | Folder | Address on the site | Template |
| --- | --- | --- | --- |
| Review of one tool | `content/reviews/` | `/reviews/<slug>` | `content/_templates/review.mdx` |
| Best tools list | `content/lists/` | `/best/<slug>` | `content/_templates/list.mdx` |
| Comparison of two tools | `content/comparisons/` | `/compare/<slug>` | `content/_templates/comparison.mdx` |
| Tutorial (English or Roman Urdu) | `content/tutorials/` | `/tutorials/<slug>` | `content/_templates/tutorial.mdx` |

Steps:

1. Copy the template into the right folder. The file name is the address: `content/reviews/canva-review.mdx`
   becomes `/reviews/canva-review`. Use lowercase letters, numbers and hyphens only.
2. Fill in the frontmatter (the part between the `---` lines). See the fields below.
3. Make a 1200×630 cover image and save it as `public/images/<slug>/cover.png`.
4. Write the article under the frontmatter.
5. Keep `draft: true` while you work: drafts show with `npm run dev` but are never published. Set
   `draft: false` when it's ready.

### Frontmatter fields (all articles)

| Field | What to write |
| --- | --- |
| `title` | The article title (up to 110 characters) |
| `description` | One or two sentences, **up to 155 characters**. Google shows this in search results. |
| `slug` | Must be the same as the file name, without `.mdx` |
| `type` | `review`, `list`, `comparison` or `tutorial`. Must match the folder. |
| `language` | `en` or `roman-urdu`. Roman Urdu articles get a badge and appear on `/urdu`. |
| `publishedAt` | The day you first published it, as `YYYY-MM-DD` |
| `updatedAt` | The day you last changed it. **Update this every time you edit an article.** |
| `author` | Your name |
| `coverImage` | `/images/<slug>/cover.png` |
| `coverAlt` | A few words describing the cover image (required, for blind readers) |
| `tags` | A short list, like `[students, writing]`. Used for related articles and search. |
| `tools` | Slugs of the tools the article covers, from `data/tools/` |
| `draft` | `true` or `false` |
| `faq` | Optional list of `question` and `answer`. Show it with `<FAQ />` and Google gets it too. |

### Extra fields for each type

- **review:** `toolSlug`, `verdict` (`rating` from 0 to 10, or `null` for "Rating coming soon", plus `bestFor`,
  `notFor`, `summary`), `pros` and `cons`.
  If the tool in `data/tools/` also has a `rating`, the two numbers must match.
- **list:** `audience` (who the list is for).
- **comparison:** `toolA`, `toolB`, `winner` (`toolA`'s slug, `toolB`'s slug or `depends`) and `useCase`.
- **tutorial:** `difficulty` (`beginner` or `intermediate`) and `timeNeeded` (like `"20 minutes"`).
  Optional:
  - `videoId`: the 11-character ID from a YouTube link. The video shows at the top instead of the cover.
    Add `videoUploadDate` too: the day the video went live.
  - `translationOf`: the slug of the same tutorial in the other language. Both versions link to each other.

### Components you can use in articles

| Component | What it shows |
| --- | --- |
| `<VerdictBox />` | The verdict from the frontmatter (reviews only) |
| `<ProsCons />` | The pros and cons from the frontmatter (reviews only) |
| `<PricingTable tool="gamma" />` | Free plan, paid plans and the date the price was checked |
| `<ToolCard tool="gamma" />` | A card with the tool's description, free plan badge, price and a button |
| `<ComparisonTable tools={["chatgpt", "claude"]} />` | Tools side by side |
| `<AffiliateButton tool="gamma">Try Gamma</AffiliateButton>` | A button to the tool (uses its affiliate link if it has one) |
| `<Step number={1} title="...">...</Step>` | A numbered tutorial step. Steps also go to Google as a how-to. |
| `<PromptBox>...</PromptBox>` | A prompt with a Copy button |
| `<Screenshot src="/images/<slug>/shot.png" alt="..." caption="..." />` | A screenshot (see section 4) |
| `<Callout type="tip">...</Callout>` | A highlighted note. Types: `tip`, `warning`, `pakistan` |
| `<FAQ />` | The questions from the frontmatter |
| `<YouTube id="VIDEO_ID" title="..." />` | A video that only loads when the reader clicks play |
| `<AffiliateDisclosure />` | The affiliate notice (added automatically when an article has affiliate links) |

Normal Markdown works too: `## headings`, lists, **bold**, [links](https://example.com) and tables.
Headings (`##` and `###`) build the table of contents.

**Placeholders:** the sample articles contain `[ADD YOUR EXPERIENCE: ...]` and `[SCREENSHOT: ...]`.
Replace every one with your own testing before you publish. Placeholders are never sent to Google, but
readers can see them.

---

## 3. Add a tool or update a price

Tools are in the `data/tools/` folder, **one file per category**: `chatbot.json`, `writing.json`,
`coding.json`, `prompting.json`, `image.json`, `design.json`, `video.json` (editing), `video-generation.json`,
`voice.json`, `music.json`, `transcription.json`, `presentation.json`, `research.json`, `automation.json`
and `productivity.json`. The file a tool is in sets its category.

To update a price, change `cheapestPaidPlan` (and `otherPlans` if needed), then **set `priceCheckedOn` to
today's date**. The site shows that date next to every price.

To add a tool, copy an existing entry in the right category file and change every field. Every tool needs a
full guide, because the tool page shows it:

| Field | What to write |
| --- | --- |
| `slug` | Short ID, lowercase with hyphens, like `"eleven-labs"` |
| `name` | The tool's name |
| `website` | `https://` link to the tool |
| `affiliateUrl` | Your affiliate link, or `""` if you don't have one |
| `shortDescription` | One sentence (up to 160 characters) |
| `bestFor` | One line: the job it does best (up to 120 characters) |
| `about` | 1 to 4 short paragraphs: what it is and who it is for |
| `useCases` | 2 to 8 things people use it for |
| `features` | 2 to 8 main features |
| `howToUse` | 3 to 8 steps, each `{ "title": "...", "text": "..." }` |
| `tips` | 1 to 6 tips for better results |
| `examplePrompt` | Optional: a prompt readers can copy and try |
| `limitations` | 1 to 5 honest limits |
| `freePlan` / `freePlanDetails` | `true` or `false`, and what the free plan includes |
| `cheapestPaidPlan` | Like `"Pro — $20/month"` |
| `otherPlans` | Optional list of other paid plans |
| `pricingNote` | Optional note shown under prices |
| `priceCheckedOn` | The day you checked the price, `YYYY-MM-DD` |
| `urduSupport` | `yes`, `partial`, `no` or `unknown` |
| `needsInternationalCard` | `true`, `false` or `"unknown"` |
| `rating` | Optional, 0 to 10. Only after you have reviewed it. |
| `reviewSlug` | Optional: the slug of its review, to link the tool page to the review |
| `featured` | Optional `true`: shown first with a "Featured" badge |
| `sponsored` / `sponsoredUntil` | For paid listings: `true` and the end date. After that date the listing turns back to normal by itself the next time the site is built. |

Sponsored listings are always labelled "Sponsored" and never change ratings or reviews.

**The "Our pick" for each job** on the Tools page is set in `lib/tool-utils.ts` (`categoryInfo`, field
`topPick`). To add a new category, add it to `categories` and `categoryInfo` there, and create
`data/tools/<category>.json`.

---

## 4. Screenshots and images

Put every image for an article in `public/images/<article-slug>/`, for example
`public/images/gamma-review/editor.png`. Then use it in the article like this:

```mdx
<Screenshot src="/images/gamma-review/editor.png" alt="The Gamma editor with a finished slide" caption="Gamma's editor" />
```

- `alt` is required: describe what the image shows.
- PNG, JPG, WebP and AVIF all work. Images are resized and compressed automatically.
- Markdown images (`![...](...)`) are blocked on purpose; the build asks you to use `<Screenshot>`.
  This makes sure every image has a size, so the page doesn't jump while loading.

---

## 5. Put it online with Vercel and realaiapps.com

The site needs no settings, no database and no environment variables.

### First deploy

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com/new), choose **Add New → Project** and import the repo.
   Vercel detects Next.js by itself. If you reuse the old "realai" project, open
   **Settings → Build and Deployment** and make sure **Framework Preset** is **Next.js**.
3. Click **Deploy**. From now on, every push to `main` updates the site, and other branches get a preview link.

### Connect realaiapps.com

Right now realaiapps.com shows the coming-soon page from Cloudflare Workers. To switch it to this site:

1. In Vercel, open the project → **Settings → Domains** and add `realaiapps.com` and `www.realaiapps.com`.
   Vercel shows the DNS records it needs (and a `_vercel` TXT record if it asks you to verify the domain).
2. In Cloudflare, go to **Workers & Pages → realaiapp → Settings → Domains & Routes** and remove the two
   custom domains (`realaiapps.com` and `www.realaiapps.com`). This stops the coming-soon page.
3. In Cloudflare **DNS → Records**, add exactly the records Vercel showed you. Set the cloud icon to
   **DNS only** (grey), not Proxied.
4. Wait a few minutes until Vercel shows the domains as **Valid**. Vercel adds HTTPS by itself.

Email forwarding (Cloudflare Email Routing) keeps working, because it uses separate MX records. Don't
delete the MX or email TXT records.

---

## 6. Turn on the optional features

Everything below is in `data/site.ts`, and is off while its value is empty. After a change, push to
GitHub (or run `npm run build` to test). If a value looks wrong, the build stops and says which one.

### Newsletter (Brevo or Mailchimp)

1. Create a signup form in Brevo (**Contacts → Forms**) or Mailchimp (**Audience → Signup forms →
   Embedded form**).
2. In the embed code, find `<form action="https://...">` and copy that address.
3. Paste it in `newsletter.formUrl`. If the email field in the embed code isn't named `EMAIL`, change
   `newsletter.emailFieldName`.

The signup box then appears on the home page and at the end of every article. Emails go straight to
Brevo or Mailchimp; this site never stores them.

### Google Analytics

Create a GA4 property, copy its **Measurement ID** (`G-...`) and paste it in `analytics.googleAnalyticsId`.

### Google AdSense

Paste your publisher ID (`ca-pub-...`) in `adsense.clientId`. This loads the AdSense script and creates
`/ads.txt`, which AdSense checks. AdSense needs a privacy policy; ours already covers it.

### Comments (Giscus)

1. Make the GitHub repo public and turn on **Discussions** in its settings.
2. Install the [giscus app](https://github.com/apps/giscus) on the repo.
3. Go to [giscus.app](https://giscus.app), enter the repo, and copy `data-repo`, `data-repo-id`,
   `data-category` and `data-category-id`.
4. Fill them in under `comments.giscus` and set `enabled: true`.

Comments appear under every article and follow the site's dark/light theme.

### Other settings in `data/site.ts`

- `author`: your name and a short bio (shown on the About page and as the article author for Google).
- `social`: your YouTube and TikTok links. Links that are empty are hidden.
- `email`: the address on the Contact, Advertise and legal pages. **Make sure this address receives
  email** (set it up in Cloudflare Email Routing).

### Legal pages

The Privacy Policy, Terms and Affiliate Disclosure are written in plain English and match what the site
does: the Privacy Policy shows "Currently: on/off" for analytics, ads, newsletter and comments by
itself. They are a good starting point, not legal advice. When you edit one, change its `updated` date
in `lib/static-pages.ts`.

---

## Project map

```
app/                 Pages and routes
components/          Page parts (header, cards, filters, search...)
components/mdx/      Components you can use inside articles
content/             Articles (MDX) and content/_templates/
data/tools/          All tools, one file per category: guides, prices, ratings
data/site.ts         Site name, menus, links and optional features
lib/                 Loading and checking content, search, SEO
public/images/       Cover images and screenshots, one folder per article
assets/fonts/        Font for the generated share images
coming-soon/         The old coming-soon page (Cloudflare)
```

Packages used, and why:

| Package | Why |
| --- | --- |
| next, react, react-dom | The website framework |
| tailwindcss, @tailwindcss/postcss, @tailwindcss/typography | Styling, and nice article text |
| next-mdx-remote, gray-matter | Turn MDX articles and their frontmatter into pages |
| remark-gfm | Markdown tables |
| rehype-slug | Heading links for the table of contents |
| image-size | Reads image sizes so pages don't jump while loading |
| zod | Checks articles, tool files and `site.ts` while building |
| fuse.js | Search that forgives typos, running in the browser |

---

## Coming-soon page

`coming-soon/` is the static page that realaiapps.com shows today, served by Cloudflare Workers
(settings in `wrangler.jsonc`). To preview it: `npx serve coming-soon`. To deploy a change to it:

```bash
npx wrangler@latest deploy
```

Once the domain points to Vercel (section 5), this folder and `wrangler.jsonc` can be deleted.
