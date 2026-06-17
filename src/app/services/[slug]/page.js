import { notFound } from "next/navigation";
import ServiceDetailClient from "@/components/services/ServiceDetailClient";
import { buildServiceJsonLd, buildServiceMetadata } from "@/data/servicesPage";
import { getBookableServices, getServiceDetailBySlug } from "@/lib/services/getServices";
import "../../home1/home1.css";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const services = await getBookableServices();
  return services.map((s) => ({ slug: s.slug }));
}

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
