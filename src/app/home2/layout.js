import { documentTitle } from "@/lib/seo/documentTitle";

export const metadata = {
  title: documentTitle("Homepage preview"),
  robots: { index: false, follow: false },
};

export default function Home2Layout({ children }) {
  return children;
}
