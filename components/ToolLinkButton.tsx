import type { ReactNode } from "react";
import type { Tool } from "@/lib/tools";
import { toolLink } from "@/lib/tool-utils";

interface ToolLinkButtonProps {
  tool: Pick<Tool, "affiliateUrl" | "website" | "name">;
  children?: ReactNode;
  className?: string;
}

/** Opens the tool's site in a new tab. Affiliate links get rel="sponsored nofollow". */
export function ToolLinkButton({ tool, children, className = "" }: ToolLinkButtonProps) {
  const link = toolLink(tool);
  return (
    <a
      href={link.href}
      target="_blank"
      rel={link.rel}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg bg-button px-4 py-2.5 text-sm font-semibold text-white hover:bg-button-hover ${className}`}
    >
      {children ?? `Visit ${tool.name}`}
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M7 17 17 7M8 7h9v9" />
      </svg>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
