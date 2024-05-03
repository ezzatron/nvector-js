import { fc, it } from "@fast-check/vitest";
import { afterAll, beforeAll, describe, expect } from "vitest";
import {
  R_Ee_NP_Z,
  n_E2lat_long,
  n_E_and_wa2R_EL,
  xyz2R,
} from "../../src/index.js";
import {
  arbitrary3dRotationMatrix,
  arbitrary3dUnitVector,
  arbitraryRadians,
} from "../arbitrary.js";
import type { NvectorTestClient } from "../nvector-test-api.js";
import { createNvectorTestClient } from "../nvector-test-api.js";

const TEST_DURATION = 5000;

describe("n_E_and_wa2R_EL()", () => {
  let nvectorTestClient: NvectorTestClient;

  beforeAll(async () => {
    nvectorTestClient = await createNvectorTestClient();
  });

  afterAll(() => {
    nvectorTestClient?.close();
  });

  it.prop(
    [
      fc
        .tuple(
          arbitrary3dUnitVector(),
          arbitraryRadians(),
          fc.option(arbitrary3dRotationMatrix(), { nil: undefined }),
        )
        .filter(([n_E, wander_azimuth, R_Ee = R_Ee_NP_Z]) => {
          // Avoid situations where components of the xyz2R matrix are close
          // to zero. The Python implementation rounds to zero in these cases,
          // which produces very different results.
          const [latitude, longitude] = n_E2lat_long(n_E, R_Ee);
          const R_AB = xyz2R(longitude, -latitude, wander_azimuth);
          if (
            R_AB.some((row) =>
              row.some(
                (value) => value !== 0 && value < 1e-15 && value > -1e-15,
              ),
            )
          ) {
            return false;
          }

          return true;
        }),
    ],
    { interruptAfterTimeLimit: TEST_DURATION, numRuns: Infinity },
  )(
    "matches the reference implementation",
    async ([n_E, wander_azimuth, R_Ee]) => {
      const expected = await nvectorTestClient.n_E_and_wa2R_EL(
        n_E,
        wander_azimuth,
        R_Ee,
      );

      expect(expected).toMatchObject([
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
      ]);

      const actual = n_E_and_wa2R_EL(n_E, wander_azimuth, R_Ee);

      expect(actual).toMatchObject([
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
      ]);
      expect(actual[0][0]).toBeCloseTo(expected[0][0], 14);
      expect(actual[0][1]).toBeCloseTo(expected[0][1], 14);
      expect(actual[0][2]).toBeCloseTo(expected[0][2], 14);
      expect(actual[1][0]).toBeCloseTo(expected[1][0], 14);
      expect(actual[1][1]).toBeCloseTo(expected[1][1], 14);
      expect(actual[1][2]).toBeCloseTo(expected[1][2], 14);
      expect(actual[2][0]).toBeCloseTo(expected[2][0], 14);
      expect(actual[2][1]).toBeCloseTo(expected[2][1], 14);
      expect(actual[2][2]).toBeCloseTo(expected[2][2], 14);
    },
    TEST_DURATION + 1000,
  );
});
