import AuthLayout from "@/components/login/AuthLayout";
import ResetPasswordForm from "@/components/login/ResetPasswordForm";
import { buildResetPasswordMetadata } from "@/data/authPages";
import { getSiteUrl } from "@/lib/siteUrl";
import "../../home1/home1.css";

const meta = buildResetPasswordMetadata();

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: meta.title,
  description: meta.description,
  alternates: meta.alternates,
  robots: meta.robots,
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout authStep={3} showSteps>
      <ResetPasswordForm />
    </AuthLayout>
  );
}
