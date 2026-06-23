import { buildBlogListingMetadata } from "@/data/blogs";
import { getSiteUrl } from "@/lib/siteUrl";

const meta = buildBlogListingMetadata();

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: meta.title,
  description: meta.description,
  keywords: meta.keywords,
  openGraph: meta.openGraph,
  twitter: {
    card: "summary_large_image",
    title: meta.openGraph.title,
    description: meta.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: meta.alternates,
};

export default function BlogLayout({ children }) {
  return children;
}
