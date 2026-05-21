"use client";

import { useState } from "react";
import Link from "next/link";
import { IconArrow } from "@/components/home1/icons";

export default function BlogCard({ post, featured = false }) {
  const [failed, setFailed] = useState(false);

  return (
    <article
      className={`home1-card home1-card-shine overflow-hidden group h-full flex flex-col ${
        featured ? "sm:flex-row sm:min-h-[280px]" : ""
      }`}
    >
      <Link
        href={post.href}
        className={`relative overflow-hidden bg-[var(--home1-surface)] shrink-0 block ${
          featured ? "sm:w-[42%] h-52 sm:h-auto min-h-[200px]" : "h-48"
        }`}
      >
        {!failed ? (
          <img
            src={post.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setFailed(true)}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold px-4 text-center"
            style={{ backgroundColor: post.color }}
            aria-hidden="true"
          >
            {post.categoryLabel}
          </div>
        )}
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md bg-black/60 text-white backdrop-blur-sm">
          {post.categoryLabel}
        </span>
      </Link>

      <div className={`flex flex-col flex-1 p-5 sm:p-6 ${featured ? "sm:justify-center" : ""}`}>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--home1-muted)] mb-2">
          {post.publishedDisplay} · {post.readMinutes} min read
        </p>
        <h2 className={`font-extrabold text-[var(--home1-text)] leading-snug mb-3 ${featured ? "text-xl sm:text-2xl" : "text-[16px] line-clamp-2"}`}>
          <Link href={post.href} className="hover:text-[var(--home1-red)] transition-colors">
            {post.title}
          </Link>
        </h2>
        <p className={`text-[var(--home1-muted)] leading-relaxed flex-1 ${featured ? "text-[15px] line-clamp-3" : "text-[13px] line-clamp-3"}`}>
          {post.excerpt}
        </p>
        <Link
          href={post.href}
          className="inline-flex items-center gap-1.5 mt-4 text-[13px] font-bold text-[var(--home1-red)] group-hover:gap-2.5 transition-all"
        >
          Read article
          <IconArrow className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
