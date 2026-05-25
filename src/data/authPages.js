const SITE = "https://www.urgentelectrical.services";

const AUTH_ROBOTS = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

export function buildForgotPasswordMetadata() {
  return {
    title: "Forgot password | Urgent Electrical",
    description: "Reset your Urgent Electrical customer account password.",
    alternates: { canonical: `${SITE}/login/forgot-password` },
    robots: AUTH_ROBOTS,
  };
}

export function buildVerifyOtpMetadata() {
  return {
    title: "Verify code | Urgent Electrical",
    description: "Enter the verification code sent to your email.",
    alternates: { canonical: `${SITE}/login/verify-otp` },
    robots: AUTH_ROBOTS,
  };
}

export function buildResetPasswordMetadata() {
  return {
    title: "Reset password | Urgent Electrical",
    description: "Create a new password for your Urgent Electrical account.",
    alternates: { canonical: `${SITE}/login/reset-password` },
    robots: AUTH_ROBOTS,
  };
}
