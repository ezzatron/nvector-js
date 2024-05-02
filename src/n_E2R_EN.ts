import type { Matrix3x3 } from "./matrix.js";
import { multiply, transpose } from "./matrix.js";
import { R_Ee_NP_Z, rotate } from "./rotation.js";
import type { Vector3 } from "./vector.js";

/**
 * Finds the rotation matrix R_EN from n-vector.
 *
 * @see https://github.com/FFI-no/n-vector/blob/82d749a67cc9f332f48c51aa969cdc277b4199f2/nvector/n_E2R_EN.m
 *
 * @param n_E - An n-vector decomposed in E.
 * @param R_Ee - Defines the axes of the coordinate frame E.
 *
 * @returns The resulting rotation matrix (direction cosine matrix).
 */
export function n_E2R_EN(n_E: Vector3, R_Ee: Matrix3x3 = R_Ee_NP_Z): Matrix3x3 {
  // R_Ee selects correct E-axes
  const [n_E_x, n_E_y, n_E_z] = rotate(R_Ee, n_E);

  // N coordinate frame (North-East-Down) is defined in Table 2 in Gade (2010)

  // R_EN is constructed by the following three column vectors: The x, y and z
  // basis vectors (axes) of N, each decomposed in E.

  // Find z-axis of N (Nz):
  // z-axis of N (down) points opposite to n-vector
  const Nz_E_x = -n_E_x;
  const Nz_E_y = -n_E_y;
  const Nz_E_z = -n_E_z;

  // Find y-axis of N (East)(remember that N is singular at Poles)
  // Equation (9) in Gade (2010):
  // Ny points perpendicular to the plane formed by n-vector and Earth's spin
  // axis
  const Ny_E_direction_y = -n_E_z;
  const Ny_E_direction_z = n_E_y;
  const Ny_E_direction_norm = Math.hypot(Ny_E_direction_y, Ny_E_direction_z);
  const on_poles = Math.hypot(Ny_E_direction_y, Ny_E_direction_z) === 0;
  // Ny_E_x is always 0, so it's factored out in the following equations
  const Ny_E_y = on_poles
    ? 1 // Pole position: selected y-axis direction
    : Ny_E_direction_y / Ny_E_direction_norm; // outside Poles:
  const Ny_E_z = on_poles
    ? 0 // Pole position: selected y-axis direction
    : Ny_E_direction_z / Ny_E_direction_norm; // outside Poles:

  // Find x-axis of N (North):
  // Final axis found by right hand rule
  const Nx_E_x = Ny_E_y * Nz_E_z - Ny_E_z * Nz_E_y;
  const Nx_E_y = Ny_E_z * Nz_E_x;
  const Nx_E_z = -Ny_E_y * Nz_E_x;

  // Form R_EN from the unit vectors:
  // R_Ee selects correct E-axes
  return multiply(transpose(R_Ee), [
    [Nx_E_x, 0, Nz_E_x],
    [Nx_E_y, Ny_E_y, Nz_E_y],
    [Nx_E_z, Ny_E_z, Nz_E_z],
  ]);
}
