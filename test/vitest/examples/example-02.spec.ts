import { expect, test } from "vitest";
import {
  WGS_72,
  deg,
  multiply,
  n_E2R_EN,
  n_E2lat_long,
  n_EA_E_and_p_AB_E2n_EB_E,
  rad,
  rotate,
  unit,
  zyx2R,
  type Vector3,
} from "../../../src/index.js";

/**
 * Example 2: B and delta to C
 *
 * Given the position of vehicle B and a bearing and distance to an object C.
 * Find the exact position of C. Use WGS-72 ellipsoid.
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_2
 */
test("Example 2", () => {
  // delta vector from B to C, decomposed in B is given:
  const p_BC_B: Vector3 = [3000, 2000, 100];

  // Position and orientation of B is given:
  // unit to get unit length of vector
  const n_EB_E = unit([1, 2, 3]);
  const z_EB = -400;
  // the three angles are yaw, pitch, and roll
  const R_NB = zyx2R(rad(10), rad(20), rad(30));

  // A custom reference ellipsoid is given (replacing WGS-84):
  // (WGS-72)
  const a = WGS_72.a;
  const f = WGS_72.f;

  // Find the position of C.

  // SOLUTION:

  // Step1: Find R_EN:
  const R_EN = n_E2R_EN(n_EB_E);

  // Step2: Find R_EB, from R_EN and R_NB:
  // Note: closest frames cancel
  const R_EB = multiply(R_EN, R_NB);

  // Step3: Decompose the delta vector in E:
  // no transpose of R_EB, since the vector is in B
  const p_BC_E = rotate(R_EB, p_BC_B);

  // Step4: Find the position of C, using the functions that goes from one
  // position and a delta, to a new position:
  const [n_EC_E, z_EC] = n_EA_E_and_p_AB_E2n_EB_E(n_EB_E, p_BC_E, z_EB, a, f);

  // When displaying the resulting position for humans, it is more convenient
  // to see lat, long:
  const [lat_EC, long_EC] = n_E2lat_long(n_EC_E);

  // Here we also assume that the user wants the output to be height (= -depth):
  const height = -z_EC;

  expect(deg(lat_EC)).toBeCloseTo(53.32637826433107, 13);
  expect(deg(long_EC)).toBeCloseTo(63.46812343514746, 13);
  expect(height).toBeCloseTo(406.0071960700098, 15); // meters
});
