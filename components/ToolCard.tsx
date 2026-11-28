import Link from "next/link";
import { categoryLabels, type ToolSummary, toolLink } from "@/lib/tool-utils";
import { ToolBadges } from "./Badge";
import { ToolLinkButton } from "./ToolLinkButton";

export function ToolCard({ tool }: { tool: ToolSummary }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">
            <Link href={`/tools/${tool.slug}`} className="hover:text-accent hover:underline">
              {tool.name}
            </Link>
          </h3>
          <p className="text-sm text-muted">{categoryLabels[tool.category]}</p>
        </div>
        {tool.rating !== undefined && (
          <p className="shrink-0 text-sm font-bold">
            {tool.rating}
            <span className="font-normal text-muted">/10</span>
          </p>
        )}
      </div>
      <div className="mt-3">
        <ToolBadges tool={tool} />
      </div>
      <p className="mt-3">{tool.shortDescription}</p>
      <p className="mt-2 flex-1 text-sm">
        <span className="font-semibold">Best for: </span>
        {tool.bestFor}
      </p>
      <p className="mt-3 text-sm">
        <span className="text-muted">Paid from: </span>
        {tool.cheapestPaidPlan}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <ToolLinkButton tool={tool} />
        <Link href={`/tools/${tool.slug}`} className="text-sm font-semibold text-accent hover:underline">
          Full guide<span className="sr-only"> to {tool.name}</span>
        </Link>
      </div>
      {toolLink(tool).isAffiliate && <p className="mt-2 text-xs text-muted">Affiliate link</p>}
    </article>
  );
}
