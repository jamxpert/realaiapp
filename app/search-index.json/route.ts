import { buildSearchIndex } from "@/lib/search-index";

// Written to a static file at build time; no server work per request.
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildSearchIndex());
}
