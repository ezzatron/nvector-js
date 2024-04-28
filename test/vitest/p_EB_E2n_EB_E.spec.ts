import { fc, it } from "@fast-check/vitest";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { GRS_80, WGS_72, WGS_84, WGS_84_SPHERE } from "../../src/ellipsoid.js";
import { p_EB_E2n_EB_E } from "../../src/index.js";
import { ROTATION_MATRIX_e, rotate } from "../../src/rotation.js";
import { arbitrary3dRotationMatrix, arbitrary3dVector } from "../arbitrary.js";
import {
  NvectorTestClient,
  createNvectorTestClient,
} from "../nvector-test-api.js";

const TEST_DURATION = 5000;

describe("p_EB_E2n_EB_E()", () => {
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
        .oneof(
          fc.constant(WGS_84),
          fc.constant(WGS_84_SPHERE),
          fc.constant(WGS_72),
          fc.constant(GRS_80),
        )
        .chain(({ a, f }) => {
          // semi-minor axis
          const b = a * (1 - f);

          return fc.tuple(
            arbitrary3dVector({ min: a - b, max: a + b, noNaN: true }),
            fc.option(fc.constant(a), { nil: undefined }),
            fc.option(fc.constant(f), { nil: undefined }),
            fc.option(arbitrary3dRotationMatrix(), { nil: undefined }),
          );
        })
        .filter(
          ([p_EB_E, a = WGS_84.a, f = WGS_84.f, R_Ee = ROTATION_MATRIX_e]) => {
            const p_EB_e = rotate(R_Ee, p_EB_E);

            // filter vectors where the x or yz components are zero after
            // rotation
            // this causes a division by zero in the Python implementation
            if (p_EB_e[0] === 0 || p_EB_e[1] + p_EB_e[2] === 0) return false;

            // filter a case that makes the Python implementation try to find
            // the square root of a negative number
            // not sure why this happens, the math is beyond me
            const s = (() => {
              const Ryz_2 = p_EB_E[1] ** 2 + p_EB_E[2] ** 2;
              const Rx_2 = p_EB_E[0] ** 2;
              const e_2 = (2.0 - f) * f;
              const q = ((1 - e_2) / a ** 2) * Rx_2;
              const p = Ryz_2 / a ** 2;
              const r = (p + q - e_2 ** 2) / 6;

              return (e_2 ** 2 * p * q) / (4 * r ** 3);
            })();
            if (Number.isNaN(s) || s <= 0) return false;

            return true;
          },
        ),
    ],
    { interruptAfterTimeLimit: TEST_DURATION, numRuns: Infinity },
  )(
    "matches the Python implementation",
    async ([p_EB_E, a, f, R_Ee]) => {
      const [expectedVector, expectedDepth] =
        await nvectorTestClient.p_EB_E2n_EB_E(p_EB_E, a, f, R_Ee);

      expect(expectedVector).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);
      expect(expectedDepth).toEqual(expect.any(Number));

      const [actualVector, actualDepth] = p_EB_E2n_EB_E(p_EB_E, a, f, R_Ee);

      expect(actualVector).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);
      expect(actualVector[0]).toBeCloseTo(expectedVector[0], 8);
      expect(actualVector[1]).toBeCloseTo(expectedVector[1], 8);
      expect(actualVector[2]).toBeCloseTo(expectedVector[2], 8);
      expect(actualDepth).toBeCloseTo(expectedDepth, 8);
    },
    TEST_DURATION + 1000,
  );
});