import type { Matrix3x3 } from "./matrix.js";
import { transpose } from "./matrix.js";
import { R_Ee_NP_Z, rotate } from "./rotation.js";
import type { Vector3 } from "./vector.js";

/**
 * Converts latitude and longitude to n-vector.
 *
 * @see https://github.com/FFI-no/n-vector/blob/82d749a67cc9f332f48c51aa969cdc277b4199f2/nvector/lat_long2n_E.m
 *
 * @param latitude - Geodetic latitude in radians.
 * @param longitude - Geodetic longitude in radians.
 * @param R_Ee - Defines the axes of the coordinate frame E.
 *
 * @returns An n-vector decomposed in E.
 */
export function lat_long2n_E(
  latitude: number,
  longitude: number,
  R_Ee: Matrix3x3 = R_Ee_NP_Z,
): Vector3 {
  // Equation (3) from Gade (2010):
  const cosLat = Math.cos(latitude);

  // R_Ee selects correct E-axes
  return rotate(transpose(R_Ee), [
    Math.sin(latitude),
    Math.sin(longitude) * cosLat,
    -Math.cos(longitude) * cosLat,
  ]);
}
