import type { Matrix3x3 } from "./matrix.js";
import { rotate } from "./rotation.js";
import type { Vector3 } from "./vector.js";

/**
 * Finds n-vector from R_EN.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/R_EN2n_E.m
 *
 * @param R_EN - Rotation matrix (direction cosine matrix).
 *
 * @returns An n-vector decomposed in E.
 */
export function R_EN2n_E(R_EN: Matrix3x3): Vector3 {
  return rotate(R_EN, [0, 0, -1]);
}
