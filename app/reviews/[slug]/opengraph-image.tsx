import { makeArticleOgImage } from "@/lib/article-og";
import { ogContentType, ogSize } from "@/lib/og";

const og = makeArticleOgImage("review");

// Built once into a file at build time (the site is a static export).
export const dynamic = "force-static";
export const alt = "The article title with the RealAIApps name";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamicParams = false;
export const generateStaticParams = og.generateStaticParams;
export default og.Image;
