import type { Matrix3x3 } from "./matrix.js";
import { ROTATION_MATRIX_e } from "./rotation.js";
import type { Vector3 } from "./vector.js";

/**
 * Converts n-vector to latitude and longitude
 *
 * @param n_E - n-vector decomposed in E
 * @param R_Ee - Rotation matrix defining the axes of the coordinate frame E
 *
 * @returns Geodetic latitude and longitude given in radians
 */
export function n_E2lat_lon(
  n_E: Vector3,
  R_Ee: Matrix3x3 = ROTATION_MATRIX_e,
): [latitude: number, longitude: number] {
  // based on https://github.com/pbrod/nvector/blob/b8afd89a860a4958d499789607aacb4168dcef87/src/nvector/rotation.py#L406
  const [x, y, z] = n_E;
  const [[r00, r01, r02], [r10, r11, r12], [r20, r21, r22]] = R_Ee;

  // flattened multiply(R_Ee, n_E)
  const rx = r00 * x + r01 * y + r02 * z;
  const ry = r10 * x + r11 * y + r12 * z;
  const rz = r20 * x + r21 * y + r22 * z;

  const sinLat = rx;
  const cosLat = Math.sqrt(ry ** 2 + rz ** 2);
  const sinLonCosLat = ry;
  const cosLonCosLat = -rz;

  return [Math.atan2(sinLat, cosLat), Math.atan2(sinLonCosLat, cosLonCosLat)];
}
