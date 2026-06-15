import Link from "next/link";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";
import { CONTAINER } from "./constants";
import { IconArrow, IconPhone } from "./icons";

export default function CTAHome2() {
  return (
    <section className="home2-section overflow-x-clip" aria-labelledby="home2-cta-heading">
      <div className={CONTAINER}>
        <div className="rounded-2xl px-8 py-12 sm:px-12 sm:py-14 text-center text-white" style={{ background: "var(--h2-red)" }}>
          <h2 id="home2-cta-heading" className="text-2xl sm:text-3xl font-extrabold mb-3">
            Need an electrician right now?
          </h2>
          <p className="text-white/90 max-w-xl mx-auto mb-8 text-[15px]">
            Emergency call-out or same-day booking — confirmed in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={`tel:${FOOTER_PHONE_TEL}`} className="home2-btn home2-btn--white">
              <IconPhone />
              {FOOTER_PHONE}
            </a>
            <Link href="/services" className="home2-btn home2-btn--outline !border-white !text-white hover:!bg-white/10">
              Book online
              <IconArrow />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
