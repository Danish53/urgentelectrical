import { notFound } from "next/navigation";
import ServiceDetailClient from "@/components/services/ServiceDetailClient";
import { buildServiceJsonLd, buildServiceMetadata } from "@/data/servicesPage";
import { getServiceDetailBySlug } from "@/lib/services/getServices";
import { resolveAreaLocationLinks } from "@/lib/locations/locationSlugIndex";
import "../../home1/home1.css";
import "../../pages/pages.css";

export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const detail = await getServiceDetailBySlug(slug);
  if (!detail) return { title: "Service not found" };
  return buildServiceMetadata(detail.service);
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const detail = await getServiceDetailBySlug(slug);
  if (!detail) notFound();

  const { service, related } = detail;

  if (Array.isArray(service.serviceAreas) && service.serviceAreas.length) {
    try {
      service.serviceAreas = await resolveAreaLocationLinks(
        service.serviceAreas.map((area) =>
          typeof area === "string" ? area : String(area?.name ?? "")
        )
      );
    } catch {
      /* keep original area names; hrefs fall back safely in UI */
    }
  }

  const jsonLd = buildServiceJsonLd(service);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ServiceDetailClient service={service} related={related} />
    </>
  );
}
