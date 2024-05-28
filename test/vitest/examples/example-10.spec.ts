import {
  cross,
  dot,
  fromGeodeticCoordinates,
  normalize,
  radians,
} from "nvector-geodesy";
import { expect, test } from "vitest";

/**
 * Example 10: Cross track distance (cross track error)
 *
 * Given path A going through A(1) and A(2), and a point B. Find the cross track
 * distance/cross track error between B and the path.
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_10
 */
test("Example 10", () => {
  // PROBLEM:

  // Path A is given by the two n-vectors a1 and a2 (as in the previous
  // example):
  const a1 = fromGeodeticCoordinates(radians(0), radians(0));
  const a2 = fromGeodeticCoordinates(radians(10), radians(0));

  // And a position B is given by b:
  const b = fromGeodeticCoordinates(radians(1), radians(0.1));

  // Find the cross track distance between the path A (i.e. the great circle
  // through a1 and a2) and the position B (i.e. the shortest distance at the
  // surface, between the great circle and B). Also, find the Euclidean distance
  // between B and the plane defined by the great circle.

  // Use Earth radius r:
  const r = 6371e3;

  // SOLUTION:

  // First, find the normal to the great circle, with direction given by the
  // right hand rule and the direction of travel:
  const c = normalize(cross(a1, a2));

  // Find the great circle cross track distance:
  const gcd = -Math.asin(dot(c, b)) * r;

  // Finding the Euclidean distance is even simpler, since it is the projection
  // of b onto c, thus simply the dot product:
  const ed = -dot(c, b) * r;

  // For both gcd and ed, positive answers means that B is to the right of the
  // track.

  expect(gcd).toBeCloseTo(11117.79911014538, 9);
  expect(ed).toBeCloseTo(11117.79346740667, 9);
});
