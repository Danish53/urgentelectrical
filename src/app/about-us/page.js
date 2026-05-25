import AboutPageClient from "@/components/about/AboutPageClient";
import { buildAboutMetadata, ABOUT_JSON_LD } from "@/data/aboutPage";
import "../home1/home1.css";

const meta = buildAboutMetadata();

export const metadata = {
  metadataBase: new URL("https://www.urgentelectrical.services"),
  title: meta.title,
  description: meta.description,
  keywords: meta.keywords,
  openGraph: meta.openGraph,
  twitter: meta.twitter,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: meta.alternates,
};

export default function AboutUsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_JSON_LD) }} />
      <AboutPageClient />
    </>
  );
}
