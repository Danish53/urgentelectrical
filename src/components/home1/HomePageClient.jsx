"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar.jsx";
import Hero from "@/components/Hero.jsx";

const HomeBelowFold = dynamic(() => import("@/components/home1/HomeBelowFold"), {
  loading: () => null,
});
const HomePageChrome = dynamic(() => import("@/components/home1/HomePageChrome"), {
  loading: () => null,
});

export default function HomePageClient() {
  return (
    <div className="home1-page w-full min-w-0">
      <Navbar />
      <main id="main-content" className="w-full min-w-0">
        <Hero />
        <HomeBelowFold />
      </main>
      <HomePageChrome />
    </div>
  );
}
