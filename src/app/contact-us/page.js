import ContactPageClient from "@/components/contact/ContactPageClient";
import { buildContactMetadata, CONTACT_JSON_LD } from "@/data/contactPage";
import { getSiteUrl } from "@/lib/siteUrl";
import "../home1/home1.css";

const meta = buildContactMetadata();

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
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

export default function ContactUsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_JSON_LD) }} />
      <ContactPageClient />
    </>
  );
}
