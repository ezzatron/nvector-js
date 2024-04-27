import { fc, it } from "@fast-check/vitest";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { GRS_80, WGS_72, WGS_84, WGS_84_SPHERE } from "../../src/ellipsoid.js";
import { n_EB_E2p_EB_E } from "../../src/index.js";
import {
  arbitrary3dRotationMatrix,
  arbitrary3dUnitVector,
} from "../arbitrary.js";
import {
  NvectorTestClient,
  createNvectorTestClient,
} from "../nvector-test-api.js";

const TEST_DURATION = 5000;

describe("n_EB_E2p_EB_E()", () => {
  let nvectorTestClient: NvectorTestClient;

  beforeAll(async () => {
    nvectorTestClient = await createNvectorTestClient();
  });

  afterAll(() => {
    nvectorTestClient?.close();
  });

  it.prop(
    [
      arbitrary3dUnitVector(),
      fc
        .oneof(
          fc.constant(WGS_84),
          fc.constant(WGS_84_SPHERE),
          fc.constant(WGS_72),
          fc.constant(GRS_80),
        )
        .chain(({ a, f }) =>
          fc.tuple(
            // center of spheroid to 2X max radius
            fc.option(fc.double({ min: -a, max: a, noNaN: true }), {
              nil: undefined,
            }),
            fc.option(fc.constant(a), { nil: undefined }),
            fc.option(fc.constant(f), { nil: undefined }),
          ),
        ),
      fc.option(arbitrary3dRotationMatrix(), { nil: undefined }),
    ],
    { interruptAfterTimeLimit: TEST_DURATION, numRuns: Infinity },
  )(
    "matches the Python implementation",
    async (n_EB_E, [depth, a, f], R_Ee) => {
      const expected = await nvectorTestClient.n_EB_E2p_EB_E(
        n_EB_E,
        depth,
        a,
        f,
        R_Ee,
      );

      expect(expected).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);

      const actual = n_EB_E2p_EB_E(n_EB_E, depth, a, f, R_Ee);

      expect(actual).toMatchObject([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
      ]);
      expect(actual[0]).toBeCloseTo(expected[0], 8);
      expect(actual[1]).toBeCloseTo(expected[1], 8);
      expect(actual[2]).toBeCloseTo(expected[2], 8);
    },
    TEST_DURATION + 1000,
  );
});
