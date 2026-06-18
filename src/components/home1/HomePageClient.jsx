"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar.jsx";
import MotionSection from "@/components/MotionSection.jsx";
import Hero from "@/components/Hero.jsx";
import TrustedCertificationsHome1 from "@/components/home1/TrustedCertificationsHome1";
import CompanyStatsHome1 from "@/components/home1/CompanyStatsHome1";

const FeaturedServicesHome1 = dynamic(() => import("@/components/home1/FeaturedServicesHome1"));
const EmergencyHome1 = dynamic(() => import("@/components/home1/EmergencyHome1"));
const WhyChooseUsHome1 = dynamic(() => import("@/components/home1/WhyChooseUsHome1"));
const AboutCompanyHome1 = dynamic(() => import("@/components/home1/AboutCompanyHome1"));
const ProjectsHome1 = dynamic(() => import("@/components/home1/ProjectsHome1"));
const HowItWorksHome1 = dynamic(() => import("@/components/home1/HowItWorksHome1"));
const TestimonialsHome1 = dynamic(() => import("@/components/home1/TestimonialsHome1"));
const FAQHome1 = dynamic(() => import("@/components/home1/FAQHome1"));
const QuoteFormHome1 = dynamic(() => import("@/components/home1/QuoteFormHome1"));
const CTAHome1 = dynamic(() => import("@/components/home1/CTAHome1"));
const Footer = dynamic(() => import("@/components/Footer.jsx"));
const FloatingCTA = dynamic(() => import("@/components/FloatingCTA.jsx"));

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
