import type { Matrix3x3 } from "./matrix.js";
import { rotate } from "./rotation.js";
import type { Vector3 } from "./vector.js";

/**
 * Finds n-vector from R_EL.
 *
 * @param R_EL - Rotation matrix (direction cosine matrix).
 *
 * @returns An n-vector decomposed in E.
 */
export function R_EL2n_E(R_EL: Matrix3x3): Vector3 {
  return rotate(R_EL, [0, 0, -1]);
}
