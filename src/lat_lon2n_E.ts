export function lat_lon2n_E(
  latitude: number,
  longitude: number,
): [x: number, y: number, z: number] {
  const sinLat = Math.sin(latitude);
  const cosLat = Math.cos(latitude);
  const sinLon = Math.sin(longitude);
  const cosLon = Math.cos(longitude);

  return [cosLat * cosLon, cosLat * sinLon, sinLat];
}
