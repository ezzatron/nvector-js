import { multiplyTransposed, type Matrix3x3 } from "./matrix.js";
import { ROTATION_MATRIX_e, rotate } from "./rotation.js";
import type { Vector3 } from "./vector.js";

/**
 * Calculates the rotation matrix R_EN from an n-vector.
 *
 * @param n_E - An n-vector decomposed in E.
 * @param R_Ee - A rotation matrix defining the axes of the coordinate frame E.
 *
 * @returns The resulting rotation matrix.
 */
export function n_E2R_EN(
  n_E: Vector3,
  R_Ee: Matrix3x3 = ROTATION_MATRIX_e,
): Matrix3x3 {
  // Based on https://github.com/pbrod/nvector/blob/b8afd89a860a4958d499789607aacb4168dcef87/src/nvector/rotation.py#L478
  const [n_e_x, n_e_y, n_e_z] = rotate(R_Ee, n_E);

  // The z-axis of N (down) points opposite to n-vector
  const Nz_e_x = -n_e_x;
  const Nz_e_y = -n_e_y;
  const Nz_e_z = -n_e_z;

  // Find y-axis of N (East)
  // Remember that N is singular at poles
  // Ny points perpendicular to the plane formed by n-vector and Earth's spin
  // axis
  const Ny_e_direction_y = -n_e_z;
  const Ny_e_direction_z = n_e_y;
  const Ny_e_direction_norm = Math.hypot(Ny_e_direction_y, Ny_e_direction_z);
  const on_poles = Math.hypot(Ny_e_direction_y, Ny_e_direction_z) === 0;
  // Ny_e_x is always 0, so it's factored out in the following equations
  const Ny_e_y = on_poles ? 1 : Ny_e_direction_y / Ny_e_direction_norm;
  const Ny_e_z = on_poles ? 0 : Ny_e_direction_z / Ny_e_direction_norm;

  // Find x-axis of N (North)
  const Nx_e_x = Ny_e_y * Nz_e_z - Ny_e_z * Nz_e_y;
  const Nx_e_y = Ny_e_z * Nz_e_x;
  const Nx_e_z = -Ny_e_y * Nz_e_x;

  // Use each component as a column vector, then multiply by the transpose of
  // R_Ee to get the rotation matrix R_EN
  return multiplyTransposed(R_Ee, [
    [Nx_e_x, 0, Nz_e_x],
    [Nx_e_y, Ny_e_y, Nz_e_y],
    [Nx_e_z, Ny_e_z, Nz_e_z],
  ]);
}
