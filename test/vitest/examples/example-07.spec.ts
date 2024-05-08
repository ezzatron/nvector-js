import { expect, test } from "vitest";
import {
  apply,
  lat_long2n_E,
  rad,
  unit,
  type Vector3,
} from "../../../src/index.js";

/**
 * Example 7: Mean position/center
 *
 * Given three positions A, B, and C. Find the mean position (center/midpoint).
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_7
 */
test.each`
  label                             | n_EA_E                           | n_EB_E                            | n_EC_E                             | n_EM_E_expected
  ${"Enter elements directly:"}     | ${unit([1, 0, -2])}              | ${unit([-1, -2, 0])}              | ${unit([0, -2, 3])}                | ${[0, -0.9990748728803714, -0.04300463206527586]}
  ${"or input as lat/long in deg:"} | ${lat_long2n_E(rad(90), rad(0))} | ${lat_long2n_E(rad(60), rad(10))} | ${lat_long2n_E(rad(50), rad(-20))} | ${[0.3841171702926, -0.04660240548568945, 0.9221074857571395]}
`(
  "Example 7 ($label)",
  // Three positions A, B and C are given:
  ({
    n_EA_E,
    n_EB_E,
    n_EC_E,
    n_EM_E_expected,
  }: {
    n_EA_E: Vector3;
    n_EB_E: Vector3;
    n_EC_E: Vector3;
    n_EM_E_expected: Vector3;
  }) => {
    // SOLUTION:

    // Find the horizontal mean position, M:
    const n_EM_E = unit(
      apply(
        (n_EA_E, n_EB_E, n_EC_E) => n_EA_E + n_EB_E + n_EC_E,
        n_EA_E,
        n_EB_E,
        n_EC_E,
      ),
    );

    expect(n_EM_E[0]).toBeCloseTo(n_EM_E_expected[0], 16);
    expect(n_EM_E[1]).toBeCloseTo(n_EM_E_expected[1], 16);
    expect(n_EM_E[2]).toBeCloseTo(n_EM_E_expected[2], 16);
  },
);
