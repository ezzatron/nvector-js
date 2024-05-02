import { expect, test } from "vitest";
import {
  deg,
  n_E2lat_long,
  p_EB_E2n_EB_E,
  type Vector3,
} from "../../../src/index.js";

/**
 * Example 3: ECEF-vector to geodetic latitude
 *
 * Given an ECEF-vector of a position. Find geodetic latitude, longitude and
 * height (using WGS-84 ellipsoid).
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_3
 */
test("Example 3", () => {
  // Position B is given as p_EB_E ("ECEF-vector")
  const r = 6371e3; // m
  const p_EB_E: Vector3 = [r * 0.71, r * -0.72, r * 0.1]; // m

  // Find position B as geodetic latitude, longitude and height

  // SOLUTION:

  // Find n-vector from the p-vector:
  const [n_EB_E, z_EB] = p_EB_E2n_EB_E(p_EB_E);

  // Convert to lat, long and height:
  const [lat_EB, long_EB] = n_E2lat_long(n_EB_E);
  const h_EB = -z_EB;

  expect(deg(lat_EB)).toBeCloseTo(5.6851, 4);
  expect(deg(long_EB)).toBeCloseTo(-45.4007, 4);
  expect(h_EB).toBeCloseTo(95772.1076, 4);
});
