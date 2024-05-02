import type { Vector3 } from "./vector.js";

/**
 * Makes input vector unit length, i.e. norm == 1.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/unit.m
 *
 * @param v - A vector.
 *
 * @returns A unit vector.
 */
export function unit(v: Vector3): Vector3 {
  const [x, y, z] = v;
  const current_norm = Math.hypot(x, y, z);

  // If the vector has norm == 0, i.e. all elements in the vector are zero, the
  // unit vector [1 0 0]' is returned.
  if (current_norm === 0) return [1, 0, 0];

  return [x / current_norm, y / current_norm, z / current_norm];
}
