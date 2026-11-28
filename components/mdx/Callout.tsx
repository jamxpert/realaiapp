import type { ReactNode } from "react";

const variants = {
  tip: { label: "Tip", className: "border-line bg-surface" },
  warning: { label: "Warning", className: "border-accent bg-surface" },
  pakistan: { label: "Pakistan tip", className: "border-l-4 border-l-accent border-line bg-surface" },
} as const;

export type CalloutType = keyof typeof variants;

export function Callout({ type, children }: { type: CalloutType; children: ReactNode }) {
  const variant = variants[type];
  return (
    <aside role="note" className={`my-6 rounded-xl border px-4 py-3 sm:px-5 ${variant.className}`}>
      <p className="not-prose text-sm font-bold text-accent">{variant.label}</p>
      <div className="[&>*:first-child]:mt-1 [&>*:last-child]:mb-0">{children}</div>
    </aside>
  );
}
