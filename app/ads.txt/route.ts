import { features } from "@/lib/site-config";

// AdSense asks for /ads.txt. Built once; empty (404) until adsense.clientId is set in data/site.ts.
export const dynamic = "force-static";

export function GET() {
  const id = features.adsenseClientId;
  if (!id) return new Response("Not found\n", { status: 404, headers: { "Content-Type": "text/plain" } });
  // ads.txt uses "pub-…", without the "ca-" prefix. f08c47fec0942fa0 is Google's fixed certification ID.
  return new Response(`google.com, ${id.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
