import { documentTitle } from "@/lib/seo/documentTitle";

export const metadata = {
  title: documentTitle("Original Homepage"),
  description: "Original Urgent Electrical homepage layout (legacy). Main site uses the home1 theme at /.",
  robots: { index: false, follow: false },
};

export default function Home1Layout({ children }) {
  return children;
}
