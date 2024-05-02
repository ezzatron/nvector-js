/**
 * Converts angle in radians to degrees.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/deg.m
 *
 * @param rad_angle - Angle in radians.
 *
 * @returns Angle in degrees.
 */
export function deg(rad_angle: number): number {
  return (rad_angle * 180) / Math.PI;
}
