export type Vector3 = [x: number, y: number, z: number];

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

/**
 * Subtracts two vectors.
 *
 * @param a - The first vector.
 * @param b - The second vector.
 *
 * @returns The resulting vector.
 */
export function sub(a: Vector3, b: Vector3): Vector3 {
  const [a1, a2, a3] = a;
  const [b1, b2, b3] = b;

  return [a1 - b1, a2 - b2, a3 - b3];
}
