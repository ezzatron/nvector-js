import { WGS_84 } from "./ellipsoid.js";
import type { Matrix3x3 } from "./matrix.js";
import { ROTATION_MATRIX_e, rotate, unrotate } from "./rotation.js";
import type { Vector3 } from "./vector.js";

/**
 * Converts Cartesian position vector in meters to n-vector
 *
 * Defaults to the WGS-84 ellipsoid. If `f` is `0`, then spherical Earth with
 * radius `a` is used instead of WGS-84.
 *
 * @param p_EB_E - Cartesian position vector from E to B, decomposed in E
 * @param a - Semi-major axis of the Earth ellipsoid given in meters
 * @param f - Flattening of the Earth ellipsoid
 * @param R_Ee - Rotation matrix defining the axes of the coordinate frame E
 *
 * @returns n-vector of position B, decomposed in E, and depth in meters of system B, relative to the ellipsoid
 */
export function p_EB_E2n_EB_E(
  p_EB_E: Vector3,
  a: number = WGS_84.a,
  f: number = WGS_84.f,
  R_Ee: Matrix3x3 = ROTATION_MATRIX_e,
): [n_EB_E: Vector3, depth: number] {
  // based on https://github.com/pbrod/nvector/blob/b8afd89a860a4958d499789607aacb4168dcef87/src/nvector/core.py#L212
  const p_EB_e = rotate(R_Ee, p_EB_E);

  // equation (23) from Gade (2010)
  const Ryz_2 = p_EB_e[1] ** 2 + p_EB_e[2] ** 2;
  const Rx_2 = p_EB_e[0] ** 2;
  const e_2 = (2.0 - f) * f;
  const q = ((1 - e_2) / a ** 2) * Rx_2;
  const Ryz = Math.sqrt(Ryz_2);
  const p = Ryz_2 / a ** 2;
  const r = (p + q - e_2 ** 2) / 6;
  const s = (e_2 ** 2 * p * q) / (4 * r ** 3);
  const t = Math.cbrt(1 + s + Math.sqrt(s * (2 + s)));
  const u = r * (1 + t + 1.0 / t);
  const v = Math.sqrt(u ** 2 + e_2 ** 2 * q);
  const w = (e_2 * (u + v - q)) / (2 * v);
  const k = Math.sqrt(u + v + w ** 2) - w;
  const d = (k * Ryz) / (k + e_2);
  const temp0 = Math.sqrt(d ** 2 + Rx_2);
  const height = ((k + e_2 - 1) / k) * temp0;
  const x_scale = 1.0 / temp0;
  const yz_scale = (x_scale * k) / (k + e_2);
  const depth = -height;

  const n_EB_e: Vector3 = [
    x_scale * p_EB_e[0],
    yz_scale * p_EB_e[1],
    yz_scale * p_EB_e[2],
  ];

  const [x, y, z] = unrotate(R_Ee, n_EB_e);

  // ensure unit length
  const norm = Math.hypot(x, y, z);
  const n_EB_E: Vector3 = [x / norm, y / norm, z / norm];

  return [n_EB_E, depth];
}
