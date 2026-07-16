import VerifyOtpPageClient from "@/components/login/VerifyOtpPageClient";
import { buildVerifyOtpMetadata } from "@/data/authPages";
import { getSiteUrl } from "@/lib/siteUrl";
import "../../home1/home1.css";

const meta = buildVerifyOtpMetadata();

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: meta.title,
  description: meta.description,
  alternates: meta.alternates,
  robots: meta.robots,
};

export default function VerifyOtpPage() {
  return <VerifyOtpPageClient />;
}
