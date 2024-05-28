import {
  apply,
  fromGeodeticCoordinates,
  normalize,
  radians,
} from "nvector-geodesy";
import { expect, test } from "vitest";

/**
 * Example 7: Mean position/center
 *
 * Given three positions A, B, and C. Find the mean position (center/midpoint).
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_7
 */
test("Example 7", () => {
  // PROBLEM:

  // Three positions A, B, and C are given as n-vectors:
  const a = fromGeodeticCoordinates(radians(90), radians(0));
  const b = fromGeodeticCoordinates(radians(60), radians(10));
  const c = fromGeodeticCoordinates(radians(50), radians(-20));

  // Find the mean position, M. Note that the calculation is independent of the
  // heights/depths of the positions.

  // SOLUTION:

  // The mean position is simply given by the mean n-vector:
  const m = normalize(apply((a, b, c) => a + b + c, a, b, c));

  expect(m[0]).toBeCloseTo(0.3841171702926, 16);
  expect(m[1]).toBeCloseTo(-0.04660240548568945, 16);
  expect(m[2]).toBeCloseTo(0.9221074857571395, 16);
});
