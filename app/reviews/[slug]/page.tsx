import { makeArticleRoute } from "@/lib/article-route";

const route = makeArticleRoute("review");

export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
