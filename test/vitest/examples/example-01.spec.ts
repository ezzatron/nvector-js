import { expect, test } from "vitest";
import {
  lat_long2n_E,
  n_E2R_EN,
  n_EA_E_and_n_EB_E2p_AB_E,
  rad,
  rotate,
  transpose,
} from "../../../src/index.js";

/**
 * Example 1: A and B to delta
 *
 * Given two positions A and B. Find the exact vector from A to B in meters
 * north, east and down, and find the direction (azimuth/bearing) to B, relative
 * to north. Use WGS-84 ellipsoid.
 *
 * - Assume WGS-84 ellipsoid. The given depths are from the ellipsoid surface.
 * - Use position A to define north, east, and down directions. (Due to the
 *   curvature of Earth and different directions to the North Pole, the north,
 *   east, and down directions will change (relative to Earth) for different
 *   places. Position A must be outside the poles for the north and east
 *   directions to be defined.
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_1
 */
test("Example 1", () => {
  // Positions A and B are given in (decimal) degrees and depths:

  // Position A:
  const lat_EA_deg = 1;
  const long_EA_deg = 2;
  const z_EA = 3;

  // Position B:
  const lat_EB_deg = 4;
  const long_EB_deg = 5;
  const z_EB = 6;

  // Find the exact vector between the two positions, given in meters north,
  // east, and down, i.e. find p_AB_N.

  // SOLUTION:

  // Step1: Convert to n-vectors (rad() converts to radians):
  const n_EA_E = lat_long2n_E(rad(lat_EA_deg), rad(long_EA_deg));
  const n_EB_E = lat_long2n_E(rad(lat_EB_deg), rad(long_EB_deg));

  // Step2: Find p_AB_E (delta decomposed in E). WGS-84 ellipsoid is default:
  const p_AB_E = n_EA_E_and_n_EB_E2p_AB_E(n_EA_E, n_EB_E, z_EA, z_EB);

  // Step3: Find R_EN for position A:
  const R_EN = n_E2R_EN(n_EA_E);

  // Step4: Find p_AB_N
  const p_AB_N = rotate(transpose(R_EN), p_AB_E);
  // (Note the transpose of R_EN: The "closest-rule" says that when decomposing,
  // the frame in the subscript of the rotation matrix that is closest to the
  // vector, should equal the frame where the vector is decomposed. Thus the
  // calculation R_NE*p_AB_E is correct, since the vector is decomposed in E,
  // and E is closest to the vector. In the above example we only had R_EN, and
  // thus we must transpose it: R_EN' = R_NE)

  // Step5: Also find the direction (azimuth) to B, relative to north:
  const azimuth = Math.atan2(p_AB_N[1], p_AB_N[0]);

  expect(p_AB_N[0]).toBeCloseTo(331730.2348, 4);
  expect(p_AB_N[1]).toBeCloseTo(332997.875, 4);
  expect(p_AB_N[2]).toBeCloseTo(17404.2714, 4);
  expect(azimuth).toBeCloseTo(rad(45.1093), 4);
});
