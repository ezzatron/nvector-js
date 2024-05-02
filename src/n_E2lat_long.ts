import type { Matrix3x3 } from "./matrix.js";
import { R_Ee_NP_Z, rotate } from "./rotation.js";
import type { Vector3 } from "./vector.js";

/**
 * Converts n-vector to latitude and longitude.
 *
 * @see https://github.com/FFI-no/n-vector/blob/82d749a67cc9f332f48c51aa969cdc277b4199f2/nvector/n_E2lat_long.m
 *
 * @param n_E - An n-vector decomposed in E.
 * @param R_Ee - Defines the axes of the coordinate frame E.
 *
 * @returns Geodetic latitude and longitude in radians.
 */
export function n_E2lat_long(
  n_E: Vector3,
  R_Ee: Matrix3x3 = R_Ee_NP_Z,
): [latitude: number, longitude: number] {
  // Equation (5) in Gade (2010):
  const [x, y, z] = rotate(R_Ee, n_E);
  const longitude = Math.atan2(y, -z);

  // Equation (6) in Gade (2010) (Robust numerical solution)
  // vector component in the equatorial plane
  const equatorial_component = Math.hypot(y, z);
  // atan() could also be used since latitude is within [-pi/2,pi/2]
  const latitude = Math.atan2(x, equatorial_component);

  // latitude = asin(n_E(1)) is a theoretical solution, but close to the Poles
  // it is ill-conditioned which may lead to numerical inaccuracies (and it will
  // give imaginary results for norm(n_E)>1)

  return [latitude, longitude];
}
