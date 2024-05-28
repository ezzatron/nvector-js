import {
  apply,
  degrees,
  fromGeodeticCoordinates,
  normalize,
  radians,
  toGeodeticCoordinates,
} from "nvector-geodesy";
import { expect, test } from "vitest";

/**
 * Example 6: Interpolated position
 *
 * Given the position of B at time t(0) and t(1). Find an interpolated position
 * at time t(i).
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_6
 */
test("Example 6", () => {
  // PROBLEM:

  // Given the position of B at time t0 and t1, pt0 and pt1:
  const t0 = 10;
  const t1 = 20;
  const ti = 16;
  const pt0 = fromGeodeticCoordinates(radians(89.9), radians(-150));
  const pt1 = fromGeodeticCoordinates(radians(89.9), radians(150));

  // Find an interpolated position at time ti, pti. All positions are given as
  // n-vectors.

  // SOLUTION:

  // Standard interpolation can be used directly with n-vector:
  const pti = normalize(
    apply((pt0, pt1) => pt0 + ((ti - t0) * (pt1 - pt0)) / (t1 - t0), pt0, pt1),
  );

  // Use human-friendly outputs:
  const [lat, lon] = toGeodeticCoordinates(pti);

  expect(degrees(lat)).toBeCloseTo(89.91282199988446, 12);
  expect(degrees(lon)).toBeCloseTo(173.4132244463705, 12);
});
