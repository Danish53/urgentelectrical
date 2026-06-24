import "@/components/skeletons/skeleton.css";

const DESKTOP_WIDTHS = [76, 92, 84, 96, 72, 88];
const MOBILE_WIDTHS = ["58%", "72%", "64%", "68%", "54%"];

/**
 * @param {{ variant?: "desktop" | "mobile", count?: number }} props
 */
export default function NavMenuSkeleton({ variant = "desktop", count = 5 }) {
  const items = Array.from({ length: count }, (_, index) => index);

  if (variant === "mobile") {
    return (
      <div className="nav-menu-skeleton nav-menu-skeleton--mobile" aria-hidden="true">
        {items.map((index) => (
          <div key={index} className="nav-menu-skeleton__mobile-row">
            <span
              className="ue-skeleton nav-menu-skeleton__bar nav-menu-skeleton__bar--mobile"
              style={{ width: MOBILE_WIDTHS[index % MOBILE_WIDTHS.length] }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="nav-menu-skeleton nav-menu-skeleton--desktop" aria-hidden="true">
      {items.map((index) => (
        <span key={index} className="nav-menu-skeleton__desktop-item">
          <span
            className="ue-skeleton nav-menu-skeleton__bar nav-menu-skeleton__bar--desktop"
            style={{ width: DESKTOP_WIDTHS[index % DESKTOP_WIDTHS.length] }}
          />
        </span>
      ))}
    </div>
  );
}
