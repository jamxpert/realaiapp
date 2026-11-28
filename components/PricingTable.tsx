import type { Tool } from "@/lib/tools";
import { formatDate } from "@/lib/format";

export function PricingTable({ tool }: { tool: Tool }) {
  const rows: [string, string][] = [
    ["Free plan", tool.freePlan ? `Yes. ${tool.freePlanDetails}` : tool.freePlanDetails],
    ["Cheapest paid plan", tool.cheapestPaidPlan],
    ...tool.otherPlans.map((plan): [string, string] => ["Other plan", plan]),
  ];
  return (
    <figure className="not-prose relative my-6 overflow-hidden rounded-2xl border border-line">
      <table className="w-full text-left">
        <caption className="sr-only">{tool.name} pricing</caption>
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={i} className="border-b border-line last:border-0">
              <th scope="row" className="w-2/5 bg-surface px-4 py-3 align-top text-sm font-semibold">
                {label}
              </th>
              <td className="px-4 py-3">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="border-t border-line bg-surface px-4 py-3 text-sm text-muted">
        Prices checked on {formatDate(tool.priceCheckedOn)}.{tool.pricingNote && ` ${tool.pricingNote}`}
      </figcaption>
    </figure>
  );
}
