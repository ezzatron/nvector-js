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
export function multiplyMatrix3x3(a: Matrix3x3, b: Matrix3x3): Matrix3x3 {
  const [[a00, a01, a02], [a10, a11, a12], [a20, a21, a22]] = a;
  const [[b00, b01, b02], [b10, b11, b12], [b20, b21, b22]] = b;

  return [
    [
      a00 * b00 + a01 * b10 + a02 * b20,
      a00 * b01 + a01 * b11 + a02 * b21,
      a00 * b02 + a01 * b12 + a02 * b22,
    ],
    [
      a10 * b00 + a11 * b10 + a12 * b20,
      a10 * b01 + a11 * b11 + a12 * b21,
      a10 * b02 + a11 * b12 + a12 * b22,
    ],
    [
      a20 * b00 + a21 * b10 + a22 * b20,
      a20 * b01 + a21 * b11 + a22 * b21,
      a20 * b02 + a21 * b12 + a22 * b22,
    ],
  ];
}

export function multiplyTransposedMatrix3x3(
  a: Matrix3x3,
  b: Matrix3x3,
): Matrix3x3 {
  const [[a00, a01, a02], [a10, a11, a12], [a20, a21, a22]] = a;
  const [[b00, b01, b02], [b10, b11, b12], [b20, b21, b22]] = b;

  return [
    [
      a00 * b00 + a10 * b10 + a20 * b20,
      a00 * b01 + a10 * b11 + a20 * b21,
      a00 * b02 + a10 * b12 + a20 * b22,
    ],
    [
      a01 * b00 + a11 * b10 + a21 * b20,
      a01 * b01 + a11 * b11 + a21 * b21,
      a01 * b02 + a11 * b12 + a21 * b22,
    ],
    [
      a02 * b00 + a12 * b10 + a22 * b20,
      a02 * b01 + a12 * b11 + a22 * b21,
      a02 * b02 + a12 * b12 + a22 * b22,
    ],
  ];
}

export function transpose(a: Matrix3x3): Matrix3x3 {
  const [[a00, a01, a02], [a10, a11, a12], [a20, a21, a22]] = a;

  return [
    [a00, a10, a20],
    [a01, a11, a21],
    [a02, a12, a22],
  ];
}
