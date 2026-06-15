import Image from "next/image";

/**
 * @param {{
 *   src: string,
 *   alt: string,
 *   width: number,
 *   height: number,
 *   className?: string,
 *   priority?: boolean,
 * }} props
 */
export default function SiteLogoImage({ src, alt, width, height, className = "", priority = false }) {
  const isRemote = src.startsWith("http");

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized={isRemote}
    />
  );
}
