import HomePageClient from "@/components/home1/HomePageClient";
import { HOME_JSON_LD, HOME_METADATA } from "@/data/homeSeo";
import "./home1/home1.css";

export const metadata = HOME_METADATA;

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }} />
      <HomePageClient />
    </>
  );
}
