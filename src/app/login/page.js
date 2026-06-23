import LoginPageClient from "@/components/login/LoginPageClient";
import { buildLoginMetadata } from "@/data/loginPage";
import { getSiteUrl } from "@/lib/siteUrl";
import "../home1/home1.css";

const meta = buildLoginMetadata();

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: meta.title,
  description: meta.description,
  openGraph: meta.openGraph,
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: meta.alternates,
};

export default function LoginPage() {
  return <LoginPageClient />;
}
