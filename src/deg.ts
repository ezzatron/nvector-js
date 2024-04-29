/**
 * Converts angle in radians to degrees.
 *
 * @param radians - Angle in radians.
 *
 * @returns Angle in degrees.
 */
export function deg(radians: number): number {
  return radians * (180 / Math.PI);
}
