import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeBelowFold from "@/components/home1/HomeBelowFold";
import { HOME_JSON_LD, HOME_METADATA } from "@/data/homeSeo";
import { getHomepageBookingOptions } from "@/lib/services/getServices";
import { absoluteSiteUrl } from "@/lib/siteUrl";
import "./home1/home1.css";

const HomePageChrome = dynamic(() => import("@/components/home1/HomePageChrome"), {
  ssr: true,
});

export const metadata = HOME_METADATA;

export default async function Home() {
  const bookingOptions = await getHomepageBookingOptions();
  const itemList =
    bookingOptions.length > 0
      ? {
          "@type": "ItemList",
          name: "Our electrical services",
          itemListElement: bookingOptions.slice(0, 6).map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: absoluteSiteUrl(`/services/${s.slug}`),
            name: s.name,
          })),
        }
      : null;

  const jsonLd = {
    ...HOME_JSON_LD,
    "@graph": itemList ? [...HOME_JSON_LD["@graph"], itemList] : HOME_JSON_LD["@graph"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="home1-page w-full min-w-0">
        <Navbar />
        <main id="main-content" className="w-full min-w-0">
          <Hero initialServices={bookingOptions} />
          <HomeBelowFold />
        </main>
        <HomePageChrome />
      </div>
    </>
  );
}
