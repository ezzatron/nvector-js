import type { Matrix } from "./matrix.js";

/**
 * Axes of the coordinate frame E (Earth-Centred, Earth-Fixed, ECEF) when the
 * z-axis points to the North Pole.
 *
 * The z-axis points to the North Pole and x-axis points to the point where
 * latitude = longitude = 0. This choice is very common in many fields.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/R_Ee.m#L48
 */
export const Z_AXIS_NORTH: Matrix = [
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
export const X_AXIS_NORTH: Matrix = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];
