"use client";

import AppImage from "@/components/common/AppImage";

export default function TestimonialAvatar({ item, className = "w-11 h-11", rounded = "rounded-xl" }) {
  const sizeClass = className;
  const shapeClass = rounded;

  if (item.image) {
    return (
      <AppImage
        src={item.image}
        alt=""
        width={48}
        height={48}
        className={`${sizeClass} ${shapeClass} object-cover`}
        referrerPolicy="no-referrer"
        fallback={
          <span
            className={`${sizeClass} ${shapeClass} flex items-center justify-center text-white font-bold`}
            style={{ backgroundColor: item.avatarBg }}
            aria-hidden="true"
          >
            {item.initial}
          </span>
        }
      />
    );
  }

  return (
    <span
      className={`${sizeClass} ${shapeClass} flex items-center justify-center text-white font-bold`}
      style={{ backgroundColor: item.avatarBg }}
      aria-hidden="true"
    >
      {item.initial}
    </span>
  );
}
