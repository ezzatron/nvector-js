import type { Matrix3x3 } from "./matrix.js";
import { ROTATION_MATRIX_e, rotate } from "./rotation.js";
import type { Vector3 } from "./vector.js";

/**
 * Converts an n-vector to a latitude and longitude.
 *
 * @param n_E - An n-vector decomposed in E.
 * @param R_Ee - A rotation matrix defining the axes of the coordinate frame E.
 *
 * @returns A geodetic latitude and longitude in radians.
 */
export function n_E2lat_lon(
  n_E: Vector3,
  R_Ee: Matrix3x3 = ROTATION_MATRIX_e,
): [latitude: number, longitude: number] {
  // Based on https://github.com/pbrod/nvector/blob/b8afd89a860a4958d499789607aacb4168dcef87/src/nvector/rotation.py#L406
  const [x, y, z] = rotate(R_Ee, n_E);

  const sinLat = x;
  const cosLat = Math.hypot(y, z);
  const sinLonCosLat = y;
  const cosLonCosLat = -z;

  return [Math.atan2(sinLat, cosLat), Math.atan2(sinLonCosLat, cosLonCosLat)];
}
