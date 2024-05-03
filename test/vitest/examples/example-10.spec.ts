import { expect, test } from "vitest";
import {
  cross,
  dot,
  lat_long2n_E,
  rad,
  unit,
  type Vector3,
} from "../../../src/index.js";

/**
 * Example 10: Cross track distance (cross track error)
 *
 * Given path A going through A(1) and A(2), and a point B. Find the cross track
 * distance/cross track error between B and the path.
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_10
 */
test.each`
  label                             | n_EA1_E                         | n_EA2_E                          | n_EB_E                            | s_xt_expected        | d_xt_expected
  ${"Enter elements directly:"}     | ${unit([1, 0, -2])}             | ${unit([-1, -2, 0])}             | ${unit([0, -2, 3])}               | ${3834155.561819959} | ${3606868.49226761}
  ${"or input as lat/long in deg:"} | ${lat_long2n_E(rad(0), rad(0))} | ${lat_long2n_E(rad(10), rad(0))} | ${lat_long2n_E(rad(1), rad(0.1))} | ${11117.79911014538} | ${11117.79346740667}
`(
  "Example 10 ($label)",
  // Position A1 and A2 and B are given as n_EA1_E, n_EA2_E, and n_EB_E:
  ({
    n_EA1_E,
    n_EA2_E,
    n_EB_E,
    s_xt_expected,
    d_xt_expected,
  }: {
    n_EA1_E: Vector3;
    n_EA2_E: Vector3;
    n_EB_E: Vector3;
    s_xt_expected: number;
    d_xt_expected: number;
  }) => {
    const r_Earth = 6371e3; // m, mean Earth radius

    // Find the cross track distance from path A to position B.

    // SOLUTION:

    // Find the unit normal to the great circle between n_EA1_E and n_EA2_E:
    const c_E = unit(cross(n_EA1_E, n_EA2_E));

    // Find the great circle cross track distance: (acos(x) - pi/2 = -asin(x))
    const s_xt = -Math.asin(dot(c_E, n_EB_E)) * r_Earth;

    // Find the Euclidean cross track distance:
    const d_xt = -dot(c_E, n_EB_E) * r_Earth;

    expect(s_xt).toBeCloseTo(s_xt_expected, 9); // meters
    expect(d_xt).toBeCloseTo(d_xt_expected, 9); // meters
  },
);
