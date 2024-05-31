import {
  WGS_72,
  degrees,
  destination,
  eulerZYXToRotationMatrix,
  multiply,
  normalize,
  radians,
  toGeodeticCoordinates,
  toRotationMatrix,
  transform,
  type Vector,
} from "nvector-geodesy";
import { expect, test } from "vitest";

/**
 * Example 2: B and delta to C
 *
 * Given the position of vehicle B and a bearing and distance to an object C.
 * Find the exact position of C. Use WGS-72 ellipsoid.
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_2
 */
test("Example 2", () => {
  // PROBLEM:

  // A radar or sonar attached to a vehicle B (Body coordinate frame) measures
  // the distance and direction to an object C. We assume that the distance and
  // two angles measured by the sensor (typically bearing and elevation relative
  // to B) are already converted (by converting from spherical to Cartesian
  // coordinates) to the vector bcB (i.e. the vector from B to C, decomposed in
  // B):
  const bcB: Vector = [3000, 2000, 100];

  // The position of B is given as an n-vector and a depth:
  const b = normalize([1, 2, 3]);
  const bDepth = -400;

  // The orientation (attitude) of B is given as rNB, specified as yaw, pitch,
  // roll:
  const rNB = eulerZYXToRotationMatrix(radians(10), radians(20), radians(30));

  // Use the WGS-72 ellipsoid:
  const e = WGS_72;

  // Find the exact position of object C as an n-vector and a depth.

  // SOLUTION:

  // Step 1
  //
  // The delta vector is given in B. It should be decomposed in E before using
  // it, and thus we need rEB. This matrix is found from the matrices rEN and
  // rNB, and we need to find rEN, as in Example 1:
  const rEN = toRotationMatrix(b);

  // Step 2
  //
  // Now, we can find rEB y using that the closest frames cancel when
  // multiplying two rotation matrices (i.e. N is cancelled here):
  const rEB = multiply(rEN, rNB);

  // Step 3
  //
  // The delta vector is now decomposed in E:
  const bcE = transform(rEB, bcB);

  // Step 4
  //
  // It is now easy to find the position of C using destination (with custom
  // ellipsoid overriding the default WGS-84):
  const [c, cDepth] = destination(b, bcE, bDepth, e);

  // Use human-friendly outputs:
  const [lon, lat] = toGeodeticCoordinates(c);
  const height = -cDepth;

  expect(degrees(lat)).toBeCloseTo(53.32637826433107, 13);
  expect(degrees(lon)).toBeCloseTo(63.46812343514746, 13);
  expect(height).toBeCloseTo(406.0071960700098, 15);
});
