import type { Matrix3x3 } from "./matrix.js";
import { multiply, transpose } from "./matrix.js";
import { n_E2lat_long } from "./n_E2lat_long.js";
import { R_Ee_NP_Z } from "./rotation.js";
import type { Vector3 } from "./vector.js";
import { xyz2R } from "./xyz2R.js";

/**
 * Finds R_EL from n-vector and wander azimuth angle.
 *
 * When wander_azimuth = 0, we have that N = L (See Table 2 in Gade (2010) for
 * details)
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/n_E_and_wa2R_EL.m
 *
 * @param n_E - An n-vector decomposed in E.
 * @param wander_azimuth - The angle in radians between L's x-axis and north,
 *   pos about L's z-axis
 * @param R_Ee - Defines the axes of the coordinate frame E.
 *
 * @returns The resulting rotation matrix.
 */
export function n_E_and_wa2R_EL(
  n_E: Vector3,
  wander_azimuth: number,
  R_Ee: Matrix3x3 = R_Ee_NP_Z,
): Matrix3x3 {
  const [latitude, longitude] = n_E2lat_long(n_E, R_Ee);

  // Longitude, -latitude, and wander azimuth are the x-y-z Euler angles (about
  // new axes) for R_EL. See also the second paragraph of Section 5.2 in Gade
  // (2010):

  // R_Ee selects correct E-axes
  return multiply(transpose(R_Ee), xyz2R(longitude, -latitude, wander_azimuth));
}
