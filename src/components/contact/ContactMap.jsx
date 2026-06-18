"use client";

import { useWebsiteGeneralData } from "@/hooks/useWebsiteGeneralData";
import {
  CONTACT_MAP_DIRECTIONS,
  CONTACT_MAP_EMBED,
  CONTACT_MAP_LINK,
  CONTACT_MAP_RATING,
} from "@/data/contactPage";
import { CONTAINER } from "@/components/home1/constants";

export default function ContactMap() {
  const { site } = useWebsiteGeneralData();

  return (
    <section className="home1-contact-map-section bg-[#eef0f2]" aria-label="Office location map">
      <div className={CONTAINER}>
        <div className="home1-contact-map-card">
          <div className="home1-contact-map-frame">
            <iframe
              title={`Map showing ${site.title} at ${site.address}`}
              src={CONTACT_MAP_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="home1-contact-map-iframe"
            />

            <div className="home1-contact-map-place-card">
              <a
                href={CONTACT_MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="home1-contact-map-place-link"
              >
                <strong className="home1-contact-map-place-name">{site.title}</strong>
                <span className="home1-contact-map-place-address">{site.address}</span>
              </a>

              <div
                className="home1-contact-map-place-rating"
                aria-label={`${CONTACT_MAP_RATING.score} out of 5 from ${CONTACT_MAP_RATING.count} reviews`}
              >
                <span className="home1-contact-map-place-stars" aria-hidden="true">
                  ★
                </span>
                <span className="home1-contact-map-place-score">{CONTACT_MAP_RATING.score}</span>
                <a
                  href={CONTACT_MAP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home1-contact-map-place-reviews"
                >
                  ({CONTACT_MAP_RATING.count})
                </a>
              </div>

              <div className="home1-contact-map-place-actions">
                <a
                  href={CONTACT_MAP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home1-contact-map-place-action"
                >
                  <span className="home1-contact-map-place-action-icon" aria-hidden="true">
                    ↗
                  </span>
                  View larger map
                </a>
                <a
                  href={CONTACT_MAP_DIRECTIONS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home1-contact-map-place-action home1-contact-map-place-action--directions"
                >
                  <span className="home1-contact-map-place-action-icon" aria-hidden="true">
                    ➤
                  </span>
                  Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
