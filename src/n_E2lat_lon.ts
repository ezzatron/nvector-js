import type { Vector3 } from "./vector.js";

export function n_E2lat_lon(
  n_E: Vector3,
): [latitude: number, longitude: number] {
  const [x, y, z] = n_E;

  const sinLat = z;
  const cosLat = Math.sqrt(y ** 2 + x ** 2);
  const cosLatSinLon = y;
  const cosLatCosLon = x;

  return [Math.atan2(sinLat, cosLat), Math.atan2(cosLatSinLon, cosLatCosLon)];
}
