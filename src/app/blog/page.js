"use client";

import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import MotionSection from "@/components/MotionSection.jsx";
import BlogHero from "@/components/blog/BlogHero";
import BlogListing from "@/components/blog/BlogListing";
import NewsletterHome1 from "@/components/home1/NewsletterHome1";
import { BLOG_LISTING_JSON_LD } from "@/data/blogs";
import "../home1/home1.css";

export default function BlogPage() {
  return (
    <div className="home1-page w-full min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_LISTING_JSON_LD) }}
      />
      <Navbar />
      <main className="w-full min-w-0">
        <BlogHero />
        <MotionSection variant="fade-up">
          <BlogListing />
        </MotionSection>
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
