"use client";

import Navbar from "@/components/Navbar.jsx";
import Hero from "@/components/Hero.jsx";
import WhyChooseUs from "@/components/WhyChooseUs.jsx";
import HowItWorks from "@/components/HowItWorks.jsx";
import FeaturedServices from "@/components/FeaturedServices.jsx";
import EmergencySection from "@/components/EmergencySection.jsx";
import CommercialSection from "@/components/CommercialSection.jsx";
import LocalElectricianSection from "@/components/LocalElectricianSection.jsx";
import FAQSection from "@/components/FAQSection.jsx";
import AreasSection from "@/components/AreasSection.jsx";
import TestimonialsSection from "@/components/TestimonialsSection.jsx";
import PartnersSection from "@/components/PartnersSection.jsx";
import NewsletterSection from "@/components/NewsletterSection.jsx";
import CTABannerSection from "@/components/CTABannerSection.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import MotionSection from "@/components/MotionSection.jsx";

/** Original homepage design (pre–home1 default) — available at /home1 */
export default function Home1LegacyPage() {
  return (
    <div className="w-full min-w-0">
      <Navbar />
      <main className="w-full min-w-0">
        <Hero />
        <MotionSection variant="fade-up">
          <WhyChooseUs />
        </MotionSection>
        <MotionSection variant="fade-up" delay={0.1}>
          <HowItWorks />
        </MotionSection>
        <MotionSection variant="blur-up" duration={1.1}>
          <FeaturedServices />
        </MotionSection>
        <MotionSection variant="fade-up" duration={1.05}>
          <EmergencySection />
        </MotionSection>
        <MotionSection variant="fade-up">
          <CommercialSection />
        </MotionSection>
        <MotionSection variant="fade-up" duration={1.05}>
          <LocalElectricianSection />
        </MotionSection>
        <MotionSection variant="fade-up">
          <FAQSection />
        </MotionSection>
        <MotionSection variant="scale-up" duration={1.1}>
          <AreasSection />
        </MotionSection>
        <MotionSection variant="fade-up">
          <TestimonialsSection />
        </MotionSection>
        <MotionSection variant="fade-in" duration={0.9}>
          <PartnersSection />
        </MotionSection>
        <MotionSection variant="blur-up" duration={1.1}>
          <NewsletterSection />
        </MotionSection>
        <MotionSection variant="fade-up" duration={1}>
          <CTABannerSection />
        </MotionSection>
      </main>
      <MotionSection variant="fade-up" duration={0.95}>
        <Footer />
      </MotionSection>
      <FloatingCTA />
    </div>
  );
}
