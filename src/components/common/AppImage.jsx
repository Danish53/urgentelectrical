"use client";

import { useState } from "react";
import Image from "next/image";
import { shouldUnoptimizeImage } from "@/lib/images/imageSrc";

const DEFAULT_FILL_SIZES = "100vw";

/**
 * Next.js Image wrapper with optional error fallback.
 *
 * @param {{
 *   src: string,
 *   alt?: string,
 *   width?: number,
 *   height?: number,
 *   fill?: boolean,
 *   className?: string,
 *   sizes?: string,
 *   priority?: boolean,
 *   loading?: "lazy" | "eager",
 *   fallback?: import("react").ReactNode,
 *   onError?: () => void,
 *   referrerPolicy?: React.HTMLAttributeReferrerPolicy,
 * }} props
 */
export default function AppImage({
  src,
  alt = "",
  width,
  height,
  fill = false,
  className = "",
  sizes,
  priority = false,
  loading,
  fallback = null,
  onError,
  referrerPolicy,
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return fallback ?? null;
  }

  const handleError = () => {
    setFailed(true);
    onError?.();
  };

  const unoptimized = shouldUnoptimizeImage(src);

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes ?? DEFAULT_FILL_SIZES}
        priority={priority}
        loading={loading}
        referrerPolicy={referrerPolicy}
        unoptimized={unoptimized}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 640}
      height={height ?? 360}
      className={className}
      sizes={sizes}
      priority={priority}
      loading={loading}
      referrerPolicy={referrerPolicy}
      unoptimized={unoptimized}
      onError={handleError}
    />
  );
}
