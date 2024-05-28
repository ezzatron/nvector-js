import {
  apply,
  degrees,
  fromECEF,
  toGeodeticCoordinates,
  type Vector,
} from "nvector-geodesy";
import { expect, test } from "vitest";

/**
 * Example 3: ECEF-vector to geodetic latitude
 *
 * Given an ECEF-vector of a position. Find geodetic latitude, longitude and
 * height (using WGS-84 ellipsoid).
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_3
 */
test("Example 3", () => {
  // PROBLEM:

  // Position B is given as an “ECEF-vector” pb (i.e. a vector from E, the
  // center of the Earth, to B, decomposed in E):
  const pb: Vector = apply((n) => n * 6371e3, [0.71, -0.72, 0.1]);

  // Find the geodetic latitude, longitude and height, assuming WGS-84
  // ellipsoid.

  // SOLUTION:

  // Step 1
  //
  // We have a function that converts ECEF-vectors to n-vectors:
  const [b, bDepth] = fromECEF(pb);

  // Step 2
  //
  // Find latitude, longitude and height:
  const [lat, lon] = toGeodeticCoordinates(b);
  const height = -bDepth;

  expect(degrees(lat)).toBeCloseTo(5.685075734513181, 14);
  expect(degrees(lon)).toBeCloseTo(-45.40066325579215, 14);
  expect(height).toBeCloseTo(95772.10761821801, 15);
});
