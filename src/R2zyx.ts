import { R2xyz } from "./R2xyz.js";
import { transpose, type Matrix3x3 } from "./matrix.js";
import type { Vector3 } from "./vector.js";

/**
 * Calculates the Euler angles in the zxy-order from a rotation matrix.
 *
 * @param R_AB - A rotation matrix.
 *
 * @returns The angles of rotation about the new axes.
 */
export function R2zyx(R_AB: Matrix3x3): Vector3 {
  // Based on https://github.com/pbrod/nvector/blob/b8afd89a860a4958d499789607aacb4168dcef87/src/nvector/rotation.py#L152
  const [x, y, z] = R2xyz(transpose(R_AB));

  return [-z, -y, -x];
}
