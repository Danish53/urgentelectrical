import { buildSeoMetadata } from "@/lib/seo/buildSeoMetadata";

export const metadata = buildSeoMetadata(
  "Homepage preview",
  "Preview of the Urgent Electrical homepage layout.",
  { robots: { index: false, follow: false } }
);

export default function Home2Layout({ children }) {
  return children;
}
