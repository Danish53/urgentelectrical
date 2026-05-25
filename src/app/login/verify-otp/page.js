import AuthLayout from "@/components/login/AuthLayout";
import VerifyOtpForm from "@/components/login/VerifyOtpForm";
import { buildVerifyOtpMetadata } from "@/data/authPages";
import "../../home1/home1.css";

const meta = buildVerifyOtpMetadata();

export const metadata = {
  metadataBase: new URL("https://www.urgentelectrical.services"),
  title: meta.title,
  description: meta.description,
  alternates: meta.alternates,
  robots: meta.robots,
};

export default function VerifyOtpPage() {
  return (
    <AuthLayout authStep={2} showSteps>
      <VerifyOtpForm />
    </AuthLayout>
  );
}
