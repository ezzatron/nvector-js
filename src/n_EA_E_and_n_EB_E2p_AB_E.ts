import { WGS_84 } from "./ellipsoid.js";
import type { Matrix3x3 } from "./matrix.js";
import { n_EB_E2p_EB_E } from "./n_EB_E2p_EB_E.js";
import { R_Ee_NP_Z } from "./rotation.js";
import type { Vector3 } from "./vector.js";

/**
 * From two positions A and B, finds the delta position.
 *
 * The calculation is exact, taking the ellipsity of the Earth into account. It
 * is also nonsingular as both n-vector and p-vector are nonsingular (except for
 * the center of the Earth). The default ellipsoid model used is WGS-84, but
 * other ellipsoids (or spheres) might be specified.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/n_EA_E_and_n_EB_E2p_AB_E.m
 *
 * @param n_EA_E - An n-vector of position A, decomposed in E.
 * @param n_EB_E - An n-vector of position B, decomposed in E.
 * @param z_EA - Depth of system A in meters, relative to the ellipsoid (z_EA =
 *   -height).
 * @param z_EB - Depth of system B in meters, relative to the ellipsoid (z_EB =
 *   -height).
 * @param a - Semi-major axis of the Earth ellipsoid in meters.
 * @param f - Flattening of the Earth ellipsoid.
 * @param R_Ee - Defines the axes of the coordinate frame E.
 *
 * @returns Position vector in meters from A to B, decomposed in E.
 */
export function n_EA_E_and_n_EB_E2p_AB_E(
  n_EA_E: Vector3,
  n_EB_E: Vector3,
  z_EA: number = 0,
  z_EB: number = 0,
  a: number = WGS_84.a,
  f: number = WGS_84.f,
  R_Ee: Matrix3x3 = R_Ee_NP_Z,
): Vector3 {
  // Function 1. in Section 5.4 in Gade (2010):
  const [p_EA_E_x, p_EA_E_y, p_EA_E_z] = n_EB_E2p_EB_E(
    n_EA_E,
    z_EA,
    a,
    f,
    R_Ee,
  );
  const [p_EB_E_x, p_EB_E_y, p_EB_E_z] = n_EB_E2p_EB_E(
    n_EB_E,
    z_EB,
    a,
    f,
    R_Ee,
  );

  return [p_EB_E_x - p_EA_E_x, p_EB_E_y - p_EA_E_y, p_EB_E_z - p_EA_E_z];
}
