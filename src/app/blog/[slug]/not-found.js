import Link from "next/link";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import { CONTAINER } from "@/components/home1/constants";
import { documentTitle } from "@/lib/seo/documentTitle";
import "../../home1/home1.css";

export const metadata = {
  title: documentTitle("Article not found"),
  robots: { index: false, follow: false },
};

export default function BlogNotFound() {
  return (
    <div className="home1-page min-h-screen flex flex-col">
      <Navbar />
      <main className={`${CONTAINER} flex-1 flex flex-col items-center justify-center py-32 text-center`}>
        <p className="home1-eyebrow mb-4">404</p>
        <h1 className="text-3xl font-extrabold text-[var(--home1-text)] mb-4">Article not found</h1>
        <p className="text-[var(--home1-muted)] mb-8 max-w-md">This blog post does not exist or may have been moved.</p>
        <Link href="/blog" className="home1-btn-primary">
          Back to blog
        </Link>
      </main>
      <Footer />
    </div>
  );
}
