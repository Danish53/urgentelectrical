"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { buildLocationMapEmbed, buildLocationMapQuery } from "@/lib/locations/buildLocationMapEmbed";

const themeMarkerIcon = L.divIcon({
  className: "home1-locations-map-pin",
  html: '<span class="home1-locations-map-pin__icon" aria-hidden="true"></span>',
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -38],
});

/**
 * @param {{ name: string, cityName?: string, slug?: string, mapQuery?: string }} input
 * @returns {Promise<{ lat: number, lng: number } | null>}
 */
async function geocodeViaApi(input) {
  const params = new URLSearchParams();
  if (input.name) params.set("name", input.name);
  if (input.cityName) params.set("cityName", input.cityName);
  if (input.slug) params.set("slug", input.slug);
  if (input.mapQuery) params.set("q", input.mapQuery);

  try {
    const res = await fetch(`/api/geocode?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const lat = Number(data?.lat);
    const lng = Number(data?.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

/**
 * Location detail map with a single red pin for the opened area.
 * Falls back to Google Maps embed (with pin) if geocoding fails.
 * @param {{
 *   name: string,
 *   cityName?: string,
 *   slug?: string,
 *   lat?: number | null,
 *   lng?: number | null,
 *   mapQuery?: string,
 *   mapEmbed?: string,
 * }} props
 */
export default function LocationDetailMap({
  name,
  cityName = "",
  slug = "",
  lat = null,
  lng = null,
  mapQuery = "",
  mapEmbed = "",
}) {
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState(() =>
    lat != null && lng != null ? { lat: Number(lat), lng: Number(lng) } : null
  );
  const [useEmbedFallback, setUseEmbedFallback] = useState(false);

  const query = useMemo(
    () => mapQuery || buildLocationMapQuery({ name, cityName, slug }),
    [mapQuery, name, cityName, slug]
  );

  const embedSrc = useMemo(() => {
    if (mapEmbed) return mapEmbed;
    return buildLocationMapEmbed({
      name,
      cityName,
      slug,
      lat,
      lng,
    });
  }, [mapEmbed, name, cityName, slug, lat, lng]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (lat != null && lng != null) {
      setCoords({ lat: Number(lat), lng: Number(lng) });
      setUseEmbedFallback(false);
      return;
    }

    let cancelled = false;
    setUseEmbedFallback(false);

    geocodeViaApi({ name, cityName, slug, mapQuery: query }).then((point) => {
      if (cancelled) return;
      if (point) {
        setCoords(point);
        setUseEmbedFallback(false);
      } else {
        setCoords(null);
        setUseEmbedFallback(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [lat, lng, name, cityName, slug, query]);

  if (!mounted || (!coords && !useEmbedFallback)) {
    return <div className="home1-locations-map__loading" aria-hidden="true" />;
  }

  if (useEmbedFallback || !coords) {
    return (
      <iframe
        title={`Map of ${name}`}
        src={embedSrc}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    );
  }

  return (
    <MapContainer
      key={`${name}-${coords.lat},${coords.lng}`}
      center={[coords.lat, coords.lng]}
      zoom={14}
      scrollWheelZoom={false}
      className="home1-location-detail-leaflet"
      aria-label={`Map pin for ${name}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[coords.lat, coords.lng]} icon={themeMarkerIcon}>
        <Popup className="home1-locations-map-popup" closeButton minWidth={96} maxWidth={160}>
          <div className="home1-locations-map-popup__inner">
            <p className="home1-locations-map-popup__title">{name}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
