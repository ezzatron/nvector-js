import { WGS_84 } from "./ellipsoid.js";
import type { Matrix3x3 } from "./matrix.js";
import { n_EB_E2p_EB_E } from "./n_EB_E2p_EB_E.js";
import { p_EB_E2n_EB_E } from "./p_EB_E2n_EB_E.js";
import { ROTATION_MATRIX_e } from "./rotation.js";
import type { Vector3 } from "./vector.js";

/**
 * Calculates position B from position A and a delta vector decomposed in E.
 *
 * @param n_EA_E - An n-vector of position A, decomposed in E.
 * @param p_AB_E - A Cartesian position vector in meters from A to B, decomposed in E.
 * @param z_EA - The depth in meters of system A, relative to the ellipsoid.
 * @param a - The semi-major axis of the Earth ellipsoid given in meters.
 * @param f - The flattening of the Earth ellipsoid.
 * @param R_Ee - A rotation matrix defining the axes of the coordinate frame E.
 *
 * @returns An n-vector of position B, decomposed in E, and the depth in meters of system B, relative to the ellipsoid.
 */
export function n_EA_E_and_p_AB_E2n_EB_E(
  n_EA_E: Vector3,
  p_AB_E: Vector3,
  z_EA: number = 0,
  a: number = WGS_84.a,
  f: number = WGS_84.f,
  R_Ee: Matrix3x3 = ROTATION_MATRIX_e,
): [n_EB_E: Vector3, z_EB: number] {
  // Based on https://github.com/pbrod/nvector/blob/b8afd89a860a4958d499789607aacb4168dcef87/src/nvector/core.py#L399
  const [p_EA_E_x, p_EA_E_y, p_EA_E_z] = n_EB_E2p_EB_E(
    n_EA_E,
    z_EA,
    a,
    f,
    R_Ee,
  );
  const p_EB_E: Vector3 = [
    p_EA_E_x + p_AB_E[0],
    p_EA_E_y + p_AB_E[1],
    p_EA_E_z + p_AB_E[2],
  ];

  return p_EB_E2n_EB_E(p_EB_E, a, f, R_Ee);
}
