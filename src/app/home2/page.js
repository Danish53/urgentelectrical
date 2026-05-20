"use client";

import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import MotionSection from "@/components/MotionSection.jsx";
import HeroHome2 from "@/components/home2/HeroHome2";
import ServicesHome2 from "@/components/home2/ServicesHome2";
import WhyChooseUsHome2 from "@/components/home2/WhyChooseUsHome2";
import HowItWorksHome2 from "@/components/home2/HowItWorksHome2";
import EmergencyHome2 from "@/components/home2/EmergencyHome2";
import CommercialHome2 from "@/components/home2/CommercialHome2";
import LocalElectricianHome2 from "@/components/home2/LocalElectricianHome2";
import FAQHome2 from "@/components/home2/FAQHome2";
import AreasHome2 from "@/components/home2/AreasHome2";
import TestimonialsHome2 from "@/components/home2/TestimonialsHome2";
import PartnersHome2 from "@/components/home2/PartnersHome2";
import NewsletterHome2 from "@/components/home2/NewsletterHome2";
import CTAHome2 from "@/components/home2/CTAHome2";
import "./home2.css";

export default function Home2Page() {
  return (
    <div className="home2-page w-full min-w-0">
      <Navbar />
      <main className="w-full min-w-0">
        <HeroHome2 />
        <MotionSection variant="fade-up">
          <ServicesHome2 />
        </MotionSection>
        <MotionSection variant="fade-up">
          <WhyChooseUsHome2 />
        </MotionSection>
        <MotionSection variant="fade-up">
          <HowItWorksHome2 />
        </MotionSection>
        <MotionSection variant="fade-up">
          <EmergencyHome2 />
        </MotionSection>
        <MotionSection variant="fade-up">
          <CommercialHome2 />
        </MotionSection>
        <MotionSection variant="fade-up">
          <LocalElectricianHome2 />
        </MotionSection>
        <MotionSection variant="fade-up">
          <FAQHome2 />
        </MotionSection>
        <MotionSection variant="fade-up">
          <AreasHome2 />
        </MotionSection>
        <MotionSection variant="fade-up">
          <TestimonialsHome2 />
        </MotionSection>
        <MotionSection variant="fade-in">
          <PartnersHome2 />
        </MotionSection>
        <MotionSection variant="fade-up">
          <NewsletterHome2 />
        </MotionSection>
        <MotionSection variant="fade-up">
          <CTAHome2 />
        </MotionSection>
      </main>
      <MotionSection variant="fade-up">
        <Footer />
      </MotionSection>
      <FloatingCTA />
    </div>
  );
}
