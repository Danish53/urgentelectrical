"use client";

import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import MotionSection from "@/components/MotionSection.jsx";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesCatalog from "@/components/services/ServicesCatalog";
import ServicesResources from "@/components/services/ServicesResources";
import CTAHome1 from "@/components/home1/CTAHome1";
import { SERVICES_JSON_LD } from "@/data/servicesPage";
import "../home1/home1.css";

export default function ServicesPage() {
  return (
    <div className="home1-page w-full min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_JSON_LD) }}
      />
      <Navbar />
      <main className="w-full min-w-0">
        <ServicesHero />
        <MotionSection variant="fade-up">
          <ServicesCatalog />
        </MotionSection>
        <MotionSection variant="fade-up" delay={0.06}>
          <ServicesResources />
        </MotionSection>
        <MotionSection variant="fade-up">
          <CTAHome1 bookHref="/#book" />
        </MotionSection>
      </main>
      <MotionSection variant="fade-up">
        <Footer />
      </MotionSection>
      <FloatingCTA />
    </div>
  );
}
