import { expect, test } from "vitest";
import {
  cross,
  dot,
  lat_long2n_E,
  norm,
  rad,
  sub,
  unit,
  type Vector3,
} from "../../../src/index.js";

/**
 * Example 5: Surface distance
 *
 * Given position A and B. Find the surface distance (i.e. great circle
 * distance) and the Euclidean distance.
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_5
 */
test.each`
  label                             | n_EA_E                           | n_EB_E                              | s_AB_expected | d_AB_expected
  ${"or input as lat/long in deg:"} | ${lat_long2n_E(rad(88), rad(0))} | ${lat_long2n_E(rad(89), rad(-170))} | ${332.4564}   | ${332.4187}
  ${"Enter elements directly:"}     | ${unit([1, 0, -2])}              | ${unit([-1, -2, 0])}                | ${11290.3947} | ${9869.9108}
`(
  "Example 5 ($label)",
  // Position A and B are given as n_EA_E and n_EB_E:
  ({
    n_EA_E,
    n_EB_E,
    s_AB_expected,
    d_AB_expected,
  }: {
    n_EA_E: Vector3;
    n_EB_E: Vector3;
    s_AB_expected: number;
    d_AB_expected: number;
  }) => {
    // m, mean Earth radius
    const r_Earth = 6371e3;

    // SOLUTION:

    // The great circle distance is given by equation (16) in Gade (2010):
    // Well conditioned for all angles:
    const s_AB =
      Math.atan2(norm(cross(n_EA_E, n_EB_E)), dot(n_EA_E, n_EB_E)) * r_Earth;

    // The Euclidean distance is given by:
    const d_AB = norm(sub(n_EB_E, n_EA_E)) * r_Earth;

    expect(s_AB / 1000).toBeCloseTo(s_AB_expected, 4);
    expect(d_AB / 1000).toBeCloseTo(d_AB_expected, 4);
  },
);
