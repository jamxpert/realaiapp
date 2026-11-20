# RealAI Apps

Coming-soon page for [realaiapps.com](https://realaiapps.com).

Right now this is a static site (`index.html` + `styles.css`) deployed on Cloudflare (Vercel copy as backup).
It will be replaced by a Next.js app later. When that happens, Vercel will detect
Next.js automatically and the domain settings stay as they are.

## Local preview

Open `index.html` in a browser, or run:

```bash
npx serve .
```

## Deploy

Production (realaiapps.com) runs on Cloudflare Workers static assets, configured in
`wrangler.jsonc`. Files listed in `.assetsignore` are not uploaded.

```bash
npx wrangler@latest deploy
```

A copy is also deployed on Vercel at https://realai-drab.vercel.app (`npx vercel@latest deploy --prod`).
