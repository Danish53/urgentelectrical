"use client";

import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import MotionSection from "@/components/MotionSection.jsx";
import BlogHero from "@/components/blog/BlogHero";
import BlogListing from "@/components/blog/BlogListing";
import NewsletterHome1 from "@/components/home1/NewsletterHome1";

export default function BlogPageClient({ categories, initialPosts, initialMeta }) {
  return (
    <div className="home1-page w-full min-w-0">
      <Navbar />
      <main className="w-full min-w-0">
        <BlogHero />
        <BlogListing
          categories={categories}
          initialPosts={initialPosts}
          initialMeta={initialMeta}
        />
        <MotionSection variant="fade-in">
          <NewsletterHome1 />
        </MotionSection>
      </main>
      <MotionSection variant="fade-up">
        <Footer />
      </MotionSection>
      <FloatingCTA />
    </div>
  );
}
