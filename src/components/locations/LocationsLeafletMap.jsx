"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  LOCATION_MAP_CENTER,
  LOCATION_MAP_PINS,
  LOCATION_MAP_ZOOM,
} from "@/data/locationCoordinates";
import { resolveLocationSlugForPin } from "@/lib/locations/resolveLocationSlug";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectLocationsList, selectLocationsStatus } from "@/store/selectors/locationsSelectors";
import { fetchLocations } from "@/store/slices/locationsSlice";

const themeMarkerIcon = L.divIcon({
  className: "home1-locations-map-pin",
  html: '<span class="home1-locations-map-pin__icon" aria-hidden="true"></span>',
  iconSize: [28, 40],
  iconAnchor: [14, 40],
  popupAnchor: [0, -36],
});

/**
 * @param {{ className?: string }} props
 */
export default function LocationsLeafletMap({ className = "" }) {
  const dispatch = useAppDispatch();
  const locations = useAppSelector(selectLocationsList);
  const status = useAppSelector(selectLocationsStatus);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLocations({ page: 1 }));
    }
  }, [dispatch, status]);

  const markers = useMemo(() => {
    return LOCATION_MAP_PINS.map((pin) => {
      const slug = resolveLocationSlugForPin(pin.name, locations);
      const label = pin.name.replace(/\s+City\s+Centre$/i, "");

      return {
        ...pin,
        label,
        href: `/locations/${slug}`,
      };
    });
  }, [locations]);

  if (!mounted) {
    return <div className="home1-locations-map__loading" aria-hidden="true" />;
  }

  return (
    <MapContainer
      center={[LOCATION_MAP_CENTER.lat, LOCATION_MAP_CENTER.lng]}
      zoom={LOCATION_MAP_ZOOM}
      scrollWheelZoom={false}
      className={`home1-locations-search-slim__leaflet ${className}`.trim()}
      aria-label="Interactive map of Urgent Electrical service areas"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map((marker) => (
        <Marker
          key={marker.name}
          position={[marker.lat, marker.lng]}
          icon={themeMarkerIcon}
        >
          <Popup className="home1-locations-map-popup" closeButton minWidth={96} maxWidth={132}>
            <div className="home1-locations-map-popup__inner">
              <p className="home1-locations-map-popup__title">{marker.label}</p>
              <Link href={marker.href} className="home1-locations-map-popup__link">
                View →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
