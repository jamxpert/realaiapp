import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { getTool, tools } from "@/lib/tools";

export const alt = "The tool name with the RealAIApps name";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const tool = getTool((await params).slug);
  return renderOgImage({
    title: tool ? `${tool.name}: free plan, pricing and details` : "AI Tools Directory",
    label: "AI tool",
  });
}
