import { buildSeoMetadata } from "@/lib/seo/buildSeoMetadata";

export const metadata = buildSeoMetadata(
  "Original Homepage",
  "Original Urgent Electrical homepage layout (legacy). Main site uses the home1 theme at /.",
  { robots: { index: false, follow: false } }
);

export default function Home1Layout({ children }) {
  return children;
}
