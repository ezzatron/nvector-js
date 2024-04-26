import type { Matrix3x3 } from "./matrix.js";
import { ROTATION_MATRIX_e } from "./rotation.js";
import type { Vector3 } from "./vector.js";

export function n_E2lat_lon(
  n_E: Vector3,
  R_Ee: Matrix3x3 = ROTATION_MATRIX_e,
): [latitude: number, longitude: number] {
  // based on https://github.com/pbrod/nvector/blob/b8afd89a860a4958d499789607aacb4168dcef87/src/nvector/rotation.py#L406
  const [x, y, z] = n_E;
  const [[n00, n01, n02], [n10, n11, n12], [n20, n21, n22]] = R_Ee;

  // flattened multiply(R_Ee, [x, y, z])
  const rx = n00 * x + n01 * y + n02 * z;
  const ry = n10 * x + n11 * y + n12 * z;
  const rz = n20 * x + n21 * y + n22 * z;

  const sinLat = rx;
  const cosLat = Math.sqrt(ry ** 2 + rz ** 2);
  const sinLonCosLat = ry;
  const cosLonCosLat = -rz;

  return [Math.atan2(sinLat, cosLat), Math.atan2(sinLonCosLat, cosLonCosLat)];
}
