"use client";

import { useEffect, useRef } from "react";

interface Props {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}

function currentTheme(): "light" | "dark" {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/** Giscus comments. The script loads only when the reader scrolls near the comments. */
export function Comments({ repo, repoId, category, categoryId }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const load = () => {
      const script = document.createElement("script");
      script.src = "https://giscus.app/client.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      const attrs: Record<string, string> = {
        "data-repo": repo,
        "data-repo-id": repoId,
        "data-category": category,
        "data-category-id": categoryId,
        "data-mapping": "pathname",
        "data-strict": "1",
        "data-reactions-enabled": "1",
        "data-input-position": "top",
        "data-theme": currentTheme(),
        "data-lang": "en",
        "data-loading": "lazy",
      };
      for (const [key, value] of Object.entries(attrs)) script.setAttribute(key, value);
      container.appendChild(script);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(container);

    // Follow the site's theme toggle.
    const themeObserver = new MutationObserver(() => {
      const frame = container.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
      frame?.contentWindow?.postMessage({ giscus: { setConfig: { theme: currentTheme() } } }, "https://giscus.app");
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      observer.disconnect();
      themeObserver.disconnect();
    };
  }, [repo, repoId, category, categoryId]);

  return (
    <section aria-labelledby="comments-heading" className="mt-16 border-t border-line pt-10">
      <h2 id="comments-heading" className="text-2xl font-bold tracking-tight">
        Comments
      </h2>
      <div ref={ref} className="mt-6 min-h-40" />
    </section>
  );
}
