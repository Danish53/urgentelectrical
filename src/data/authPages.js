import { getSiteUrl } from "@/lib/siteUrl";
import { buildSeoMetadata } from "@/lib/seo/buildSeoMetadata";

const SITE = getSiteUrl();

const AUTH_ROBOTS = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

export function buildForgotPasswordMetadata() {
  return buildSeoMetadata("Forgot password", "Reset your Urgent Electrical customer account password.", {
    alternates: { canonical: `${SITE}/login/forgot-password` },
    robots: AUTH_ROBOTS,
  });
}

export function buildVerifyOtpMetadata() {
  return buildSeoMetadata("Verify code", "Enter the verification code sent to your email.", {
    alternates: { canonical: `${SITE}/login/verify-otp` },
    robots: AUTH_ROBOTS,
  });
}

export function buildResetPasswordMetadata() {
  return buildSeoMetadata(
    "Reset password",
    "Create a new password for your Urgent Electrical account.",
    {
      alternates: { canonical: `${SITE}/login/reset-password` },
      robots: AUTH_ROBOTS,
    }
  );
}
