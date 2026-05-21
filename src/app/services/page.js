import ServicesPageClient from "@/components/services/ServicesPageClient";
import { SERVICES_JSON_LD } from "@/data/servicesPage";
import "../home1/home1.css";

export { metadata } from "./layout";

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_JSON_LD) }} />
      <ServicesPageClient />
    </>
  );
}
