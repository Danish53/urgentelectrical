import { notFound } from "next/navigation";
import ServiceDetailClient from "@/components/services/ServiceDetailClient";
import { buildServiceJsonLd, buildServiceMetadata } from "@/data/servicesPage";
import { getServiceDetailBySlug } from "@/lib/services/getServices";
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
  const jsonLd = buildServiceJsonLd(service);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ServiceDetailClient service={service} related={related} />
    </>
  );
}
