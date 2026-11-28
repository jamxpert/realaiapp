"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

export function PromptBox({ children }: { children: ReactNode }) {
  const textRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timer = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  async function copy() {
    const text = textRef.current?.innerText.trim() ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <span className="text-sm font-semibold text-muted">Prompt</span>
        <button
          type="button"
          onClick={copy}
          className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold hover:border-accent"
        >
          {status === "copied" ? "Copied!" : "Copy"}
        </button>
      </div>
      <div ref={textRef} className="px-4 py-4 font-mono text-sm leading-relaxed whitespace-pre-wrap [&>p+p]:mt-3">
        {children}
      </div>
      <p aria-live="polite" className="sr-only">
        {status === "copied" ? "Prompt copied" : status === "failed" ? "Copy failed. Select the text and copy it." : ""}
      </p>
      {status === "failed" && (
        <p className="border-t border-line px-4 py-2 text-sm text-muted">Couldn&apos;t copy. Select the text and copy it.</p>
      )}
    </div>
  );
}
