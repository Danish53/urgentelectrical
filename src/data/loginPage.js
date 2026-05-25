const SITE = "https://www.urgentelectrical.services";

export const LOGIN_CANONICAL = `${SITE}/login`;

export const LOGIN_PANEL = {
  eyebrow: "Customer portal",
  title: "Trusted electricians",
  titleAccent: "24/7",
  description: "NICEIC-approved emergency and planned electrical work across Nottingham and the East Midlands.",
  highlights: ["Secure sign-in", "NICEIC approved", "Fixed online pricing"],
  image: "/featured/emergency-24.jpg",
  imageAlt: "Urgent Electrical emergency electrician team at work",
};

export function buildLoginMetadata() {
  return {
    title: "Sign in | Urgent Electrical Services",
    description:
      "Sign in to your Urgent Electrical customer account to manage bookings and access your electrical service history.",
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: LOGIN_CANONICAL,
      siteName: "Urgent Electrical Services",
      title: "Sign in | Urgent Electrical",
      description: "Customer portal sign-in for Urgent Electrical Services.",
    },
    alternates: { canonical: LOGIN_CANONICAL },
  };
}
