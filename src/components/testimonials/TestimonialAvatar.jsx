export default function TestimonialAvatar({ item, className = "w-11 h-11", rounded = "rounded-xl" }) {
  const sizeClass = className;
  const shapeClass = rounded;

  if (item.image) {
    return (
      <img
        src={item.image}
        alt=""
        width={44}
        height={44}
        className={`${sizeClass} ${shapeClass} object-cover`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
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
