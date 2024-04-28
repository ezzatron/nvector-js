import type { Matrix3x3 } from "./matrix.js";
import type { Vector3 } from "./vector.js";

export const ROTATION_MATRIX_e: Matrix3x3 = [
  [0, 0, 1.0],
  [0, 1.0, 0],
  [-1.0, 0, 0],
];

/**
 * Rotates a vector by a rotation matrix.
 *
 * @param r - A rotation matrix.
 * @param v - A vector to rotate.
 *
 * @returns The rotated vector.
 */
export function rotateVector3(r: Matrix3x3, [x, y, z]: Vector3): Vector3 {
  return [
    r[0][0] * x + r[0][1] * y + r[0][2] * z,
    r[1][0] * x + r[1][1] * y + r[1][2] * z,
    r[2][0] * x + r[2][1] * y + r[2][2] * z,
  ];
}

/**
 * Un-rotates a vector by a rotation matrix.
 *
 * @param r - A rotation matrix.
 * @param v - A vector to un-rotate.
 *
 * @returns The un-rotated vector.
 */
export function unrotateVector3(r: Matrix3x3, [x, y, z]: Vector3): Vector3 {
  return [
    r[0][0] * x + r[1][0] * y + r[2][0] * z,
    r[0][1] * x + r[1][1] * y + r[2][1] * z,
    r[0][2] * x + r[1][2] * y + r[2][2] * z,
  ];
}
