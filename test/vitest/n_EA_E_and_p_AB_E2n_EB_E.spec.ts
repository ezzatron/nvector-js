import { fc, it } from "@fast-check/vitest";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { WGS_84 } from "../../src/ellipsoid.js";
import { n_EA_E_and_p_AB_E2n_EB_E, n_EB_E2p_EB_E } from "../../src/index.js";
import { ROTATION_MATRIX_e, rotateVector3 } from "../../src/rotation.js";
import type { Vector3 } from "../../src/vector.js";
import {
  arbitrary3dRotationMatrix,
  arbitrary3dUnitVector,
  arbitraryEllipsoid,
  arbitraryEllipsoidDepth,
  arbitraryEllipsoidECEFVector,
} from "../arbitrary.js";
import {
  NvectorTestClient,
  createNvectorTestClient,
} from "../nvector-test-api.js";

const TEST_DURATION = 5000;

describe("n_EA_E_and_p_AB_E2n_EB_E()", () => {
  let nvectorTestClient: NvectorTestClient;

  beforeAll(async () => {
    nvectorTestClient = await createNvectorTestClient();
  });

  afterAll(() => {
    nvectorTestClient?.close();
  });

  it.prop(
    [
      arbitraryEllipsoid()
        .chain((ellipsoid) => {
          return fc.tuple(
            arbitrary3dUnitVector(),
            arbitraryEllipsoidECEFVector(ellipsoid),
            fc.option(arbitraryEllipsoidDepth(ellipsoid), { nil: undefined }),
            fc.option(fc.constant(ellipsoid.a), { nil: undefined }),
            fc.option(fc.constant(ellipsoid.f), { nil: undefined }),
            fc.option(arbitrary3dRotationMatrix(), { nil: undefined }),
          );
        })
        .filter(
          ([
            n_EA_E,
            p_AB_E,
            z_EA,
            a = WGS_84.a,
            f = WGS_84.f,
            R_Ee = ROTATION_MATRIX_e,
          ]) => {
            const [p_EA_E_x, p_EA_E_y, p_EA_E_z] = n_EB_E2p_EB_E(
              n_EA_E,
              z_EA,
              a,
              f,
              R_Ee,
            );
            const p_EB_E: Vector3 = [
              p_EA_E_x + p_AB_E[0],
              p_EA_E_y + p_AB_E[1],
              p_EA_E_z + p_AB_E[2],
            ];

            const p_EB_e = rotateVector3(R_Ee, p_EB_E);

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
    async ([n_EA_E, p_AB_E, z_EA, a, f, R_Ee]) => {
      const [expectedVector, expectedDepth] =
        await nvectorTestClient.n_EA_E_and_p_AB_E2n_EB_E(
          n_EA_E,
          p_AB_E,
          z_EA,
          a,
          f,
          R_Ee,
        );

      expect(expectedVector).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);
      expect(expectedDepth).toEqual(expect.any(Number));

      const [actualVector, actualDepth] = n_EA_E_and_p_AB_E2n_EB_E(
        n_EA_E,
        p_AB_E,
        z_EA,
        a,
        f,
        R_Ee,
      );

      expect(actualVector).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);
      expect(actualVector[0]).toBeCloseTo(expectedVector[0], 12);
      expect(actualVector[1]).toBeCloseTo(expectedVector[1], 12);
      expect(actualVector[2]).toBeCloseTo(expectedVector[2], 12);
      expect(actualDepth).toBeCloseTo(expectedDepth, 7);
    },
    TEST_DURATION + 1000,
  );
});
