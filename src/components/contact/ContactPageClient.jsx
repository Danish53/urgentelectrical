"use client";

import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import CTAHome1 from "@/components/home1/CTAHome1";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfoPanel from "@/components/contact/ContactInfoPanel";
import ContactForm from "@/components/contact/ContactForm";
import ContactMap from "@/components/contact/ContactMap";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";

export default function ContactPageClient() {
  return (
    <div className="home1-page home1-contact-page w-full min-w-0">
      <Navbar />
      <main id="main-content" className="w-full min-w-0">
        <ContactHero />

        <section
          className="bg-[#eef0f2] pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10"
          aria-label="Contact form and details"
        >
          <div className={`${SERVICES_PAGE_CONTAINER}`}>
            <div className="home1-contact-main-grid">
              <div className="home1-contact-form-col min-w-0">
                <ContactForm />
              </div>
              <div className="home1-contact-info-col min-w-0">
                <ContactInfoPanel />
              </div>
            </div>
          </div>
        </section>

        <ContactMap />

        <CTAHome1 />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
