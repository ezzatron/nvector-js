import { WGS_84 } from "./ellipsoid.js";
import type { Matrix3x3 } from "./matrix.js";
import { ROTATION_MATRIX_e, rotate, unrotate } from "./rotation.js";
import type { Vector3 } from "./vector.js";

/**
 * Converts an n-vector to a Cartesian position vector.
 *
 * Defaults to the WGS-84 ellipsoid. If `f` is `0`, then spherical Earth with
 * radius `a` is used instead of WGS-84.
 *
 * @param n_EB_E - An n-vector of position B, decomposed in E.
 * @param depth - The depth in meters of system B, relative to the ellipsoid.
 * @param a - The semi-major axis of the Earth ellipsoid given in meters.
 * @param f - The flattening of the Earth ellipsoid.
 * @param R_Ee - A rotation matrix defining the axes of the coordinate frame E.
 *
 * @returns A Cartesian position vector in meters from E to B, decomposed in E.
 */
export function n_EB_E2p_EB_E(
  n_EB_E: Vector3,
  depth: number = 0,
  a: number = WGS_84.a,
  f: number = WGS_84.f,
  R_Ee: Matrix3x3 = ROTATION_MATRIX_e,
): Vector3 {
  // Based on https://github.com/pbrod/nvector/blob/b8afd89a860a4958d499789607aacb4168dcef87/src/nvector/core.py#L108
  const [x, y, z] = rotate(R_Ee, n_EB_E);

  // Semi-minor axis
  const b = a * (1 - f);

  // Scale vector
  const sx = 1;
  const sy = 1 - f;
  const sz = 1 - f;

  // denominator = normalize(n_EB_e (vector) / scale (vector))
  const denominator = Math.sqrt((x / sx) ** 2 + (y / sy) ** 2 + (z / sz) ** 2);

  // p_EL_e = b (scalar) / denominator (scalar) * n_EB_e (vector) / scale (vector) ** 2
  const p_EL_e_ratio = b / denominator;
  const p_EL_e_x = p_EL_e_ratio * (x / sx ** 2);
  const p_EL_e_y = p_EL_e_ratio * (y / sy ** 2);
  const p_EL_e_z = p_EL_e_ratio * (z / sz ** 2);

  // p_EL_e (vector) - n_EB_e (vector) * depth (scalar)
  // Guessing a name of p_EB_e (lowercase) is appropriate
  // This is an unnamed expression in the original code
  const p_EB_e: Vector3 = [
    p_EL_e_x - x * depth,
    p_EL_e_y - y * depth,
    p_EL_e_z - z * depth,
  ];

  return unrotate(R_Ee, p_EB_e);
}
