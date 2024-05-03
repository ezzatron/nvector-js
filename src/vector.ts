/**
 * A 3D vector.
 */
export type Vector3 = [x: number, y: number, z: number];

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
  ...v: { [Property in keyof N]: Vector3 }
): Vector3 {
  const result: Vector3 = [0, 0, 0];

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
export function cross(a: Vector3, b: Vector3): Vector3 {
  const [a1, a2, a3] = a;
  const [b1, b2, b3] = b;

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
export function dot(a: Vector3, b: Vector3): number {
  const [a1, a2, a3] = a;
  const [b1, b2, b3] = b;

  return a1 * b1 + a2 * b2 + a3 * b3;
}

/**
 * Finds the Euclidean norm of a vector.
 *
 * @param v - The vector.
 *
 * @returns The Euclidean norm.
 */
export function norm(v: Vector3): number {
  return Math.hypot(...v);
}
