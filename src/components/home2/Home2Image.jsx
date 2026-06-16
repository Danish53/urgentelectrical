"use client";

import { useState } from "react";
import Image from "next/image";
import { shouldUnoptimizeImage } from "@/lib/images/imageSrc";

/**
 * Section image with gradient fallback when file is missing.
 */
export default function Home2Image({ src, alt, className = "object-cover", priority = false, sizes }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#2d1515] to-[#0a0a0a] text-white/50 text-sm font-semibold px-6 text-center"
        role="img"
        aria-label={alt || "Image placeholder"}
      >
        <span className="text-4xl mb-2 opacity-40" aria-hidden="true">
          ⚡
        </span>
        <span>{alt || "Electrical services"}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized={shouldUnoptimizeImage(src)}
      onError={() => setFailed(true)}
    />
  );
}
