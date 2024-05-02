import { WGS_84 } from "./ellipsoid.js";
import type { Matrix3x3 } from "./matrix.js";
import { transpose } from "./matrix.js";
import { R_Ee_NP_Z, rotate } from "./rotation.js";
import type { Vector3 } from "./vector.js";

/**
 * Converts n-vector to Cartesian position vector in meters.
 *
 * The position of B (typically body) relative to E (typically Earth) is given
 * into this function as n-vector, n_EB_E. The function converts to cartesian
 * position vector ("ECEF-vector"), p_EB_E, in meters.
 *
 * The calculation is exact, taking the ellipsity of the Earth into account. It
 * is also nonsingular as both n-vector and p-vector are nonsingular (except for
 * the center of the Earth). The default ellipsoid model used is WGS-84, but
 * other ellipsoids (or spheres) might be specified.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/n_EB_E2p_EB_E.m
 *
 * @param n_EB_E - An n-vector of position B, decomposed in E.
 * @param z_EB - Depth of system B in meters, relative to the ellipsoid (z_EB =
 *   -height).
 * @param a - Semi-major axis of the Earth ellipsoid in meters.
 * @param f - Flattening of the Earth ellipsoid.
 * @param R_Ee - Defines the axes of the coordinate frame E.
 *
 * @returns Cartesian position vector in meters from E to B, decomposed in E.
 */
export function n_EB_E2p_EB_E(
  n_EB_E: Vector3,
  z_EB: number = 0,
  a: number = WGS_84.a,
  f: number = WGS_84.f,
  R_Ee: Matrix3x3 = R_Ee_NP_Z,
): Vector3 {
  // R_Ee selects correct E-axes
  const [x, y, z] = rotate(R_Ee, n_EB_E);

  // semi-minor axis:
  const b = a * (1 - f);

  // The following code implements equation (22) in Gade (2010):

  const denominator = Math.hypot(x, y / (1 - f), z / (1 - f));

  // We first calculate the position at the origin of coordinate system L, which
  // has the same n-vector as B (n_EL_E = n_EB_E), but lies at the surface of
  // the Earth (z_EL = 0).

  const p_EL_E_x = (b / denominator) * x;
  const p_EL_E_y = (b / denominator) * (y / (1 - f) ** 2);
  const p_EL_E_z = (b / denominator) * (z / (1 - f) ** 2);

  return rotate(transpose(R_Ee), [
    p_EL_E_x - x * z_EB,
    p_EL_E_y - y * z_EB,
    p_EL_E_z - z * z_EB,
  ]);
}
