import Image from "next/image";
import { shouldUnoptimizeImage } from "@/lib/images/imageSrc";

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
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized={shouldUnoptimizeImage(src)}
    />
  );
}
