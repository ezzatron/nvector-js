import type { Matrix3x3 } from "./matrix.js";
import type { Vector3 } from "./vector.js";

/**
 * Axes of the coordinate frame E (Earth-Centred, Earth-Fixed, ECEF) when the
 * z-axis points to the North Pole.
 *
 * The z-axis points to the North Pole and x-axis points to the point where
 * latitude = longitude = 0. This choice is very common in many fields.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/R_Ee.m#L48
 */
export const R_Ee_NP_Z: Matrix3x3 = [
  [0, 0, 1],
  [0, 1, 0],
  [-1, 0, 0],
];

/**
 * Axes of the coordinate frame E (Earth-Centred, Earth-Fixed, ECEF) when the
 * x-axis points to the North Pole.
 *
 * The x-axis points to the North Pole, y-axis points towards longitude +90deg
 * (east) and latitude = 0. This choice of axis directions ensures that at zero
 * latitude and longitude, N (North-East-Down) has the same orientation as E. If
 * roll/pitch/yaw are zero, also B (Body, forward, starboard, down) has this
 * orientation. In this manner, the axes of E is chosen to correspond with the
 * axes of N and B.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/R_Ee.m#L55
 */
export const R_Ee_NP_X: Matrix3x3 = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

/**
 * Rotates a vector by a rotation matrix.
 *
 * @param r - A rotation matrix.
 * @param v - A vector to rotate.
 *
 * @returns The rotated vector.
 */
export function rotate(r: Matrix3x3, v: Vector3): Vector3 {
  const [[r11, r12, r13], [r21, r22, r23], [r31, r32, r33]] = r;
  const [x, y, z] = v;

  return [
    r11 * x + r12 * y + r13 * z,
    r21 * x + r22 * y + r23 * z,
    r31 * x + r32 * y + r33 * z,
  ];
}
