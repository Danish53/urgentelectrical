import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeBelowFold from "@/components/home1/HomeBelowFold";
import HomePageChrome from "@/components/home1/HomePageChrome";
import { HOME_JSON_LD, HOME_METADATA } from "@/data/homeSeo";
import { getBookableServices } from "@/lib/services/getServices";
import "./home1/home1.css";

export const metadata = HOME_METADATA;

export default async function Home() {
  const bookable = await getBookableServices();
  const bookingOptions = bookable.map(({ name, slug }) => ({ name, slug }));
  const itemList =
    bookable.length > 0
      ? {
          "@type": "ItemList",
          name: "Our electrical services",
          itemListElement: bookable.slice(0, 6).map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: s.canonicalUrl,
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
