import {
  Z_AXIS_NORTH,
  apply,
  cross,
  degrees,
  fromGeodeticCoordinates,
  normalize,
  radians,
  toGeodeticCoordinates,
  transform,
  transpose,
} from "nvector-geodesy";
import { expect, test } from "vitest";

/**
 * Example 8: A and azimuth/distance to B
 *
 * Given position A and an azimuth/bearing and a (great circle) distance. Find
 * the destination point B.
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_8
 */
test("Example 8", () => {
  // PROBLEM:

  // Position A is given as n-vector:
  const a = fromGeodeticCoordinates(radians(80), radians(-90));

  // We also have an initial direction of travel given as an azimuth (bearing)
  // relative to north (clockwise), and finally the distance to travel along a
  // great circle is given:
  const azimuth = radians(200);
  const gcd = 1000;

  // Use Earth radius r:
  const r = 6371e3;

  // Find the destination point B.
  //
  // In geodesy, this is known as "The first geodetic problem" or "The direct
  // geodetic problem" for a sphere, and we see that this is similar to Example
  // 2, but now the delta is given as an azimuth and a great circle distance.
  // "The second/inverse geodetic problem" for a sphere is already solved in
  // Examples 1 and 5.

  // SOLUTION:

  // The azimuth (relative to north) is a singular quantity (undefined at the
  // Poles), but from this angle we can find a (non-singular) quantity that is
  // more convenient when working with vector algebra: a vector d that points in
  // the initial direction. We find this from azimuth by first finding the north
  // and east vectors at the start point, with unit lengths.
  //
  // Here we have assumed that our coordinate frame E has its z-axis along the
  // rotational axis of the Earth, pointing towards the North Pole. Hence, this
  // axis is given by [1, 0, 0]:
  const e = normalize(cross(transform(transpose(Z_AXIS_NORTH), [1, 0, 0]), a));
  const n = cross(a, e);

  // The two vectors n and e are horizontal, orthogonal, and span the tangent
  // plane at the initial position. A unit vector d in the direction of the
  // azimuth is now given by:
  const d = apply(
    (n, e) => n * Math.cos(azimuth) + e * Math.sin(azimuth),
    n,
    e,
  );

  // With the initial direction given as d instead of azimuth, it is now quite
  // simple to find b. We know that d and a are orthogonal, and they will span
  // the plane where b will lie. Thus, we can use sin and cos in the same manner
  // as above, with the angle traveled given by gcd / r:
  const b = apply(
    (a, d) => a * Math.cos(gcd / r) + d * Math.sin(gcd / r),
    a,
    d,
  );

  // Use human-friendly outputs:
  const [lat, lon] = toGeodeticCoordinates(b);

  expect(degrees(lat)).toBeCloseTo(79.99154867339445, 13);
  expect(degrees(lon)).toBeCloseTo(-90.01769837291397, 13);
});
