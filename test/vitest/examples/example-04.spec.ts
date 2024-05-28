import { fromGeodeticCoordinates, radians, toECEF } from "nvector-geodesy";
import { expect, test } from "vitest";

/**
 * Example 4: Geodetic latitude to ECEF-vector
 *
 * Given geodetic latitude, longitude and height. Find the ECEF-vector (using
 * WGS-84 ellipsoid).
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_4
 */
test("Example 4", () => {
  // PROBLEM:

  // Geodetic latitude, longitude and height are given for position B:
  const bLat = 1;
  const bLon = 2;
  const bHeight = 3;

  // Find the ECEF-vector for this position.

  // SOLUTION:

  // Step 1: First, the given latitude and longitude are converted to n-vector:
  const b = fromGeodeticCoordinates(radians(bLat), radians(bLon));

  // Step 2: Convert to an ECEF-vector:
  const pb = toECEF(b, -bHeight);

  expect(pb[0]).toBeCloseTo(6373290.277218279, 8);
  expect(pb[1]).toBeCloseTo(222560.2006747365, 8);
  expect(pb[2]).toBeCloseTo(110568.8271817859, 8);
});
