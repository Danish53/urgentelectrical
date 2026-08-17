import CompanyStatsHome1 from "@/components/home1/CompanyStatsHome1";
import FeaturedServicesHome1 from "@/components/home1/FeaturedServicesHome1";
import EmergencyHome1 from "@/components/home1/EmergencyHome1";
import WhyChooseUsHome1 from "@/components/home1/WhyChooseUsHome1";
import AboutCompanyHome1 from "@/components/home1/AboutCompanyHome1";
import ProjectsHome1 from "@/components/home1/ProjectsHome1";
import HowItWorksHome1 from "@/components/home1/HowItWorksHome1";
import TrustedCertificationsHome1 from "@/components/home1/TrustedCertificationsHome1";
import TestimonialsHome1 from "@/components/home1/TestimonialsHome1";
import FAQHome1 from "@/components/home1/FAQHome1";
import QuoteFormHome1 from "@/components/home1/QuoteFormHome1";
import CTAHome1 from "@/components/home1/CTAHome1";

function HomeSection({ children }) {
  return <div className="w-full min-w-0">{children}</div>;
}

/** Server-rendered below-fold homepage sections with minimal client JavaScript. */
export default function HomeBelowFold() {
  return (
    <>
      <HomeSection>
        <HowItWorksHome1 />
      </HomeSection>
      <CompanyStatsHome1 />
      <HomeSection>
        <FeaturedServicesHome1 compact />
      </HomeSection>
      <HomeSection>
        <EmergencyHome1 />
      </HomeSection>
      <HomeSection>
        <WhyChooseUsHome1 />
      </HomeSection>
      <HomeSection>
        <AboutCompanyHome1 />
      </HomeSection>
      <HomeSection>
        <ProjectsHome1 />
      </HomeSection>
      <HomeSection>
        <TrustedCertificationsHome1 />
      </HomeSection>
      <HomeSection>
        <TestimonialsHome1 />
      </HomeSection>
      <HomeSection>
        <FAQHome1 />
      </HomeSection>
      <HomeSection>
        <QuoteFormHome1 />
      </HomeSection>
      <HomeSection>
        <CTAHome1 />
      </HomeSection>
    </>
  );
}
