import { expect, test } from "vitest";
import {
  R_Ee_NP_Z,
  apply,
  cross,
  deg,
  lat_long2n_E,
  n_E2lat_long,
  rad,
  rotate,
  transpose,
  unit,
  type Vector3,
} from "../../../src/index.js";

/**
 * Example 8: A and azimuth/distance to B
 *
 * Given position A and an azimuth/bearing and a (great circle) distance. Find
 * the destination point B.
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_8
 */
test.each`
  label                             | n_EA_E                             | lat_EB_expected       | long_EB_expected
  ${"Enter elements directly:"}     | ${unit([1, 0, -2])}                | ${-63.44339951651296} | ${-0.006879863905895194}
  ${"or input as lat/long in deg:"} | ${lat_long2n_E(rad(80), rad(-90))} | ${79.99154867339445}  | ${-90.01769837291397}
`(
  "Example 8 ($label)",
  // Position A is given as n_EA_E:
  ({
    n_EA_E,
    lat_EB_expected,
    long_EB_expected,
  }: {
    n_EA_E: Vector3;
    lat_EB_expected: number;
    long_EB_expected: number;
  }) => {
    // The initial azimuth and great circle distance (s_AB), and Earth radius
    // (r_Earth) are also given:
    const azimuth = rad(200);
    const s_AB = 1000; // m
    const r_Earth = 6371e3; // m, mean Earth radius

    // Find the destination point B, as n_EB_E ("The direct/first geodetic
    // problem" for a sphere)

    // SOLUTION:

    // Step1: Find unit vectors for north and east (see equations (9) and (10)
    // in Gade (2010):
    const k_east_E = unit(
      cross(rotate(transpose(R_Ee_NP_Z), [1, 0, 0]), n_EA_E),
    );
    const k_north_E = cross(n_EA_E, k_east_E);

    // Step2: Find the initial direction vector d_E:
    const d_E = apply(
      (k_north_E, k_east_E) =>
        k_north_E * Math.cos(azimuth) + k_east_E * Math.sin(azimuth),
      k_north_E,
      k_east_E,
    );

    // Step3: Find n_EB_E:
    const n_EB_E = apply(
      (n_EA_E, d_E) =>
        n_EA_E * Math.cos(s_AB / r_Earth) + d_E * Math.sin(s_AB / r_Earth),
      n_EA_E,
      d_E,
    );

    // When displaying the resulting position for humans, it is more convenient
    // to see lat, long:
    const [lat_EB, long_EB] = n_E2lat_long(n_EB_E);

    expect(deg(lat_EB)).toBeCloseTo(lat_EB_expected, 13);
    expect(deg(long_EB)).toBeCloseTo(long_EB_expected, 13);
  },
);
