import type { Matrix3x3 } from "./matrix.js";

/**
 * Calculates a rotation matrix from Euler angles in the xyz-order.
 *
 * @param x - The angle in radians of rotation about the new x-axis.
 * @param y - The angle in radians of rotation about the new y-axis.
 * @param z - The angle in radians of rotation about the new z-axis.
 *
 * @returns The rotation matrix.
 */
export function xyz2R(x: number, y: number, z: number): Matrix3x3 {
  // Based on https://github.com/pbrod/nvector/blob/b8afd89a860a4958d499789607aacb4168dcef87/src/nvector/rotation.py#L277
  const sinX = Math.sin(x);
  const sinY = Math.sin(y);
  const sinZ = Math.sin(z);
  const cosX = Math.cos(x);
  const cosY = Math.cos(y);
  const cosZ = Math.cos(z);

  return [
    [cosY * cosZ, -cosY * sinZ, sinY],
    [
      sinY * sinX * cosZ + cosX * sinZ,
      -sinY * sinX * sinZ + cosX * cosZ,
      -cosY * sinX,
    ],
    [
      -sinY * cosX * cosZ + sinX * sinZ,
      sinY * cosX * sinZ + sinX * cosZ,
      cosY * cosX,
    ],
  ];
}
