"use client";

import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import CTAHome1 from "@/components/home1/CTAHome1";
import AboutHero from "@/components/about/AboutHero";
import AboutJourneySection from "@/components/about/AboutJourneySection";
import AboutCoreValuesSection from "@/components/about/AboutCoreValuesSection";

export default function AboutPageClient() {
  return (
    <div className="home1-page home1-about-page w-full min-w-0">
      <Navbar />
      <main id="main-content" className="w-full min-w-0">
        <AboutHero />
        <AboutJourneySection />
        <AboutCoreValuesSection />
        <CTAHome1 />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
