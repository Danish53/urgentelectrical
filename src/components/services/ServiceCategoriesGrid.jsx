"use client";

import Image from "next/image";
import Link from "next/link";
import { useServiceCategories } from "@/hooks/useServices";

function CategoryCard({ category }) {
  const [line1, ...rest] = category.description.split("\n").filter(Boolean);
  const summary = line1 ?? category.description;

  return (
    <article className="home1-card home1-card-shine overflow-hidden h-full flex flex-col">
      <Link href={category.href} className="home1-service-media block shrink-0 aspect-[16/10]" aria-label={category.label}>
        {category.image ? (
          <Image
            src={category.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            className="object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg px-4 text-center"
            style={{ background: "var(--home1-red)" }}
          >
            {category.label}
          </div>
        )}
      </Link>
      <div className="p-6 sm:p-8 flex flex-col flex-1 min-h-0">
        <h3 className="font-bold text-[var(--home1-text)] text-lg mb-2">
          <Link href={category.href} className="hover:text-[var(--home1-red)] transition-colors">
            {category.label}
          </Link>
        </h3>
        {summary ? (
          <p className="text-[var(--home1-muted)] text-[14px] leading-relaxed line-clamp-4 flex-1">{summary}</p>
        ) : null}
        <Link href={category.href} className="home1-service-btn home1-service-btn--ghost mt-5 w-fit text-sm">
          View services
        </Link>
      </div>
    </article>
  );
}

export default function ServiceCategoriesGrid({ className = "" }) {
  const { categories, loading, failed } = useServiceCategories();

  if (loading) {
    return (
      <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-5 ${className}`.trim()}>
        {[1, 2, 3].map((n) => (
          <div key={n} className="home1-card h-[320px] animate-pulse bg-[var(--home1-surface)]" aria-hidden="true" />
        ))}
      </div>
    );
  }

  if (failed || !categories.length) {
    return null;
  }

  return (
    <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 ${className}`.trim()}>
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
