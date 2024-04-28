import { fc, it } from "@fast-check/vitest";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { n_E2R_EN } from "../../src/index.js";
import { ROTATION_MATRIX_e, rotateVector3 } from "../../src/rotation.js";
import {
  arbitrary3dRotationMatrix,
  arbitrary3dUnitVector,
} from "../arbitrary.js";
import {
  NvectorTestClient,
  createNvectorTestClient,
} from "../nvector-test-api.js";

const TEST_DURATION = 5000;

describe("n_E2R_EN()", () => {
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
          fc.option(arbitrary3dRotationMatrix(), { nil: undefined }),
        )
        .filter(([n_E, R_Ee = ROTATION_MATRIX_e]) => {
          // Avoid situations where very close to poles
          // Python implementation rounds to zero in these cases, which causes
          // the Y axis to be [0, 1, 0] instead of the calculated value,
          // producing very different results.
          const [, n_e_y, n_e_z] = rotateVector3(R_Ee, n_E);
          const Ny_e_direction_norm = Math.hypot(-n_e_z, n_e_y);
          if (Ny_e_direction_norm > 0 && Ny_e_direction_norm <= 1e-100) {
            return false;
          }

          return true;
        }),
    ],
    { interruptAfterTimeLimit: TEST_DURATION, numRuns: Infinity },
  )(
    "matches the Python implementation",
    async ([n_E, R_Ee]) => {
      const expected = await nvectorTestClient.n_E2R_EN(n_E, R_Ee);

      expect(expected).toMatchObject([
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
        [expect.any(Number), expect.any(Number), expect.any(Number)],
      ]);

      const actual = n_E2R_EN(n_E, R_Ee);

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
