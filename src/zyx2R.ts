import type { Matrix3x3 } from "./matrix.js";

/**
 * Creates a rotation matrix from 3 angles about new axes in the zyx order.
 *
 * The rotation matrix R_AB is created based on 3 angles z,y,x about new axes
 * (intrinsic) in the order z-y-x. The angles (called Euler angles or Tait-Bryan
 * angles) are defined by the following procedure of successive rotations:
 *
 * Given two arbitrary coordinate frames A and B. Consider a temporary frame T
 * that initially coincides with A. In order to make T align with B, we first
 * rotate T an angle z about its z-axis (common axis for both A and T).
 * Secondly, T is rotated an angle y about the NEW y-axis of T. Finally, T is
 * rotated an angle x about its NEWEST x-axis. The final orientation of T now
 * coincides with the orientation of B.
 *
 * The signs of the angles are given by the directions of the axes and the right
 * hand rule.
 *
 * Note that if A is a north-east-down frame and B is a body frame, we have that
 * z = yaw, y = pitch and x = roll.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/zyx2R.m
 *
 * @param z - Angle of rotation about the new z-axis in radians.
 * @param y - Angle of rotation about the new y-axis in radians.
 * @param x - Angle of rotation about the new x-axis in radians.
 *
 * @returns The rotation matrix.
 */
export function zyx2R(z: number, y: number, x: number): Matrix3x3 {
  const cz = Math.cos(z);
  const sz = Math.sin(z);
  const cy = Math.cos(y);
  const sy = Math.sin(y);
  const cx = Math.cos(x);
  const sx = Math.sin(x);

  return [
    [cz * cy, -sz * cx + cz * sy * sx, sz * sx + cz * sy * cx],
    [sz * cy, cz * cx + sz * sy * sx, -cz * sx + sz * sy * cx],
    [-sy, cy * sx, cy * cx],
  ];
}
