import HomePageClient from "@/components/home1/HomePageClient";
import { HOME_JSON_LD, HOME_METADATA } from "@/data/homeSeo";
import { getBookableServices } from "@/lib/services/getServices";
import "./home1/home1.css";

export const metadata = HOME_METADATA;

export const revalidate = 3600;

export default async function Home() {
  const bookable = await getBookableServices();
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
      <HomePageClient />
    </>
  );
}
