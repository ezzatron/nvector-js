export function lat_lon2n_E(
  lat: number,
  lon: number,
): [x: number, y: number, z: number] {
  const sinLat = Math.sin(lat);
  const cosLat = Math.cos(lat);
  const sinLon = Math.sin(lon);
  const cosLon = Math.cos(lon);

  return [cosLat * cosLon, cosLat * sinLon, sinLat];
}
