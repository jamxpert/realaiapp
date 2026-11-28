import type { Element, ElementContent, Root, RootContent } from "hast";
import Link from "next/link";
import { type MDXRemoteProps, compileMDX } from "next-mdx-remote/rsc";
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { PricingTable } from "@/components/PricingTable";
import { ToolCard } from "@/components/ToolCard";
import { ToolLinkButton } from "@/components/ToolLinkButton";
import { AffiliateDisclosure } from "@/components/mdx/AffiliateDisclosure";
import { Callout, type CalloutType } from "@/components/mdx/Callout";
import { ComparisonTable } from "@/components/mdx/ComparisonTable";
import { FAQ } from "@/components/mdx/FAQ";
import { PromptBox } from "@/components/mdx/PromptBox";
import { ProsCons } from "@/components/mdx/ProsCons";
import { Screenshot } from "@/components/mdx/Screenshot";
import { Step } from "@/components/mdx/Step";
import { VerdictBox } from "@/components/mdx/VerdictBox";
import { YouTube } from "@/components/mdx/YouTube";
import type { Article } from "./content";
import { getImageInfo } from "./images";
import { requireTool } from "./tools";

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

// ---------- Table of contents ----------

function textOf(node: RootContent | ElementContent): string {
  if (node.type === "text") return node.value;
  if ("children" in node) return node.children.map(textOf).join("");
  return "";
}

/** Collects h2/h3 headings after rehype-slug has given them ids. */
function rehypeCollectHeadings({ into }: { into: Heading[] }) {
  return (tree: Root) => {
    const visit = (node: Root | RootContent) => {
      if (node.type === "element" && (node.tagName === "h2" || node.tagName === "h3")) {
        const el: Element = node;
        const id = el.properties.id;
        if (typeof id === "string") into.push({ id, text: textOf(el).trim(), level: node.tagName === "h2" ? 2 : 3 });
      }
      if ("children" in node) node.children.forEach(visit);
    };
    visit(tree);
  };
}

// ---------- Components available inside MDX ----------

type MdxComponents = NonNullable<MDXRemoteProps["components"]>;

function makeComponents(article: Article): MdxComponents {
  const where = (component: string) => `${article.file}: <${component}>`;
  const reviewOnly = (component: string) => {
    if (article.type !== "review") throw new Error(`${where(component)} only works in reviews`);
    return article;
  };

  return {
    // Markdown elements
    a: ({ href = "", ...props }: ComponentPropsWithoutRef<"a">) =>
      href.startsWith("/") || href.startsWith("#") ? (
        <Link href={href} {...props} />
      ) : (
        <a href={href} target="_blank" rel="noopener" {...props} />
      ),
    img: () => {
      throw new Error(`${article.file}: use <Screenshot src="..." alt="..." /> instead of a Markdown image`);
    },
    table: (props: ComponentPropsWithoutRef<"table">) => (
      <div className="relative overflow-x-auto">
        <table {...props} />
      </div>
    ),

    // Article components
    VerdictBox: () => {
      const review = reviewOnly("VerdictBox");
      if (review.type !== "review") return null;
      return <VerdictBox verdict={review.verdict} toolName={requireTool(review.toolSlug, review.file).name} />;
    },
    ProsCons: () => {
      const review = reviewOnly("ProsCons");
      return review.type === "review" ? <ProsCons pros={review.pros} cons={review.cons} /> : null;
    },
    FAQ: () => {
      if (!article.faq || article.faq.length === 0) {
        throw new Error(`${where("FAQ")} needs a faq list in the frontmatter`);
      }
      return <FAQ items={article.faq} />;
    },
    PricingTable: ({ tool }: { tool: string }) => <PricingTable tool={requireTool(tool, where("PricingTable"))} />,
    ToolCard: ({ tool }: { tool: string }) => (
      <div className="not-prose my-6">
        <ToolCard tool={requireTool(tool, where("ToolCard"))} />
      </div>
    ),
    ComparisonTable: ({ tools }: { tools: unknown }) => {
      if (!Array.isArray(tools) || tools.length < 2 || !tools.every((t) => typeof t === "string")) {
        throw new Error(`${where("ComparisonTable")} needs tools={["slug-a", "slug-b"]} with at least two tools`);
      }
      return <ComparisonTable tools={tools.map((t: string) => requireTool(t, where("ComparisonTable")))} />;
    },
    AffiliateButton: ({ tool, children }: { tool: string; children?: ReactNode }) => (
      <span className="not-prose my-4 block">
        <ToolLinkButton tool={requireTool(tool, where("AffiliateButton"))}>{children}</ToolLinkButton>
      </span>
    ),
    Step: ({ number, title, children }: { number: unknown; title: unknown; children: ReactNode }) => {
      if (typeof number !== "number" || typeof title !== "string") {
        throw new Error(`${where("Step")} needs number={1} and title="..."`);
      }
      return (
        <Step number={number} title={title}>
          {children}
        </Step>
      );
    },
    PromptBox,
    Screenshot: ({ src, alt, caption }: { src: string; alt?: string; caption?: string }) => {
      if (!alt) throw new Error(`${where("Screenshot")} needs alt text describing the image`);
      return <Screenshot image={getImageInfo(src, where("Screenshot"))} alt={alt} caption={caption} />;
    },
    Callout: ({ type, children }: { type: string; children: ReactNode }) => {
      if (type !== "tip" && type !== "warning" && type !== "pakistan") {
        throw new Error(`${where("Callout")} type must be "tip", "warning" or "pakistan"`);
      }
      return <Callout type={type satisfies CalloutType}>{children}</Callout>;
    },
    YouTube: ({ id, title }: { id: string; title?: string }) => {
      if (!/^[A-Za-z0-9_-]{11}$/.test(id) || !title) {
        throw new Error(`${where("YouTube")} needs id="<11-character video ID>" and title="..."`);
      }
      return <YouTube id={id} title={title} />;
    },
    AffiliateDisclosure,
  };
}

// ---------- Render ----------

export async function renderArticle(article: Article): Promise<{ content: ReactElement; headings: Heading[] }> {
  const headings: Heading[] = [];
  const { content } = await compileMDX({
    source: article.body,
    components: makeComponents(article),
    options: {
      // Articles are our own files in the repo, so {expressions} like
      // tools={["a","b"]} are allowed. Dangerous globals stay blocked.
      blockJS: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeCollectHeadings, { into: headings }]],
      },
    },
  });
  return { content, headings };
}
