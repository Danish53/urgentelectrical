"use client";

import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import CTAHome1 from "@/components/home1/CTAHome1";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfoPanel from "@/components/contact/ContactInfoPanel";
import ContactForm from "@/components/contact/ContactForm";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import { CONTACT_MAP_EMBED } from "@/data/contactPage";

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10 items-start">
              <ContactInfoPanel />
              <ContactForm />
            </div>
          </div>
        </section>

        <section className="bg-[#eef0f2] pb-10 sm:pb-14 lg:pb-16" aria-label="Office location map">
          <div className={SERVICES_PAGE_CONTAINER}>
            <div className="rounded-xl overflow-hidden border border-[#e8eaed] shadow-[0_4px_24px_rgba(17,24,39,0.08)] bg-white">
              <iframe
                title="Map showing Urgent Electrical at 17 Regent Street, Nottingham NG1 5BQ"
                src={CONTACT_MAP_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="block w-full h-[280px] sm:h-[360px] md:h-[420px] lg:h-[460px] border-0"
              />
            </div>
          </div>
        </section>

        <CTAHome1 />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
