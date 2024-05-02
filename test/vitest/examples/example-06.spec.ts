import { expect, test } from "vitest";
import {
  deg,
  lat_long2n_E,
  n_E2lat_long,
  rad,
  unit,
  type Vector3,
} from "../../../src/index.js";

/**
 * Example 6: Interpolated position
 *
 * Given the position of B at time t(0) and t(1). Find an interpolated position
 * at time t(i).
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_6
 */
test.each`
  label                             | n_EB_E_t0                             | n_EB_E_t1                            | lat_EB_ti_expected | long_EB_ti_expected
  ${"Enter elements directly:"}     | ${unit([1, 0, -2])}                   | ${unit([-1, -2, 0])}                 | ${-33.3288}        | ${-99.4623}
  ${"or input as lat/long in deg:"} | ${lat_long2n_E(rad(89.9), rad(-150))} | ${lat_long2n_E(rad(89.9), rad(150))} | ${89.9128}         | ${173.4132}
`(
  "Example 5 ($label)",
  // Position B is given at time t0 as n_EB_E_t0 and at time t1 as n_EB_E_t1:
  ({
    n_EB_E_t0,
    n_EB_E_t1,
    lat_EB_ti_expected,
    long_EB_ti_expected,
  }: {
    n_EB_E_t0: Vector3;
    n_EB_E_t1: Vector3;
    lat_EB_ti_expected: number;
    long_EB_ti_expected: number;
  }) => {
    // The times are given as:
    const t0 = 10;
    const t1 = 20;
    const ti = 16; // time of interpolation

    // Find the interpolated position at time ti, n_EB_E_ti

    // SOLUTION:

    // Using standard interpolation:
    const lerp = (a: number) =>
      n_EB_E_t0[a] + ((ti - t0) * (n_EB_E_t1[a] - n_EB_E_t0[a])) / (t1 - t0);
    const n_EB_E_ti = unit([lerp(0), lerp(1), lerp(2)]);

    // When displaying the resulting position for humans, it is more convenient
    // to see lat, long:
    const [lat_EB_ti, long_EB_ti] = n_E2lat_long(n_EB_E_ti);

    expect(deg(lat_EB_ti)).toBeCloseTo(lat_EB_ti_expected, 4);
    expect(deg(long_EB_ti)).toBeCloseTo(long_EB_ti_expected, 4);
  },
);
