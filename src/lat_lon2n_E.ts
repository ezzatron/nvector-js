import type { Matrix3x3 } from "./matrix.js";
import { ROTATION_MATRIX_e, unrotate } from "./rotation.js";
import type { Vector3 } from "./vector.js";

/**
 * Converts a latitude and longitude to an n-vector.
 *
 * @param latitude - A latitude in radians.
 * @param longitude - A longitude in radians.
 * @param R_Ee - A rotation matrix defining the axes of the coordinate frame E.
 *
 * @returns An n-vector decomposed in E.
 */
export function lat_lon2n_E(
  latitude: number,
  longitude: number,
  R_Ee: Matrix3x3 = ROTATION_MATRIX_e,
): Vector3 {
  // Based on https://github.com/pbrod/nvector/blob/b8afd89a860a4958d499789607aacb4168dcef87/src/nvector/core.py#L53
  const sinLat = Math.sin(latitude);
  const cosLat = Math.cos(latitude);
  const sinLon = Math.sin(longitude);
  const cosLon = Math.cos(longitude);

  const x = sinLat;
  const y = cosLat * sinLon;
  const z = -cosLat * cosLon;

  return unrotate(R_Ee, [x, y, z]);
}
