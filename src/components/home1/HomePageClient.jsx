"use client";

import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import MotionSection from "@/components/MotionSection.jsx";
import Hero from "@/components/Hero.jsx";
import TrustedCertificationsHome1 from "@/components/home1/TrustedCertificationsHome1";
import CompanyStatsHome1 from "@/components/home1/CompanyStatsHome1";
import FeaturedServicesHome1 from "@/components/home1/FeaturedServicesHome1";
import EmergencyHome1 from "@/components/home1/EmergencyHome1";
import WhyChooseUsHome1 from "@/components/home1/WhyChooseUsHome1";
import AboutCompanyHome1 from "@/components/home1/AboutCompanyHome1";
import ProjectsHome1 from "@/components/home1/ProjectsHome1";
import HowItWorksHome1 from "@/components/home1/HowItWorksHome1";
import TestimonialsHome1 from "@/components/home1/TestimonialsHome1";
import FAQHome1 from "@/components/home1/FAQHome1";
import QuoteFormHome1 from "@/components/home1/QuoteFormHome1";
import CTAHome1 from "@/components/home1/CTAHome1";

export default function HomePageClient() {
  return (
    <div className="home1-page w-full min-w-0">
      <Navbar />
      <main id="main-content" className="w-full min-w-0">
        <Hero />
        <MotionSection variant="fade-up">
          <TrustedCertificationsHome1 />
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
        <MotionSection variant="fade-up" delay={0.06}>
          <HowItWorksHome1 />
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
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
