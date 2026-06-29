import ServicesPageClient from "@/components/services/ServicesPageClient";
import { buildServicesJsonLd } from "@/data/servicesPage";
import { getBookableServices } from "@/lib/services/getServices";
import "../home1/home1.css";

export { metadata } from "./layout";

export default async function ServicesPage() {
  const bookable = await getBookableServices();
  const jsonLd = buildServicesJsonLd(bookable);

  return (
    <>
      {bookable.length > 0 ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}
      <ServicesPageClient />
    </>
  );
}
