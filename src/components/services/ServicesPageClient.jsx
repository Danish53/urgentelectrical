"use client";

import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import MotionSection from "@/components/MotionSection.jsx";
import CTAHome1 from "@/components/home1/CTAHome1";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesTrustStrip from "@/components/services/ServicesTrustStrip";
import ServicesCatalog from "@/components/services/ServicesCatalog";
// import ServicesResources from "@/components/services/ServicesResources";

export default function ServicesPageClient() {
  return (
    <div className="home1-page home1-services-page w-full min-w-0">
      <Navbar />
      <main id="main-content" className="w-full min-w-0">
        <ServicesHero />
        <ServicesTrustStrip />
        <ServicesCatalog />
        {/* <MotionSection variant="fade-up" delay={0.05}>
          <ServicesResources />
        </MotionSection> */}
        <MotionSection variant="fade-up">
          <CTAHome1 />
        </MotionSection>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
