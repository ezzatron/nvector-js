import {
  apply,
  cross,
  dot,
  fromGeodeticCoordinates,
  norm,
  radians,
} from "nvector-geodesy";
import { expect, test } from "vitest";

/**
 * Example 5: Surface distance
 *
 * Given position A and B. Find the surface distance (i.e. great circle
 * distance) and the Euclidean distance.
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_5
 */
test("Example 5", () => {
  // PROBLEM:

  // Given two positions A and B as n-vectors:
  const a = fromGeodeticCoordinates(radians(88), radians(0));
  const b = fromGeodeticCoordinates(radians(89), radians(-170));

  // Find the surface distance (i.e. great circle distance). The heights of A
  // and B are not relevant (i.e. if they do not have zero height, we seek the
  // distance between the points that are at the surface of the Earth, directly
  // above/below A and B). The Euclidean distance (chord length) should also be
  // found.

  // Use Earth radius r:
  const r = 6371e3;

  // SOLUTION:

  // Find the great circle distance:
  const gcd = Math.atan2(norm(cross(a, b)), dot(a, b)) * r;

  // Find the Euclidean distance:
  const ed = norm(apply((b, a) => b - a, b, a)) * r;

  expect(gcd).toBeCloseTo(332456.4441053448, 9);
  expect(ed).toBeCloseTo(332418.7248568097, 9);
});
