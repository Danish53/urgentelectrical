import { getSiteUrl } from "@/lib/siteUrl";
import { documentTitle } from "@/lib/seo/documentTitle";

const SITE = getSiteUrl();

const AUTH_ROBOTS = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

export function buildForgotPasswordMetadata() {
  return {
    title: documentTitle("Forgot password"),
    description: "Reset your Urgent Electrical customer account password.",
    alternates: { canonical: `${SITE}/login/forgot-password` },
    robots: AUTH_ROBOTS,
  };
}

export function buildVerifyOtpMetadata() {
  return {
    title: documentTitle("Verify code"),
    description: "Enter the verification code sent to your email.",
    alternates: { canonical: `${SITE}/login/verify-otp` },
    robots: AUTH_ROBOTS,
  };
}

export function buildResetPasswordMetadata() {
  return {
    title: documentTitle("Reset password"),
    description: "Create a new password for your Urgent Electrical account.",
    alternates: { canonical: `${SITE}/login/reset-password` },
    robots: AUTH_ROBOTS,
  };
}
