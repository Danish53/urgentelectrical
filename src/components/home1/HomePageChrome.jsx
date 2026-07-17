"use client";

import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";

/** Footer + floating CTA in one lazy chunk. */
export default function HomePageChrome() {
  return (
    <>
      <Footer />
      <FloatingCTA />
    </>
  );
}
