import AuthLayout from "@/components/login/AuthLayout";
import ForgotPasswordForm from "@/components/login/ForgotPasswordForm";
import { buildForgotPasswordMetadata } from "@/data/authPages";
import { getSiteUrl } from "@/lib/siteUrl";
import "../../home1/home1.css";

const meta = buildForgotPasswordMetadata();

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: meta.title,
  description: meta.description,
  alternates: meta.alternates,
  robots: meta.robots,
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout authStep={1} showSteps>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
