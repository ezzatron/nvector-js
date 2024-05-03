import type { Matrix3x3 } from "./matrix.js";
import { rotate } from "./rotation.js";
import type { Vector3 } from "./vector.js";

/**
 * Finds n-vector from R_EN.
 *
 * @param R_EN - Rotation matrix (direction cosine matrix).
 *
 * @returns An n-vector decomposed in E.
 */
export function R_EN2n_E(R_EN: Matrix3x3): Vector3 {
  return rotate(R_EN, [0, 0, -1]);
}
