export type Matrix3x3 = [
  [n00: number, n01: number, n02: number],
  [n10: number, n11: number, n12: number],
  [n20: number, n21: number, n22: number],
];

/**
 * Multiplies two 3x3 matrices.
 *
 * @param a - The first matrix.
 * @param b - The second matrix.
 *
 * @returns The resulting matrix.
 */
export function multiply(a: Matrix3x3, b: Matrix3x3): Matrix3x3 {
  const [[a11, a12, a13], [a21, a22, a23], [a31, a32, a33]] = a;
  const [[b11, b12, b13], [b21, b22, b23], [b31, b32, b33]] = b;

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
 * Transposes a 3x3 matrix.
 *
 * @param a - The matrix to transpose.
 *
 * @returns The transposed matrix.
 */
export function transpose(a: Matrix3x3): Matrix3x3 {
  const [[a11, a12, a13], [a21, a22, a23], [a31, a32, a33]] = a;

  return [
    [a11, a21, a31],
    [a12, a22, a32],
    [a13, a23, a33],
  ];
}
