import type { Matrix } from "./matrix.js";

/**
 * A 3D vector.
 */
export type Vector = [x: number, y: number, z: number];

/**
 * Creates a new vector by applying a function component-wise to the components
 * of one or more input vectors.
 *
 * @example Find the sum of two vectors
 * ```typescript
 * apply((a, b) => a + b, [1, 2, 3], [4, 5, 6]); // [5, 7, 9]
 * ```
 *
 * @example Scale a vector by a scalar
 * ```typescript
 * apply((i) => i * 2, [1, 2, 3]); // [2, 4, 6]
 * ```
 *
 * @example Interpolate between two vectors
 * ```typescript
 * apply((a, b) => a + (b - a) / 2, [1, 2, 3], [4, 5, 6]); // [2.5, 3.5, 4.5]
 * ```
 *
 * @param fn - The function to apply to each component.
 * @param v - The vectors.
 *
 * @returns The resulting vector.
 */
export function apply<N extends number[]>(
  fn: (...n: N) => number,
  ...v: { [Property in keyof N]: Vector }
): Vector {
  const result: Vector = [0, 0, 0];

  for (let i = 0; i < 3; ++i) {
    const n: number[] = [];
    for (let j = 0; j < v.length; ++j) n[j] = v[j][i];

    result[i] = fn(...(n as N));
  }

  return result;
}

/**
 * Finds the cross product of two vectors.
 *
 * @param a - The first vector.
 * @param b - The second vector.
 *
 * @returns The resulting vector.
 */
export function cross([a1, a2, a3]: Vector, [b1, b2, b3]: Vector): Vector {
  return [a2 * b3 - a3 * b2, a3 * b1 - a1 * b3, a1 * b2 - a2 * b1];
}

/**
 * Finds the dot product of two vectors.
 *
 * @param a - The first vector.
 * @param b - The second vector.
 *
 * @returns The resulting scalar.
 */
export function dot([a1, a2, a3]: Vector, [b1, b2, b3]: Vector): number {
  return a1 * b1 + a2 * b2 + a3 * b3;
}

/**
 * Finds the Euclidean norm of a vector.
 *
 * @param v - The vector.
 *
 * @returns The Euclidean norm.
 */
export function norm(v: Vector): number {
  return Math.hypot(...v);
}

/**
 * Finds a vector in the same direction as v but with norm 1.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/unit.m
 *
 * @param v - A vector.
 *
 * @returns A normalized vector.
 */
export function normalize([x, y, z]: Vector): Vector {
  const norm = Math.hypot(x, y, z);

  // If the vector has norm == 0, i.e. all elements in the vector are zero, the
  // unit vector [1 0 0]' is returned.
  return norm === 0 ? [1, 0, 0] : [x / norm, y / norm, z / norm];
}

/**
 * Transforms a vector by a matrix.
 *
 * @param r - A transformation matrix.
 * @param v - A vector.
 *
 * @returns The transformed vector.
 */
export function transform(
  [[r11, r12, r13], [r21, r22, r23], [r31, r32, r33]]: Matrix,
  [x, y, z]: Vector,
): Vector {
  return [
    r11 * x + r12 * y + r13 * z,
    r21 * x + r22 * y + r23 * z,
    r31 * x + r32 * y + r33 * z,
  ];
}
