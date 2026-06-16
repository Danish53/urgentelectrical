/** @typedef {{ name: string, lat: number, lng: number }} LocationMapPin */

/** Major East Midlands hubs — matches reference coverage map density */
export const LOCATION_MAP_PINS = /** @type {LocationMapPin[]} */ ([
  { name: "Nottingham City Centre", lat: 52.9548, lng: -1.1581 },
  { name: "Derby City Centre", lat: 52.9225, lng: -1.4746 },
  { name: "Leicester City Centre", lat: 52.6369, lng: -1.1398 },
  { name: "Lincoln City Centre", lat: 53.2307, lng: -0.5406 },
  { name: "Newark-on-Trent", lat: 53.07, lng: -0.8066 },
  { name: "Retford", lat: 53.3222, lng: -0.9425 },
  { name: "Grantham", lat: 52.9115, lng: -0.6418 },
  { name: "Sleaford", lat: 52.9994, lng: -0.4094 },
  { name: "Boston", lat: 52.9789, lng: -0.0266 },
  { name: "Stamford", lat: 52.6517, lng: -0.4806 },
  { name: "Melton Mowbray", lat: 52.7667, lng: -0.8833 },
  { name: "Uttoxeter", lat: 52.8983, lng: -1.8647 },
  { name: "Ashbourne", lat: 53.0167, lng: -1.7333 },
  { name: "Swadlincote", lat: 52.774, lng: -1.557 },
]);

export const LOCATION_MAP_CENTER = { lat: 52.95, lng: -0.95 };
export const LOCATION_MAP_ZOOM = 8;
