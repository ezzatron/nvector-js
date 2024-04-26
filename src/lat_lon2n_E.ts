import type { Vector3 } from "./vector.js";

export function lat_lon2n_E(latitude: number, longitude: number): Vector3 {
  const sinLat = Math.sin(latitude);
  const cosLat = Math.cos(latitude);
  const sinLon = Math.sin(longitude);
  const cosLon = Math.cos(longitude);

  return [cosLat * cosLon, cosLat * sinLon, sinLat];
}
