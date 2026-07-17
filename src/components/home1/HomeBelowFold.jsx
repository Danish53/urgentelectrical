"use client";

import MotionSection from "@/components/MotionSection.jsx";
import CompanyStatsHome1 from "@/components/home1/CompanyStatsHome1";
import FeaturedServicesHome1 from "@/components/home1/FeaturedServicesHome1";
import EmergencyHome1 from "@/components/home1/EmergencyHome1";
import WhyChooseUsHome1 from "@/components/home1/WhyChooseUsHome1";
import AboutCompanyHome1 from "@/components/home1/AboutCompanyHome1";
import ProjectsHome1 from "@/components/home1/ProjectsHome1";
import HowItWorksHome1 from "@/components/home1/HowItWorksHome1";
import TrustedCertificationsHome1 from "@/components/home1/TrustedCertificationsHome1";
import TestimonialsHome1 from "@/components/home1/TestimonialsHome1";
import FAQHome1 from "@/components/home1/FAQHome1";
import QuoteFormHome1 from "@/components/home1/QuoteFormHome1";
import CTAHome1 from "@/components/home1/CTAHome1";

/** Single chunk for below-fold homepage sections — fewer JS requests for SEO audits. */
export default function HomeBelowFold() {
  return (
    <>
      <MotionSection variant="fade-up">
        <HowItWorksHome1 />
      </MotionSection>
      <CompanyStatsHome1 />
      <MotionSection variant="fade-up">
        <FeaturedServicesHome1 compact />
      </MotionSection>
      <MotionSection variant="fade-up">
        <EmergencyHome1 />
      </MotionSection>
      <MotionSection variant="fade-up">
        <WhyChooseUsHome1 />
      </MotionSection>
      <MotionSection variant="fade-up">
        <AboutCompanyHome1 />
      </MotionSection>
      <MotionSection variant="fade-up">
        <ProjectsHome1 />
      </MotionSection>
      <MotionSection variant="fade-up">
        <TrustedCertificationsHome1 />
      </MotionSection>
      <MotionSection variant="fade-up">
        <TestimonialsHome1 />
      </MotionSection>
      <MotionSection variant="fade-up">
        <FAQHome1 />
      </MotionSection>
      <MotionSection variant="fade-up">
        <QuoteFormHome1 />
      </MotionSection>
      <MotionSection variant="fade-up">
        <CTAHome1 />
      </MotionSection>
    </>
  );
}
