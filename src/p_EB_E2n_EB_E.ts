import { WGS_84 } from "./ellipsoid.js";
import type { Matrix3x3 } from "./matrix.js";
import { transpose } from "./matrix.js";
import { R_Ee_NP_Z, rotate } from "./rotation.js";
import { unit } from "./unit.js";
import type { Vector3 } from "./vector.js";

/**
 * Converts Cartesian position vector in meters to n-vector.
 *
 * The position of B (typically body) relative to E (typically Earth) is given
 * into this function as cartesian position vector p_EB_E, in meters
 * ("ECEF-vector"). The function converts to n-vector, n_EB_E and its depth,
 * z_EB.
 *
 * The calculation is exact, taking the ellipsity of the Earth into account. It
 * is also nonsingular as both n-vector and p-vector are nonsingular (except for
 * the center of the Earth). The default ellipsoid model used is WGS-84, but
 * other ellipsoids (or spheres) might be specified.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/p_EB_E2n_EB_E.m
 *
 * @param p_EB_E - Cartesian position vector in meters from E to B, decomposed
 *   in E.
 * @param a - Semi-major axis of the Earth ellipsoid in meters.
 * @param f - Flattening of the Earth ellipsoid.
 * @param R_Ee - Defines the axes of the coordinate frame E.
 *
 * @returns Representation of position B, decomposed in E, and depth in meters
 *   of system B relative to the ellipsoid.
 */
export function p_EB_E2n_EB_E(
  p_EB_E: Vector3,
  a: number = WGS_84.a,
  f: number = WGS_84.f,
  R_Ee: Matrix3x3 = R_Ee_NP_Z,
): [n_EB_E: Vector3, depth: number] {
  // R_Ee selects correct E-axes
  const [p_EB_E_x, p_EB_E_y, p_EB_E_z] = rotate(R_Ee, p_EB_E);

  // e_2 = eccentricity^2
  const e_2 = 2 * f - f ** 2;

  // The following code implements equation (23) from Gade (2010):

  const R_2 = p_EB_E_y ** 2 + p_EB_E_z ** 2;
  // R = component of p_EB_E in the equatorial plane
  const R = Math.sqrt(R_2);

  const p_EB_E_x_2 = p_EB_E_x ** 2;

  const p = R_2 / a ** 2;
  const q = ((1 - e_2) / a ** 2) * p_EB_E_x_2;
  const r = (p + q - e_2 ** 2) / 6;

  const s = (e_2 ** 2 * p * q) / (4 * r ** 3);
  const t = Math.cbrt(1 + s + Math.sqrt(s * (2 + s)));
  const u = r * (1 + t + 1 / t);
  const v = Math.sqrt(u ** 2 + e_2 ** 2 * q);

  const w = (e_2 * (u + v - q)) / (2 * v);
  const k = Math.sqrt(u + v + w ** 2) - w;
  const d = (k * R) / (k + e_2);

  // Calculate height:
  const height_factor = Math.sqrt(d ** 2 + p_EB_E_x_2);
  const height = ((k + e_2 - 1) / k) * height_factor;

  const temp = 1 / height_factor;

  const n_EB_E_x = temp * p_EB_E_x;
  const n_EB_E_y = ((temp * k) / (k + e_2)) * p_EB_E_y;
  const n_EB_E_z = ((temp * k) / (k + e_2)) * p_EB_E_z;

  const n_EB_E: Vector3 = [n_EB_E_x, n_EB_E_y, n_EB_E_z];

  return [
    // Ensure unit length:
    unit(rotate(transpose(R_Ee), n_EB_E)),
    -height,
  ];
}
