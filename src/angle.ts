/**
 * Converts angle in radians to degrees.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/deg.m
 *
 * @param radians - Angle in radians.
 *
 * @returns Angle in degrees.
 */
export function degrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Converts angle in degrees to radians.
 *
 * @see https://github.com/FFI-no/n-vector/blob/f77f43d18ddb6b8ea4e1a8bb23a53700af965abb/nvector/rad.m
 *
 * @param degrees - Angle in degrees.
 *
 * @returns Angle in radians.
 */
export function radians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
