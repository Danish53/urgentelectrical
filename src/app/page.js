"use client";

import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import MotionSection from "@/components/MotionSection.jsx";
import HeroHome1 from "@/components/home1/HeroHome1";
import WhyChooseUsHome1 from "@/components/home1/WhyChooseUsHome1";
import HowItWorksHome1 from "@/components/home1/HowItWorksHome1";
import FeaturedServicesHome1 from "@/components/home1/FeaturedServicesHome1";
import EmergencyHome1 from "@/components/home1/EmergencyHome1";
import CommercialHome1 from "@/components/home1/CommercialHome1";
import LocalElectricianHome1 from "@/components/home1/LocalElectricianHome1";
import FAQHome1 from "@/components/home1/FAQHome1";
import AreasHome1 from "@/components/home1/AreasHome1";
import TestimonialsHome1 from "@/components/home1/TestimonialsHome1";
import PartnersHome1 from "@/components/home1/PartnersHome1";
import NewsletterHome1 from "@/components/home1/NewsletterHome1";
import CTAHome1 from "@/components/home1/CTAHome1";
import "./home1/home1.css";

export default function Home() {
  return (
    <div className="home1-page w-full min-w-0">
      <Navbar />
      <main className="w-full min-w-0">
        <HeroHome1 />
        <MotionSection variant="fade-up">
          <WhyChooseUsHome1 />
        </MotionSection>
        <MotionSection variant="fade-up" delay={0.08}>
          <HowItWorksHome1 />
        </MotionSection>
        <MotionSection variant="fade-up">
          <FeaturedServicesHome1 />
        </MotionSection>
        <MotionSection variant="fade-up">
          <EmergencyHome1 />
        </MotionSection>
        <MotionSection variant="fade-up">
          <CommercialHome1 />
        </MotionSection>
        <MotionSection variant="fade-up">
          <LocalElectricianHome1 />
        </MotionSection>
        <MotionSection variant="fade-up">
          <FAQHome1 />
        </MotionSection>
        <MotionSection variant="scale-up">
          <AreasHome1 />
        </MotionSection>
        <MotionSection variant="fade-up">
          <TestimonialsHome1 />
        </MotionSection>
        <MotionSection variant="fade-in">
          <PartnersHome1 />
        </MotionSection>
        <MotionSection variant="fade-up">
          <NewsletterHome1 />
        </MotionSection>
        <MotionSection variant="fade-up">
          <CTAHome1 />
        </MotionSection>
      </main>
      <MotionSection variant="fade-up">
        <Footer />
      </MotionSection>
      <FloatingCTA />
    </div>
  );
}
