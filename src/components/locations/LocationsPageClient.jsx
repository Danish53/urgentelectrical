"use client";

import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import CTAHome1 from "@/components/home1/CTAHome1";
import LocationsHero from "@/components/locations/LocationsHero";
import LocationsIntro from "@/components/locations/LocationsIntro";
import LocationsSearchMap from "@/components/locations/LocationsSearchMap";
import LocationsAreasList from "@/components/locations/LocationsAreasList";

/**
 * @param {{
 *   initialLocations?: import("@/lib/locations/parseLocationsList").LocationListItem[],
 *   initialPagination?: import("@/lib/locations/parseLocationsList").LocationsPagination | null,
 * }} props
 */
export default function LocationsPageClient({
  initialLocations = [],
  initialPagination = null,
}) {
  return (
    <div className="home1-page home1-locations-page w-full min-w-0">
      <Navbar />
      <main id="main-content" className="w-full min-w-0">
        <LocationsHero />
        <LocationsIntro />
        <LocationsSearchMap />
        <LocationsAreasList
          initialLocations={initialLocations}
          initialPagination={initialPagination}
        />
        <CTAHome1 />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
