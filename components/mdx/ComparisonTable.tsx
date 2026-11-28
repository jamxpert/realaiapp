import Link from "next/link";
import { ToolLinkButton } from "@/components/ToolLinkButton";
import { formatDate } from "@/lib/format";
import { categoryLabels, internationalCardLabel, urduSupportLabels } from "@/lib/tool-utils";
import type { Tool } from "@/lib/tools";

const rows: [string, (tool: Tool) => string][] = [
  ["Category", (t) => categoryLabels[t.category]],
  ["Free plan", (t) => (t.freePlan ? `Yes. ${t.freePlanDetails}` : t.freePlanDetails)],
  ["Cheapest paid plan", (t) => t.cheapestPaidPlan],
  ["Works in Urdu", (t) => urduSupportLabels[t.urduSupport]],
  ["Needs an international card", (t) => internationalCardLabel(t.needsInternationalCard)],
  ["Our rating", (t) => (t.rating !== undefined ? `${t.rating}/10` : "Not reviewed yet")],
];

export function ComparisonTable({ tools }: { tools: Tool[] }) {
  const checked = [...new Set(tools.map((t) => t.priceCheckedOn))].sort();
  return (
    <figure className="not-prose my-8">
      {/* Scrolls sideways inside its box on small screens; the page itself never does. */}
      <div className="relative overflow-x-auto rounded-2xl border border-line" tabIndex={0} role="region" aria-label="Comparison table">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead className="bg-surface">
            <tr>
              <td className="sticky left-0 z-10 w-36 bg-surface px-4 py-3" />
              {tools.map((tool) => (
                <th key={tool.slug} scope="col" className="px-4 py-3 text-base font-bold">
                  <Link href={`/tools/${tool.slug}`} className="hover:text-accent hover:underline">
                    {tool.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label} className="border-t border-line">
                <th scope="row" className="sticky left-0 z-10 w-36 bg-surface px-4 py-3 align-top font-semibold">
                  {label}
                </th>
                {tools.map((tool) => (
                  <td key={tool.slug} className="px-4 py-3 align-top">
                    {value(tool)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-line">
              <td className="sticky left-0 z-10 bg-surface px-4 py-3" />
              {tools.map((tool) => (
                <td key={tool.slug} className="px-4 py-3">
                  <ToolLinkButton tool={tool} className="whitespace-nowrap">
                    Visit
                  </ToolLinkButton>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <figcaption className="mt-2 text-sm text-muted">
        Prices checked on {checked.map(formatDate).join(", ")}. US prices; app store prices in Pakistan may be
        different.
      </figcaption>
    </figure>
  );
}
