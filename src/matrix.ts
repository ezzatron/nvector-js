/**
 * A 3x3 matrix.
 */
export type Matrix = [
  [n11: number, n12: number, n13: number],
  [n21: number, n22: number, n23: number],
  [n31: number, n32: number, n33: number],
];

/**
 * Multiplies two matrices.
 *
 * @param a - The first matrix.
 * @param b - The second matrix.
 *
 * @returns The resulting matrix.
 */
export function multiply(
  [[a11, a12, a13], [a21, a22, a23], [a31, a32, a33]]: Matrix,
  [[b11, b12, b13], [b21, b22, b23], [b31, b32, b33]]: Matrix,
): Matrix {
  return [
    [
      a11 * b11 + a12 * b21 + a13 * b31,
      a11 * b12 + a12 * b22 + a13 * b32,
      a11 * b13 + a12 * b23 + a13 * b33,
    ],
    [
      a21 * b11 + a22 * b21 + a23 * b31,
      a21 * b12 + a22 * b22 + a23 * b32,
      a21 * b13 + a22 * b23 + a23 * b33,
    ],
    [
      a31 * b11 + a32 * b21 + a33 * b31,
      a31 * b12 + a32 * b22 + a33 * b32,
      a31 * b13 + a32 * b23 + a33 * b33,
    ],
  ];
}

/**
 * Transposes a matrix.
 *
 * @param m - A matrix.
 *
 * @returns The transposed matrix.
 */
export function transpose([
  [a11, a12, a13],
  [a21, a22, a23],
  [a31, a32, a33],
]: Matrix): Matrix {
  return [
    [a11, a21, a31],
    [a12, a22, a32],
    [a13, a23, a33],
  ];
}
