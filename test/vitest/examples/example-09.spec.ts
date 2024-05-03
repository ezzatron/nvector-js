import { expect, test } from "vitest";
import {
  apply,
  cross,
  deg,
  dot,
  lat_long2n_E,
  n_E2lat_long,
  rad,
  unit,
  type Vector3,
} from "../../../src/index.js";

/**
 * Example 9: Intersection of two paths / triangulation
 *
 * Given path A going through A(1) and A(2), and path B going through B(1) and
 * B(2). Find the intersection of the two paths.
 *
 * @see https://www.ffi.no/en/research/n-vector/#example_9
 */
test.each`
  label                             | n_EA1_E                            | n_EA2_E                            | n_EB1_E                            | n_EB2_E                             | lat_EC_expected | long_EC_expected
  ${"Enter elements directly:"}     | ${unit([0, 0, 1])}                 | ${unit([-1, 0, 1])}                | ${unit([-2, -2, 4])}               | ${unit([-2, 2, 2])}                 | ${56.3099}      | ${180}
  ${"or input as lat/long in deg:"} | ${lat_long2n_E(rad(50), rad(180))} | ${lat_long2n_E(rad(90), rad(180))} | ${lat_long2n_E(rad(60), rad(160))} | ${lat_long2n_E(rad(80), rad(-140))} | ${74.1634}      | ${180}
`(
  "Example 9 ($label)",
  // Two paths A and B are given by two pairs of positions:
  ({
    n_EA1_E,
    n_EA2_E,
    n_EB1_E,
    n_EB2_E,
    lat_EC_expected,
    long_EC_expected,
  }: {
    n_EA1_E: Vector3;
    n_EA2_E: Vector3;
    n_EB1_E: Vector3;
    n_EB2_E: Vector3;
    lat_EC_expected: number;
    long_EC_expected: number;
  }) => {
    // Find the intersection between the two paths, n_EC_E:
    const n_EC_E_tmp = unit(
      cross(cross(n_EA1_E, n_EA2_E), cross(n_EB1_E, n_EB2_E)),
    );

    // n_EC_E_tmp is one of two solutions, the other is -n_EC_E_tmp. Select the
    // one that is closest to n_EA1_E, by selecting sign from the dot product
    // between n_EC_E_tmp and n_EA1_E:
    const n_EC_E = apply(
      (n) => Math.sign(dot(n_EC_E_tmp, n_EA1_E)) * n,
      n_EC_E_tmp,
    );

    // When displaying the resulting position for humans, it is more convenient
    // to see lat, long:
    const [lat_EC, long_EC] = n_E2lat_long(n_EC_E);

    expect(deg(lat_EC)).toBeCloseTo(lat_EC_expected, 4);
    expect(deg(long_EC)).toBeCloseTo(long_EC_expected, 4);
  },
);
