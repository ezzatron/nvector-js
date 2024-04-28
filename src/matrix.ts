export type Matrix3x3 = [
  [n00: number, n01: number, n02: number],
  [n10: number, n11: number, n12: number],
  [n20: number, n21: number, n22: number],
];

export function multiplyTransposed(a: Matrix3x3, b: Matrix3x3): Matrix3x3 {
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
