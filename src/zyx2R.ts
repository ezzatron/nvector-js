import type { Matrix3x3 } from "./matrix.js";

/**
 * Calculates a rotation matrix from Euler angles in the zyx-order.
 *
 * @param z - The angle in radians of rotation about the new z-axis.
 * @param y - The angle in radians of rotation about the new y-axis.
 * @param x - The angle in radians of rotation about the new x-axis.
 *
 * @returns The rotation matrix.
 */
export function zyx2R(z: number, y: number, x: number): Matrix3x3 {
  // Based on https://github.com/pbrod/nvector/blob/b8afd89a860a4958d499789607aacb4168dcef87/src/nvector/rotation.py#L329
  const sinX = Math.sin(x);
  const sinY = Math.sin(y);
  const sinZ = Math.sin(z);
  const cosX = Math.cos(x);
  const cosY = Math.cos(y);
  const cosZ = Math.cos(z);

  return [
    [
      cosZ * cosY,
      -sinZ * cosX + cosZ * sinY * sinX,
      sinZ * sinX + cosZ * sinY * cosX,
    ],
    [
      sinZ * cosY,
      cosZ * cosX + sinZ * sinY * sinX,
      -cosZ * sinX + sinZ * sinY * cosX,
    ],
    [-sinY, cosY * sinX, cosY * cosX],
  ];
}
