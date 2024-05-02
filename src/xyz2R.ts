import type { Matrix3x3 } from "./matrix.js";

/**
 * Creates a rotation matrix from 3 angles about new axes in the xyz order.
 *
 * The rotation matrix R_AB is created based on 3 angles x,y,z about new axes
 * (intrinsic) in the order x-y-z. The angles (called Euler angles or Tait-Bryan
 * angles) are defined by the following procedure of successive rotations:
 *
 * Given two arbitrary coordinate frames A and B. Consider a temporary frame T
 * that initially coincides with A. In order to make T align with B, we first
 * rotate T an angle x about its x-axis (common axis for both A and T).
 * Secondly, T is rotated an angle y about the NEW y-axis of T. Finally, T is
 * rotated an angle z about its NEWEST z-axis. The final orientation of T now
 * coincides with the orientation of B.
 *
 * The signs of the angles are given by the directions of the axes and the right
 * hand rule.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/xyz2R.m
 *
 * @param x - Angle of rotation about the new x-axis in radians.
 * @param y - Angle of rotation about the new y-axis in radians.
 * @param z - Angle of rotation about the new z-axis in radians.
 *
 * @returns 3x3 rotation matrix (direction cosine matrix) such that the relation
 *   between a vector v decomposed in A and B is given by: v_A = R_AB * v_B.
 */
export function xyz2R(x: number, y: number, z: number): Matrix3x3 {
  const cz = Math.cos(z);
  const sz = Math.sin(z);
  const cy = Math.cos(y);
  const sy = Math.sin(y);
  const cx = Math.cos(x);
  const sx = Math.sin(x);

  return [
    [cy * cz, -cy * sz, sy],
    [sy * sx * cz + cx * sz, -sy * sx * sz + cx * cz, -cy * sx],
    [-sy * cx * cz + sx * sz, sy * cx * sz + sx * cz, cy * cx],
  ];
}
