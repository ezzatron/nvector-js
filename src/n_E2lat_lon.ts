export function n_E2lat_lon(
  x: number,
  y: number,
  z: number,
): [latitude: number, longitude: number] {
  const sinLat = z;
  const cosLat = Math.sqrt(y ** 2 + x ** 2);
  const cosLatSinLon = y;
  const cosLatCosLon = x;

  return [Math.atan2(sinLat, cosLat), Math.atan2(cosLatSinLon, cosLatCosLon)];
}
