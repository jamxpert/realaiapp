import type { ReactNode } from "react";

const styles = {
  neutral: "border-line text-muted",
  accent: "border-accent text-accent",
  solid: "border-transparent bg-fg text-bg",
} as const;

interface BadgeProps {
  children: ReactNode;
  tone?: keyof typeof styles;
}

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

/** The honest labels every listing of a tool must show. */
export function ToolBadges({
  tool,
}: {
  tool: { freePlan: boolean; featured: boolean; sponsoredActive: boolean };
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tool.sponsoredActive && <Badge tone="solid">Sponsored</Badge>}
      {tool.featured && <Badge tone="accent">Featured</Badge>}
      <Badge>{tool.freePlan ? "Free plan" : "No free plan"}</Badge>
    </div>
  );
}
