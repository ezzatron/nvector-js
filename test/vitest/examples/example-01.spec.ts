import {
  delta,
  fromGeodeticCoordinates,
  radians,
  toRotationMatrix,
  transform,
  transpose,
} from "nvector-geodesy";
import { expect, test } from "vitest";

/**
 * Example 1: A and B to delta
 *
 * Given two positions A and B. Find the exact vector from A to B in meters
 * north, east and down, and find the direction (azimuth/bearing) to B, relative
 * to north. Use WGS-84 ellipsoid.
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_1
 */
test("Example 1", () => {
  // PROBLEM:

  // Given two positions, A and B as latitudes, longitudes and depths (relative
  // to Earth, E):
  const aLat = 1,
    aLon = 2,
    aDepth = 3;
  const bLat = 4,
    bLon = 5,
    bDepth = 6;

  // Find the exact vector between the two positions, given in meters north,
  // east, and down, and find the direction (azimuth) to B, relative to north.
  //
  // Details:
  //
  // - Assume WGS-84 ellipsoid. The given depths are from the ellipsoid surface.
  // - Use position A to define north, east, and down directions. (Due to the
  //   curvature of Earth and different directions to the North Pole, the north,
  //   east, and down directions will change (relative to Earth) for different
  //   places. Position A must be outside the poles for the north and east
  //   directions to be defined.

  // SOLUTION:

  // Step 1
  //
  // First, the given latitudes and longitudes are converted to n-vectors:
  const a = fromGeodeticCoordinates(radians(aLat), radians(aLon));
  const b = fromGeodeticCoordinates(radians(bLat), radians(bLon));

  // Step 2
  //
  // When the positions are given as n-vectors (and depths), it is easy to find
  // the delta vector decomposed in E. No ellipsoid is specified when calling
  // the function, thus WGS-84 (default) is used:
  const abE = delta(a, b, aDepth, bDepth);

  // Step 3
  //
  // We now have the delta vector from A to B, but the three coordinates of the
  // vector are along the Earth coordinate frame E, while we need the
  // coordinates to be north, east and down. To get this, we define a
  // North-East-Down coordinate frame called N, and then we need the rotation
  // matrix (direction cosine matrix) rEN to go between E and N. We have a
  // simple function that calculates rEN from an n-vector, and we use this
  // function (using the n-vector at position A):
  const rEN = toRotationMatrix(a);

  // Step 4
  //
  // Now the delta vector is easily decomposed in N. Since the vector is
  // decomposed in E, we must use rNE (rNE is the transpose of rEN):
  const abN = transform(transpose(rEN), abE);

  // Step 5
  //
  // The three components of abN are the north, east and down displacements from
  // A to B in meters. The azimuth is simply found from element 1 and 2 of the
  // vector (the north and east components):
  const azimuth = Math.atan2(abN[1], abN[0]);

  expect(abN[0]).toBeCloseTo(331730.2347808944, 8);
  expect(abN[1]).toBeCloseTo(332997.8749892695, 8);
  expect(abN[2]).toBeCloseTo(17404.27136193635, 8);
  expect(azimuth).toBeCloseTo(radians(45.10926323826139), 15);
});
