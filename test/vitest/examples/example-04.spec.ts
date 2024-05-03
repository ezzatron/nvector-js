import { expect, test } from "vitest";
import { lat_long2n_E, n_EB_E2p_EB_E, rad } from "../../../src/index.js";

/**
 * Example 4: Geodetic latitude to ECEF-vector
 *
 * Given geodetic latitude, longitude and height. Find the ECEF-vector (using
 * WGS-84 ellipsoid).
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_4
 */
test("Example 4", () => {
  // Position B is given with lat, long and height:
  const lat_EB_deg = 1;
  const long_EB_deg = 2;
  const h_EB = 3;

  // Find the vector p_EB_E ("ECEF-vector")

  // SOLUTION:

  // Step1: Convert to n-vector:
  const n_EB_E = lat_long2n_E(rad(lat_EB_deg), rad(long_EB_deg));

  // Step2: Find the ECEF-vector p_EB_E:
  const p_EB_E = n_EB_E2p_EB_E(n_EB_E, -h_EB);

  expect(p_EB_E[0]).toBeCloseTo(6373290.277218279, 8); // meters
  expect(p_EB_E[1]).toBeCloseTo(222560.2006747365, 8); // meters
  expect(p_EB_E[2]).toBeCloseTo(110568.8271817859, 8); // meters
});
