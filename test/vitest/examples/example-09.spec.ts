import {
  apply,
  cross,
  degrees,
  dot,
  fromGeodeticCoordinates,
  normalize,
  radians,
  toGeodeticCoordinates,
} from "nvector-geodesy";
import { expect, test } from "vitest";

/**
 * Example 9: Intersection of two paths
 *
 * Given path A going through A(1) and A(2), and path B going through B(1) and
 * B(2). Find the intersection of the two paths.
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_9
 */
test("Example 9", () => {
  // PROBLEM:

  // Define a path from two given positions (at the surface of a spherical
  // Earth), as the great circle that goes through the two points (assuming that
  // the two positions are not antipodal).

  // Path A is given by a1 and a2:
  const a1 = fromGeodeticCoordinates(radians(180), radians(50));
  const a2 = fromGeodeticCoordinates(radians(180), radians(90));

  // While path B is given by b1 and b2:
  const b1 = fromGeodeticCoordinates(radians(160), radians(60));
  const b2 = fromGeodeticCoordinates(radians(-140), radians(80));

  // Find the position C where the two paths intersect.

  // SOLUTION:

  // A convenient way to represent a great circle is by its normal vector (i.e.
  // the normal vector to the plane containing the great circle). This normal
  // vector is simply found by taking the cross product of the two n-vectors
  // defining the great circle (path). Having the normal vectors to both paths,
  // the intersection is now simply found by taking the cross product of the two
  // normal vectors:
  const cTmp = normalize(cross(cross(a1, a2), cross(b1, b2)));

  // Note that there will be two places where the great circles intersect, and
  // thus two solutions are found. Selecting the solution that is closest to
  // e.g. a1 can be achieved by selecting the solution that has a positive dot
  // product with a1 (or the mean position from Example 7 could be used instead
  // of a1):
  const c = apply((n) => Math.sign(dot(cTmp, a1)) * n, cTmp);

  // Use human-friendly outputs:
  const [lon, lat] = toGeodeticCoordinates(c);

  expect(degrees(lat)).toBeCloseTo(74.16344802135536, 16);
  expect(degrees(lon)).toBeCloseTo(180, 16);
});
