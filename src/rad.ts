/**
 * Converts angle in degrees to radians.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/rad.m
 *
 * @param deg_angle - Angle in degrees.
 *
 * @returns Angle in radians.
 */
export function rad(deg_angle: number): number {
  return (deg_angle * Math.PI) / 180;
}
