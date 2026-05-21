import HowItWorks from "@/components/HowItWorks.jsx";

/** Home page — reuses premium step cards from HowItWorks (legacy home1 design) */
export default function HowItWorksHome1() {
  return (
    <HowItWorks
      sectionId="how-we-work"
      headingId="home1-how-heading"
      className="home1-section-surface py-16 sm:py-20 lg:py-24 overflow-x-clip scroll-mt-28"
      eyebrow="How we work"
      title="Four simple steps to book"
      description="Book a trusted electrician online in under two minutes."
    />
  );
}
