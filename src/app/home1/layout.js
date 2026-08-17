import { Anton } from "next/font/google";
import { buildSeoMetadata } from "@/lib/seo/buildSeoMetadata";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

export const metadata = buildSeoMetadata(
  "Original Homepage",
  "Original Urgent Electrical homepage layout (legacy). Main site uses the home1 theme at /.",
  { robots: { index: false, follow: false } }
);

export default function Home1Layout({ children }) {
  return <div className={anton.variable}>{children}</div>;
}
